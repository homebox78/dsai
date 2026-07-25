import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * Google Material Symbols 아이콘.
 * 프로젝트의 모든 아이콘은 이 컴포넌트만 사용한다 (사용자 지시 2026-07-25).
 * 아이콘 이름은 https://fonts.google.com/icons 의 리거처 이름 (예: "folder", "chat_bubble").
 */
export interface IconProps {
  /** Material Symbols 리거처 이름 */
  name: string
  /** px 크기 (기본 20) */
  size?: number
  /** 채움 아이콘 여부 */
  filled?: boolean
  /** 100~700 (기본 400) */
  weight?: number
  className?: string
  style?: CSSProperties
}

export function Icon({ name, size = 20, filled = false, weight = 400, className, style }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('mi shrink-0', className)}
      style={
        {
          fontSize: size,
          width: size,
          height: size,
          '--mi-fill': filled ? 1 : 0,
          '--mi-wght': weight,
          '--mi-opsz': size,
          ...style,
        } as CSSProperties
      }
    >
      {name}
    </span>
  )
}
