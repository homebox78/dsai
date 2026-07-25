import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { Icon } from '@/components/common/icon'

/**
 * 공용 모달 — 시안 실측: 딤 rgba(15,23,42,.42) / radius 12 / shadow 0 24px 60px
 * ⚠️ body 포털 + 명시 z-index (헤더 stacking context에 갇히지 않게)
 */
export function Modal({
  open,
  onClose,
  title,
  desc,
  width = 520,
  footer,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  desc?: string
  width?: number
  footer?: ReactNode
  children: ReactNode
}) {
  if (!open) return null

  return createPortal(
    <div
      className="anim-fade fixed inset-0 z-[90] flex items-center justify-center p-6"
      style={{ background: 'rgba(15,23,42,.42)' }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="anim-pop flex max-h-[86vh] flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,.22)]"
        style={{ width }}
      >
        <div className="flex flex-none items-start gap-2 border-b border-ink-200 px-[18px] py-3.5">
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-extrabold tracking-[-.01em]">{title}</div>
            {desc && <div className="mt-1 text-sm2 text-ink-500">{desc}</div>}
          </div>
          <button onClick={onClose} className="size-[26px] flex-none p-0 text-ink-400 hover:text-ink-900">
            <Icon name="close" size={19} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-[18px] py-4">{children}</div>

        {footer && (
          <div className="flex flex-none items-center gap-1.5 border-t border-ink-200 bg-ink-50 px-[18px] py-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

/** 우측 슬라이드 시트 (p17·p49) */
export function Sheet({
  open,
  onClose,
  title,
  desc,
  width = 380,
  footer,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  desc?: string
  width?: number
  footer?: ReactNode
  children: ReactNode
}) {
  if (!open) return null

  return createPortal(
    <div
      className="anim-fade fixed inset-0 z-[80]"
      style={{ background: 'rgba(15,23,42,.32)' }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside
        className="anim-sheet absolute right-0 top-0 flex h-full flex-col border-l border-ink-200 bg-white shadow-[-12px_0_40px_rgba(15,23,42,.14)]"
        style={{ width }}
      >
        <div className="flex flex-none items-start gap-2 border-b border-ink-200 px-[18px] py-3.5">
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-extrabold tracking-[-.01em]">{title}</div>
            {desc && <div className="mt-1 text-sm2 text-ink-500">{desc}</div>}
          </div>
          <button onClick={onClose} className="size-[26px] flex-none p-0 text-ink-400 hover:text-ink-900">
            <Icon name="close" size={19} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto px-[18px] py-4">{children}</div>
        {footer && (
          <div className="flex flex-none items-center gap-1.5 border-t border-ink-200 bg-ink-50 px-[18px] py-3">
            {footer}
          </div>
        )}
      </aside>
    </div>,
    document.body,
  )
}

/* 공용 폼 조각 */

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="mb-3.5 block">
      <span className="mb-1.5 block text-sm2 font-bold text-ink-700">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs2 text-ink-400">{hint}</span>}
    </label>
  )
}

export const inputCls =
  'w-full rounded-md border border-ink-300 px-3 py-2 text-label outline-none focus:border-brand-link'

export function BtnPrimary({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md bg-brand px-3.5 py-2 text-sm2 font-bold text-white hover:bg-brand-dark"
    >
      {children}
    </button>
  )
}

export function BtnGhost({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-ink-300 bg-white px-3.5 py-2 text-sm2 font-bold text-ink-700 hover:bg-ink-100"
    >
      {children}
    </button>
  )
}

export function BtnDanger({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md bg-bad-dark px-3.5 py-2 text-sm2 font-bold text-white hover:opacity-90"
    >
      {children}
    </button>
  )
}
