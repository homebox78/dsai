import { useState } from 'react'
import { useQaState } from '@/lib/qa-state'
import { Icon } from '@/components/common/icon'
import { members, msgs, rooms, tasks, taskStatusTone } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'
import { useLayoutMetrics } from '@/lib/responsive'

/** 채팅 (p46~50) — 룸 목록 250px | 대화 | 업무존 318px(탭 전환, 룸 안에서는 항상 열림) */

const ROOM_FILTERS: [string, string][] = [
  ['all', '전체'],
  ['unread', '안읽음'],
  ['task', '업무있음'],
]

const PINNED = [
  { who: '이수진', text: '에코바디스 제출 마감 8/12 · 증빙 누락분 우선 처리', time: '07.20' },
  { who: '홍길동', text: '문서 업로드 시 반드시 폴더 지정 후 업로드해주세요', time: '07.18' },
]

/** 메시지 리액션 (시안 실측: 2번째 메시지 👍2, 그 외 ✓3 👁1) */
const REACTIONS: Record<number, { icon: string; count: number; color: string }[]> = {
  1: [{ icon: 'thumb_up', count: 2, color: '#1750d8' }],
  3: [
    { icon: 'check_circle', count: 3, color: '#16a34a' },
    { icon: 'visibility', count: 1, color: '#64748b' },
  ],
}

const ROOM_FILES = [
  { ext: 'PDF', name: 'ISO 14001 인증서_2026.pdf', who: '박지원', date: '07.20' },
  { ext: 'DOCX', name: '표준 공급계약서_v3.docx', who: '나', date: '07.16' },
  { ext: 'XLSX', name: '안전보건 교육 이수 내역_2025.xlsx', who: '최민호', date: '07.14' },
]

export function ChatView() {
  const { room, setRoom, setTaskId, setScreen } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [roomQuery, setRoomQuery] = useState('')
  const [roomFilter, setRoomFilter] = useQaState('roomFilter', 'all')
  const [searchOpen, setSearchOpen] = useQaState('roomSearch', false)
  const [msgQuery, setMsgQuery] = useState('')
  const [pinnedOpen, setPinnedOpen] = useQaState('pinnedOpen', false)
  const [zoneTab, setZoneTab] = useQaState<'task' | 'info'>('zoneTab', 'task')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [input, setInput] = useState('')
  const [mentionOpen, setMentionOpen] = useQaState('mentionOpen', false)
  const { chatRowMin, autoHideZone } = useLayoutMetrics()

  const cur = rooms.find((r) => r.id === room) ?? rooms[0]
  const curMsgs = msgs[room] ?? []
  const roomTasks = tasks.filter((t) => t.room === cur.name)
  const shownRooms = rooms
    .filter((r) => !roomQuery.trim() || r.name.includes(roomQuery.trim()) || r.last.includes(roomQuery.trim()))
    .filter((r) =>
      roomFilter === 'all'
        ? true
        : roomFilter === 'unread'
          ? !!r.unread
          : tasks.some((t) => t.room === r.name && t.status !== '완료'),
    )
  const roomFilterCount = (id: string) =>
    id === 'unread'
      ? rooms.filter((r) => r.unread).length
      : id === 'task'
        ? rooms.filter((r) => tasks.some((t) => t.room === r.name && t.status !== '완료')).length
        : 0

  const iconBtn = 'size-[30px] flex-none rounded-md border border-ink-300 bg-white p-0 text-ink-600 hover:bg-ink-100'

  return (
    <div className="flex min-h-0 flex-1" style={{ minWidth: chatRowMin }}>
      {/* 채팅룸 목록 */}
      <div className="flex w-[250px] flex-none flex-col border-r border-ink-200 bg-white">
        <div className="flex-none border-b border-ink-200 px-3 py-2">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">채팅룸 목록</span>
            <button
              onClick={() => openLayer('chat-invite')}
              className="ml-auto whitespace-nowrap rounded-[5px] border border-ink-300 bg-white px-[7px] py-[3px] text-xs2 font-bold text-ink-700 hover:bg-ink-100"
            >
              + 초대
            </button>
          </div>
          <div className="mb-2 flex items-center gap-1.5 border-b border-ink-200 px-0.5 py-[5px]">
            <Icon name="search" size={16} className="text-ink-400" />
            <input
              value={roomQuery}
              onChange={(e) => setRoomQuery(e.target.value)}
              placeholder="대화·참여자 검색"
              className="min-w-0 flex-1 border-none bg-transparent p-0 text-sm2 outline-none"
            />
          </div>
          <div className="flex gap-1">
            {ROOM_FILTERS.map(([id, label]) => {
              const on = roomFilter === id
              const cnt = roomFilterCount(id)
              return (
                <button
                  key={id}
                  onClick={() => setRoomFilter(id)}
                  className="flex-1 rounded-[5px] border py-1 text-tiny font-bold"
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
          {shownRooms.map((r) => {
            const on = r.id === room
            return (
              <button
                key={r.id}
                onClick={() => setRoom(r.id)}
                className="block w-full border-b border-l-2 border-ink-100 px-3.5 py-3 text-left hover:bg-ink-50"
                style={{ background: on ? '#eff6ff' : '#fff', borderLeftColor: on ? '#2563eb' : 'transparent' }}
              >
                <span className="flex items-center gap-2">
                  <span className="flex size-7 flex-none items-center justify-center rounded-full border border-brand-border bg-brand-soft text-cap font-extrabold text-brand-link-dark">
                    {r.name[0]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-label font-bold">{r.name}</span>
                    <span className="block whitespace-nowrap text-tiny text-ink-400">
                      {r.type} · {r.time}
                    </span>
                  </span>
                  {!!r.unread && (
                    <span className="flex-none rounded-full bg-brand px-2 py-0.5 text-mini font-extrabold text-white">
                      {r.unread}
                    </span>
                  )}
                </span>
                <span className="mt-[5px] block truncate pl-9 text-cap text-ink-500">{r.last}</span>
              </button>
            )
          })}
        </div>

        <div className="flex-none border-t border-ink-200 px-3.5 py-3">
          <div className="mb-2 whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">
            프로젝트 참여자
          </div>
          <div className="flex flex-col gap-1">
            {members.map((p) => (
              <button
                key={p.id}
                onClick={() => openLayer('task-request', { to: p.id })}
                className="flex items-center gap-2 rounded-md px-1.5 py-[5px] text-left hover:bg-ink-100"
              >
                <span className="flex size-[22px] flex-none items-center justify-center rounded-full border border-ink-200 bg-ink-100 text-mini font-extrabold text-ink-600">
                  {p.name[0]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm2 font-semibold">{p.name}</span>
                  <span className="block truncate text-mini text-ink-400">{p.role}</span>
                </span>
                <span
                  className="size-1.5 flex-none rounded-full"
                  style={{ background: p.on ? '#16a34a' : '#cbd5e1' }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 대화 */}
      <div className="flex min-w-[400px] flex-1 flex-col bg-white">
        <div className="flex h-11 flex-none items-center gap-2 border-b border-ink-200 px-[18px]">
          <span className="flex size-7 items-center justify-center rounded-full border border-brand-border bg-brand-soft text-cap font-extrabold text-brand-link-dark">
            {cur.name[0]}
          </span>
          <div>
            <div className="whitespace-nowrap text-body font-extrabold">{cur.name}</div>
            <div className="whitespace-nowrap text-[11.2px] text-ink-400">{cur.type === '1:1' ? '1:1 대화 · 온라인' : `${cur.type} 참여`}</div>
          </div>
          <div className="ml-1 flex items-center">
            {members.slice(0, 3).map((m) => (
              <span
                key={m.id}
                className="-ml-1.5 flex size-[22px] items-center justify-center rounded-full border-[1.5px] border-white bg-brand-soft text-mini font-extrabold text-brand-link-dark"
              >
                {m.name[0]}
              </span>
            ))}
          </div>
          <div className="flex-1" />
          <button onClick={() => setSearchOpen((v) => !v)} title="대화 내 검색" className={iconBtn}>
            <Icon name="search" size={17.9} />
          </button>
          <button
            onClick={() => setPinnedOpen((v) => !v)}
            title="고정 메시지"
            className="size-[30px] flex-none rounded-md border p-0 hover:bg-ink-100"
            style={
              pinnedOpen
                ? { background: '#fffbeb', borderColor: '#fed7aa', color: '#b45309' }
                : { background: '#fff', borderColor: '#cbd5e1', color: '#475569' }
            }
          >
            <Icon name="push_pin" size={17.9} />
          </button>
          <button
            onClick={() => openLayer('chat-info')}
            className="rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-sm2 font-semibold text-ink-700 hover:bg-ink-100"
          >
            대화방 정보
          </button>
          <button
            onClick={() => openLayer('chat-invite')}
            className="rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-sm2 font-semibold text-ink-700 hover:bg-ink-100"
          >
            초대
          </button>
          <button
            onClick={() => openLayer('task-request')}
            className="rounded-md bg-brand px-2.5 py-1.5 text-sm2 font-bold text-white hover:bg-brand-dark"
          >
            업무 요청
          </button>
        </div>

        {searchOpen && (
          <div className="flex flex-none items-center gap-2 border-b border-ink-200 bg-white px-[18px] py-3.5">
            <Icon name="search" size={17} className="text-ink-400" />
            <input
              value={msgQuery}
              onChange={(e) => setMsgQuery(e.target.value)}
              placeholder="이 대화에서 검색 (파일·업무 포함)"
              className="flex-1 border-0 border-b border-ink-200 px-0.5 py-[5px] text-sm2 outline-none"
            />
            <span className="whitespace-nowrap text-xs2 text-ink-500">
              {curMsgs.filter((m) => msgQuery && m.text?.includes(msgQuery)).length}건
            </span>
            <button onClick={() => setSearchOpen(false)} className="size-6 p-0 text-ink-400">
              <Icon name="close" size={17} />
            </button>
          </div>
        )}

        {pinnedOpen && (
          <div className="flex-none border-b border-ink-200 bg-warn-soft px-[18px] py-3.5">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Icon name="push_pin" size={15} className="text-warn-dark" />
              <span className="text-tiny font-extrabold tracking-[.05em] text-warn-dark">고정된 메시지 2</span>
            </div>
            <div className="flex flex-col gap-1">
              {PINNED.map((p) => (
                <div key={p.text} className="flex items-center gap-2">
                  <span className="whitespace-nowrap text-xs2 font-bold text-warn-deepest">{p.who}</span>
                  <span className="min-w-0 flex-1 truncate text-cap text-warn-deepest">{p.text}</span>
                  <span className="whitespace-nowrap text-tiny text-warn-dark">{p.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-4 overflow-auto bg-white px-[18px] py-4">
          <div className="mb-0.5 flex items-center gap-2">
            <span className="h-px flex-1 bg-ink-200" />
            <span className="whitespace-nowrap text-xs2 font-bold text-ink-400">오늘</span>
            <span className="h-px flex-1 bg-ink-200" />
          </div>

          {curMsgs.map((m, i) => {
            const task = m.task ? tasks.find((t) => t.id === m.task) : null
            const tone = task ? taskStatusTone[task.status] : null
            return (
              <div key={i} className={`flex flex-col ${m.mine ? 'items-end' : 'items-start'}`}>
                <div className="mb-1 flex items-baseline gap-1.5">
                  <span className="whitespace-nowrap text-cap font-bold">{m.who}</span>
                  <span className="text-tiny text-ink-400">{m.time}</span>
                </div>

                {m.text && (
                  <div className={`flex items-end gap-2 ${m.mine ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div
                      className="max-w-[520px] rounded-lg px-3 py-2 text-body leading-[1.7]"
                      style={m.mine ? { background: '#1750d8', color: '#fff' } : { background: '#f1f5f9', color: '#0f172a' }}
                    >
                      {m.text}
                    </div>
                    <div className="flex items-center gap-1 pb-0.5">
                      {m.mine && <span className="whitespace-nowrap text-mini font-bold text-ink-400">읽음</span>}
                      <button title="답장" className="size-[22px] p-0 text-ink-300 hover:text-brand">
                        <Icon name="reply" size={16} />
                      </button>
                      <button title="고정" className="size-[22px] p-0 text-ink-300 hover:text-warn-dark">
                        <Icon name="push_pin" size={16} />
                      </button>
                      <button
                        onClick={() => openLayer('task-request')}
                        title="이 메시지로 업무 요청"
                        className="size-[22px] p-0 text-ink-300 hover:text-ok"
                      >
                        <Icon name="task_alt" size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {m.text && REACTIONS[i] && (
                  <div className="mt-[5px] flex gap-1">
                    {REACTIONS[i].map((rc) => (
                      <span
                        key={rc.icon}
                        className="flex items-center gap-1 rounded-full border border-ink-200 bg-ink-50 px-2 py-0.5 text-xs2 font-bold text-ink-600"
                      >
                        <Icon name={rc.icon} size={14.1} style={{ color: rc.color }} />
                        {rc.count}
                      </span>
                    ))}
                  </div>
                )}

                {m.file && (
                  <button
                    onClick={() => setScreen('store')}
                    className="mt-1.5 flex items-center gap-2 border-l-2 border-ink-300 bg-white px-3 py-2 hover:border-l-brand hover:bg-ink-50"
                  >
                    <span className="flex size-[26px] flex-none items-center justify-center rounded-md bg-ink-100 font-mono text-[8.2px] font-extrabold text-ink-600">
                      {m.fileExt}
                    </span>
                    <span className="text-left">
                      <span className="block text-label font-bold">{m.file}</span>
                      <span className="block text-tiny text-ink-400">{m.fileSize} · 문서 저장소에서 열기</span>
                    </span>
                  </button>
                )}

                {task && tone && (
                  <button
                    onClick={() => { setTaskId(task.id); setScreen('task') }}
                    className="mt-1.5 block w-[330px] rounded-r-lg border-y border-r border-l-2 border-ink-200 bg-white px-3.5 py-3 text-left hover:bg-ink-50"
                    style={{ borderLeftColor: tone.bar }}
                  >
                    <span className="mb-[5px] flex items-center gap-1.5">
                      <span className="text-mini font-extrabold tracking-[.05em] text-ink-500">업무 요청</span>
                      <span
                        className="ml-auto rounded-full px-2 py-0.5 text-mini font-extrabold"
                        style={{ background: tone.bg, color: tone.fg }}
                      >
                        {task.status}
                      </span>
                    </span>
                    <span className="block text-body font-bold">{task.title}</span>
                    <span className="mt-1 block text-xs2 text-ink-500">
                      담당 {task.to} · 기한 {task.due}
                    </span>
                    <span className="mt-[7px] flex items-center gap-[3px] text-cap font-bold text-brand-link">
                      빠른 처리 열기
                      <Icon name="open_in_new" size={15} />
                    </span>
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex-none border-t border-ink-200">
          {mentionOpen && (
            <div className="border-b border-ink-100 bg-white px-2.5 py-1.5">
              <div className="px-1 pb-1.5 pt-[3px] text-tiny font-extrabold tracking-[.05em] text-ink-400">
                멘션 · 선택 시 업무 요청 가능
              </div>
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setMentionOpen(false); openLayer('task-request', { to: m.id }) }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-ink-100"
                >
                  <span className="flex size-[22px] flex-none items-center justify-center rounded-full border border-brand-border bg-brand-soft text-mini font-extrabold text-brand-link-dark">
                    {m.name[0]}
                  </span>
                  <span className="min-w-0 flex-1 whitespace-nowrap text-sm2 font-semibold">{m.name}</span>
                  <span className="whitespace-nowrap text-tiny text-ink-400">{m.role}</span>
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-[7px] px-[18px] pb-3 pt-2.5">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              placeholder="메시지 입력 · @이름으로 담당자 지정 · Enter 전송 / Shift+Enter 줄바꿈"
              className="min-h-[56px] w-full resize-none rounded-lg border border-ink-300 px-3 py-[9px] text-body leading-[1.65] outline-none"
            />
            <div className="flex items-center gap-1.5">
              <button onClick={() => openLayer('file-upload')} title="파일 첨부" className={iconBtn}>
                <Icon name="attach_file" size={17.9} />
              </button>
              <button onClick={() => openLayer('task-request')} title="업무 요청" className={iconBtn}>
                <Icon name="task_alt" size={17.9} />
              </button>
              <button
                onClick={() => setMentionOpen((v) => !v)}
                title="멘션"
                className="size-[30px] flex-none rounded-md border p-0 hover:bg-ink-100"
                style={
                  mentionOpen
                    ? { background: '#eff6ff', borderColor: '#bfdbfe', color: '#1345bd' }
                    : { background: '#fff', borderColor: '#cbd5e1', color: '#64748b' }
                }
              >
                <Icon name="alternate_email" size={17.9} />
              </button>
              <div className="flex-1" />
              <button
                onClick={() => setInput('')}
                className="rounded-md bg-brand px-4 py-[7px] text-sm2 font-bold text-white hover:bg-brand-dark"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 업무 영역 (탭 전환) — 룸 안에서는 항상 열림, 아주 좁을 때만 숨김 */}
      {!autoHideZone && (
      <aside className="flex w-[318px] flex-none flex-col border-l border-ink-200 bg-white">
        <div className="flex flex-none items-center border-b border-ink-200">
          {([['task', 'Task 업무영역'], ['info', '대화방 정보']] as const).map(([id, label]) => {
            const on = zoneTab === id
            return (
              <button
                key={id}
                onClick={() => setZoneTab(id)}
                className="flex-1 border-b-2 py-[11px] text-sm2 font-bold hover:text-ink-900"
                style={{ borderBottomColor: on ? '#1750d8' : 'transparent', color: on ? '#0f172a' : '#94a3b8' }}
              >
                {label}
                {id === 'task' && !!roomTasks.length && (
                  <span className="ml-[5px] rounded-full bg-bad-soft px-2 py-0.5 text-mini font-extrabold text-bad-dark">
                    {roomTasks.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {zoneTab === 'task' ? (
          <>
            <div className="flex-none border-b border-ink-100 bg-ink-50 px-3.5 py-3">
              <div className="mb-1.5 whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">
                이 대화방의 업무 요청
              </div>
              <div className="flex gap-1">
                {([['all', '전체'], ['mine', '내 담당'], ['open', '진행중']] as const).map(([id, label]) => {
                  const on = zoneFilter === id
                  return (
                    <button
                      key={id}
                      onClick={() => setZoneFilter(id)}
                      className="rounded-full border px-2 py-0.5 text-xs2 font-bold"
                      style={{
                        background: on ? '#2563eb' : '#fff',
                        borderColor: on ? '#2563eb' : '#cbd5e1',
                        color: on ? '#fff' : '#334155',
                      }}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {roomTasks
                .filter((t) =>
                  zoneFilter === 'all'
                    ? true
                    : zoneFilter === 'mine'
                      ? t.to === '나'
                      : t.status === '진행중' || t.status === '요청됨',
                )
                .map((t) => {
                  const tone = taskStatusTone[t.status]
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setTaskId(t.id); setScreen('task') }}
                      className="block w-full border-b border-l-2 border-ink-100 bg-white px-3.5 py-3 text-left hover:bg-ink-50"
                      style={{ borderLeftColor: tone.bar }}
                    >
                      <span className="mb-[5px] flex items-center gap-1.5">
                        <span
                          className="rounded-full px-2 py-0.5 text-mini font-extrabold"
                          style={{ background: tone.bg, color: tone.fg }}
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
                      <span className="block text-label font-bold leading-[1.6]">{t.title}</span>
                      <span className="mt-1 block text-xs2 text-ink-500">
                        {t.from} → {t.to} · 첨부 {t.files}건
                      </span>
                    </button>
                  )
                })}
              <button
                onClick={() => openLayer('task-request')}
                className="w-full border-b border-ink-100 p-3 text-sm2 font-bold text-brand-link hover:bg-brand-soft"
              >
                + 업무 요청 만들기
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-auto p-[13px]">
            <div className="mb-2 whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">
              참여자 {members.length}명
            </div>
            <div className="mb-4 flex flex-col gap-0.5">
              {members.map((p) => (
                <button
                  key={p.id}
                  onClick={() => openLayer('task-request', { to: p.id })}
                  className="flex items-center gap-2 rounded-md p-1.5 text-left hover:bg-ink-100"
                >
                  <span className="flex size-6 flex-none items-center justify-center rounded-full border border-ink-200 bg-ink-100 text-tiny font-extrabold text-ink-600">
                    {p.name[0]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm2 font-semibold">{p.name}</span>
                    <span className="block truncate text-mini text-ink-400">{p.role}</span>
                  </span>
                  <span className="text-mini font-bold text-brand-link">업무 요청</span>
                </button>
              ))}
            </div>
            <div className="mb-2 whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">
              공유된 파일
            </div>
            <div className="flex flex-col gap-1.5">
              {ROOM_FILES.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setScreen('store')}
                  className="flex items-center gap-2 rounded-[7px] border border-ink-200 bg-ink-50 px-[9px] py-2 text-left hover:border-brand-fade"
                >
                  <span className="flex size-[22px] flex-none items-center justify-center rounded-[5px] border border-ink-200 bg-white font-mono text-[7.3px] font-extrabold text-ink-600">
                    {f.ext}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm2 font-semibold">{f.name}</span>
                    <span className="block text-mini text-ink-400">
                      {f.who} · {f.date}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
      )}
    </div>
  )
}
