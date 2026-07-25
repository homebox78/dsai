import { useNavigate } from 'react-router'
import { ctx } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/** 사용자 드롭다운 (p14) — 시안 실측: w 230 / top 44 / padding 6 */
export function UserDropdown() {
  const { setScreen, closeDropdowns } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const navigate = useNavigate()

  const items: { label: string; tag: string; danger?: boolean; onClick: () => void }[] = [
    { label: '내 프로필', tag: '모달', onClick: () => openLayer('member-invite') },
    { label: '설정', tag: '모달', onClick: () => openLayer('settings') },
    { label: '멤버·권한 관리', tag: '', onClick: () => setScreen('members') },
    { label: '초기 설정 화면 보기', tag: '1회성', onClick: () => navigate('/setup') },
    { label: '로그인 화면 보기', tag: 'Auth', onClick: () => navigate('/login') },
    { label: '로그아웃', tag: '', danger: true, onClick: () => navigate('/login') },
  ]

  return (
    <div className="anim-pop absolute right-0 top-11 w-[230px] rounded-[10px] border border-ink-200 bg-white p-1.5 shadow-[0_14px_36px_rgba(15,23,42,.14)]">
      <div className="mb-[5px] border-b border-ink-100 px-3 py-2">
        <div className="text-body font-bold">
          {ctx.me.name} · {ctx.me.title}
        </div>
        <div className="mt-1 text-xs2 text-ink-400">{ctx.me.email}</div>
      </div>
      {items.map((u) => (
        <button
          key={u.label}
          onClick={() => {
            closeDropdowns()
            u.onClick()
          }}
          className={`flex w-full rounded-[7px] px-3 py-2 text-left text-body font-semibold hover:bg-ink-100 ${
            u.danger ? 'text-bad-dark' : 'text-ink-900'
          }`}
        >
          <span className="flex-1">{u.label}</span>
          <span className="text-xs2 text-ink-400">{u.tag}</span>
        </button>
      ))}
    </div>
  )
}
