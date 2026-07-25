import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * Google Material Symbols Rounded 아이콘.
 * 프로젝트의 모든 아이콘은 이 컴포넌트만 사용한다.
 * (시안 CLAUDE.md — 직접 그린 SVG path·이모지·문자 글리프 금지, lucide 등 혼용 금지)
 * 아이콘 이름은 https://fonts.google.com/icons 의 리거처 이름.
 */
export interface IconProps {
  name: string
  /** px 크기 (시안은 대개 15~20) */
  size?: number
  filled?: boolean
  /** 100~700 */
  weight?: number
  className?: string
  style?: CSSProperties
  title?: string
}

export function Icon({ name, size = 18, filled = false, weight = 400, className, style, title }: IconProps) {
  return (
    <span
      aria-hidden={title ? undefined : 'true'}
      title={title}
      className={cn('msym', className)}
      style={
        {
          fontSize: size,
          '--mi-fill': filled ? 1 : 0,
          '--mi-wght': weight,
          ...style,
        } as CSSProperties
      }
    >
      {name}
    </span>
  )
}
