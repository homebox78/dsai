import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Icon } from '@/components/common/icon'

/**
 * 초기 셋업 (p23~25) — 조직 → 조직&사업부 → 프로젝트 3단계.
 * ⚠️ 최초 관리자 접근 시 계층이 없어 모달이 아닌 별도 페이지로 구성한다(시안 p23 특이사항).
 *    향후 모달로 대체 예정.
 */

const STEPS = [
  { key: 'org', label: '조직', desc: '최상위 데이터/보안 경계' },
  { key: 'ws', label: '조직&사업부', desc: '부서별 단위 작업 공간' },
  { key: 'proj', label: '프로젝트', desc: '실제 업무 수행 단위' },
] as const

const PLANS = [
  { id: 'STARTER', price: '무료', desc: '문서 100건 · 색인 1GB' },
  { id: 'BUSINESS', price: '₩49,000/월', desc: '문서 5,000건 · 색인 20GB' },
  { id: 'ENTERPRISE', price: '문의', desc: '무제한 · 전용 색인 · SSO' },
]

const inputCls =
  'w-full rounded-[9px] border border-ink-300 px-3.5 py-2.5 text-body outline-none focus:border-brand-link'

export function SetupPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [step, setStep] = useState(Number(params.get('step') ?? 0))
  const [plan, setPlan] = useState('ENTERPRISE')
  const [vis, setVis] = useState('공개')
  const [org, setOrg] = useState('Amber Evolution')
  const [ws, setWs] = useState('ESG 전략팀')
  const [biz, setBiz] = useState('ESG 본부')
  const [proj, setProj] = useState('에코바디스 2026 대응')
  const [invites, setInvites] = useState(['sj.lee@corp.com', 'jw.park@corp.com'])
  const [inviteInput, setInviteInput] = useState('')

  const next = () => (step < 2 ? setStep(step + 1) : navigate('/'))

  return (
    <div className="flex h-screen min-h-0 bg-ink-50">
      {/* 좌측 스텝 레일 */}
      <div
        className="relative flex w-[340px] flex-none flex-col justify-between overflow-hidden px-9 py-11 text-white"
        style={{ background: 'linear-gradient(160deg,#1750d8 0%,#123fae 55%,#0d2f80 100%)' }}
      >
        <div>
          <div className="flex items-center gap-3">
            <img src="/amber-logo.png" alt="Amber" className="block h-6 w-auto" />
            <span className="text-lg2 font-extrabold tracking-[-.01em]">Amber</span>
          </div>
          <div className="mt-1.5 text-sm2 text-brand-pale">초기 설정 · 1회성</div>

          <div className="mt-11 flex flex-col gap-1">
            {STEPS.map((s, i) => {
              const done = i < step
              const on = i === step
              return (
                <button
                  key={s.key}
                  onClick={() => setStep(i)}
                  className="flex items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors"
                  style={{ background: on ? 'rgba(255,255,255,.14)' : 'transparent' }}
                >
                  <span
                    className="mt-0.5 flex size-6 flex-none items-center justify-center rounded-full text-xs2 font-extrabold"
                    style={{
                      background: done || on ? '#fff' : 'rgba(255,255,255,.18)',
                      color: done || on ? '#1750d8' : 'rgba(255,255,255,.7)',
                    }}
                  >
                    {done ? <Icon name="check" size={15} /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-label font-bold">{s.label}</span>
                    <span className="mt-0.5 block text-xs2 text-brand-pale">{s.desc}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 계층 미리보기 — 입력값이 실시간 반영 */}
        <div className="rounded-xl border border-white/20 bg-white/10 p-4">
          <div className="mb-2.5 text-tiny font-extrabold tracking-[.06em] text-white/70">계층 미리보기</div>
          <div className="flex flex-col gap-1.5 text-sm2">
            <div className="flex items-center gap-2">
              <Icon name="apartment" size={16} className="text-white/70" />
              <span className="truncate font-bold">{org || '조직명'}</span>
            </div>
            <div className="ml-2 flex items-center gap-2" style={{ opacity: step >= 1 ? 1 : 0.45 }}>
              <span className="text-white/40">└</span>
              <Icon name="groups" size={16} className="text-white/70" />
              <span className="truncate font-bold">{ws || '조직&사업부'}</span>
            </div>
            <div className="ml-6 flex items-center gap-2" style={{ opacity: step >= 2 ? 1 : 0.45 }}>
              <span className="text-white/40">└</span>
              <Icon name="folder_special" size={16} className="text-white/70" />
              <span className="truncate font-bold">{proj || '프로젝트'}</span>
            </div>
          </div>
          <div className="mt-3 border-t border-white/15 pt-2.5 text-tiny leading-[1.7] text-white/70">
            각 단계는 독립 저장되며, 이전 단계의 id가 다음 단계의 부모 키로 사용됩니다.
          </div>
        </div>
      </div>

      {/* 우측 폼 */}
      <div className="flex min-w-0 flex-1 items-center justify-center overflow-auto p-10">
        <div className="w-full max-w-[520px]">
          <div className="mb-1.5 text-tiny font-extrabold tracking-[.06em] text-ink-400">
            STEP {step + 1} / 3
          </div>
          <h1 className="mb-1.5 text-[26px] font-extrabold tracking-[-.02em]">
            {step === 0 ? '조직을 만들어 주세요' : step === 1 ? '조직&사업부를 만들어 주세요' : '첫 프로젝트를 만들어 주세요'}
          </h1>
          <p className="mb-7 text-body text-ink-500">
            {step === 0
              ? '조직은 Amber의 최상위 데이터 경계입니다. 사용자·문서·감사 로그가 모두 조직 기준으로 분리됩니다.'
              : step === 1
                ? '부서·팀 단위 작업 공간입니다. 프로젝트는 항상 선택된 조직&사업부 아래에 생성됩니다.'
                : '실제 업무 수행 단위입니다. 문서 저장소·채팅·업무·에코바디스가 프로젝트 안에서 만들어집니다.'}
          </p>

          {step === 0 && (
            <>
              <label className="mb-4 block">
                <span className="mb-1.5 block text-sm2 font-bold text-ink-700">조직 이름</span>
                <input className={inputCls} value={org} onChange={(e) => setOrg(e.target.value)} autoFocus />
              </label>
              <label className="mb-4 block">
                <span className="mb-1.5 block text-sm2 font-bold text-ink-700">사업자등록번호</span>
                <input className={inputCls} placeholder="선택 사항 · 000-00-00000" />
              </label>
              <div className="mb-2 text-sm2 font-bold text-ink-700">플랜</div>
              <div className="grid grid-cols-3 gap-2">
                {PLANS.map((p) => {
                  const on = plan === p.id
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPlan(p.id)}
                      className="rounded-xl border p-3.5 text-left"
                      style={{ borderColor: on ? '#1750d8' : '#e2e8f0', background: on ? '#eff6ff' : '#fff' }}
                    >
                      <div className="text-tiny font-extrabold tracking-[.06em] text-ink-400">{p.id}</div>
                      <div className="mt-1.5 text-label font-extrabold">{p.price}</div>
                      <div className="mt-1.5 text-xs2 leading-[1.6] text-ink-500">{p.desc}</div>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <label className="mb-4 block">
                <span className="mb-1.5 block text-sm2 font-bold text-ink-700">조직&사업부 이름</span>
                <input className={inputCls} value={ws} onChange={(e) => setWs(e.target.value)} autoFocus />
              </label>
              <label className="mb-4 block">
                <span className="mb-1.5 block text-sm2 font-bold text-ink-700">상위 사업부</span>
                <input className={inputCls} value={biz} onChange={(e) => setBiz(e.target.value)} />
              </label>
              <label className="mb-4 block">
                <span className="mb-1.5 block text-sm2 font-bold text-ink-700">설명</span>
                <textarea className={`${inputCls} resize-none`} rows={3} placeholder="어떤 일을 하는 조직인지 적어주세요" />
              </label>
              <div className="rounded-[9px] border border-ink-200 bg-white px-3.5 py-3 text-sm2 leading-[1.7] text-ink-500">
                생성 후에는 조직&사업부 전환 팝오버에서 언제든 추가·변경할 수 있습니다. (향후 모달로 대체)
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <label className="mb-4 block">
                <span className="mb-1.5 block text-sm2 font-bold text-ink-700">프로젝트 이름</span>
                <input className={inputCls} value={proj} onChange={(e) => setProj(e.target.value)} autoFocus />
              </label>

              <div className="mb-4">
                <span className="mb-1.5 block text-sm2 font-bold text-ink-700">공개 범위</span>
                <div className="flex gap-1.5">
                  {['공개', '비공개'].map((v) => {
                    const on = vis === v
                    return (
                      <button
                        key={v}
                        onClick={() => setVis(v)}
                        className="flex-1 rounded-[9px] border py-2.5 text-body font-bold"
                        style={{
                          background: on ? '#1750d8' : '#fff',
                          borderColor: on ? '#1750d8' : '#cbd5e1',
                          color: on ? '#fff' : '#334155',
                        }}
                      >
                        {v}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mb-4">
                <span className="mb-1.5 block text-sm2 font-bold text-ink-700">멤버 초대</span>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {invites.map((e) => (
                    <span
                      key={e}
                      className="flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-soft px-2.5 py-1 text-sm2 font-semibold text-brand-dark"
                    >
                      {e}
                      <button
                        onClick={() => setInvites((v) => v.filter((x) => x !== e))}
                        className="text-brand-dark/60 hover:text-bad-dark"
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    className={inputCls}
                    placeholder="name@company.com"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inviteInput.trim()) {
                        setInvites((v) => [...v, inviteInput.trim()])
                        setInviteInput('')
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (!inviteInput.trim()) return
                      setInvites((v) => [...v, inviteInput.trim()])
                      setInviteInput('')
                    }}
                    className="flex-none rounded-[9px] border border-ink-300 bg-white px-4 text-sm2 font-bold text-ink-700 hover:bg-ink-100"
                  >
                    추가
                  </button>
                </div>
              </div>

              <div className="rounded-[9px] border border-ok-border bg-ok-softer px-3.5 py-3">
                <div className="flex items-center gap-1.5 text-label font-bold text-ok-dark">
                  <Icon name="check_circle" size={17} />
                  설정이 끝나면 바로 사용할 수 있습니다
                </div>
                <div className="mt-1.5 text-sm2 leading-[1.7] text-ink-600">
                  기본 문서 저장소와 협업 채널이 함께 생성되고, 초대한 멤버에게 메일이 발송됩니다.
                </div>
              </div>
            </>
          )}

          <div className="mt-7 flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="rounded-[9px] border border-ink-300 bg-white px-5 py-2.5 text-body font-bold text-ink-700 hover:bg-ink-100"
              >
                이전
              </button>
            )}
            <div className="flex-1" />
            <button onClick={() => navigate('/')} className="text-sm2 font-bold text-ink-500 hover:text-ink-900">
              나중에 하기
            </button>
            <button
              onClick={next}
              className="rounded-[9px] bg-brand px-6 py-2.5 text-body font-bold text-white hover:bg-brand-dark"
            >
              {step < 2 ? '저장하고 계속' : '완료하고 시작하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
