import { create } from 'zustand'
import { projects, workspaces } from '@/mocks/data'

/**
 * 앱 셸 상태.
 * ⚠️ 화면 운영 원칙(사용자 지시 2026-07-25): 페이지를 늘리지 않고 **한 화면 안에서** 동선을 운영한다.
 *    → 메뉴 선택은 라우팅이 아니라 이 스토어의 `view` 교체로 처리한다.
 */

export type ViewKey =
  // PROJECT
  | 'dashboard'
  | 'members'
  | 'activity'
  | 'settings'
  // 협업공간
  | 'chat'
  | 'tasks'
  // 문서
  | 'stores'
  | 'files'
  | 'uploads'
  | 'ocr'
  // EcoVadis
  | 'eco-summary'
  | 'eco-questions'
  | 'eco-evidence'
  | 'eco-requests'
  // SYSTEM
  | 'system-members'
  // 헤더에서 진입 (프로젝트 메뉴 밖)
  | 'account-profile'
  | 'account-security'
  | 'admin-users'
  | 'admin-workspaces'
  | 'admin-members'
  | 'admin-channels'

export interface PanelState {
  /** ① 메뉴 — 접으면 아이콘만 */
  menu: boolean
  /** ② 서브메뉴 */
  submenu: boolean
  /** ③ 컨텐츠 & 챗봇 */
  chatbot: boolean
}

interface AppState {
  workspaceId: string
  projectId: string
  view: ViewKey
  panels: PanelState
  /** 헤더 전체 메뉴(메가메뉴) 열림 */
  megaMenuOpen: boolean

  setWorkspace: (id: string) => void
  setProject: (id: string) => void
  setView: (view: ViewKey) => void
  togglePanel: (key: keyof PanelState) => void
  setPanel: (key: keyof PanelState, open: boolean) => void
  setMegaMenu: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  workspaceId: workspaces[0].id,
  projectId: projects[0].id,
  view: 'dashboard',
  panels: { menu: true, submenu: true, chatbot: true },
  megaMenuOpen: false,

  setWorkspace: (workspaceId) =>
    set(() => {
      const first = projects.find((p) => p.workspaceId === workspaceId)
      return { workspaceId, projectId: first ? first.id : '' }
    }),
  setProject: (projectId) => set({ projectId }),
  setView: (view) => set({ view, megaMenuOpen: false }),
  togglePanel: (key) => set((s) => ({ panels: { ...s.panels, [key]: !s.panels[key] } })),
  setPanel: (key, open) => set((s) => ({ panels: { ...s.panels, [key]: open } })),
  setMegaMenu: (megaMenuOpen) => set({ megaMenuOpen }),
}))
