import { AppHeader } from '@/components/layout/AppHeader'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SideMenu } from '@/components/layout/SideMenu'
import { SidebarProvider } from '@/components/ui/sidebar'
import { PanelHandle } from '@/components/layout/PanelHandle'
import { WsPopover } from '@/components/layout/WsPopover'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { LayerHost } from '@/components/layers/LayerHost'
import { QaBar } from '@/components/common/QaBar'
import { useAppStore } from '@/stores/app-store'
import { ScreenRouter } from '@/views/ScreenRouter'
import { useHashSync } from '@/lib/hash-sync'

/**
 * 단일 앱 셸 — 화면 운영 원칙상 여기가 유일한 앱 화면이다.
 * 메뉴 선택은 페이지 이동이 아니라 ScreenRouter의 뷰 교체, 상세·설정은 레이어.
 * 시안 실측: 100vh flex column / font-size 14.1px / bg #f8fafc
 */
export function AppShell() {
  const { menuOpen, toggleMenu, wsPopOpen, closeDropdowns, notiOpen, helpOpen, userOpen } = useAppStore()
  const anyDropdown = notiOpen || helpOpen || userOpen
  useHashSync()

  return (
    <SidebarProvider
      open={menuOpen}
      onOpenChange={(v) => v !== menuOpen && toggleMenu()}
      // 셸 안에 배치되므로 shadcn 기본 래퍼의 최소 높이·배경은 쓰지 않는다
      className="contents"
      style={{ ['--sidebar-width' as string]: '234px', ['--sidebar-width-icon' as string]: '48px' }}
    >
    <div className="flex h-screen flex-col overflow-hidden bg-ink-50 text-[14.1px]">
      <AppHeader />
      <Breadcrumb />

      <div className="flex min-h-0 flex-1 overflow-x-auto">
        <SideMenu />
        <PanelHandle
          side="left"
          open={menuOpen}
          onClick={toggleMenu}
          title={menuOpen ? '메뉴 접기' : '메뉴 펼치기'}
        />
        <ScreenRouter />
      </div>

      {wsPopOpen && <WsPopover />}
      <MegaMenu />
      <LayerHost />
      <QaBar />

      {/* 드롭다운 바깥 클릭 닫기 */}
      {anyDropdown && <div className="fixed inset-0 z-[55]" onClick={closeDropdowns} />}
    </div>
    </SidebarProvider>
  )
}
