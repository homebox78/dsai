import { useNavigate } from 'react-router'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore, type LayerKey } from '@/stores/layer-store'
import type { IdxItem } from '@/views/index/index-data'

/**
 * 검수 인덱스 항목 → 실제 화면 상태 적용.
 * 시안(dc.html)의 modal/sheet 이름을 앱의 LayerKey로 매핑한다.
 * ⚠️ 납품 시 제거 대상.
 */

const MODAL_MAP: Record<string, LayerKey> = {
  org: 'org-create',
  ws: 'ws-create',
  proj: 'proj-create',
  settings: 'settings',
  folder: 'folder-create',
  upload: 'file-upload',
  newfile: 'file-create',
  delete: 'file-delete',
  invite: 'chat-invite',
  room: 'chat-info',
  quick: 'task-preview',
  member: 'member-invite',
  evpack: 'eco-export',
}

const SHEET_MAP: Record<string, LayerKey> = {
  chat: 'ai-chat',
  req: 'task-request',
  toc: 'toc-edit',
  task: 'task-alert',
}

export function useOpenIdxItem() {
  const navigate = useNavigate()
  const applyPreset = useAppStore((s) => s.applyPreset)
  const openLayer = useLayerStore((s) => s.open)
  const closeAll = useLayerStore((s) => s.closeAll)

  return (item: IdxItem) => {
    const st = item.st
    if (!st) return

    if (st.view === 'auth') {
      const authTab = (st.authTab as string) ?? 'login'
      navigate(`/login?tab=${authTab === 'twofa' ? '2fa' : authTab}`)
      return
    }
    if (st.view === 'onboard') {
      navigate(`/setup?step=${(st.obStep as number) ?? 0}`)
      return
    }

    navigate('/')
    closeAll()
    applyPreset(st)

    if (typeof st.modal === 'string' && MODAL_MAP[st.modal]) openLayer(MODAL_MAP[st.modal])
    if (typeof st.sheet === 'string' && SHEET_MAP[st.sheet]) openLayer(SHEET_MAP[st.sheet])
    if (st.viewer) openLayer('viewer')
  }
}
