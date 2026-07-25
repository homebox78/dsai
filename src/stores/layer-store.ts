import { create } from 'zustand'

/**
 * 모달 · 시트 · 팝오버 등 "겹쳐 뜨는 레이어" 단일 관리소.
 * 화면 운영 원칙상 상세·설정·요청은 전부 페이지가 아니라 레이어로 연다.
 */

export type LayerKey =
  // 조직 · 조직&사업부 · 멤버
  | 'org-create'
  | 'workspace-create'
  | 'workspace-settings'
  | 'member-invite'
  // 문서
  | 'folder-create'
  | 'file-upload'
  | 'file-create'
  // 협업
  | 'chat-invite'
  | 'chat-info'
  | 'chat-leave'
  | 'task-request'
  | 'task-preview'
  // 기타
  | 'activity-all'
  | 'collaborators'
  | 'ai-search'

export interface LayerEntry {
  key: LayerKey
  /** 레이어가 다룰 대상 id (파일·업무·채팅방 등) */
  payload?: Record<string, unknown>
}

interface LayerState {
  stack: LayerEntry[]
  open: (key: LayerKey, payload?: Record<string, unknown>) => void
  close: (key?: LayerKey) => void
  closeAll: () => void
  isOpen: (key: LayerKey) => boolean
  payloadOf: (key: LayerKey) => Record<string, unknown> | undefined
}

export const useLayerStore = create<LayerState>((set, get) => ({
  stack: [],
  open: (key, payload) =>
    set((s) => ({ stack: [...s.stack.filter((l) => l.key !== key), { key, payload }] })),
  close: (key) =>
    set((s) => ({ stack: key ? s.stack.filter((l) => l.key !== key) : s.stack.slice(0, -1) })),
  closeAll: () => set({ stack: [] }),
  isOpen: (key) => get().stack.some((l) => l.key === key),
  payloadOf: (key) => get().stack.find((l) => l.key === key)?.payload,
}))

/** 컴포넌트에서 쓰기 편한 헬퍼 — 리렌더 대상이 좁아진다. */
export function useLayer(key: LayerKey) {
  const isOpen = useLayerStore((s) => s.stack.some((l) => l.key === key))
  const payload = useLayerStore((s) => s.stack.find((l) => l.key === key)?.payload)
  const open = useLayerStore((s) => s.open)
  const close = useLayerStore((s) => s.close)
  return {
    isOpen,
    payload,
    open: (p?: Record<string, unknown>) => open(key, p),
    close: () => close(key),
    onOpenChange: (v: boolean) => (v ? open(key) : close(key)),
  }
}
