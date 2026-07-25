import { useAppStore } from '@/stores/app-store'
import { Icon } from '@/components/common/icon'
import { DashboardView } from './dashboard/DashboardView'

/** 셸 컨텐츠 영역 — screen 값에 따라 뷰를 교체한다(페이지 이동 아님). */
export function ScreenRouter() {
  const screen = useAppStore((s) => s.screen)

  switch (screen) {
    case 'dash':
      return <DashboardView />
    default:
      return <Placeholder />
  }
}

function Placeholder() {
  const screen = useAppStore((s) => s.screen)
  return (
    <div className="flex min-w-0 flex-1 items-center justify-center bg-ink-50">
      <div className="text-center">
        <Icon name="construction" size={40} className="text-ink-300" />
        <p className="mt-2 text-body text-ink-400">
          <span className="font-bold text-ink-600">{screen}</span> 화면 — 구현 예정
        </p>
      </div>
    </div>
  )
}
