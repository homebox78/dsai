import { useState } from 'react'
import { ecoQuestions, ecoStatusTone, tasks, taskStatusTone } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'
import { Icon } from '@/components/common/icon'

/** 에코바디스 요약 (p57) — 질문지 바 + 질문항 결과 목록 + 요청한 자료 패널 */

const BARS = [
  { label: '답변완료', count: 214, w: '71%', color: '#16a34a' },
  { label: 'AI 초안', count: 41, w: '14%', color: '#f59e0b' },
  { label: '미처리', count: 45, w: '15%', color: '#cbd5e1' },
]

const FILTERS = ['전체', '답변완료', 'AI 초안', '미처리']

export function EcoSummaryView() {
  const { setQId, setScreen, setTaskId } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [filter, setFilter] = useState('전체')
  const [page, setPage] = useState(1)

  const rows = ecoQuestions.filter((q) => filter === '전체' || q.status === filter)
  const ecoReqs = tasks.filter((t) => t.status !== '완료').slice(0, 4)

  return (
    <div className="flex min-h-0 min-w-[1000px] flex-1">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
        {/* 질문지 + 전체 진행률 */}
        <div className="flex flex-none items-stretch border-b border-ink-200">
          <div className="flex w-[340px] flex-none items-center gap-3 border-r border-ink-200 px-[18px] py-3.5">
            <span className="flex size-[34px] flex-none items-center justify-center rounded-lg bg-ink-100 font-mono text-[8.7px] font-extrabold text-ink-600">
              PDF
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-label font-bold">에코바디스_2026_질문항.pdf</div>
              <div className="mt-1 flex items-center gap-1">
                <span className="flex-none whitespace-nowrap rounded-full bg-ok-softer px-2 py-0.5 text-mini font-bold text-ok-dark">
                  OCR 완료
                </span>
                <span className="truncate text-xs2 text-ink-400">300문항 · 12.4MB</span>
              </div>
            </div>
            <button
              onClick={() => openLayer('file-upload')}
              className="flex-none rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-cap font-semibold text-ink-700 hover:bg-ink-100"
            >
              재업로드
            </button>
          </div>

          <div className="min-w-0 flex-1 px-[18px] py-3.5">
            <div className="mb-[9px] flex items-center gap-2">
              <span className="whitespace-nowrap text-sm2 font-extrabold">전체 진행률</span>
              <span className="min-w-0 flex-1 truncate text-xs2 text-ink-400">
                답변완료 · AI 초안 · 미처리 합계 100%
              </span>
              <button
                onClick={() => openLayer('eco-export')}
                className="flex-none whitespace-nowrap rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-cap font-bold text-ink-700 hover:bg-ink-100"
              >
                답변서 내려받기
              </button>
            </div>
            <div className="flex h-2.5 overflow-hidden rounded-full border border-ink-200">
              {BARS.map((b) => (
                <span key={b.label} style={{ width: b.w, background: b.color }} />
              ))}
            </div>
            <div className="mt-2.5 flex gap-4">
              {BARS.map((b) => (
                <div key={b.label} className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm" style={{ background: b.color }} />
                  <span className="whitespace-nowrap text-cap text-ink-500">{b.label}</span>
                  <span className="text-label font-extrabold">{b.count}</span>
                  <span className="whitespace-nowrap text-xs2 text-ink-400">{b.w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* 질문항 결과 */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-r border-ink-200">
            <div className="flex h-11 flex-none items-center gap-2 border-b border-ink-200 px-[18px]">
              <span className="whitespace-nowrap text-sm2 font-extrabold">질문항 결과</span>
              <div className="flex-1" />
              {FILTERS.map((f) => {
                const on = filter === f
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="rounded-full border px-2.5 py-1 text-xs2 font-bold"
                    style={{
                      background: on ? '#1750d8' : '#fff',
                      borderColor: on ? '#1750d8' : '#cbd5e1',
                      color: on ? '#fff' : '#334155',
                    }}
                  >
                    {f}
                  </button>
                )
              })}
            </div>

            <div className="flex-1 overflow-auto">
              {rows.map((q) => {
                const tone = ecoStatusTone[q.status]
                return (
                  <button
                    key={q.id}
                    onClick={() => { setQId(q.id); setScreen('ecoWork') }}
                    className="flex w-full items-center gap-3 border-b border-ink-100 bg-white px-[18px] py-[11px] text-left hover:bg-ink-50"
                  >
                    <span className="flex-none rounded bg-ink-200 px-2 py-0.5 font-mono text-tiny font-extrabold text-ink-600">
                      {q.no}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body font-semibold">{q.q}</span>
                      <span className="mt-1 flex items-center gap-2">
                        <span className="text-tiny text-ink-500">{q.cat}</span>
                        <span className="text-tiny text-ink-300">|</span>
                        <span className="text-tiny text-ink-500">
                          답변파일 {q.files}건 · {q.filesSize}
                        </span>
                        <span className="text-tiny text-ink-300">|</span>
                        <span className="text-tiny text-ink-500">답변자 {q.owner}</span>
                      </span>
                    </span>
                    <span
                      className="flex-none rounded-full px-2 py-0.5 text-mini font-extrabold"
                      style={{ background: tone.bg, color: tone.fg }}
                    >
                      {q.status}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex flex-none items-center justify-center gap-1 border-t border-ink-200 p-2.5">
              {['chevron_left', '1', '2', '3', 'chevron_right'].map((p, i) => {
                const isIcon = p.startsWith('chevron')
                const on = !isIcon && Number(p) === page
                return (
                  <button
                    key={i}
                    onClick={() => !isIcon && setPage(Number(p))}
                    className="inline-flex h-[26px] min-w-[26px] items-center justify-center rounded-[5px] border px-1.5 text-cap font-bold"
                    style={{
                      background: on ? '#1750d8' : '#fff',
                      borderColor: on ? '#1750d8' : '#cbd5e1',
                      color: on ? '#fff' : '#334155',
                    }}
                  >
                    {isIcon ? <Icon name={p} size={16} /> : p}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 요청한 자료 */}
          <div className="flex w-[300px] flex-none flex-col overflow-hidden">
            <div className="flex h-11 flex-none flex-col justify-center border-b border-ink-200 px-[18px]">
              <div className="whitespace-nowrap text-sm2 font-extrabold">요청한 자료 · 진행중</div>
              <div className="mt-px truncate text-tiny text-ink-400">담당자에게 요청한 증빙 현황</div>
            </div>
            <div className="flex-1 overflow-auto">
              {ecoReqs.map((r) => {
                const tone = taskStatusTone[r.status]
                return (
                  <button
                    key={r.id}
                    onClick={() => { setTaskId(r.id); setScreen('task') }}
                    className="block w-full border-b border-l-2 border-ink-100 bg-white px-3.5 py-3 text-left hover:bg-ink-50"
                    style={{ borderLeftColor: tone.bar }}
                  >
                    <span className="mb-[5px] flex items-center gap-1.5">
                      <span
                        className="rounded-full px-2 py-0.5 text-mini font-extrabold"
                        style={{ background: tone.bg, color: tone.fg }}
                      >
                        {r.status}
                      </span>
                      <span className="font-mono text-mini text-ink-400">TASK-{r.no}</span>
                    </span>
                    <span className="block text-sm2 font-bold leading-[1.6]">{r.title}</span>
                    <span className="mt-1 block text-xs2 text-ink-500">
                      {r.to} · ~{r.due}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="flex-none border-t border-ink-200 px-4 py-2.5">
              <button
                onClick={() => openLayer('task-request')}
                className="w-full rounded-md bg-brand py-2 text-sm2 font-bold text-white hover:bg-brand-dark"
              >
                + 자료 요청 만들기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
