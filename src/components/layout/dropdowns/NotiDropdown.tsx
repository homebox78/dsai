import { useQaState } from '@/lib/qa-state'
import { Icon } from '@/components/common/icon'
import { useAppStore } from '@/stores/app-store'

/** 알림 드롭다운 (p13) — 시안 실측: w 306 / top 38 / radius 10 / shadow 0 14px 36px rgba(15,23,42,.14) */

interface Noti {
  id: string
  tag: string
  tagBg: string
  tagFg: string
  time: string
  mention: boolean
  text: string
  go: () => void
}

export function NotiDropdown() {
  const { setScreen, setTaskId, setRoom, setQId, closeDropdowns, openFile, setFolder } = useAppStore()
  const [tab, setTab] = useQaState<'all' | 'unread' | 'mention'>('notiTab', 'all')
  const [read, setRead] = useQaState<Record<string, boolean>>('notiRead', {})

  const NOTI: Noti[] = [
    {
      id: 'n1', tag: '업무 요청', tagBg: '#fef2f2', tagFg: '#b91c1c', time: '3분 전', mention: false,
      text: '이수진님이 「안전보건 교육 이수 내역」 자료를 요청했습니다.',
      go: () => { setTaskId('t1'); setScreen('task') },
    },
    {
      id: 'n2', tag: '색인 완료', tagBg: '#eff6ff', tagFg: '#1d4ed8', time: '18분 전', mention: false,
      text: 'ISO 14001 인증서_2026.pdf 의 OCR·RAG 색인이 완료되었습니다.',
      go: () => { setFolder('f2'); openFile('a1'); setScreen('store') },
    },
    {
      id: 'n3', tag: '멘션', tagBg: '#e2e8f0', tagFg: '#334155', time: '1시간 전', mention: true,
      text: 'ESG 전략 TF에서 @홍길동 을 호출했습니다.',
      go: () => setRoom('r1'),
    },
    {
      id: 'n4', tag: '멘션', tagBg: '#e2e8f0', tagFg: '#334155', time: '2시간 전', mention: true,
      text: '김대성님이 TASK-139 코멘트에서 @홍길동 을 언급했습니다.',
      go: () => { setTaskId('t3'); setScreen('task') },
    },
    {
      id: 'n5', tag: '에코바디스', tagBg: '#fffbeb', tagFg: '#b45309', time: '어제', mention: false,
      text: 'AI 초안 41건이 검토 대기 중입니다.',
      go: () => { setQId('q3'); setScreen('ecoWork') },
    },
  ]

  const unread = NOTI.filter((n) => !read[n.id])
  const shown = NOTI.filter(
    (n) => tab === 'all' || (tab === 'unread' && !read[n.id]) || (tab === 'mention' && n.mention),
  )
  const tabs = [
    { id: 'all' as const, label: '전체', count: 0 },
    { id: 'unread' as const, label: '안 읽음', count: unread.length },
    { id: 'mention' as const, label: '멘션', count: 0 },
  ]

  return (
    <div className="anim-pop absolute right-0 top-[38px] w-[306px] overflow-hidden rounded-[10px] border border-ink-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,.14)]">
      <div className="flex items-center gap-2 border-b border-ink-200 px-[18px] py-[11px]">
        <span className="whitespace-nowrap text-sm2 font-extrabold">알림</span>
        {unread.length > 0 && (
          <span className="flex-none whitespace-nowrap rounded-full bg-bad-light px-[7px] py-px text-mini font-extrabold text-white">
            {unread.length}
          </span>
        )}
        <button
          onClick={() => setRead(NOTI.reduce<Record<string, boolean>>((a, n) => ((a[n.id] = true), a), {}))}
          className="ml-auto flex-none whitespace-nowrap text-xs2 font-bold text-brand"
        >
          모두 읽음
        </button>
      </div>

      <div className="flex gap-[5px] border-b border-ink-100 px-3.5 py-[9px]">
        {tabs.map((t) => {
          const on = t.id === tab
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-[5px] whitespace-nowrap rounded-full border px-[11px] py-1 text-xs2 font-bold ${
                on ? 'border-brand bg-brand text-white' : 'border-ink-300 bg-white text-ink-700'
              }`}
            >
              {t.label}
              {!!t.count && (
                <span className={`text-mini font-extrabold ${on ? 'text-white/85' : 'text-bad-light'}`}>{t.count}</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="max-h-[284px] overflow-y-auto overflow-x-hidden">
        {shown.map((n) => (
          <button
            key={n.id}
            onClick={() => {
              setRead((r) => ({ ...r, [n.id]: true }))
              closeDropdowns()
              n.go()
            }}
            className={`block w-full overflow-hidden border-b border-ink-100 px-3.5 py-3 text-left hover:bg-ink-50 ${
              read[n.id] ? 'bg-white' : 'bg-ink-50'
            }`}
          >
            <span className="mb-[3px] flex min-w-0 items-center gap-1.5">
              <span
                className="flex-none whitespace-nowrap rounded-full px-2 py-0.5 text-mini font-extrabold"
                style={{ background: n.tagBg, color: n.tagFg }}
              >
                {n.tag}
              </span>
              <span className="ml-auto flex-none whitespace-nowrap text-tiny text-ink-400">{n.time}</span>
            </span>
            <span className="line-clamp-2 block text-sm2 font-semibold leading-[1.65] text-ink-900">{n.text}</span>
          </button>
        ))}
        {shown.length === 0 && (
          <div className="px-3.5 py-[26px] text-center">
            <Icon name="notifications_off" size={26} className="text-ink-300" />
            <div className="mt-1.5 text-cap text-ink-400">해당하는 알림이 없습니다</div>
          </div>
        )}
      </div>

      <div className="flex border-t border-ink-200">
        <button className="flex-1 whitespace-nowrap border-r border-ink-200 bg-ink-50 py-2.5 text-cap font-bold text-ink-700 hover:bg-ink-100">
          전체 알림 보기
        </button>
        <button className="flex-1 whitespace-nowrap bg-ink-50 py-2.5 text-cap font-bold text-ink-700 hover:bg-ink-100">
          알림 설정
        </button>
      </div>
    </div>
  )
}
