import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * shadcn/ui 내부에서 쓰이던 lucide 아이콘을 Google Material Symbols로 대체하는 드롭인 shim.
 * 프로젝트 전체 아이콘은 Material Symbols로 통일한다 (사용자 지시 2026-07-25).
 * 화면 코드에서는 이 shim 대신 `@/components/common/icon`의 <Icon/>을 사용할 것.
 */
interface MiProps {
  className?: string
  size?: number
  style?: CSSProperties
}

function mi(name: string, defaultSize = 16) {
  return function MiGlyph({ className, size = defaultSize, style }: MiProps) {
    return (
      <span
        aria-hidden="true"
        className={cn('mi shrink-0', className)}
        style={{ fontSize: size, width: size, height: size, ...style } as CSSProperties}
      >
        {name}
      </span>
    )
  }
}

export const ChevronDownIcon = mi('keyboard_arrow_down')
export const ChevronUpIcon = mi('keyboard_arrow_up')
export const ChevronRightIcon = mi('chevron_right')
export const CheckIcon = mi('check')
export const XIcon = mi('close')
export const CircleCheckIcon = mi('check_circle')
export const InfoIcon = mi('info')
export const TriangleAlertIcon = mi('warning')
export const OctagonXIcon = mi('cancel')
export const Loader2Icon = mi('progress_activity')
