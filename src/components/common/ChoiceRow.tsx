import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

/**
 * 한 줄 선택 (shadcn RadioGroup 기반).
 * 시안의 "칩 3~4개 중 하나 선택" 패턴을 라디오 그룹 시맨틱으로 구현한다.
 * — 키보드 화살표 이동·라벨 클릭·aria 지원이 붙고, 보이는 모양은 시안 칩 그대로.
 */
export function ChoiceRow({
  value,
  options,
  onChange,
  name,
  className,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
  /** 라디오 그룹 이름 — 화면 안에서 고유해야 한다 */
  name: string
  className?: string
}) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className={cn('flex flex-row gap-1.5', className)}>
      {options.map((o) => {
        const on = value === o
        const id = `${name}-${o}`
        return (
          <label
            key={o}
            htmlFor={id}
            className="flex flex-1 cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border px-3 py-2 text-sm2 transition-colors hover:bg-ink-50"
            style={{
              background: on ? '#eff6ff' : '#fff',
              borderColor: on ? '#1750d8' : '#cbd5e1',
              color: on ? '#1345bd' : '#334155',
              fontWeight: on ? 700 : 500,
            }}
          >
            {/* 실제 라디오 표시 — 선택 상태가 원형 인디케이터로 보인다 */}
            <RadioGroupItem
              id={id}
              value={o}
              className="size-[15px] flex-none border-ink-300 data-[state=checked]:border-brand data-[state=checked]:text-brand"
            />
            {o}
          </label>
        )
      })}
    </RadioGroup>
  )
}
