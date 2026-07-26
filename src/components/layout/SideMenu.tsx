import { Icon } from '@/components/common/icon'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { ICON, ctx, tasks } from '@/mocks/data'
import { useAppStore, type ScreenKey } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/**
 * 메뉴 영역 (p26~28) — shadcn Sidebar 기반.
 * 시안 실측: bg #fafbfc / border-right #e2e8f0 / 펼침 234px, 접힘 48px(아이콘 레일)
 * 접힘 상태는 앱 스토어(menuOpen)와 Sidebar 상태를 함께 물린다.
 */

type Target = ScreenKey | `room:${string}` | 'editor' | 'channel' | 'settings'

interface MenuItem {
  label: string
  target: Target
  icon: string
  badge: number
  /** 1:1 대화방 — 아이콘 대신 이름 이니셜 아바타로 구분(아이콘 중복 방지) */
  avatar?: boolean
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
      { label: '김대성', target: 'room:r2', icon: 'person', badge: 0, avatar: true },
      { label: '최민호', target: 'room:r3', icon: 'person', badge: 1, avatar: true },
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
      { label: '멤버등록', target: 'members', icon: 'person_add', badge: 0 },
      { label: '채널관리', target: 'channel', icon: 'hub', badge: 8 },
      { label: '설정', target: 'settings', icon: ICON.gear, badge: 0 },
    ],
  },
]

const ALERT_TARGETS = new Set<Target>(['task', 'ecoReq'])

export function SideMenu() {
  const { screen, room, storeMode, sysTab, setScreen, setRoom, setStoreMode, setSysTab, setDropdown } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const { state } = useSidebar()
  const open = state === 'expanded'
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
    <Sidebar
      collapsible="none"
      className="h-full flex-none border-r border-ink-200 transition-[width] duration-150"
      style={{ ['--sidebar-width' as string]: open ? '234px' : '48px' }}
    >
      {/* 현재 조직&사업부 · 프로젝트 (펼침 상태에서만) */}
      {open && (
        <SidebarHeader className="gap-0 border-b border-ink-200 p-0">
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
        </SidebarHeader>
      )}

      <SidebarContent className="gap-0 overflow-x-hidden pb-[7.6px] pt-[4.7px]">
        {GROUPS.map((g) => (
          <SidebarGroup key={g.title} className="gap-0 p-0 pb-[5.7px]">
            {open ? (
              <SidebarGroupLabel className="h-auto px-3.5 pb-[2.8px] pt-[3.8px] text-mini font-extrabold tracking-[.07em] text-ink-400">
                {g.title}
              </SidebarGroupLabel>
            ) : (
              <div className="mx-2.5 my-[5px] h-px bg-ink-200" />
            )}
            <SidebarGroupContent>
              <SidebarMenu className="gap-0">
                {g.items.map((mi) => {
                  const active = isActive(mi.target)
                  const badge = mi.target === 'task' ? myOpen : mi.badge
                  const alert = ALERT_TARGETS.has(mi.target)
                  return (
                    <SidebarMenuItem key={`${g.title}-${mi.label}`}>
                      <SidebarMenuButton
                        onClick={() => go(mi.target)}
                        isActive={active}
                        tooltip={badge ? `${mi.label} (${badge})` : mi.label}
                        className="h-auto rounded-none border-l-2 text-body hover:bg-ink-100 data-[active=true]:bg-brand-softer"
                        style={{
                          gap: open ? 9 : 0,
                          padding: open ? '6.4px 12px' : '7.8px 0',
                          justifyContent: open ? 'flex-start' : 'center',
                          borderLeftColor: active ? '#2563eb' : 'transparent',
                          color: active ? '#1d4ed8' : '#334155',
                          fontWeight: active ? 700 : 500,
                        }}
                      >
                        {mi.avatar ? (
                          <span
                            className="flex size-[18.4px] flex-none items-center justify-center rounded-full border text-[9.7px] font-extrabold"
                            style={{
                              background: active ? '#dbeafe' : '#f1f5f9',
                              borderColor: active ? '#bfdbfe' : '#e2e8f0',
                              color: active ? '#1d4ed8' : '#64748b',
                            }}
                          >
                            {mi.label[0]}
                          </span>
                        ) : (
                          <Icon name={mi.icon} size={18.4} className="opacity-90" style={{ lineHeight: 1 }} />
                        )}
                        {open && <span className="truncate leading-none">{mi.label}</span>}
                      </SidebarMenuButton>
                      {open && !!badge && (
                        <SidebarMenuBadge
                          className="top-1/2 h-auto -translate-y-1/2 rounded-full border px-2 py-[1.5px] text-tiny font-extrabold leading-[1.45]"
                          style={{
                            background: alert ? '#fef2f2' : '#fff',
                            color: alert ? '#b91c1c' : '#475569',
                            borderColor: alert ? '#fecaca' : '#e2e8f0',
                          }}
                        >
                          {badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
