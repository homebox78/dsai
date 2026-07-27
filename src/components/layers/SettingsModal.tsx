import { useState } from 'react'
import { Select } from '@/components/common/select'
import { useQaState } from '@/lib/qa-state'
import { Icon } from '@/components/common/icon'
import { Modal, BtnGhost, BtnPrimary } from './Modal'
import { members } from '@/mocks/data'
import { useLayer, useLayerStore } from '@/stores/layer-store'

/** 설정 (p18·p29~34) — 5영역: 내 계정 · 보안 · 조직&사업부 · AI·색인 · 알림 */

type Row =
  | { label: string; desc: string; kind: 'action'; action: string; danger?: boolean }
  | { label: string; desc: string; kind: 'toggle'; on: boolean }
  | { label: string; desc: string; kind: 'select'; options: string[] }

const NAV = [
  { id: 'account', label: '내 계정', icon: 'person', title: '내 계정', desc: '이름·직함·언어 등 개인 정보' },
  { id: 'security', label: '보안 · 로그인', icon: 'lock', title: '보안 및 로그인', desc: '비밀번호 · 2단계 인증 · 세션' },
  { id: 'users', label: '사용자', icon: 'group', title: '사용자', desc: '조직&사업부에 소속된 멤버를 관리합니다' },
  { id: 'billing', label: '요금제 · 결제', icon: 'credit_card', title: '요금제 및 결제수단', desc: '현재 구독 중인 요금제와 결제 정보를 확인합니다' },
  { id: 'org', label: '조직&사업부', icon: 'apartment', title: '조직&사업부 설정', desc: '멤버 정책 · 외부 공유 · 스토리지' },
  { id: 'audit', label: '관리 이력', icon: 'history', title: '관리 이력', desc: '설정·권한 변경 감사 로그' },
  { id: 'ai', label: 'AI · 색인', icon: 'auto_awesome', title: 'AI · 색인 정책', desc: 'OCR·RAG 처리와 답변 인용 정책' },
  { id: 'noti', label: '알림', icon: 'notifications', title: '알림 설정', desc: '업무·멘션·색인 알림 채널' },
] as const

const ROWS: Record<string, Row[]> = {
  account: [
    { label: '프로필 사진', desc: 'JPG · PNG · 최대 5MB', kind: 'action', action: '사진 변경' },
    { label: '이름 · 직함', desc: '홍길동 · 성과 리드', kind: 'action', action: '변경' },
    { label: '이메일', desc: 'hong@evolvailab.com · 조직 인증 계정', kind: 'action', action: '변경' },
    { label: '연락처', desc: '010-1234-5678 · 2FA SMS 수신 번호', kind: 'action', action: '변경' },
    { label: '로그인 방식', desc: 'Google 계정 연결됨 · hong@evolvailab.com', kind: 'action', action: '비밀번호로 변경' },
    { label: '회사', desc: 'Amber Evolution', kind: 'action', action: '변경' },
    { label: '국가', desc: '기본 통화·세금계산서 기준', kind: 'select', options: ['대한민국', '미국', '일본'] },
    { label: '표시 언어', desc: '화면 전체에 적용됩니다', kind: 'select', options: ['한국어', 'English'] },
    { label: '시간대', desc: '기한·알림 시각 기준', kind: 'select', options: ['(GMT+9) 서울', '(GMT+0) UTC'] },
    { label: '기본 진입 화면', desc: '로그인 후 처음 열리는 화면', kind: 'select', options: ['대시보드', '문서 저장소', '업무 관리'] },
    { label: '광고성 정보 수신 동의', desc: '제품 소식·이벤트 메일 · 최근 변경 2026.07.02', kind: 'toggle', on: false },
  ],
  security: [
    { label: '비밀번호', desc: '마지막 변경 2026.05.02', kind: 'action', action: '변경' },
    { label: '2단계 인증 (2FA)', desc: '인증 앱 코드로 추가 확인 · Google Authenticator 등록됨', kind: 'toggle', on: true },
    { label: '신뢰 기기 유지', desc: '2FA 통과한 브라우저를 30일간 기억', kind: 'toggle', on: true },
    { label: 'SSO 강제', desc: '조직 계정(SAML)으로만 로그인 허용', kind: 'toggle', on: false },
    { label: '자동 로그아웃', desc: '무활동 시 세션 종료 시간', kind: 'select', options: ['4시간', '1시간', '8시간'] },
    { label: '백업 코드', desc: '인증 앱을 쓸 수 없을 때 사용 · 10개 중 8개 남음', kind: 'action', action: '재발급' },
  ],
  org: [
    { label: '조직&사업부 이름', desc: 'ESG 전략팀 · 상위 ESG 본부', kind: 'action', action: '변경' },
    { label: '멤버 초대 권한', desc: '누가 멤버를 초대할 수 있는지', kind: 'select', options: ['마스터만', '편집 가능 이상', '전체 멤버'] },
    { label: '외부 협업자 허용', desc: '조직 외부 이메일 초대 · 기본 만료 30일', kind: 'toggle', on: true },
    { label: '기본 프로젝트 공개 범위', desc: '새 프로젝트 생성 시 적용', kind: 'select', options: ['공개 (조직&사업부 전체)', '비공개'] },
    { label: '문서 다운로드 제한', desc: '보기 전용 멤버의 원본 내려받기 차단', kind: 'toggle', on: false },
    { label: '조직&사업부 삭제', desc: '모든 프로젝트·문서가 영구 삭제됩니다', kind: 'action', action: '삭제', danger: true },
  ],
  users: [],
  billing: [
    { label: '청구서 수신 이메일', desc: 'billing@evolvailab.com', kind: 'action', action: '변경' },
    { label: '세금계산서 자동 발행', desc: '매월 1일 사업자 정보로 발행', kind: 'toggle', on: true },
    { label: '청구 내역', desc: '최근 12개월 결제 내역과 영수증', kind: 'action', action: '내려받기' },
  ],
  audit: [],
  ai: [
    { label: 'OCR 자동 실행', desc: '업로드 즉시 텍스트 추출 · 스캔 PDF·이미지 포함', kind: 'toggle', on: true },
    { label: 'RAG 색인 자동 실행', desc: 'OCR 완료 후 임베딩 · 검색·답변에 사용', kind: 'toggle', on: true },
    { label: 'OCR 기본 언어', desc: '문서 인식 정확도에 영향', kind: 'select', options: ['한국어 + 영어', '한국어', 'English'] },
    { label: '표·양식 구조 추출', desc: '표를 셀 단위로 인식해 인용 정확도 향상', kind: 'toggle', on: true },
    { label: '답변 근거 표시', desc: '챗봇 답변에 파일명·페이지 인용을 항상 표시', kind: 'toggle', on: true },
    { label: '학습 데이터 제외 폴더', desc: '인사·법무 등 민감 폴더 2개 제외 중', kind: 'action', action: '폴더 선택' },
    { label: '외부 모델 전송', desc: '사내 전용 · 데이터 외부 유출 없음', kind: 'toggle', on: false },
  ],
  noti: [
    { label: '업무 요청 알림', desc: '나에게 배정된 업무가 생기면 알림', kind: 'toggle', on: true },
    { label: '멘션 알림', desc: '@내이름 으로 호출되면 알림', kind: 'toggle', on: true },
    { label: '색인 완료 알림', desc: '업로드 문서의 OCR·RAG 색인이 끝나면 알림', kind: 'toggle', on: true },
    { label: '알림 채널', desc: '어디로 받을지 선택', kind: 'select', options: ['앱 + 이메일', '앱만', '이메일만'] },
    { label: '요약 리포트', desc: '주간 업무·색인 현황 메일', kind: 'select', options: ['매주 월요일', '매일', '받지 않음'] },
  ],
}

/* ── 설계서 전용 패널 (표·카드형) ─────────────────── */

/** 설정 > 사용자 (설계서 p30) — 조직&사업부 소속 멤버 표 */
function UserPanel() {
  const openLayer = useLayerStore((s) => s.open)
  const rows = members.slice(0, 5)
  return (
    <div className="py-2">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm2 text-ink-500">총 {rows.length}명</span>
        <button
          onClick={() => openLayer('member-invite')}
          className="ml-auto flex h-[30px] items-center gap-1 whitespace-nowrap rounded-md bg-brand px-2.5 text-sm2 font-bold text-white hover:bg-brand-dark"
        >
          <Icon name="person_add" size={16} />멤버 초대
        </button>
      </div>
      <div className="overflow-hidden rounded-lg border border-ink-200">
        <div className="grid grid-cols-[110px_minmax(0,1fr)_100px_90px] gap-2 border-b border-ink-200 bg-ink-50 px-3 py-2">
          {['이름', '이메일', '역할', '상태'].map((h) => (
            <span key={h} className="text-center text-mini font-extrabold tracking-[.06em] text-ink-400">
              {h}
            </span>
          ))}
        </div>
        {rows.map((m) => (
          <div
            key={m.id}
            className="grid grid-cols-[110px_minmax(0,1fr)_100px_90px] items-center gap-2 border-b border-ink-100 px-3 py-2.5 last:border-b-0"
          >
            <span className="truncate text-center text-label font-bold">{m.name}</span>
            <span className="truncate text-left text-sm2 text-ink-500">{m.email}</span>
            <span className="truncate text-center text-sm2 text-ink-600">{m.perm}</span>
            <span className="flex justify-center">
              <span
                className="whitespace-nowrap rounded-full px-2 py-0.5 text-mini font-extrabold"
                style={
                  m.state === '활성'
                    ? { background: '#ecfdf3', color: '#15803d' }
                    : { background: '#fffbeb', color: '#b45309' }
                }
              >
                {m.state}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 등록된 결제수단 (설계서 p32) */
const CARDS = [
  { brand: 'VISA', no: '4321', primary: true, fg: '#1a1f71' },
  { brand: 'MC', no: '8765', primary: false, fg: '#eb001b' },
]

/** 설정 > 요금제 및 결제수단 (설계서 p32) */
function BillingPanel() {
  return (
    <div className="flex flex-col gap-3 py-2">
      {/* 현재 플랜 */}
      <div className="rounded-lg border border-ink-200 px-3.5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-label font-extrabold">프리미엄</span>
          <span className="whitespace-nowrap rounded-full bg-brand-soft px-2 py-0.5 text-mini font-bold text-brand-dark">
            이용 중
          </span>
          <button className="ml-auto h-[30px] whitespace-nowrap rounded-md border border-ink-300 bg-white px-2.5 text-sm2 font-bold text-ink-700 hover:border-brand hover:text-brand-dark">
            요금제 변경
          </button>
        </div>
        <div className="mt-1 text-sm2 text-ink-500">다음 결제일: 2027-03-01 · 연 결제</div>
      </div>

      {/* 비즈니스 월렛 */}
      <div>
        <div className="mb-1.5 text-sm2 font-extrabold">비즈니스 월렛</div>
        <div className="flex items-center gap-2 rounded-lg border border-ink-200 bg-ink-50 px-3.5 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-label font-extrabold">1,000 Credit</div>
            <div className="mt-0.5 text-sm2 text-ink-500">AI 색인·검색에 사용 가능한 크레딧 잔액</div>
          </div>
          <button className="h-[30px] flex-none whitespace-nowrap rounded-md bg-brand px-3 text-sm2 font-bold text-white hover:bg-brand-dark">
            충전
          </button>
        </div>
      </div>

      {/* 결제수단 */}
      <div>
        <div className="mb-1.5 text-sm2 font-extrabold">결제수단</div>
        <div className="flex flex-col gap-1.5">
          {CARDS.map((c) => (
            <div key={c.no} className="flex items-center gap-2.5 rounded-lg border border-ink-200 px-3 py-2.5">
              <span
                className="flex h-[22px] w-[34px] flex-none items-center justify-center rounded border border-ink-200 bg-white text-[9.7px] font-extrabold"
                style={{ color: c.fg }}
              >
                {c.brand}
              </span>
              <span className="flex-1 whitespace-nowrap font-mono text-label tracking-[.12em] text-ink-600">
                •••• •••• •••• {c.no}
              </span>
              {c.primary && (
                <span className="flex-none whitespace-nowrap rounded-full bg-ok-soft px-2 py-0.5 text-mini font-bold text-ok-dark">
                  기본
                </span>
              )}
              <button className="h-[26px] flex-none whitespace-nowrap rounded border border-ink-300 bg-white px-2 text-tiny font-bold text-ink-600 hover:border-bad hover:text-bad">
                삭제
              </button>
            </div>
          ))}
          <button className="flex h-[38px] items-center justify-center gap-1 rounded-lg border border-dashed border-ink-300 bg-white text-sm2 font-bold text-ink-500 hover:border-brand hover:text-brand-dark">
            <Icon name="add" size={16} />결제수단 추가
          </button>
        </div>
      </div>
    </div>
  )
}

/** 관리 이력 (설계서 p33) — 일시 / 작업자 / 활동 */
const AUDIT = [
  { at: '2026-07-24 14:22', who: '홍길동', what: '결제수단(VISA ****4321) 추가' },
  { at: '2026-07-22 10:05', who: '홍길동', what: '외부 협업자 초대 — sky@megazone.com' },
  { at: '2026-07-19 16:40', who: '김대성', what: 'AI 색인 정책 변경 — 표·양식 구조 추출 켜짐' },
  { at: '2026-07-15 09:12', who: '홍길동', what: '프리미엄 요금제 구독 시작' },
  { at: '2026-07-02 11:30', who: '시스템', what: '조직&사업부 생성 — ESG 전략팀' },
]

function AuditPanel() {
  return (
    <div className="py-2">
      <div className="overflow-hidden rounded-lg border border-ink-200">
        <div className="grid grid-cols-[160px_100px_minmax(0,1fr)] gap-2 border-b border-ink-200 bg-ink-50 px-3 py-2">
          {['일시', '작업자', '활동'].map((h) => (
            <span key={h} className="text-center text-mini font-extrabold tracking-[.06em] text-ink-400">
              {h}
            </span>
          ))}
        </div>
        {AUDIT.map((a) => (
          <div
            key={a.at}
            className="grid grid-cols-[160px_100px_minmax(0,1fr)] items-center gap-2 border-b border-ink-100 px-3 py-2.5 last:border-b-0"
          >
            <span className="text-center text-sm2 text-ink-500">{a.at}</span>
            <span className="text-center text-sm2 font-bold text-ink-700">{a.who}</span>
            <span className="truncate text-left text-sm2 text-ink-600">{a.what}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 최근 로그인 기록 (설계서 p16) */
const LOGINS = [
  { at: '2026-07-24 14:22', dev: 'Chrome · macOS', loc: '서울, 대한민국', state: '현재 세션' },
  { at: '2026-07-23 09:11', dev: 'Safari · iPhone', loc: '서울, 대한민국', state: '정상' },
  { at: '2026-07-20 18:40', dev: 'Chrome · Windows', loc: '성남, 대한민국', state: '정상' },
  { at: '2026-07-18 02:13', dev: 'Unknown · Android', loc: '해외 · IP 차단됨', state: '차단됨' },
]

function LoginHistory() {
  return (
    <div className="border-b border-ink-100 py-3.5">
      <div className="text-label font-bold">최근 로그인 기록</div>
      <div className="mt-2 overflow-x-auto rounded-lg border border-ink-200">
        <div className="grid min-w-[520px] grid-cols-[150px_minmax(0,1fr)_150px_90px] gap-2 border-b border-ink-200 bg-ink-50 px-3 py-2">
          {['일시', '기기 · 브라우저', '위치', '상태'].map((h) => (
            <span key={h} className="text-center text-mini font-extrabold tracking-[.06em] text-ink-400">
              {h}
            </span>
          ))}
        </div>
        {LOGINS.map((l) => (
          <div
            key={l.at}
            className="grid min-w-[520px] grid-cols-[150px_minmax(0,1fr)_150px_90px] items-center gap-2 border-b border-ink-100 px-3 py-2 last:border-b-0"
          >
            <span className="text-center text-sm2 text-ink-500">{l.at}</span>
            <span className="truncate text-center text-sm2 text-ink-600">{l.dev}</span>
            <span className="truncate text-center text-sm2 text-ink-500">{l.loc}</span>
            <span className="flex justify-center">
              <span
                className="whitespace-nowrap rounded-full px-2 py-0.5 text-mini font-extrabold"
                style={
                  l.state === '차단됨'
                    ? { background: '#fef2f2', color: '#b91c1c' }
                    : l.state === '현재 세션'
                      ? { background: '#eff6ff', color: '#1345bd' }
                      : { background: '#f1f5f9', color: '#475569' }
                }
              >
                {l.state}
              </span>
            </span>
          </div>
        ))}
      </div>
      <button className="mt-2 h-[34px] rounded-md border border-ink-300 bg-white px-3 text-sm2 font-bold text-ink-700 hover:border-brand hover:text-brand-dark">
        다른 모든 기기에서 로그아웃
      </button>
    </div>
  )
}

export function SettingsModal() {
  const { isOpen, close, payload } = useLayer('settings')
  const [tab, setTab] = useQaState<string>('settingTab', 'account')
  const [flags, setFlags] = useState<Record<string, boolean>>({})
  const [picks, setPicks] = useState<Record<string, string>>({})
  // 프로필 드롭다운에서 특정 섹션으로 바로 열 수 있다 (설계서 p14).
  // 사용자가 좌측 메뉴를 직접 누르면 그때부터는 그 선택이 우선한다.
  const [picked, setPicked] = useState(false)
  const openLayer = useLayerStore((s) => s.open)
  const want = typeof payload?.tab === 'string' ? payload.tab : null
  const active = !picked && want && NAV.some((n) => n.id === want) ? want : tab
  const cur = NAV.find((n) => n.id === active) ?? NAV[0]

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title={cur.title}
      desc={cur.desc}
      width={780}
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>닫기</BtnGhost><BtnPrimary onClick={close}>저장</BtnPrimary></>}
    >
      <div className="-mx-[18px] -my-4 flex min-h-[420px]">
        <div className="w-[186px] flex-none border-r border-ink-200 py-2">
          {NAV.map((n) => {
            const on = cur.id === n.id
            return (
              <button
                key={n.id}
                onClick={() => {
                  setPicked(true)
                  setTab(n.id)
                }}
                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left hover:bg-ink-100"
                style={{ background: on ? '#eff6ff' : 'transparent', color: on ? '#1345bd' : '#334155' }}
              >
                <Icon name={n.icon} size={17} />
                <span className="text-label" style={{ fontWeight: on ? 700 : 500 }}>
                  {n.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="min-w-0 flex-1 px-[18px] py-2">
          {cur.id === 'security' && <LoginHistory />}
          {cur.id === 'users' && <UserPanel />}
          {cur.id === 'billing' && <BillingPanel />}
          {cur.id === 'audit' && <AuditPanel />}
          {ROWS[cur.id].map((r) => (
            <div key={r.label} className="flex items-center gap-3 border-b border-ink-100 py-3.5 last:border-b-0">
              <div className="min-w-0 flex-1">
                <div className="text-label font-bold" style={r.kind === 'action' && r.danger ? { color: '#b91c1c' } : undefined}>
                  {r.label}
                </div>
                <div className="mt-1 text-sm2 leading-[1.65] text-ink-500">{r.desc}</div>
              </div>

              {r.kind === 'toggle' && (
                <button
                  onClick={() => setFlags((f) => ({ ...f, [r.label]: !(f[r.label] ?? r.on) }))}
                  className="relative h-[22px] w-[38px] flex-none rounded-full transition-colors"
                  style={{ background: (flags[r.label] ?? r.on) ? '#1750d8' : '#cbd5e1' }}
                >
                  <span
                    className="absolute top-0.5 size-[18px] rounded-full bg-white transition-all"
                    style={{ left: (flags[r.label] ?? r.on) ? 18 : 2 }}
                  />
                </button>
              )}

              {r.kind === 'select' && (
                <Select
                  ddKey={`set:${r.label}`}
                  value={picks[r.label] ?? r.options[0]}
                  options={r.options}
                  onChange={(v) => setPicks({ ...picks, [r.label]: v })}
                  className="w-[190px] flex-none"
                />
              )}

              {r.kind === 'action' && (
                <button
                  onClick={() => {
                    // 삭제는 이름을 직접 입력해 확인한다 (설계서 p34)
                    if (r.danger) openLayer('ws-delete')
                  }}
                  className="flex-none rounded-md border bg-white px-3 py-1.5 text-sm2 font-bold"
                  style={{
                    borderColor: r.danger ? '#fecaca' : '#cbd5e1',
                    color: r.danger ? '#b91c1c' : '#1750d8',
                  }}
                >
                  {r.action}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
