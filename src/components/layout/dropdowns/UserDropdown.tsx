import { useNavigate } from 'react-router'
import { clearEntered } from '@/lib/session'
import { Icon } from '@/components/common/icon'
import { ctx } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/** 사용자 드롭다운 (p14) — 시안 실측: w 230 / top 44 / padding 6 */
export function UserDropdown() {
  const { setScreen, closeDropdowns } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const navigate = useNavigate()

  // 설계서 p14 — 내 정보 / 보안 및 로그인 / 내 결제수단 / 로그아웃
  const items: { label: string; icon: string; tag: string; danger?: boolean; onClick: () => void }[] = [
    { label: '내 정보', icon: 'person', tag: '', onClick: () => openLayer('settings', { tab: 'account' }) },
    { label: '보안 및 로그인', icon: 'shield', tag: '', onClick: () => openLayer('settings', { tab: 'security' }) },
    { label: '내 결제수단', icon: 'credit_card', tag: '', onClick: () => openLayer('settings', { tab: 'billing' }) },
  ]
  const devItems: { label: string; icon: string; tag: string; onClick: () => void }[] = [
    { label: '멤버·권한 관리', icon: 'group', tag: '', onClick: () => setScreen('members') },
    { label: '초기 설정 화면 보기', icon: 'rocket_launch', tag: '1회성', onClick: () => navigate('/setup') },
    { label: '로그인 화면 보기', icon: 'login', tag: 'Auth', onClick: () => navigate('/login') },
  ]

  return (
    <div className="anim-pop absolute right-0 top-11 w-[230px] rounded-[10px] border border-ink-200 bg-white p-1.5 shadow-[0_14px_36px_rgba(15,23,42,.14)]">
      {/* 프로필 카드 — 아바타 + 이름 + 이메일 */}
      <div className="mb-[5px] flex items-center gap-2 border-b border-ink-100 px-3 py-2.5">
        <span className="flex size-9 flex-none items-center justify-center rounded-full bg-brand text-label font-extrabold text-white">
          {ctx.me.name[0]}
        </span>
        <div className="min-w-0">
          <div className="truncate text-body font-bold">{ctx.me.name}</div>
          <div className="mt-0.5 truncate text-xs2 text-ink-400">{ctx.me.email}</div>
        </div>
      </div>
      {items.map((u) => (
        <button
          key={u.label}
          onClick={() => {
            closeDropdowns()
            u.onClick()
          }}
          className="flex w-full items-center gap-2.5 rounded-[7px] px-3 py-2 text-left text-body font-semibold text-ink-900 hover:bg-ink-100"
        >
          <Icon name={u.icon} size={17} className="flex-none text-ink-500" />
          <span className="flex-1">{u.label}</span>
        </button>
      ))}

      <div className="my-[5px] h-px bg-ink-100" />
      {devItems.map((u) => (
        <button
          key={u.label}
          onClick={() => {
            closeDropdowns()
            u.onClick()
          }}
          className="flex w-full items-center gap-2.5 rounded-[7px] px-3 py-2 text-left text-body font-semibold text-ink-900 hover:bg-ink-100"
        >
          <Icon name={u.icon} size={17} className="flex-none text-ink-500" />
          <span className="flex-1">{u.label}</span>
          <span className="text-xs2 text-ink-400">{u.tag}</span>
        </button>
      ))}

      <div className="my-[5px] h-px bg-ink-100" />
      <button
        onClick={() => {
          closeDropdowns()
          clearEntered()
          navigate('/login?tab=login')
        }}
        className="flex w-full items-center gap-2.5 rounded-[7px] px-3 py-2 text-left text-body font-semibold text-bad-dark hover:bg-bad-soft"
      >
        <Icon name="logout" size={17} className="flex-none" />
        <span className="flex-1">로그아웃</span>
      </button>
    </div>
  )
}
