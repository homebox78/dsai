import { FileExt } from '@/components/common/FileExt'
import { useState } from 'react'
import { useQaState } from '@/lib/qa-state'
import { Icon } from '@/components/common/icon'
import { taskHistory, taskStatusTone, type TaskStatus } from '@/mocks/data'
import { useDataStore } from '@/stores/data-store'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'
import { useFlipUp } from '@/lib/flip-up'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useLayoutMetrics } from '@/lib/responsive'

/** 업무 관리 (p55~56) — 상태 196px | 목록 322px | 상세 | 실시간 스트림 284px */

/** 좌측 상태 필터 (시안 tfDefs) */
/* ── 화면 전용 목업 · 상수 ────────────────────────── */

const FILTERS: { id: string; label: string; dot: string }[] = [
  { id: 'all', label: '전체', dot: '#94a3b8' },
  { id: 'mine', label: '내가 받은 요청', dot: '#2563eb' },
  { id: 'sent', label: '내가 보낸 요청', dot: '#64748b' },
  { id: '요청됨', label: '요청됨', dot: '#94a3b8' },
  { id: '진행중', label: '진행중', dot: '#2563eb' },
  { id: '검토대기', label: '검토대기', dot: '#f59e0b' },
  { id: '완료', label: '완료', dot: '#16a34a' },
  { id: '반려', label: '반려', dot: '#ef4444' },
]

/** 워크플로 (시안 flowSteps) */
const FLOW: { key: TaskStatus; icon: string }[] = [
  { key: '요청됨', icon: 'send' },
  { key: '진행중', icon: 'autorenew' },
  { key: '검토대기', icon: 'rate_review' },
  { key: '완료', icon: 'check_circle' },
]

const STREAM = [
  { who: '이수진', time: '3분 전', text: '요청 자료 아직 안 올라온 것 같아요. 확인 부탁드립니다.', dot: '#f59e0b' },
  { who: '나', time: '1시간 전', text: '구매팀에 원본 요청해 두었습니다. 오늘 중 회신 예정입니다.', dot: '#2563eb' },
  { who: '시스템', time: '2시간 전', text: '기한 D-3 알림이 담당자에게 발송되었습니다.', dot: '#cbd5e1' },
  { who: '김대성', time: '어제', text: 'TASK-139 상태가 진행중으로 변경되었습니다.', dot: '#94a3b8' },
]

const PRESETS = ['확인했습니다', '자료 첨부했습니다', '기한 연장 요청', '담당자 변경 필요']

const ACTIONS: { label: string; color: string; bd: string; to: TaskStatus }[] = [
  { label: '진행 시작', color: '#1d4ed8', bd: '#cbd5e1', to: '진행중' },
  { label: '검토 요청', color: '#b45309', bd: '#cbd5e1', to: '검토대기' },
  { label: '완료 처리', color: '#15803d', bd: '#cbd5e1', to: '완료' },
  { label: '반려', color: '#b91c1c', bd: '#fecaca', to: '반려' },
]

const STATUS_ORDER: TaskStatus[] = ['요청됨', '진행중', '검토대기', '완료', '반려']

const SORTS: [string, string][] = [
  ['due', '기한순'],
  ['recent', '최신순'],
  ['status', '상태순'],
]

/* ── 기한 판정 헬퍼 ───────────────────────────────── */

/** 기한이 지났고 아직 끝나지 않은 업무 */
const isOverdue = (t: { due: string; status: TaskStatus }) =>
  t.due < '07.25' && t.status !== '완료' && t.status !== '반려'
const isSoon = (t: { due: string; status: TaskStatus }) =>
  t.due >= '07.25' && t.due <= '07.28' && t.status !== '완료'

/* ── 화면 ─────────────────────────────────────────── */

export function TaskView() {
  const { taskId, setTaskId, setScreen, taskFilter: filter, setTaskFilter: setFilter } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [query, setQuery] = useState('')
  // useQaState = useState + 검수 프리셋 연동 (검수 인덱스가 재현해야 하는 상태만 사용)
  const [due, setDue] = useQaState('taskDue', 'all')
  const [sort, setSort] = useState('due')
  const [ddOpen, setDdOpen] = useQaState<string | null>('ddOpen', null)
  const sortOpen = ddOpen === 'taskSort'
  const { ref: sortRef, up: sortUp } = useFlipUp<HTMLButtonElement>(sortOpen, SORTS.length * 30 + 12)
  const setSortOpen = (v: boolean) => setDdOpen(v ? 'taskSort' : null)
  const tasks = useDataStore((s) => s.tasks)
  const setTaskStatus = useDataStore((s) => s.setTaskStatus)
  const [comment, setComment] = useState('')
  const [streamOpen, setStreamOpen] = useQaState('streamOpen', true)
  const { taskRowMin, contentMin, veryNarrow } = useLayoutMetrics()

  const cur = tasks.find((t) => t.id === taskId) ?? tasks[0]
  const tone = taskStatusTone[cur.status]

  const byFilter = (id: string) =>
    id === 'all'
      ? tasks
      : id === 'mine'
        ? tasks.filter((t) => t.to === '나')
        : id === 'sent'
          ? tasks.filter((t) => t.from === '나')
          : tasks.filter((t) => t.status === id)

  const q = query.trim()
  const list = byFilter(filter)
    .filter((t) => !q || t.title.includes(q) || t.from.includes(q) || t.to.includes(q))
    .filter((t) => (due === 'over' ? isOverdue(t) : due === 'soon' ? isSoon(t) : true))
    .slice()
    .sort((a, b) =>
      sort === 'due'
        ? a.due.localeCompare(b.due)
        : sort === 'recent'
          ? b.no.localeCompare(a.no)
          : STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
    )

  const history = taskHistory[cur.id] ?? [
    { who: '시스템', time: '-', text: '아직 처리 이력이 없습니다.', tag: '안내' },
  ]

  // 시안: 반려는 1단계로 표시
  const doneIdx = cur.status === '반려' ? 1 : Math.max(0, FLOW.findIndex((f) => f.key === cur.status))

  const meta = [
    { label: '요청자', value: cur.from },
    { label: '담당자', value: cur.to },
    { label: '처리 기한', value: cur.due },
    { label: '연결된 대화방', value: cur.room },
  ]

  return (
    <ResizablePanelGroup orientation="horizontal" className="flex min-h-0 flex-1" style={{ minWidth: taskRowMin }}>
      {/* 업무 상태 */}
      <ResizablePanel defaultSize={196} minSize={160} maxSize={320} className="flex flex-col bg-white">
        <div className="flex-none border-b border-ink-200 px-3 py-2">
          <div className="mb-2 whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">업무 상태</div>
          <div className="flex items-center gap-1.5 rounded-md border border-ink-200 bg-ink-50 px-2.5 py-1.5">
            <Icon name="search" size={16} className="text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="업무·담당자 검색"
              className="min-w-0 flex-1 border-none bg-transparent p-0 text-sm2 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto py-[5px]">
          {FILTERS.map((f) => {
            const on = filter === f.id
            const count = byFilter(f.id).length
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="flex w-full items-center gap-2 border-l-2 px-3 py-2 text-left hover:bg-ink-100"
                style={{
                  background: on ? '#eff6ff' : 'transparent',
                  borderLeftColor: on ? '#2563eb' : 'transparent',
                  color: on ? '#1d4ed8' : '#334155',
                }}
              >
                <span className="size-1.5 flex-none rounded-full" style={{ background: f.dot }} />
                <span className="flex-1 text-label" style={{ fontWeight: on ? 700 : 500 }}>
                  {f.label}
                </span>
                <span className="text-xs2 text-ink-400">{count}</span>
              </button>
            )
          })}
        </div>
        <div className="flex-none border-t border-ink-200 px-3.5 py-3">
          <button
            onClick={() => openLayer('task-request')}
            className="w-full rounded-md bg-brand py-2 text-sm2 font-bold text-white hover:bg-brand-dark"
          >
            + 업무 요청
          </button>
        </div>
      </ResizablePanel>
      <ResizableHandle />

      {/* 목록 — 아주 좁으면 자동 접힘 */}
      {!veryNarrow && (
      <>
      <ResizablePanel defaultSize={322} minSize={252} maxSize={480} className="flex flex-col bg-white">
        <div className="flex-none border-b border-ink-200 px-3 py-2">
          <div className="mb-2 flex items-center gap-2">
            <span className="whitespace-nowrap text-label font-extrabold">
              {FILTERS.find((f) => f.id === filter)?.label}
            </span>
            <span className="whitespace-nowrap text-xs2 text-ink-400">{list.length}건</span>
            <div className="flex-1" />
            <div className="relative min-w-[132px] flex-none">
              <button
                ref={sortRef}
                onClick={() => setSortOpen(!sortOpen)}
                className="flex w-full items-center gap-1 whitespace-nowrap rounded-md border bg-white px-2 py-1 text-xs2 font-bold text-ink-700 hover:bg-ink-50"
                style={{ borderColor: sortOpen ? '#1750d8' : '#cbd5e1' }}
              >
                <Icon name="swap_vert" size={15} className="flex-none text-ink-400" />
                <span className="min-w-0 flex-1 truncate text-left">{SORTS.find(([id]) => id === sort)?.[1]}</span>
                <Icon name={sortOpen ? 'expand_less' : 'expand_more'} size={14.1} className="ml-auto flex-none text-ink-400" />
              </button>
              {sortOpen && (
                <div
                  className="anim-pop absolute left-0 z-30 w-full rounded-lg border border-ink-200 bg-white p-1 shadow-[0_12px_30px_rgba(15,23,42,.16)]"
                  style={sortUp ? { bottom: 'calc(100% + 4px)' } : { top: 'calc(100% + 4px)' }}
                >
                  {SORTS.map(([id, label]) => {
                    const on = sort === id
                    return (
                      <button
                        key={id}
                        onClick={() => { setSort(id); setSortOpen(false) }}
                        className="flex w-full items-center gap-1.5 whitespace-nowrap rounded-md px-[9px] py-1.5 text-left text-cap text-ink-900 hover:bg-ink-100"
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
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            {([['all', '전체'], ['over', '기한초과'], ['soon', '임박']] as const).map(([id, label]) => {
              const on = due === id
              const arr = byFilter(filter)
              const cnt = id === 'over' ? arr.filter(isOverdue).length : id === 'soon' ? arr.filter(isSoon).length : 0
              return (
                <button
                  key={id}
                  onClick={() => setDue(id)}
                  className="flex-1 whitespace-nowrap rounded-[5px] border py-1 text-tiny font-bold"
                  style={{
                    background: on ? '#1750d8' : '#fff',
                    borderColor: on ? '#1750d8' : '#cbd5e1',
                    color: on ? '#fff' : '#334155',
                  }}
                >
                  {label}
                  {!!cnt && <span className="ml-[3px] opacity-75">{cnt}</span>}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {list.map((t) => {
            const tt = taskStatusTone[t.status]
            const on = t.id === taskId
            return (
              <button
                key={t.id}
                onClick={() => setTaskId(t.id)}
                className="block w-full border-b border-l-2 border-ink-100 px-3.5 py-3 text-left hover:bg-ink-50"
                style={{ background: on ? '#eff6ff' : '#fff', borderLeftColor: tt.bar }}
              >
                <span className="mb-[5px] flex items-center gap-1.5">
                  <span
                    className="rounded-full px-2 py-0.5 text-mini font-extrabold"
                    style={{ background: tt.bg, color: tt.fg }}
                  >
                    {t.status}
                  </span>
                  <span className="font-mono text-mini text-ink-400">TASK-{t.no}</span>
                  <span
                    className="ml-auto text-tiny font-semibold"
                    style={{ color: t.due < '07.25' ? '#b91c1c' : '#64748b' }}
                  >
                    ~{t.due}
                  </span>
                </span>
                <span className="block text-body font-bold leading-[1.6]">{t.title}</span>
                <span className="mt-1 block text-xs2 text-ink-500">
                  {t.from} → {t.to} · {t.room}
                </span>
              </button>
            )
          })}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      </>
      )}

      {/* 상세 */}
      <ResizablePanel minSize={Number(String(contentMin).replace('px', '')) || 280} className="flex flex-col bg-ink-50">
        <div className="flex-none border-b border-ink-200 bg-white px-3.5 py-3">
          <div className="mb-[7px] flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-mini font-extrabold"
              style={{ background: tone.bg, color: tone.fg }}
            >
              {cur.status}
            </span>
            <span className="font-mono text-xs2 text-ink-400">TASK-{cur.no}</span>
            <div className="flex-1" />
            <button
              onClick={() => openLayer('task-preview', { id: cur.id })}
              className="rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-sm2 font-semibold text-ink-700 hover:bg-ink-100"
            >
              빠른 처리 모달
            </button>
            <button
              onClick={() => setScreen('chat')}
              className="rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-sm2 font-semibold text-ink-700 hover:bg-ink-100"
            >
              채팅으로 이동
            </button>
          </div>
          <div className="text-lg2 font-extrabold tracking-[-.01em]">{cur.title}</div>

          <div className="mt-3 flex items-center">
            {FLOW.map((f, i) => {
              const done = i <= doneIdx
              return (
                <div key={f.key} className="flex min-w-0 flex-1 items-center">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="flex size-5 flex-none items-center justify-center rounded-full border"
                      style={{
                        background: done ? '#1750d8' : '#fff',
                        borderColor: done ? '#1750d8' : '#cbd5e1',
                      }}
                    >
                      <Icon name={f.icon} size={14.1} style={{ color: done ? '#fff' : '#94a3b8' }} />
                    </span>
                    <span
                      className="whitespace-nowrap text-cap font-bold"
                      style={{ color: i === doneIdx ? '#0f172a' : done ? '#475569' : '#94a3b8' }}
                    >
                      {f.key}
                    </span>
                  </div>
                  {i < FLOW.length - 1 && (
                    <span className="mx-2 h-px flex-1" style={{ background: i < doneIdx ? '#1750d8' : '#e2e8f0' }} />
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-3.5 grid grid-cols-4 gap-2">
            {meta.map((m) => (
              <div key={m.label} className="border-l-2 border-ink-200 pl-[9px]">
                <div className="text-tiny font-bold text-ink-400">{m.label}</div>
                <div className="mt-1 text-label font-bold">{m.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-[13px] flex gap-1.5">
            {ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={() => setTaskStatus(cur.id, a.to)}
                disabled={cur.status === a.to}
                className="rounded-md border bg-white px-[13px] py-[7px] text-sm2 font-bold hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ borderColor: a.bd, color: a.color }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="mb-[11px] whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">
            처리 히스토리 · 코멘트 · 파일
          </div>
          {history.map((h, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex w-2.5 flex-none flex-col items-center">
                <span
                  className="mt-1 size-[9px] flex-none rounded-full"
                  style={{ background: h.who === '나' ? '#2563eb' : h.who === '시스템' ? '#cbd5e1' : '#94a3b8' }}
                />
                <span className="mt-1 w-px flex-1 bg-ink-200" />
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-label font-bold">{h.who}</span>
                  <span className="text-tiny text-ink-400">{h.time}</span>
                  {h.tag && (
                    <span className="rounded-full bg-ink-200 px-[7px] py-px text-mini font-bold text-ink-700">
                      {h.tag}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-body leading-[1.75] text-ink-700">{h.text}</div>
                {h.file && (
                  <button
                    onClick={() => setScreen('store')}
                    className="mt-[7px] flex items-center gap-2 rounded-[7px] border border-ink-200 bg-white px-3 py-2 hover:border-brand-fade"
                  >
                    <FileExt ext={h.fileExt} size={24} />
                    <span className="text-left">
                      <span className="block text-sm2 font-bold">{h.file}</span>
                      <span className="block text-mini text-ink-400">문서 저장소에 자동 등록됨</span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-none border-t border-ink-200 bg-white px-4 py-2.5">
          <div className="mb-2 flex gap-1">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setComment(p)}
                className="whitespace-nowrap rounded-full bg-ink-200 px-2.5 py-1 text-xs2 font-semibold text-ink-700 hover:text-ink-900"
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => openLayer('file-upload')}
              title="파일 첨부"
              className="w-8 flex-none rounded-md border border-ink-300 bg-white p-0 text-ink-500 hover:bg-ink-100"
            >
              <Icon name="attach_file" size={17.9} />
            </button>
            <button
              onClick={() => setScreen('store')}
              title="저장소에서 문서 선택"
              className="w-8 flex-none rounded-md border border-ink-300 bg-white p-0 text-ink-500 hover:bg-ink-100"
            >
              <Icon name="topic" size={17.9} />
            </button>
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="코멘트 입력 또는 파일 첨부"
              className="flex-1 rounded-md border border-ink-300 px-3 py-2 text-body outline-none"
            />
            <button
              onClick={() => setComment('')}
              className="rounded-md bg-brand px-3.5 text-sm2 font-bold text-white hover:bg-brand-dark"
            >
              등록
            </button>
          </div>
        </div>
      </ResizablePanel>

      {/* 실시간 스트림 */}
      {streamOpen && (
        <>
        <ResizableHandle />
        <ResizablePanel defaultSize={284} minSize={224} maxSize={460} className="flex flex-col bg-white">
          <div className="flex flex-none items-center gap-2 border-b border-ink-200 px-[18px] py-[11px]">
            <span className="whitespace-nowrap text-sm2 font-extrabold">실시간 스트림</span>
            <button
              onClick={() => setStreamOpen(false)}
              title="실시간 스트림 닫기"
              className="ml-auto size-[22px] p-0 text-ink-400 hover:text-ink-900"
            >
              <Icon name="close" size={17.9} />
            </button>
          </div>
          <div className="min-w-0 flex-none border-b border-ink-100 bg-warn-soft px-[13px] py-[9px] text-xs2 leading-[1.7] text-warn-dark">
            답변을 달아도 상대가 다시 요청하는 경우를 막기 위해 요청·회신 이력을 이 영역에 계속 노출합니다.
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-auto px-3.5 py-3">
            {STREAM.map((s, i) => (
              <div key={i} className="flex gap-2">
                <span className="mt-[5px] size-[7px] flex-none rounded-full" style={{ background: s.dot }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="whitespace-nowrap text-cap font-bold">{s.who}</span>
                    <span className="whitespace-nowrap text-mini text-ink-400">{s.time}</span>
                  </div>
                  <div className="mt-1 text-cap leading-[1.7] text-ink-700">{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  )
}
