import { useQaState } from '@/lib/qa-state'
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

/** 평가 점수 요약 (시안 ecoScores) */
const SCORES = [
  { label: '예상 점수', value: '68', delta: '', color: '#0f172a', deltaColor: '#94a3b8' },
  { label: '전년', value: '61', delta: '+7', color: '#475569', deltaColor: '#15803d' },
  { label: '업종 평균', value: '54', delta: '', color: '#475569', deltaColor: '#94a3b8' },
]

/** 평가 영역별 진행률 (시안 ecoAreas) — 클릭 시 해당 영역으로 필터 */
const AREAS = [
  { label: '환경', total: 96, done: 81, pct: '84%', barColor: '#16a34a', pctColor: '#15803d' },
  { label: '노동·인권', total: 84, done: 52, pct: '62%', barColor: '#f59e0b', pctColor: '#b45309' },
  { label: '윤리', total: 62, done: 48, pct: '78%', barColor: '#16a34a', pctColor: '#15803d' },
  { label: '지속가능한 조달', total: 58, done: 30, pct: '51%', barColor: '#ef4444', pctColor: '#b91c1c' },
]

/** 병목 문항 (시안 ecoBlockers) */
const BLOCKERS = [
  { no: 'LAB 3.1', q: '안전보건 교육 실시 기록', tag: '증빙 없음', hint: '자료요청 REQ-142 · 최민호 회신 대기', bg: '#fef2f2', fg: '#b91c1c', bar: '#ef4444' },
  { no: 'SUP 2.1', q: '공급업체 ESG 실사 수행', tag: '증빙 없음', hint: '요청 미생성 · 담당자 지정 필요', bg: '#fef2f2', fg: '#b91c1c', bar: '#ef4444' },
  { no: 'ENV 4.2', q: '폐기물 위탁처리 계약 현황', tag: '기한초과', hint: '자료요청 REQ-137 · 07.22 초과', bg: '#fff7ed', fg: '#c2410c', bar: '#fb923c' },
  { no: 'ETH 3.4', q: '이해상충 관리 절차 운영', tag: '검토 필요', hint: 'AI 초안 신뢰도 54% · 근거 재확인', bg: '#fffbeb', fg: '#b45309', bar: '#f59e0b' },
]

export function EcoSummaryView() {
  const { setQId, setScreen, setTaskId } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [filter, setFilter] = useQaState('ecoFilter', '전체')
  const [page, setPage] = useQaState('ecoPage', 1)
  const [query, setQuery] = useQaState('ecoQuery', '')
  const [area, setArea] = useQaState('ecoArea', '전체')
  const [aside, setAside] = useQaState<'req' | 'block'>('ecoAside', 'req')

  const q0 = query.trim()
  const rows = ecoQuestions
    .filter((q) => filter === '전체' || q.status === filter)
    .filter((q) => area === '전체' || q.cat.includes(area))
    .filter((q) => !q0 || q.no.includes(q0) || q.q.includes(q0) || q.cat.includes(q0))
  const ecoReqs = tasks.filter((t) => t.status !== '완료').slice(0, 4)

  return (
    <div className="flex min-h-0 min-w-[1000px] flex-1">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
        {/* 평가 헤더 — 라운드 · 마감 D-day · 점수 요약 */}
        <div className="flex h-11 flex-none items-center gap-3.5 border-b border-ink-200 px-[18px]">
          <span className="whitespace-nowrap text-label font-extrabold">에코바디스 2026 평가</span>
          <span className="whitespace-nowrap text-[11.2px] text-ink-400">라운드 2 · 제출 마감 2026.08.12</span>
          <span className="whitespace-nowrap rounded-full bg-[#fef2f2] px-[9px] py-0.5 text-[11.2px] font-extrabold text-[#b91c1c]">
            D-18
          </span>
          <div className="flex-1" />
          {SCORES.map((sc) => (
            <div key={sc.label} className="flex items-baseline gap-[5px] whitespace-nowrap">
              <span className="text-[11.2px] text-ink-400">{sc.label}</span>
              <span className="text-[14px] font-extrabold tracking-[-.01em]" style={{ color: sc.color }}>
                {sc.value}
              </span>
              {sc.delta && (
                <span className="text-[10.7px] font-bold" style={{ color: sc.deltaColor }}>
                  {sc.delta}
                </span>
              )}
            </div>
          ))}
        </div>

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

        {/* 평가 영역별 진행 — 클릭 시 해당 영역 문항만 */}
        <div className="flex flex-none items-stretch border-b border-ink-200">
          {AREAS.map((a) => {
            const on = area === a.label
            return (
              <button
                key={a.label}
                onClick={() => setArea(on ? '전체' : a.label)}
                className="block min-w-0 flex-1 border-r border-t-2 border-r-ink-200 px-4 py-[11px] text-left hover:bg-ink-50"
                style={{ background: on ? '#eff6ff' : '#fff', borderTopColor: on ? '#1750d8' : 'transparent' }}
              >
                <span className="mb-[7px] flex items-baseline gap-1.5">
                  <span className="whitespace-nowrap text-sm2 font-bold">{a.label}</span>
                  <span
                    className="ml-auto text-label font-extrabold tracking-[-.01em]"
                    style={{ color: a.pctColor }}
                  >
                    {a.pct}
                  </span>
                </span>
                <span className="mb-1.5 block h-[5px] overflow-hidden rounded-full bg-ink-100">
                  <span className="block h-full" style={{ width: a.pct, background: a.barColor }} />
                </span>
                <span className="block truncate text-[10.7px] text-ink-400">
                  {a.done}/{a.total}문항 · 미처리 {a.total - a.done}건
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex min-h-0 flex-1">
          {/* 질문항 결과 */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-r border-ink-200">
            <div className="flex h-11 flex-none items-center gap-2 border-b border-ink-200 px-[18px]">
              <span className="whitespace-nowrap text-sm2 font-extrabold">질문항 결과</span>
              <span className="whitespace-nowrap text-[11.2px] text-ink-400">
                {rows.length}건 표시{area !== '전체' ? ` · ${area}` : ''}
              </span>
              <div className="flex-1" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="문항번호·키워드 검색"
                className="h-[34px] w-[158px] border-none border-b border-b-ink-300 bg-transparent px-0.5 text-sm2 outline-none"
              />
              {FILTERS.map((f) => {
                const on = filter === f
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="h-[34px] rounded-full border px-2.5 text-xs2 font-bold"
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
            <div className="flex h-11 flex-none items-stretch border-b border-ink-200">
              {([['req', '요청한 자료'], ['block', '병목 문항']] as const).map(([id, label]) => {
                const on = aside === id
                return (
                  <button
                    key={id}
                    onClick={() => setAside(id)}
                    className="flex-1 border-b-2 text-sm2"
                    style={{
                      borderBottomColor: on ? '#1750d8' : 'transparent',
                      color: on ? '#1345bd' : '#64748b',
                      fontWeight: on ? 800 : 600,
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            <div className="flex-1 overflow-auto">
              {aside === 'block' &&
                BLOCKERS.map((b) => (
                  <button
                    key={b.no}
                    onClick={() => { setQId('q4'); setScreen('ecoWork') }}
                    className="block w-full border-b border-l-2 border-ink-100 px-3.5 py-3 text-left hover:bg-ink-50"
                    style={{ borderLeftColor: b.bar, background: '#fff' }}
                  >
                    <span className="mb-[5px] flex items-center gap-1.5">
                      <span className="rounded bg-ink-200 px-2 py-0.5 font-mono text-mini font-extrabold text-ink-600">
                        {b.no}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-mini font-extrabold"
                        style={{ background: b.bg, color: b.fg }}
                      >
                        {b.tag}
                      </span>
                    </span>
                    <span className="block text-sm2 font-bold leading-[1.6]">{b.q}</span>
                    <span className="mt-1 block text-xs2 text-ink-500">{b.hint}</span>
                  </button>
                ))}
              {aside === 'req' && (<>
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
              </>)}
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
