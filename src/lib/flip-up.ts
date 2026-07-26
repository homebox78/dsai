import { useLayoutEffect, useRef, useState } from 'react'

/**
 * 드롭다운 열림 방향 자동 판정.
 * 트리거 아래 공간이 목록을 담기에 모자라면 위로 연다(시안 공통 규칙: 하단 행은 위로 열림).
 *
 * const { ref, up } = useFlipUp(open, 220)
 * <button ref={ref}>…</button>
 * <div style={up ? { bottom: 'calc(100% + 4px)' } : { top: 'calc(100% + 4px)' }} />
 */
export function useFlipUp<T extends HTMLElement = HTMLButtonElement>(open: boolean, estimatedHeight = 220) {
  const ref = useRef<T | null>(null)
  const [up, setUp] = useState(false)

  useLayoutEffect(() => {
    if (!open || !ref.current) return
    const decide = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const below = window.innerHeight - r.bottom
      const above = r.top
      // 아래 공간이 모자라고 위가 더 넉넉하면 위로
      setUp(below < estimatedHeight + 12 && above > below)
    }
    decide()
    window.addEventListener('resize', decide)
    window.addEventListener('scroll', decide, true)
    return () => {
      window.removeEventListener('resize', decide)
      window.removeEventListener('scroll', decide, true)
    }
  }, [open, estimatedHeight])

  return { ref, up }
}
