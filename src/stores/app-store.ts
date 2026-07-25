import { create } from 'zustand'

/**
 * 앱 셸 상태 — 시안의 state 구조를 따른다.
 * ⚠️ 화면 운영 원칙: 페이지를 늘리지 않고 한 화면 안에서 `screen` 교체 + 레이어로 동선을 운영한다.
 */

export type ScreenKey =
  | 'index' // 작업 목록(검수 인덱스)
  | 'dash' // 대시보드
  | 'members' // 멤버 / 시스템
  | 'store' // 문서 저장소
  | 'chat' // 채팅
  | 'task' // 업무 관리
  | 'ecoSum' // 에코바디스 요약
  | 'ecoWork' // 에코바디스 문항(처리부)
  | 'ecoDocs' // 증빙자료
  | 'ecoReq' // 자료요청

export type StoreMode = 'list' | 'detail' | 'editor'

interface AppState {
  screen: ScreenKey
  /** 좌측 메뉴 펼침 */
  menuOpen: boolean
  /** 우측 챗봇/업무 패널 펼침 */
  botOpen: boolean
  botTab: 'chat' | 'task'
  /** 헤더 레이어 */
  notiOpen: boolean
  helpOpen: boolean
  userOpen: boolean
  wsPopOpen: boolean
  /** 전체 메뉴 오버레이 */
  overlay: boolean

  /** 문서 저장소 */
  folder: string
  fileId: string | null
  storeMode: StoreMode
  /** 채팅 */
  room: string
  /** 업무 */
  taskId: string
  /** 에코바디스 */
  qId: string
  /** 시스템 탭 */
  sysTab: 'member' | 'channel'

  setScreen: (screen: ScreenKey) => void
  toggleMenu: () => void
  toggleBot: () => void
  setBotTab: (t: 'chat' | 'task') => void
  setDropdown: (key: 'notiOpen' | 'helpOpen' | 'userOpen' | 'wsPopOpen', open: boolean) => void
  closeDropdowns: () => void
  setOverlay: (open: boolean) => void
  setFolder: (id: string) => void
  openFile: (id: string) => void
  setStoreMode: (m: StoreMode) => void
  setRoom: (id: string) => void
  setTaskId: (id: string) => void
  setQId: (id: string) => void
  setSysTab: (t: 'member' | 'channel') => void
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'dash',
  menuOpen: true,
  botOpen: true,
  botTab: 'chat',
  notiOpen: false,
  helpOpen: false,
  userOpen: false,
  wsPopOpen: false,
  overlay: false,
  folder: 'f2',
  fileId: null,
  storeMode: 'list',
  room: 'r1',
  taskId: 't1',
  qId: 'q3',
  sysTab: 'member',

  setScreen: (screen) =>
    set({ screen, overlay: false, notiOpen: false, helpOpen: false, userOpen: false, wsPopOpen: false }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
  toggleBot: () => set((s) => ({ botOpen: !s.botOpen })),
  setBotTab: (botTab) => set({ botTab }),
  setDropdown: (key, open) =>
    set({ notiOpen: false, helpOpen: false, userOpen: false, wsPopOpen: false, [key]: open } as Partial<AppState>),
  closeDropdowns: () => set({ notiOpen: false, helpOpen: false, userOpen: false, wsPopOpen: false }),
  setOverlay: (overlay) => set({ overlay }),
  setFolder: (folder) => set({ folder, fileId: null, storeMode: 'list' }),
  openFile: (fileId) => set({ fileId, storeMode: 'detail' }),
  setStoreMode: (storeMode) => set({ storeMode }),
  setRoom: (room) => set({ room, screen: 'chat' }),
  setTaskId: (taskId) => set({ taskId }),
  setQId: (qId) => set({ qId }),
  setSysTab: (sysTab) => set({ sysTab }),
}))
