import { useState } from 'react'
import { BtnDanger, BtnGhost, BtnPrimary, Field, Modal, inputCls } from './Modal'
import { ChoiceRow } from '@/components/common/ChoiceRow'
import { Select } from '@/components/common/select'
import { bizNo, email, emailList, maxLen, required, runRules, safeName, type Validator } from '@/lib/validate'

/**
 * 시안(dc.html)의 modalDefs 구조를 그대로 옮긴 폼 모달.
 * 필드 = [라벨, 유형(text|select|area|chips), 필수, placeholder, 옵션]
 * ⚠️ 네이티브 select 금지 — select는 트리거와 같은 폭의 커스텀 드롭다운으로 연다.
 */

export type FieldType = 'text' | 'select' | 'area' | 'chips'

export interface ModalField {
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: string[]
  /** 추가 검증 규칙 — 라벨로 자동 추론되며 필요하면 직접 지정 */
  rules?: Validator[]
}

/** 라벨로 기본 검증 규칙을 추론한다 (이메일·사업자번호·이름 등) */
function rulesFor(f: ModalField): Validator[] {
  const rules: Validator[] = []
  if (f.required) rules.push(required(f.label))
  if (/이메일/.test(f.label)) rules.push(/초대|멤버/.test(f.label) ? emailList : email)
  if (/사업자/.test(f.label)) rules.push(bizNo)
  if (/이름|제목|폴더|파일/.test(f.label)) rules.push(safeName, maxLen(60, f.label))
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

  const Cta = danger ? BtnDanger : BtnPrimary
  const list = fields ?? []
  const errors = list.map((f, i) =>
    f.type === 'text' || f.type === 'area' ? runRules(values[i] ?? '', rulesFor(f)) : null,
  )
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
