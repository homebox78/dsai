import { useAppStore } from '@/stores/app-store'
import { DashboardView } from './dashboard/DashboardView'
import { StoreView } from './store/StoreView'
import { ChatView } from './chat/ChatView'
import { TaskView } from './task/TaskView'
import { EcoSummaryView } from './eco/EcoSummaryView'
import { EcoWorkView } from './eco/EcoWorkView'
import { EcoDocsView } from './eco/EcoDocsView'
import { EcoReqView } from './eco/EcoReqView'
import { MembersView } from './members/MembersView'
import { IndexView } from './index/IndexView'

/** 셸 컨텐츠 영역 — screen 값에 따라 뷰를 교체한다(페이지 이동 아님). */
export function ScreenRouter() {
  const screen = useAppStore((s) => s.screen)

  switch (screen) {
    case 'index':
      return <IndexView />
    case 'dash':
      return <DashboardView />
    case 'store':
      return <StoreView />
    case 'chat':
      return <ChatView />
    case 'task':
      return <TaskView />
    case 'ecoSum':
      return <EcoSummaryView />
    case 'ecoWork':
      return <EcoWorkView />
    case 'ecoDocs':
      return <EcoDocsView />
    case 'ecoReq':
      return <EcoReqView />
    case 'members':
      return <MembersView />
    default:
      return <DashboardView />
  }
}
