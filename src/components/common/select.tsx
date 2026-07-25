import { Icon } from '@/components/common/icon'
import { useQaState } from '@/lib/qa-state'

/**
 * 커스텀 드롭다운 — 네이티브 select 금지 규칙(시안 공통 규칙 9)에 따른 공용 컴포넌트.
 * 트리거와 드롭다운 폭이 같고, 스크롤 영역 하단에서는 위로 열린다.
 */
export function Select({
  ddKey,
  value,
  options,
  onChange,
  className = '',
  up = false,
}: {
  /** 열림 상태 키 — 검수 프리셋(ddOpen)과 동일한 문자열 */
  ddKey: string
  value: string
  options: string[]
  onChange: (v: string) => void
  className?: string
  /** 하단 잘림 방지: 위로 열기 */
  up?: boolean
}) {
  const [ddOpen, setDdOpen] = useQaState<string | null>('ddOpen', null)
  const open = ddOpen === ddKey

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setDdOpen(open ? null : ddKey)}
        className="flex w-full items-center gap-2 rounded-md border bg-white px-2.5 py-1.5 text-left text-sm2"
        style={{ borderColor: open ? '#1750d8' : '#cbd5e1' }}
      >
        <span className="min-w-0 flex-1 truncate">{value}</span>
        <Icon name={open ? 'expand_less' : 'expand_more'} size={16} className="text-ink-400" />
      </button>
      {open && (
        <div
          className="absolute left-0 z-30 max-h-[220px] w-full overflow-auto rounded-lg border border-ink-200 bg-white p-1 shadow-[0_12px_30px_rgba(15,23,42,.16)]"
          style={up ? { bottom: 'calc(100% + 4px)' } : { top: 'calc(100% + 4px)' }}
        >
          {options.map((o) => {
            const on = o === value
            return (
              <button
                key={o}
                onClick={() => {
                  onChange(o)
                  setDdOpen(null)
                }}
                className="flex w-full items-center gap-1.5 rounded-md px-2.5 py-1.5 text-left text-sm2 hover:bg-ink-100"
                style={{ background: on ? '#eff6ff' : 'transparent', fontWeight: on ? 700 : 500 }}
              >
                <Icon
                  name={on ? 'check' : 'radio_button_unchecked'}
                  size={15}
                  style={{ color: on ? '#1750d8' : '#cbd5e1' }}
                />
                <span className="min-w-0 flex-1 truncate">{o}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
