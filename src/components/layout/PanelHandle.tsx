import { Icon } from '@/components/common/icon'

/**
 * 패널 경계 토글 핸들 — 22×22 사각형(radius 4) / top 96 / 화살표는 가로·세로 정중앙
 * 좌측 핸들은 경계 위(-11), 우측 핸들은 화면 끝에서 잘리지 않도록 **경계 안쪽**(+6)에 고정한다.
 * hover 시 border·color·shadow가 브랜드색으로.
 */
export function PanelHandle({
  side,
  open,
  onClick,
  title,
}: {
  side: 'left' | 'right'
  open: boolean
  onClick: () => void
  title: string
}) {
  // 좌측 패널: 열렸으면 «(접기), 닫혔으면 »(펼치기)
  const arrow =
    side === 'left' ? (open ? 'chevron_left' : 'chevron_right') : open ? 'chevron_right' : 'chevron_left'

  return (
    <div className="relative z-[55] w-0 flex-none">
      <button
        onClick={onClick}
        title={title}
        className="absolute top-24 grid size-[22px] place-items-center rounded-[4px] border border-ink-300 bg-white p-0 leading-none text-ink-500 shadow-[0_1px_4px_rgba(15,23,42,.14)] transition-[border-color,color,box-shadow] duration-100 hover:border-brand hover:text-brand hover:shadow-[0_2px_9px_rgba(23,80,216,.24)]"
        style={side === 'left' ? { left: -11 } : { right: 6 }}
      >
        <Icon name={arrow} size={16} className="block leading-none" />
      </button>
    </div>
  )
}
