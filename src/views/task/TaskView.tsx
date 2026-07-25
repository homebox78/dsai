import { useState } from 'react'
import { Icon } from '@/components/common/icon'
import { tasks, taskHistory, taskStatusTone, type TaskStatus } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/** 업무 관리 (p55~56) — 상태 196px | 목록 322px | 상세 | 실시간 스트림 284px */

const FILTERS: { id: string; label: string; dot: string }[] = [
  { id: 'all', label: '전체', dot: '#94a3b8' },
  { id: '요청됨', label: '요청됨', dot: '#94a3b8' },
  { id: '진행중', label: '진행중', dot: '#2563eb' },
  { id: '검토대기', label: '검토대기', dot: '#f59e0b' },
  { id: '완료', label: '완료', dot: '#16a34a' },
  { id: '반려', label: '반려', dot: '#ef4444' },
]

const FLOW: { key: TaskStatus | '완료'; label: string; icon: string }[] = [
  { key: '요청됨', label: '요청', icon: 'send' },
  { key: '진행중', label: '진행', icon: 'sync' },
  { key: '검토대기', label: '검토', icon: 'rate_review' },
  { key: '완료', label: '완료', icon: 'check' },
]

const STREAM = [
  { who: '이수진', time: '10분 전', text: 'TASK-142 자료 요청을 다시 확인했습니다. 사업장별 구분 파일이 필요합니다.', dot: '#2563eb' },
  { who: '나', time: '1시간 전', text: 'TASK-139 미서명 9개사 목록을 첨부해 회신했습니다.', dot: '#16a34a' },
  { who: '김대성', time: '3시간 전', text: '확인했습니다. 구매팀과 협의해 이번 주 내 마무리 예정입니다.', dot: '#94a3b8' },
  { who: '시스템', time: '어제', text: 'TASK-131 완료 처리 · 첨부 2건 문서 저장소 등록', dot: '#94a3b8' },
]

const PRESETS = ['확인했습니다', '자료 준비 중입니다', '기한 연장 요청']

export function TaskView() {
  const { taskId, setTaskId, setScreen } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [due, setDue] = useState('all')
  const [comment, setComment] = useState('')
  const [streamOpen, setStreamOpen] = useState(true)

  const cur = tasks.find((t) => t.id === taskId) ?? tasks[0]
  const tone = taskStatusTone[cur.status]
  const list = tasks
    .filter((t) => filter === 'all' || t.status === filter)
    .filter((t) => !query.trim() || t.title.includes(query.trim()) || t.from.includes(query.trim()))
    .filter((t) => (due === 'over' ? t.due < '07.25' : due === 'week' ? t.due <= '07.28' : true))

  const history = taskHistory[cur.id] ?? [
    { who: '시스템', time: '-', text: '아직 처리 이력이 없습니다.', tag: '안내' },
  ]

  const flowIdx = FLOW.findIndex((f) => f.key === cur.status)
  const doneIdx = cur.status === '완료' ? 3 : cur.status === '반려' ? 0 : flowIdx

  const meta = [
    { label: '요청자', value: cur.from },
    { label: '담당자', value: cur.to },
    { label: '기한', value: cur.due },
    { label: '첨부', value: `${cur.files}건` },
  ]

  const actions = [
    { label: '완료 처리', bg: '#1750d8', bd: '#1750d8', color: '#fff' },
    { label: '수정 요청', bg: '#fff', bd: '#cbd5e1', color: '#334155' },
    { label: '기한 변경', bg: '#fff', bd: '#cbd5e1', color: '#334155' },
    { label: '반려', bg: '#fff', bd: '#fecaca', color: '#b91c1c' },
  ]

  return (
    <div className="flex min-h-0 min-w-[1180px] flex-1">
      {/* 업무 상태 */}
      <div className="flex w-[196px] flex-none flex-col border-r border-ink-200 bg-white">
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
            const count = f.id === 'all' ? tasks.length : tasks.filter((t) => t.status === f.id).length
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
      </div>

      {/* 목록 */}
      <div className="flex w-[322px] flex-none flex-col border-r border-ink-200 bg-white">
        <div className="flex-none border-b border-ink-200 px-3 py-2">
          <div className="mb-2 flex items-center gap-2">
            <span className="whitespace-nowrap text-label font-extrabold">
              {FILTERS.find((f) => f.id === filter)?.label}
            </span>
            <span className="whitespace-nowrap text-xs2 text-ink-400">{list.length}건</span>
            <div className="flex-1" />
            <button className="flex items-center gap-1 whitespace-nowrap rounded-md border border-ink-300 bg-white px-2 py-1 text-xs2 font-bold text-ink-700 hover:bg-ink-50">
              <Icon name="swap_vert" size={15} className="text-ink-400" />
              기한순
            </button>
          </div>
          <div className="flex gap-1">
            {([['all', '전체'], ['week', '이번 주'], ['over', '기한 초과']] as const).map(([id, label]) => {
              const on = due === id
              return (
                <button
                  key={id}
                  onClick={() => setDue(id)}
                  className="flex-1 whitespace-nowrap rounded-[5px] border py-1 text-tiny font-bold"
                  style={{
                    background: on ? '#eff6ff' : '#fff',
                    borderColor: on ? '#bfdbfe' : '#cbd5e1',
                    color: on ? '#1345bd' : '#334155',
                  }}
                >
                  {label}
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
                    {t.due < '07.25' ? '기한 초과' : `~${t.due}`}
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
      </div>

      {/* 상세 */}
      <div className="flex min-w-[420px] flex-1 flex-col bg-ink-50">
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
                        background: done ? '#eff6ff' : '#fff',
                        borderColor: done ? '#bfdbfe' : '#e2e8f0',
                      }}
                    >
                      <Icon name={f.icon} size={14.1} style={{ color: done ? '#1750d8' : '#cbd5e1' }} />
                    </span>
                    <span
                      className="whitespace-nowrap text-cap font-bold"
                      style={{ color: done ? '#0f172a' : '#94a3b8' }}
                    >
                      {f.label}
                    </span>
                  </div>
                  {i < FLOW.length - 1 && (
                    <span className="mx-2 h-px flex-1" style={{ background: i < doneIdx ? '#bfdbfe' : '#e2e8f0' }} />
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
            {actions.map((a) => (
              <button
                key={a.label}
                className="rounded-md border px-[13px] py-[7px] text-sm2 font-bold"
                style={{ background: a.bg, borderColor: a.bd, color: a.color }}
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
                <span className="mt-1 size-[9px] flex-none rounded-full bg-ink-400" />
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
                    <span className="flex size-6 flex-none items-center justify-center rounded-[5px] bg-ink-100 font-mono text-[7.3px] font-extrabold text-ink-600">
                      {h.fileExt}
                    </span>
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
      </div>

      {/* 실시간 스트림 */}
      {streamOpen && (
        <aside className="flex w-[284px] flex-none flex-col border-l border-ink-200 bg-white">
          <div className="flex flex-none items-center gap-2 border-b border-ink-200 px-[18px] py-[11px]">
            <span className="whitespace-nowrap text-sm2 font-extrabold">실시간 스트림</span>
            <button
              onClick={() => setStreamOpen(false)}
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
        </aside>
      )}
    </div>
  )
}
