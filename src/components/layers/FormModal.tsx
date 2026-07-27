import { useState } from 'react'
import { Icon } from '@/components/common/icon'
import { BtnDanger, BtnGhost, BtnPrimary, Field, Modal, inputCls } from './Modal'
import { ChoiceRow } from '@/components/common/ChoiceRow'
import { Select } from '@/components/common/select'
import { bizNo, email, emailList, maxLen, required, runRules, safeName, url, type Validator } from '@/lib/validate'

/**
 * 시안(dc.html)의 modalDefs 구조를 그대로 옮긴 폼 모달.
 * 필드 = [라벨, 유형(text|select|area|chips), 필수, placeholder, 옵션]
 * ⚠️ 네이티브 select 금지 — select는 트리거와 같은 폭의 커스텀 드롭다운으로 연다.
 */

export type FieldType =
  | 'text'
  | 'select'
  | 'area'
  | 'chips'
  /** 값이 고정된 안내용 입력 (예: 초대 대상 조직&사업부 명칭) */
  | 'readonly'
  /** 이메일 + 역할 행을 여러 개 추가하는 초대 입력 (설계서 p11) */
  | 'invite'

export interface ModalField {
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: string[]
  /** readonly 필드에 표시할 값 */
  value?: string
  /** 추가 검증 규칙 — 라벨로 자동 추론되며 필요하면 직접 지정 */
  rules?: Validator[]
}

/** 라벨로 기본 검증 규칙을 추론한다 (이메일·사업자번호·이름 등) */
function rulesFor(f: ModalField): Validator[] {
  const rules: Validator[] = []
  if (f.required) rules.push(required(f.label))
  if (/이메일/.test(f.label)) rules.push(/초대|멤버/.test(f.label) ? emailList : email)
  if (/사업자/.test(f.label)) rules.push(bizNo)
  if (/URL|웹사이트/i.test(f.label)) rules.push(url)
  if (/이름|제목|폴더|파일/.test(f.label)) {
    rules.push(safeName)
    // 필드가 길이 규칙을 직접 지정했다면 기본 60자 제한은 덧붙이지 않는다
    if (!f.rules?.length) rules.push(maxLen(60, f.label))
  }
  if (/설명|내용/.test(f.label)) rules.push(maxLen(300, f.label))
  return [...rules, ...(f.rules ?? [])]
}

export function FormModal({
  open,
  onClose,
  id,
  title,
  desc,
  width,
  cta,
  danger,
  fields,
  children,
}: {
  open: boolean
  onClose: () => void
  /** 드롭다운 열림 상태 키 접두사 (검수 프리셋 `mf:<id>:<index>`와 일치) */
  id: string
  title: string
  desc?: string
  width?: number
  cta: string
  danger?: boolean
  fields?: ModalField[]
  children?: React.ReactNode
}) {
  const [sel, setSel] = useState<Record<number, number>>({})
  const [values, setValues] = useState<Record<number, string>>({})
  const [touched, setTouched] = useState<Record<number, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  /** invite 필드의 행 목록 — 필드 인덱스별로 관리한다 */
  const [rows, setRows] = useState<Record<number, { email: string; role: string }[]>>({})
  const rowsOf = (i: number, f: ModalField) => rows[i] ?? [{ email: '', role: (f.options ?? ['관리자'])[0] }]
  const setRowsAt = (i: number, next: { email: string; role: string }[]) => setRows({ ...rows, [i]: next })

  const Cta = danger ? BtnDanger : BtnPrimary
  const list = fields ?? []
  const errors = list.map((f, i) => {
    if (f.type === 'text' || f.type === 'area') return runRules(values[i] ?? '', rulesFor(f))
    if (f.type === 'invite') {
      const rs = rowsOf(i, f)
      if (f.required && !rs.some((r) => r.email.trim())) return '초대할 멤버의 이메일을 한 명 이상 입력해주세요'
      const bad = rs.map((r) => r.email).filter((e) => e.trim()).map(email).find(Boolean)
      return bad ?? null
    }
    return null
  })
  const invalid = errors.some(Boolean)
  const errorOf = (i: number) => ((touched[i] || submitted) && errors[i]) || null

  const submit = () => {
    setSubmitted(true)
    if (invalid) return
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      desc={desc}
      width={width}
      footer={
        <>
          <div className="flex-1" />
          <BtnGhost onClick={onClose}>취소</BtnGhost>
          <Cta onClick={submit}>{cta}</Cta>
        </>
      }
    >
      {children}
      {list.map((f, i) => {
        const cur = sel[i] ?? 0
        const key = `mf:${id}:${i}`
        const err = errorOf(i)
        const invalidCls = err ? ' border-bad-border focus:border-bad' : ''
        return (
          <Field key={f.label} label={f.required ? `${f.label} *` : f.label} error={err}>
            {f.type === 'text' && (
              <input
                className={inputCls + invalidCls}
                placeholder={f.placeholder}
                autoFocus={i === 0}
                aria-invalid={!!err}
                value={values[i] ?? ''}
                onChange={(e) => setValues({ ...values, [i]: e.target.value })}
                onBlur={() => setTouched({ ...touched, [i]: true })}
              />
            )}
            {f.type === 'area' && (
              <textarea
                className={`${inputCls}${invalidCls} resize-none`}
                rows={3}
                placeholder={f.placeholder}
                aria-invalid={!!err}
                value={values[i] ?? ''}
                onChange={(e) => setValues({ ...values, [i]: e.target.value })}
                onBlur={() => setTouched({ ...touched, [i]: true })}
              />
            )}
            {f.type === 'chips' && (
              <ChoiceRow
                name={`${id}-${i}`}
                value={(f.options ?? [])[cur] ?? ''}
                options={f.options ?? []}
                onChange={(v) => setSel({ ...sel, [i]: (f.options ?? []).indexOf(v) })}
              />
            )}
            {f.type === 'readonly' && (
              <input className={`${inputCls} bg-ink-50 text-ink-500`} value={f.value ?? ''} readOnly tabIndex={-1} />
            )}
            {f.type === 'invite' && (
              <div className="flex flex-col gap-1.5">
                <div className="grid grid-cols-[minmax(0,1fr)_140px_34px] gap-1.5">
                  <span className="text-sm2 font-bold text-ink-500">멤버</span>
                  <span className="text-sm2 font-bold text-ink-500">역할</span>
                  <span />
                </div>
                {rowsOf(i, f).map((r, ri) => (
                  <div key={ri} className="grid grid-cols-[minmax(0,1fr)_140px_34px] items-center gap-1.5">
                    <input
                      className={`${inputCls} h-[34px] py-0${err && r.email.trim() && email(r.email) ? ' border-bad-border' : ''}`}
                      placeholder="초대할 멤버의 이메일을 입력하세요"
                      value={r.email}
                      aria-invalid={!!(r.email.trim() && email(r.email))}
                      onChange={(e) => {
                        const next = [...rowsOf(i, f)]
                        next[ri] = { ...r, email: e.target.value }
                        setRowsAt(i, next)
                      }}
                      onBlur={() => setTouched({ ...touched, [i]: true })}
                    />
                    <Select
                      ddKey={`${key}:${ri}`}
                      className="h-[34px]"
                      value={r.role}
                      options={f.options ?? ['관리자']}
                      onChange={(v) => {
                        const next = [...rowsOf(i, f)]
                        next[ri] = { ...r, role: v }
                        setRowsAt(i, next)
                      }}
                    />
                    <button
                      type="button"
                      title="행 삭제"
                      disabled={rowsOf(i, f).length === 1}
                      onClick={() => setRowsAt(i, rowsOf(i, f).filter((_, x) => x !== ri))}
                      className="flex h-[34px] items-center justify-center rounded-[7px] border border-ink-200 bg-white text-ink-400 hover:border-bad hover:text-bad disabled:opacity-40"
                    >
                      <Icon name="delete" size={17} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setRowsAt(i, [...rowsOf(i, f), { email: '', role: (f.options ?? ['관리자'])[0] }])}
                  className="flex h-[34px] items-center justify-center gap-1 rounded-[7px] border border-dashed border-ink-300 bg-white text-sm2 font-bold text-ink-500 hover:border-brand hover:text-brand-dark"
                >
                  <Icon name="add" size={16} />
                  추가하기
                </button>
              </div>
            )}
            {f.type === 'select' && (
              <Select
                ddKey={key}
                value={(f.options ?? [])[cur] ?? ''}
                options={f.options ?? []}
                onChange={(v) => setSel({ ...sel, [i]: (f.options ?? []).indexOf(v) })}
              />
            )}
          </Field>
        )
      })}
    </Modal>
  )
}
