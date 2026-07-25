import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Icon } from '@/components/common/icon'
import { DotCube } from '@/components/common/DotCube'

/** 인증 (p7) — 로그인 / 회원가입 / 아이디·비밀번호 찾기 / 2FA. 블루 컨셉 + AI 파형 배경 */

const TABS = [
  { id: 'login', label: '로그인', title: '다시 오신 걸 환영합니다', desc: '조직 계정으로 로그인하세요' },
  { id: 'signup', label: '회원가입', title: '계정 만들기', desc: '초대받은 이메일로 가입합니다' },
  { id: 'find', label: '계정 찾기', title: '아이디 · 비밀번호 찾기', desc: '가입한 이메일로 재설정 링크를 보냅니다' },
  { id: '2fa', label: '2단계 인증', title: '2단계 인증', desc: '인증 앱에 표시된 6자리 코드를 입력하세요' },
] as const

const STEPS = [
  { icon: 'document_scanner', label: 'OCR 추출' },
  { icon: 'auto_awesome', label: 'RAG 색인' },
  { icon: 'search_insights', label: '의미 추론 검색' },
]

const inputCls =
  'w-full rounded-[9px] border border-ink-300 px-3.5 py-2.5 text-body outline-none focus:border-brand-link'

/** AI 파형 배경 (시안 authWave) — 큐브 하단에 낮게 깔아 바닥선 역할 */
function Wave() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 opacity-[.22]">
      <div className="flex h-[140px] w-[200%] items-end gap-1.5">
        {Array.from({ length: 90 }).map((_, i) => (
          <span
            key={i}
            className="flex-1 rounded-t bg-white/40"
            style={{
              height: `${20 + Math.abs(Math.sin(i * 0.7)) * 78}%`,
              animation: `eq ${1.6 + (i % 5) * 0.25}s ease-in-out ${i * 0.04}s infinite`,
              transformOrigin: 'bottom',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>(
    (params.get('tab') as (typeof TABS)[number]['id']) ?? 'login',
  )
  // 검수 인덱스에서 같은 라우트의 다른 탭으로 열 때 쿼리 변화를 따라간다
  const qTab = params.get('tab') as (typeof TABS)[number]['id'] | null
  useEffect(() => {
    if (qTab && qTab !== tab) setTab(qTab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qTab])

  const [pw, setPw] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [agree, setAgree] = useState({ tos: false, priv: false, mkt: false })

  const cur = TABS.find((t) => t.id === tab)!
  const strength = pw.length >= 12 ? 2 : pw.length >= 8 ? 1 : pw ? 0 : -1
  const strengthMeta = [
    { label: '약함', color: '#ef4444', w: '33%' },
    { label: '보통', color: '#f59e0b', w: '66%' },
    { label: '강함', color: '#16a34a', w: '100%' },
  ]

  return (
    <div className="flex h-screen min-h-0">
      {/* 좌측 브랜드 패널 */}
      {/* 좁아지면 패널도 같이 줄어든다(숨기지 않는다). 640px 미만에서만 접어 폼에 자리를 내준다 */}
      <div
        className="relative hidden w-[46%] min-w-[300px] flex-none flex-col justify-between overflow-hidden px-11 py-[52px] text-white min-[640px]:flex"
        style={{ background: 'linear-gradient(160deg,#1750d8 0%,#123fae 55%,#0d2f80 100%)' }}
      >
        {/* 입체 격자 큐브 — 패널 전체를 덮고, 큐브 자체는 상단(헤드라인 위)에 앉는다 */}
        <DotCube className="pointer-events-none absolute inset-0 h-full w-full opacity-[.8]" />
        <Wave />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(100% 70% at 15% 8%,rgba(255,255,255,.16),transparent 62%)' }}
        />
        <div className="relative flex items-center gap-3">
          <img src="/amber-logo.png" alt="Amber" className="block h-7 w-auto" />
          <div className="text-xl2 font-extrabold tracking-[-.01em]">Amber</div>
        </div>

        <div className="relative">
          <div className="mb-3.5 whitespace-nowrap text-5xl2 font-extrabold leading-[1.34] tracking-[-.03em]">
            문서를 읽고 이해하는
            <br />
            사내 전용 AI 지식 콘솔
          </div>
          <div className="text-[15px] leading-[1.75] text-brand-pale">
            업로드한 문서를 OCR·RAG로 색인하고,
            <br />
            키워드가 아닌 <span className="font-semibold text-white">의미 추론</span>으로 근거를 페이지 단위로 찾아냅니다.
          </div>
          <div className="mt-7 flex items-center gap-4">
            {STEPS.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <Icon name={s.icon} size={16} className="text-white/80" />
                <span className="whitespace-nowrap text-[12.1px] text-brand-pale">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-[11.6px] text-white/72">
          <Icon name="lock" size={15} className="text-white/72" />
          Private AI for Enterprise Knowledge · EvolvAiLab
        </div>
      </div>

      {/* 우측 폼 */}
      <div className="flex min-w-0 flex-1 items-center justify-center overflow-auto px-6 py-9 sm:px-8">
        <div className="w-full max-w-[368px]">
          <div className="mb-[26px] flex gap-1 border-b border-ink-200">
            {TABS.map((t) => {
              const on = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="border-b-2 px-3 py-2 text-body font-bold hover:text-ink-900"
                  style={{ borderBottomColor: on ? '#1750d8' : 'transparent', color: on ? '#0f172a' : '#94a3b8' }}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          <div className="mb-1.5 text-3xl2 font-extrabold tracking-[-.02em]">{cur.title}</div>
          <div className="mb-6 text-body text-ink-500">{cur.desc}</div>

          {tab === '2fa' ? (
            <>
              <div className="mb-4 flex items-center gap-2 rounded-[9px] border border-ink-200 bg-ink-50 px-3.5 py-3">
                <Icon name="phonelink_lock" size={20.4} className="text-brand" />
                <div className="min-w-0 flex-1">
                  <div className="text-label font-bold">인증 앱 (Authenticator)</div>
                  <div className="mt-px text-cap text-ink-500">hong@evolvailab.com · 등록된 기기 1대</div>
                </div>
                <button className="rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-xs2 font-bold text-ink-700 hover:bg-ink-100">
                  변경
                </button>
              </div>

              <div className="mb-3 flex justify-between gap-2">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    value={v}
                    maxLength={1}
                    onChange={(e) => setOtp((o) => o.map((x, xi) => (xi === i ? e.target.value : x)))}
                    className="w-full rounded-lg border border-ink-300 py-3 text-center font-mono text-3xl2 font-bold outline-none focus:border-brand-link"
                  />
                ))}
              </div>

              <div className="mb-3.5 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full rounded-full bg-brand-link" style={{ width: '62%' }} />
                </div>
                <span className="font-mono text-sm2 font-bold text-brand-link">00:42</span>
              </div>

              <div className="mb-[18px] flex items-center gap-2">
                <span className="whitespace-nowrap text-sm2 text-ink-500">코드가 오지 않나요?</span>
                <button className="text-sm2 font-bold text-brand">코드 재전송</button>
                <div className="flex-1" />
                <button className="text-sm2 font-semibold text-ink-500">백업 코드 사용</button>
              </div>

              <label className="mb-[18px] flex cursor-pointer items-center gap-2">
                <input type="checkbox" className="size-[15px] accent-brand" />
                <span className="whitespace-nowrap text-sm2 text-ink-700">이 브라우저는 30일간 신뢰</span>
              </label>
            </>
          ) : (
            <>
              {tab === 'signup' && (
                <div className="mb-4 flex items-center gap-2 rounded-[9px] border border-brand-border bg-brand-soft px-3.5 py-3">
                  <Icon name="mail" size={19.4} className="text-brand" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm2 font-bold text-brand-dark">초대받은 계정으로 가입 중</div>
                    <div className="mt-px text-cap text-ink-600">Amber Evolution · ESG 전략팀 초대</div>
                  </div>
                </div>
              )}

              <label className="mb-3.5 block">
                <span className="mb-1.5 block text-sm2 font-bold text-ink-700">이메일</span>
                <input className={inputCls} placeholder="name@company.com" defaultValue="hong@evolvailab.com" />
              </label>

              {tab !== 'find' && (
                <label className="mb-3.5 block">
                  <span className="mb-1.5 block text-sm2 font-bold text-ink-700">비밀번호</span>
                  <input
                    type="password"
                    className={inputCls}
                    placeholder="8자 이상"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                  />
                  {tab === 'signup' && strength >= 0 && (
                    <span className="mt-2 flex items-center gap-2">
                      <span className="h-1 flex-1 overflow-hidden rounded-full bg-ink-100">
                        <span
                          className="block h-full rounded-full"
                          style={{ width: strengthMeta[strength].w, background: strengthMeta[strength].color }}
                        />
                      </span>
                      <span className="text-xs2 font-bold" style={{ color: strengthMeta[strength].color }}>
                        {strengthMeta[strength].label}
                      </span>
                    </span>
                  )}
                </label>
              )}

              {tab === 'signup' && (
                <div className="mb-4 flex flex-col gap-2 rounded-[9px] border border-ink-200 bg-ink-50 px-3.5 py-3">
                  {([
                    ['tos', '(필수) 서비스 이용약관 동의'],
                    ['priv', '(필수) 개인정보 처리방침 동의'],
                    ['mkt', '(선택) 제품 소식 수신 동의'],
                  ] as const).map(([id, label]) => (
                    <label key={id} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agree[id]}
                        onChange={(e) => setAgree((a) => ({ ...a, [id]: e.target.checked }))}
                        className="size-[15px] accent-brand"
                      />
                      <span className="text-sm2 text-ink-700">{label}</span>
                    </label>
                  ))}
                </div>
              )}

              {tab === 'login' && (
                <div className="mb-[18px] flex items-center">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" className="size-[15px] accent-brand" defaultChecked />
                    <span className="text-sm2 text-ink-700">로그인 유지</span>
                  </label>
                  <div className="flex-1" />
                  <button onClick={() => setTab('find')} className="text-sm2 font-bold text-brand">
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
              )}
            </>
          )}

          <button
            onClick={() => (tab === 'login' || tab === '2fa' ? navigate('/') : setTab(tab === 'signup' ? '2fa' : 'login'))}
            className="w-full rounded-[9px] bg-brand py-3 text-body font-bold text-white hover:bg-brand-dark"
          >
            {tab === 'login' ? '로그인' : tab === 'signup' ? '가입하고 시작하기' : tab === 'find' ? '재설정 링크 보내기' : '인증 완료'}
          </button>

          {tab === 'login' && (
            <>
              <div className="my-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-ink-200" />
                <span className="text-xs2 text-ink-400">또는</span>
                <span className="h-px flex-1 bg-ink-200" />
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-[9px] border border-ink-300 bg-white py-3 text-body font-bold text-ink-700 hover:bg-ink-100">
                <Icon name="corporate_fare" size={19} />
                조직 계정(SSO)으로 로그인
              </button>
            </>
          )}

          {tab === 'find' && (
            <div className="mt-4 rounded-[9px] border border-ink-200 bg-ink-50 px-3.5 py-3 text-sm2 leading-[1.7] text-ink-500">
              조직 계정(SSO)을 쓰는 경우 비밀번호 재설정 대신 관리자에게 문의해 주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
