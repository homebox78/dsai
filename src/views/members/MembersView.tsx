import { Icon } from '@/components/common/icon'
import { useQaState } from '@/lib/qa-state'
import { members } from '@/mocks/data'
import { useAppStore, type SysTab } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/** 멤버 / 시스템 (p19~22) — 관리 항목 196px | 목록 테이블 (시안 1:1) */

const SYS_TABS: { id: SysTab; label: string; count: number; icon: string }[] = [
  { id: 'member', label: '멤버 관리', count: 6, icon: 'group' },
  { id: 'ws', label: '조직&사업부', count: 3, icon: 'account_tree' },
  { id: 'channel', label: '채널 관리', count: 8, icon: 'forum' },
  { id: 'perm', label: '권한 그룹', count: 4, icon: 'admin_panel_settings' },
]

const SYS_TITLE: Record<SysTab, string> = {
  member: '멤버 관리',
  ws: '워크스페이스 관리',
  channel: '채널 관리',
  perm: '권한 그룹',
}

const PERM_SUMMARY = [
  { label: '마스터', count: 1, color: '#1750d8' },
  { label: '편집 가능', count: 2, color: '#16a34a' },
  { label: '댓글 가능', count: 1, color: '#f59e0b' },
  { label: '보기 전용', count: 2, color: '#cbd5e1' },
]

/** 시안 ALLM — 목업 멤버 4명 + 마스터/외부 협업자 2명 */
const ALL_MEMBERS = [
  ...members,
  {
    id: 'm5', name: '홍길동', role: '성과 리드', dept: 'ESG팀', email: 'hong@evolvailab.com',
    perm: '마스터', on: true, state: '활성', last: '방금 전',
  },
  {
    id: 'm6', name: '정하늘', role: '메가존 파트너', dept: '외부 협업자', email: 'sky@megazone.com',
    perm: '보기 전용', on: false, state: '초대 대기', last: '-',
  },
]

const MEMBER_FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'active', label: '활성' },
  { id: 'pending', label: '초대 대기' },
  { id: 'guest', label: '외부 협업자' },
]

const ROLE_OPTS = ['마스터', '편집 가능', '댓글 가능', '보기 전용']

type SysRow = { name: string; sub: string; icon: string; c2: string; c3: string; tag: string; action: string }

const SYS_DEFS: Record<Exclude<SysTab, 'member'>, { headers: string[]; rows: SysRow[] }> = {
  ws: {
    headers: ['조직&사업부', '프로젝트', '멤버', '공개 범위', ''],
    rows: [
      { name: 'ESG 전략팀', sub: '상위: ESG 본부', icon: 'account_tree', c2: '3개', c3: '24명', tag: '공개', action: '설정' },
      { name: '경영지원팀', sub: '상위: 경영지원 본부', icon: 'account_tree', c2: '2개', c3: '11명', tag: '비공개', action: '설정' },
      { name: '구매 · 공급망팀', sub: '상위: 구매 본부', icon: 'account_tree', c2: '2개', c3: '9명', tag: '공개', action: '설정' },
    ],
  },
  channel: {
    headers: ['채널', '유형', '참여자', '공개 범위', ''],
    rows: [
      { name: 'ESG 전략 TF', sub: '최근 활동 10:42', icon: 'forum', c2: '그룹', c3: '5명', tag: '공개', action: '관리' },
      { name: '법무 검토 채널', sub: '최근 활동 07.22', icon: 'forum', c2: '그룹', c3: '4명', tag: '비공개', action: '관리' },
      { name: '전체 공지', sub: '프로젝트 기본 채널', icon: 'campaign', c2: '공지', c3: '24명', tag: '공개', action: '관리' },
      { name: '김대성', sub: '1:1 대화', icon: 'chat', c2: '1:1', c3: '2명', tag: '비공개', action: '관리' },
      { name: '외부 감사 협업', sub: '외부 협업자 포함', icon: 'group_add', c2: '게스트', c3: '3명', tag: '제한', action: '관리' },
    ],
  },
  perm: {
    headers: ['권한 그룹', '인원', '문서 권한', '관리 권한', ''],
    rows: [
      { name: '마스터', sub: '조직 전체 관리', icon: 'workspace_premium', c2: '1명', c3: '전체', tag: '관리자', action: '편집' },
      { name: '편집 가능', sub: '문서 업로드·수정', icon: 'edit_document', c2: '2명', c3: '읽기·쓰기', tag: '일반', action: '편집' },
      { name: '댓글 가능', sub: '코멘트만 작성', icon: 'comment', c2: '1명', c3: '읽기·댓글', tag: '일반', action: '편집' },
      { name: '보기 전용', sub: '지정 폴더 열람', icon: 'visibility', c2: '2명', c3: '읽기', tag: '제한', action: '편집' },
    ],
  },
}

const tagTone = (t: string) =>
  t === '공개'
    ? { bg: '#eff6ff', fg: '#1345bd' }
    : t === '제한'
      ? { bg: '#fff7ed', fg: '#c2410c' }
      : t === '관리자'
        ? { bg: '#ecfdf3', fg: '#15803d' }
        : { bg: '#f1f5f9', fg: '#64748b' }

const matchFilter = (m: (typeof ALL_MEMBERS)[number], id: string) =>
  id === 'all' ? true : id === 'active' ? m.state === '활성' : id === 'pending' ? m.state === '초대 대기' : m.dept === '외부 협업자'

const GRID = '34px minmax(170px,1fr) 150px 108px 104px 92px 76px'
const SYS_GRID = 'minmax(180px,1fr) 108px 96px 96px 84px'

export function MembersView() {
  const { sysTab, setSysTab } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [query, setQuery] = useQaState('memberQuery', '')
  const [filter, setFilter] = useQaState('memberFilter', 'all')
  const [sel, setSel] = useQaState<Record<string, boolean>>('memberSel', {})
  const [ddOpen, setDdOpen] = useQaState<string | null>('ddOpen', null)
  const [roleOv, setRoleOv] = useQaState<Record<string, string>>('roleOverride', {})

  const q = query.trim()
  const list = ALL_MEMBERS.filter((m) => matchFilter(m, filter)).filter(
    (m) => !q || m.name.includes(q) || m.email.includes(q) || m.dept.includes(q),
  )
  const selCount = Object.values(sel).filter(Boolean).length
  const allOn = list.length > 0 && list.every((m) => sel[m.id])
  const pending = ALL_MEMBERS.filter((m) => m.state === '초대 대기').length

  const toggleAll = () => {
    const next = { ...sel }
    list.forEach((m) => (next[m.id] = !allOn))
    setSel(next)
  }

  const head = 'text-[11.2px] font-extrabold text-ink-400 whitespace-nowrap'

  return (
    <div className="flex min-h-0 min-w-[900px] flex-1">
      {/* 관리 항목 레일 */}
      <div className="flex w-[196px] flex-none flex-col border-r border-ink-200 bg-white">
        <div className="flex-none border-b border-ink-200 px-3 py-2">
          <div className="whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">관리 항목</div>
        </div>
        <div className="flex-1 overflow-auto py-[5px]">
          {SYS_TABS.map((t) => {
            const on = sysTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setSysTab(t.id)}
                className="flex w-full items-center gap-2 border-l-2 px-3 py-2 text-left hover:bg-ink-100"
                style={{
                  background: on ? '#eff6ff' : 'transparent',
                  borderLeftColor: on ? '#2563eb' : 'transparent',
                  color: on ? '#1d4ed8' : '#334155',
                }}
              >
                <Icon name={t.icon} size={17} className="opacity-90" />
                <span className="min-w-0 flex-1 truncate text-xs2" style={{ fontWeight: on ? 700 : 500 }}>
                  {t.label}
                </span>
                <span className="flex-none whitespace-nowrap text-[11.2px] text-ink-400">{t.count}</span>
              </button>
            )
          })}
        </div>
        <div className="flex-none border-t border-ink-200 px-3.5 py-3">
          <div className="mb-2 whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">권한 요약</div>
          <div className="flex flex-col gap-2">
            {PERM_SUMMARY.map((p) => (
              <div key={p.label} className="flex items-center gap-2">
                <span className="size-[7px] flex-none rounded-sm" style={{ background: p.color }} />
                <span className="flex-1 whitespace-nowrap text-cap text-ink-500">{p.label}</span>
                <span className="whitespace-nowrap text-cap font-extrabold">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-auto bg-white">
        <div className="flex items-center gap-2 px-[18px] pb-[13px] pt-4">
          <div className="min-w-0">
            <div className="whitespace-nowrap text-lg2 font-extrabold tracking-[-.01em]">{SYS_TITLE[sysTab]}</div>
            <div className="mt-1 truncate text-sm2 text-ink-500">
              조직 › 조직&사업부 › 프로젝트 계층에 따라 권한이 상속됩니다
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex w-[190px] items-center gap-1.5 rounded-md border border-ink-300 bg-white px-2.5 py-1.5">
            <Icon name="search" size={16} className="text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름 · 이메일 검색"
              className="min-w-0 flex-1 border-none bg-transparent p-0 text-sm2 outline-none"
            />
          </div>
          <button
            onClick={() => openLayer('member-invite')}
            className="flex items-center gap-1 whitespace-nowrap rounded-md bg-brand px-3 py-2 text-xs2 font-bold text-white hover:bg-brand-dark"
          >
            <Icon name="person_add" size={17} />
            멤버 추가
          </button>
        </div>

        {sysTab === 'member' ? (
          <>
            {/* 상태 필터 + 다중 선택 일괄 액션 */}
            <div className="flex flex-wrap items-center gap-1.5 px-[18px] pb-3">
              {MEMBER_FILTERS.map((f) => {
                const on = filter === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className="whitespace-nowrap rounded-full border px-3 py-[5px] text-[11.6px] font-bold"
                    style={{
                      background: on ? '#1750d8' : '#fff',
                      borderColor: on ? '#1750d8' : '#cbd5e1',
                      color: on ? '#fff' : '#334155',
                    }}
                  >
                    {f.label}
                    <span className="ml-[5px] opacity-70">{ALL_MEMBERS.filter((m) => matchFilter(m, f.id)).length}</span>
                  </button>
                )
              })}
              <div className="flex-1" />
              {selCount > 0 && (
                <>
                  <span className="whitespace-nowrap text-[11.6px] font-bold text-brand-dark">{selCount}명 선택</span>
                  <button
                    onClick={() => openLayer('member-invite')}
                    className="whitespace-nowrap rounded-md border border-ink-300 bg-white px-2.5 py-[5px] text-[11.6px] font-bold text-ink-700 hover:bg-ink-100"
                  >
                    권한 변경
                  </button>
                  <button
                    onClick={() => setSel({})}
                    className="whitespace-nowrap rounded-md border border-[#fecaca] bg-white px-2.5 py-[5px] text-[11.6px] font-bold text-[#b91c1c] hover:bg-[#fef2f2]"
                  >
                    내보내기
                  </button>
                </>
              )}
            </div>

            <div className="overflow-x-auto border-y border-ink-200 bg-white">
              <div
                className="grid min-w-[800px] gap-2 border-b border-ink-200 px-3.5 py-[9px]"
                style={{ gridTemplateColumns: GRID }}
              >
                <button onClick={toggleAll} className="justify-self-start" style={{ color: allOn ? '#1750d8' : '#cbd5e1' }}>
                  <Icon name={allOn ? 'check_box' : 'check_box_outline_blank'} size={18} />
                </button>
                <span className={head}>멤버</span>
                <span className={head}>이메일</span>
                <span className={`${head} text-center`}>권한</span>
                <span className={head}>담당 프로젝트</span>
                <span className={`${head} text-center`}>상태</span>
                <span className={`${head} text-center`}>최근 접속</span>
              </div>

              {list.map((m, i) => {
                const checked = !!sel[m.id]
                const role = roleOv[m.id] ?? m.perm
                const open = ddOpen === `role:${m.id}`
                const upward = i >= list.length - 2
                return (
                  <div
                    key={m.id}
                    className="grid min-w-[800px] items-center gap-2 border-b border-ink-100 px-[18px] py-[11px]"
                    style={{ gridTemplateColumns: GRID, background: checked ? '#eff6ff' : '#fff' }}
                  >
                    <button
                      onClick={() => setSel({ ...sel, [m.id]: !checked })}
                      className="justify-self-start"
                      style={{ color: checked ? '#1750d8' : '#cbd5e1' }}
                    >
                      <Icon name={checked ? 'check_box' : 'check_box_outline_blank'} size={18} />
                    </button>

                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex size-7 flex-none items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff] text-[11.6px] font-extrabold text-brand-dark">
                        {m.name[0]}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1">
                          <span className="whitespace-nowrap text-label font-bold">{m.name}</span>
                          {m.perm === '마스터' && <Icon name="workspace_premium" size={15} className="text-brand" />}
                          {m.dept === '외부 협업자' && (
                            <span className="whitespace-nowrap rounded-full bg-[#fff7ed] px-2 py-0.5 text-[9.7px] font-extrabold text-[#c2410c]">
                              외부
                            </span>
                          )}
                        </span>
                        <span className="block truncate text-[11.2px] text-ink-400">{m.dept}</span>
                      </span>
                    </div>

                    <span className="truncate text-sm2 text-ink-500">{m.email}</span>

                    <span className="relative flex justify-center">
                      <button
                        onClick={() => setDdOpen(open ? null : `role:${m.id}`)}
                        className="flex items-center gap-[3px] whitespace-nowrap rounded-[7px] border bg-white px-[7px] py-[3px] text-[10.7px] font-bold text-ink-600 hover:border-brand hover:text-brand-dark"
                        style={{ borderColor: open ? '#1750d8' : '#e2e8f0' }}
                      >
                        {role}
                        <Icon name={open ? 'expand_less' : 'expand_more'} size={14} className="text-ink-400" />
                      </button>
                      {open && (
                        <span
                          className="absolute left-0 z-30 flex min-w-full flex-col rounded-lg border border-ink-200 bg-white p-1 shadow-[0_12px_30px_rgba(15,23,42,.16)]"
                          style={upward ? { bottom: 'calc(100% + 4px)' } : { top: 'calc(100% + 4px)' }}
                        >
                          {ROLE_OPTS.map((label) => {
                            const on = label === role
                            return (
                              <button
                                key={label}
                                onClick={() => {
                                  setRoleOv({ ...roleOv, [m.id]: label })
                                  setDdOpen(null)
                                }}
                                className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-[9px] py-1.5 text-left text-[11.6px] hover:bg-ink-100"
                                style={{ background: on ? '#eff6ff' : 'transparent', fontWeight: on ? 700 : 500 }}
                              >
                                <Icon
                                  name={on ? 'check' : 'radio_button_unchecked'}
                                  size={15}
                                  style={{ color: on ? '#1750d8' : '#cbd5e1' }}
                                />
                                {label}
                              </button>
                            )
                          })}
                        </span>
                      )}
                    </span>

                    <span className="truncate text-[11.6px] text-ink-500">
                      {m.dept === '외부 협업자' ? '에코바디스 2026' : m.perm === '마스터' ? '전체 3개' : '에코바디스 2026'}
                    </span>

                    <span className="flex justify-center">
                      <span
                        className="whitespace-nowrap rounded-full px-2 py-0.5 text-[10.7px] font-extrabold"
                        style={
                          m.state === '활성'
                            ? { background: '#ecfdf3', color: '#15803d' }
                            : { background: '#fffbeb', color: '#b45309' }
                        }
                      >
                        {m.state}
                      </span>
                    </span>

                    <span className="whitespace-nowrap text-center text-sm2 text-ink-500">{m.last}</span>
                  </div>
                )
              })}

              <div className="flex items-center gap-2 bg-ink-50 px-3.5 py-3">
                <span className="whitespace-nowrap text-[11.6px] text-ink-500">
                  총 {ALL_MEMBERS.length}명 · 초대 대기 {pending}명
                </span>
                <div className="flex-1" />
                <button
                  onClick={() => openLayer('member-invite')}
                  className="whitespace-nowrap text-[11.6px] font-bold text-brand"
                >
                  초대 링크 만들기
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="overflow-x-auto border-y border-ink-200 bg-white">
            <div
              className="grid min-w-[660px] gap-2 border-b border-ink-200 px-3.5 py-[9px]"
              style={{ gridTemplateColumns: SYS_GRID }}
            >
              {SYS_DEFS[sysTab].headers.map((h, i) => (
                <span key={i} className={head} style={{ textAlign: i === 0 ? 'left' : 'center' }}>
                  {h}
                </span>
              ))}
            </div>
            {SYS_DEFS[sysTab].rows.map((r) => {
              const tone = tagTone(r.tag)
              return (
                <div
                  key={r.name}
                  className="grid min-w-[660px] items-center gap-2 border-b border-ink-100 px-[18px] py-[11px]"
                  style={{ gridTemplateColumns: SYS_GRID }}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="flex size-[26px] flex-none items-center justify-center rounded-[7px] border border-[#bfdbfe] bg-[#eff6ff]">
                      <Icon name={r.icon} size={16} className="text-brand-dark" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-label font-bold">{r.name}</span>
                      <span className="block truncate text-[11.2px] text-ink-400">{r.sub}</span>
                    </span>
                  </span>
                  <span className="whitespace-nowrap text-center text-sm2 text-ink-500">{r.c2}</span>
                  <span className="whitespace-nowrap text-center text-sm2 text-ink-500">{r.c3}</span>
                  <span className="flex justify-center">
                    <span
                      className="whitespace-nowrap rounded-full px-2 py-0.5 text-[10.7px] font-extrabold"
                      style={{ background: tone.bg, color: tone.fg }}
                    >
                      {r.tag}
                    </span>
                  </span>
                  <span className="flex justify-center">
                    <button
                      onClick={() => openLayer(sysTab === 'channel' ? 'chat-invite' : sysTab === 'perm' ? 'member-invite' : 'ws-create')}
                      className="whitespace-nowrap rounded-[5px] border border-ink-300 bg-white px-2.5 py-[5px] text-[11.2px] font-bold text-ink-700 hover:bg-ink-100"
                    >
                      {r.action}
                    </button>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
