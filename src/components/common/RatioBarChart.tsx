import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart'

/**
 * 비율 스택 막대 (shadcn Chart · recharts).
 * 시안의 "한 줄 3분할 진행 바"를 그대로 유지하면서 마우스오버 시 건수·비율 툴팁을 제공한다.
 * 색·비율·높이는 시안 실측값 그대로 전달받는다.
 */

export interface RatioSlice {
  label: string
  count: number
  color: string
  /** 시안 표기 비율 — 없으면 count 합으로 계산 */
  pct?: string
}

export function RatioBarChart({
  slices,
  height = 10,
  unit = '건',
}: {
  slices: RatioSlice[]
  height?: number
  unit?: string
}) {
  const total = slices.reduce((a, s) => a + s.count, 0)
  const row: Record<string, number | string> = { name: 'total' }
  const config: ChartConfig = {}
  slices.forEach((s, i) => {
    row[`s${i}`] = s.count
    config[`s${i}`] = { label: s.label, color: s.color }
  })

  return (
    <ChartContainer
      config={config}
      className="w-full overflow-hidden rounded-full border border-ink-200"
      style={{ height, aspectRatio: 'auto' }}
    >
      <BarChart data={[row]} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barCategoryGap={0}>
        <XAxis type="number" hide domain={[0, total]} />
        <YAxis type="category" dataKey="name" hide />
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) =>
            active && payload?.length ? (
              <div className="rounded-md border border-ink-200 bg-white px-2.5 py-2 text-sm2 shadow-[0_8px_22px_rgba(15,23,42,.16)]">
                {slices.map((s) => (
                  <div key={s.label} className="flex items-center gap-2 whitespace-nowrap py-px">
                    <span className="size-2 flex-none rounded-sm" style={{ background: s.color }} />
                    <span className="text-ink-500">{s.label}</span>
                    <span className="ml-auto font-extrabold">
                      {s.count.toLocaleString()}
                      {unit}
                    </span>
                    <span className="w-9 text-right text-xs2 text-ink-400">
                      {s.pct ?? `${Math.round((s.count / total) * 100)}%`}
                    </span>
                  </div>
                ))}
              </div>
            ) : null
          }
        />
        {slices.map((s, i) => (
          <Bar key={s.label} dataKey={`s${i}`} stackId="ratio" fill={s.color} isAnimationActive={false} />
        ))}
      </BarChart>
    </ChartContainer>
  )
}
