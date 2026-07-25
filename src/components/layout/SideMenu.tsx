import { Icon } from '@/components/common/icon'
import { ICON, ctx, tasks } from '@/mocks/data'
import { useAppStore, type ScreenKey } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/**
 * 메뉴 영역 (p26~28) — 시안 실측: bg #fafbfc / border-right #e2e8f0 / 펼침 226px, 접힘 52px
 * 접으면 아이콘만 노출 (스토리보드 p5 ①)
 */

type Target = ScreenKey | `room:${string}` | 'editor' | 'channel' | 'settings'

interface MenuItem {
  label: string
  target: Target
  icon: string
  badge: number
}

const GROUPS: { title: string; items: MenuItem[] }[] = [
  { title: '검수', items: [{ label: '작업 목록', target: 'index', icon: 'fact_check', badge: 0 }] },
  {
    title: '프로젝트',
    items: [
      { label: '대시보드', target: 'dash', icon: ICON.dash, badge: 0 },
      { label: '멤버', target: 'members', icon: ICON.user, badge: 0 },
    ],
  },
  {
    title: '협업공간',
    items: [
      { label: 'ESG 전략 TF', target: 'room:r1', icon: ICON.chat, badge: 3 },
      { label: '김대성', target: 'room:r2', icon: ICON.chat, badge: 0 },
      { label: '최민호', target: 'room:r3', icon: ICON.chat, badge: 1 },
      { label: '업무', target: 'task', icon: ICON.task, badge: 0 },
    ],
  },
  {
    title: '문서',
    items: [
      { label: '문서 저장소', target: 'store', icon: ICON.folder, badge: 0 },
      { label: '문서', target: 'editor', icon: ICON.doc, badge: 0 },
    ],
  },
  {
    title: '에코바디스',
    items: [
      { label: '요약', target: 'ecoSum', icon: ICON.chart, badge: 0 },
      { label: '문항', target: 'ecoWork', icon: ICON.list, badge: 300 },
      { label: '증빙자료', target: 'ecoDocs', icon: ICON.shield, badge: 0 },
      { label: '자료요청', target: 'ecoReq', icon: ICON.inbox, badge: 2 },
    ],
  },
  {
    title: '시스템',
    items: [
      { label: '멤버등록', target: 'members', icon: ICON.user, badge: 0 },
      { label: '채널관리', target: 'channel', icon: ICON.chat, badge: 8 },
      { label: '설정', target: 'settings', icon: ICON.gear, badge: 0 },
    ],
  },
]

const ALERT_TARGETS = new Set<Target>(['task', 'ecoReq'])

export function SideMenu() {
  const { menuOpen, screen, room, storeMode, sysTab, setScreen, setRoom, setStoreMode, setSysTab, setDropdown } =
    useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const myOpen = tasks.filter((t) => t.to === '나' && t.status !== '완료' && t.status !== '반려').length

  const isActive = (t: Target) => {
    if (typeof t === 'string' && t.startsWith('room:')) return screen === 'chat' && room === t.slice(5)
    if (t === 'channel') return screen === 'members' && sysTab === 'channel'
    if (t === 'editor') return screen === 'store' && storeMode === 'editor'
    if (t === 'store') return screen === 'store' && storeMode !== 'editor'
    return t === screen
  }

  const go = (t: Target) => {
    if (typeof t === 'string' && t.startsWith('room:')) return setRoom(t.slice(5))
    if (t === 'channel') { setSysTab('channel'); return setScreen('members') }
    if (t === 'editor') { setStoreMode('editor'); return setScreen('store') }
    if (t === 'store') { setStoreMode('list'); return setScreen('store') }
    if (t === 'settings') return openLayer('settings')
    if (t === 'members') { setSysTab('member'); return setScreen('members') }
    setScreen(t as ScreenKey)
  }

  return (
    <aside
      className="flex flex-none flex-col border-r border-ink-200 bg-surface-sidebar transition-[width] duration-150"
      style={{ width: menuOpen ? 226 : 52 }}
    >
      {menuOpen && (
        <div className="flex-none border-b border-ink-200">
          <button
            onClick={() => setDropdown('wsPopOpen', true)}
            className="block w-full px-3.5 py-3 text-left hover:bg-ink-100"
          >
            <span className="flex items-center gap-1.5">
              <span className="truncate text-mini font-extrabold tracking-[.06em] text-ink-400">현재 조직&amp;사업부</span>
              <Icon name="expand_more" size={16} className="ml-auto text-ink-400" />
            </span>
            <span className="mt-1 block truncate text-base2 font-extrabold tracking-[-.01em]">{ctx.ws}</span>
            <span className="mt-[5px] flex items-center gap-1.5 overflow-hidden whitespace-nowrap text-xs2 text-ink-500">
              <span>{ctx.wsStores} stores</span>
              <span className="text-ink-200">|</span>
              <span>{ctx.wsFiles} files</span>
              <span className="text-ink-200">|</span>
              <span>{ctx.wsChannels} channels</span>
            </span>
          </button>
          <div className="px-[13px] pb-[11px]">
            <button
              onClick={() => setDropdown('wsPopOpen', true)}
              className="block w-full rounded-[7px] border border-ink-200 bg-white px-3 py-2 text-left hover:border-brand-border hover:bg-brand-soft"
            >
              <span className="flex items-center gap-1.5">
                <span className="whitespace-nowrap text-mini font-extrabold tracking-[.06em] text-ink-400">현재 프로젝트</span>
                <span className="ml-auto flex-none whitespace-nowrap rounded-full bg-brand-soft px-2 py-0.5 text-tiny font-bold text-brand-dark">
                  {ctx.projVis}
                </span>
              </span>
              <span className="mt-1 block truncate text-body font-bold">{ctx.proj}</span>
              <span className="mt-1 block whitespace-nowrap text-xs2 text-ink-500">멤버 {ctx.projMembers}명</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto pb-[7.6px] pt-[4.7px]">
        {GROUPS.map((g) => (
          <div key={g.title} className="mb-[5.7px]">
            {menuOpen ? (
              <div className="px-3.5 pb-[2.8px] pt-[3.8px] text-mini font-extrabold tracking-[.07em] text-ink-400">
                {g.title}
              </div>
            ) : (
              <div className="mx-2.5 my-[5px] h-px bg-ink-200" />
            )}
            {g.items.map((mi) => {
              const active = isActive(mi.target)
              const badge = mi.target === 'task' ? myOpen : mi.badge
              const alert = ALERT_TARGETS.has(mi.target)
              return (
                <button
                  key={`${g.title}-${mi.label}`}
                  onClick={() => go(mi.target)}
                  title={menuOpen ? mi.label : mi.label + (badge ? ` (${badge})` : '')}
                  className="flex w-full items-center border-l-2 text-left hover:bg-ink-100"
                  style={{
                    gap: menuOpen ? 9 : 0,
                    padding: menuOpen ? '6.4px 12px' : '7.8px 0',
                    justifyContent: menuOpen ? 'flex-start' : 'center',
                    background: active ? '#eff6ff' : 'transparent',
                    borderLeftColor: active ? '#2563eb' : 'transparent',
                    color: active ? '#1d4ed8' : '#334155',
                  }}
                >
                  <Icon name={mi.icon} size={18.4} className="opacity-90" style={{ lineHeight: 1 }} />
                  {menuOpen && (
                    <span
                      className="flex-1 truncate text-body leading-none"
                      style={{ fontWeight: active ? 700 : 500 }}
                    >
                      {mi.label}
                    </span>
                  )}
                  {menuOpen && !!badge && (
                    <span
                      className="flex-none rounded-full border px-2 py-[1.5px] text-tiny font-extrabold leading-[1.45]"
                      style={{
                        background: alert ? '#fef2f2' : '#fff',
                        color: alert ? '#b91c1c' : '#475569',
                        borderColor: alert ? '#fecaca' : '#e2e8f0',
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </aside>
  )
}
