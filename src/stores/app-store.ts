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
  taskFilter: string
  /** 에코바디스 */
  qId: string
  /** 시스템 탭 */
  sysTab: SysTab

  /**
   * 검수 인덱스 프리셋 — "열기"를 누른 항목의 화면 상태.
   * 스토어가 직접 갖지 않는 세부 상태(탭·필터·검색어 등)는 여기 담고
   * 각 뷰가 `useQaState`로 초기값을 받아간다. ⚠️ 납품 시 제거 대상.
   */
  preset: Record<string, unknown>
  /** 프리셋이 새로 적용될 때마다 증가 — 뷰의 로컬 상태 재초기화 트리거 */
  presetSeq: number

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
  setTaskFilter: (f: string) => void
  /** 시안: 자료요청 / 내가 보낸 요청 진입 — 업무 관리 화면 + 필터 지정 */
  goTask: (filter: string) => void
  setQId: (id: string) => void
  setSysTab: (t: SysTab) => void
  /** 검수 인덱스 항목의 상태를 앱 셸에 그대로 적용 */
  applyPreset: (st: Record<string, unknown>) => void
}

/** 시스템(멤버) 화면 탭 — 시안: 멤버 / 조직&사업부 / 채널 / 권한 그룹 */
export type SysTab = 'member' | 'ws' | 'channel' | 'perm'

/** dc.html 상태 키 → 스토어 필드 */
const CORE_KEYS: Record<string, keyof AppState> = {
  screen: 'screen',
  menuOpen: 'menuOpen',
  bot: 'botOpen',
  botTab: 'botTab',
  notiOpen: 'notiOpen',
  helpOpen: 'helpOpen',
  userOpen: 'userOpen',
  wsPopOpen: 'wsPopOpen',
  overlay: 'overlay',
  folder: 'folder',
  fileId: 'fileId',
  storeMode: 'storeMode',
  room: 'room',
  taskId: 'taskId',
  taskFilter: 'taskFilter',
  qId: 'qId',
  sysTab: 'sysTab',
}

export const useAppStore = create<AppState>((set) => ({
  // 로그인 직후 착지 화면 — 클라이언트 검수 동선상 작업목록부터 본다
  screen: 'index',
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
  taskFilter: 'all',
  qId: 'q3',
  sysTab: 'member',
  preset: {},
  presetSeq: 0,

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
  setTaskFilter: (taskFilter) => set({ taskFilter }),
  goTask: (taskFilter) => set({ screen: 'task', taskFilter, overlay: false }),
  setQId: (qId) => set({ qId }),
  setSysTab: (sysTab) => set({ sysTab }),

  applyPreset: (st) =>
    set((s) => {
      // 프리셋에 없는 레이어·드롭다운은 항상 닫힌 상태에서 출발한다.
      const next: Partial<AppState> = {
        preset: st,
        presetSeq: s.presetSeq + 1,
        notiOpen: false,
        helpOpen: false,
        userOpen: false,
        wsPopOpen: false,
        overlay: false,
        menuOpen: true,
        botOpen: true,
      }
      for (const [k, v] of Object.entries(st)) {
        const field = CORE_KEYS[k]
        if (field) (next as Record<string, unknown>)[field] = v
      }
      return next
    }),
}))
