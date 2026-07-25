import { useEffect, useRef } from 'react'
import { useAppStore, type ScreenKey } from '@/stores/app-store'
import { useLayerStore, type LayerKey } from '@/stores/layer-store'

/**
 * 주소창 해시로 화면 상태를 보존한다 — `#screen=store&modal=upload`.
 * 특정 화면·레이어 링크를 그대로 공유할 수 있게 하는 검수 편의 기능.
 */

const SCREENS: ScreenKey[] = ['index', 'dash', 'members', 'store', 'chat', 'task', 'ecoSum', 'ecoWork', 'ecoDocs', 'ecoReq']

export function useHashSync() {
  const screen = useAppStore((s) => s.screen)
  const applyPreset = useAppStore((s) => s.applyPreset)
  const setScreen = useAppStore((s) => s.setScreen)
  const stack = useLayerStore((s) => s.stack)
  const openLayer = useLayerStore((s) => s.open)
  const booted = useRef(false)

  // 진입 시 해시 → 상태
  useEffect(() => {
    const read = () => {
      const raw = window.location.hash.replace(/^#/, '')
      if (!raw) return
      const p = new URLSearchParams(raw)
      const sc = p.get('screen') as ScreenKey | null
      const layer = (p.get('modal') ?? p.get('sheet')) as LayerKey | null
      if (sc && SCREENS.includes(sc)) {
        applyPreset({ screen: sc })
        setScreen(sc)
      }
      if (layer) openLayer(layer)
    }
    read()
    window.addEventListener('hashchange', read)
    // 첫 렌더의 기본 화면이 해시를 덮어쓰지 않도록 한 틱 뒤부터 기록한다
    const t = window.setTimeout(() => (booted.current = true), 0)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('hashchange', read)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 상태 → 해시
  useEffect(() => {
    if (!booted.current) return
    const top = stack[stack.length - 1]
    const next = `#screen=${screen}${top ? `&modal=${top.key}` : ''}`
    if (window.location.hash !== next) window.history.replaceState(null, '', next)
  }, [screen, stack])
}
