import { useQaState } from '@/lib/qa-state'
import { RatioBarChart } from '@/components/common/RatioBarChart'
import { useLayerStore } from '@/stores/layer-store'
import { useAppStore } from '@/stores/app-store'
import { useLayoutMetrics } from '@/lib/responsive'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

/** 에코바디스 증빙자료 — 문항 ↔ 문서 ↔ 페이지 매핑 + 커버리지 패널 */

/** 시안 EV — 문항 ↔ 문서 ↔ 인용 페이지 매핑 9건 */
interface EvRow {
  no: string
  cat: string
  q: string
  file: string | null
  ext: string
  fileId: string | null
  page: string
  state: EvState
  expire: string
  exp: 'ok' | 'soon' | 'none'
}

type EvState = '검증완료' | '검토대기' | '만료임박' | '미연결'

const EV: EvRow[] = [
  { no: 'ENV 1.1', cat: '환경', q: '환경 정책 문서 보유 여부', file: '환경정책 선언문_국문영문.pdf', ext: 'PDF', fileId: 'a4', page: 'p.1~4', state: '검증완료', expire: '2027.06', exp: 'ok' },
  { no: 'ENV 2.4', cat: '환경', q: '온실가스 배출량 모니터링 체계', file: '온실가스 배출량 보고서_2025.pdf', ext: 'PDF', fileId: 'a2', page: 'p.12~31', state: '검증완료', expire: '2027.03', exp: 'ok' },
  { no: 'ENV 3.2', cat: '환경', q: '환경경영시스템 인증 현황', file: 'ISO 14001 인증서_2026.pdf', ext: 'PDF', fileId: 'a1', page: 'p.1', state: '만료임박', expire: '2026.09', exp: 'soon' },
  { no: 'LAB 1.2', cat: '노동·인권', q: '아동·강제노동 금지 정책', file: '윤리경영 행동강령_v2.pdf', ext: 'PDF', fileId: 'b1', page: 'p.12~14', state: '검토대기', expire: '2028.01', exp: 'ok' },
  { no: 'LAB 3.1', cat: '노동·인권', q: '안전보건 교육 실시 기록', file: null, ext: '', fileId: null, page: '-', state: '미연결', expire: '-', exp: 'none' },
  { no: 'ETH 1.1', cat: '윤리', q: '부패 방지 정책 및 배포', file: '윤리경영 행동강령_v2.pdf', ext: 'PDF', fileId: 'b1', page: 'p.4~7', state: '검증완료', expire: '2028.01', exp: 'ok' },
  { no: 'ETH 2.2', cat: '윤리', q: '내부 신고채널 운영 현황', file: '고충처리 및 신고채널 운영보고.docx', ext: 'DOCX', fileId: 'b3', page: 'p.3~9', state: '검토대기', expire: '2027.07', exp: 'ok' },
  { no: 'SUP 1.3', cat: '지속가능한 조달', q: '공급업체 행동강령 서명 확보', file: '공급업체 행동강령_서명본.pdf', ext: 'PDF', fileId: 'c2', page: 'p.2~28', state: '검증완료', expire: '2027.12', exp: 'ok' },
  { no: 'SUP 2.1', cat: '지속가능한 조달', q: '공급업체 ESG 실사 수행', file: null, ext: '', fileId: null, page: '-', state: '미연결', expire: '-', exp: 'none' },
]

const EVST: Record<EvState, { bg: string; fg: string; bar: string; dot: string }> = {
  검증완료: { bg: '#f0fdf4', fg: '#15803d', bar: '#16a34a', dot: '#16a34a' },
  검토대기: { bg: '#fef3c7', fg: '#92400e', bar: '#f59e0b', dot: '#f59e0b' },
  만료임박: { bg: '#fff7ed', fg: '#c2410c', bar: '#fb923c', dot: '#fb923c' },
  미연결: { bg: '#fef2f2', fg: '#b91c1c', bar: '#ef4444', dot: '#ef4444' },
}

const CAT_LABELS = ['전체', '환경', '노동·인권', '윤리', '지속가능한 조달']
const STATE_LABELS: ('전체' | EvState)[] = ['전체', '검증완료', '검토대기', '만료임박', '미연결']

const COVERAGE = [
  { label: '검증완료 증빙', count: 198, w: '66%', color: '#16a34a' },
  { label: '검토대기', count: 48, w: '16%', color: '#f59e0b' },
  { label: '미연결', count: 54, w: '18%', color: '#fecaca' },
]

const ALERTS: { tag: string; count: number; text: string; bg: string; bd: string; fg: string; to: '전체' | EvState }[] = [
  { tag: '유효기한 임박', count: 6, text: '90일 내 만료되는 인증서·허가증이 있습니다. 갱신본으로 교체하세요.', bg: '#fff7ed', bd: '#fed7aa', fg: '#c2410c', to: '만료임박' },
  { tag: '증빙 미연결', count: 54, text: '문항에 연결된 문서가 없습니다. 담당자에게 자료 요청을 보내세요.', bg: '#fef2f2', bd: '#fecaca', fg: '#b91c1c', to: '미연결' },
  { tag: '중복 참조', count: 3, text: '동일 문서가 5개 이상 문항에 인용되어 있습니다. 적정성 검토가 필요합니다.', bg: '#f8fafc', bd: '#e2e8f0', fg: '#475569', to: '전체' },
]

export function EcoDocsView() {
  const openLayer = useLayerStore((s) => s.open)
  const { setScreen, setFolder, openFile } = useAppStore()
  const [cat, setCat] = useQaState('evCat', '전체')
  const [state, setState] = useQaState('evState', '전체')
  const [query, setQuery] = useQaState('ecoQuery', '')
  const { chatRowMin, contentMin } = useLayoutMetrics()

  const q = query.trim()
  const rows = EV.filter((r) => (cat === '전체' || r.cat === cat) && (state === '전체' || r.state === state)).filter(
    (r) => !q || r.no.includes(q) || (r.file ?? '').includes(q) || r.q.includes(q),
  )

  return (
    <ResizablePanelGroup orientation="horizontal" className="flex min-h-0 flex-1" style={{ minWidth: chatRowMin }}>
      {/* 평가 영역 */}
      <ResizablePanel defaultSize={206} minSize={168} maxSize={340} className="flex flex-col bg-white">
        <div className="flex h-10 flex-none items-center border-b border-ink-200 px-3.5">
          <span className="whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">평가 영역</span>
        </div>
        <div className="flex-1 overflow-auto py-[5px]">
          {CAT_LABELS.map((label) => {
            const count = label === '전체' ? EV.length : EV.filter((e) => e.cat === label).length
            const on = cat === label
            return (
              <button
                key={label}
                onClick={() => setCat(label)}
                className="flex w-full items-center gap-2 border-l-2 px-3 py-2 text-left hover:bg-ink-100"
                style={{
                  background: on ? '#eff6ff' : 'transparent',
                  borderLeftColor: on ? '#2563eb' : 'transparent',
                  color: on ? '#1d4ed8' : '#334155',
                }}
              >
                <span className="flex-1 text-xs2" style={{ fontWeight: on ? 700 : 500 }}>
                  {label}
                </span>
                <span className="text-[11.2px] text-ink-400">{count}</span>
              </button>
            )
          })}
        </div>
        <div className="flex-none border-t border-ink-200 px-3.5 py-3">
          <div className="mb-[7px] whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">
            검증 상태
          </div>
          <div className="flex flex-col gap-1">
            {STATE_LABELS.map((label) => {
              const count = label === '전체' ? EV.length : EV.filter((e) => e.state === label).length
              const dot = label === '전체' ? '#94a3b8' : EVST[label].dot
              const on = state === label
              return (
                <button
                  key={label}
                  onClick={() => setState(label)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-ink-100"
                  style={{ background: on ? '#eff6ff' : 'transparent' }}
                >
                  <span className="size-1.5 flex-none rounded-full" style={{ background: dot }} />
                  <span
                    className="flex-1 text-sm2"
                    style={{ fontWeight: on ? 700 : 500, color: on ? '#1d4ed8' : '#334155' }}
                  >
                    {label}
                  </span>
                  <span className="text-tiny text-ink-400">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </ResizablePanel>

      {/* 매핑 테이블 */}
      <ResizableHandle />

      <ResizablePanel minSize={Number(String(contentMin).replace('px', '')) || 280} className="flex flex-col bg-ink-50">
        <div className="flex flex-none items-center gap-2 border-b border-ink-200 bg-white px-3.5 py-3">
          <div>
            <div className="text-[15px] font-extrabold tracking-[-.01em]">증빙자료 매핑</div>
            <div className="mt-1 text-cap text-ink-500">문항 ↔ 문서 ↔ 페이지 연결 상태 · 총 {rows.length}건</div>
          </div>
          <div className="flex-1" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="문항번호·파일명 검색"
            className="h-[34px] w-[200px] rounded-md border border-ink-300 bg-ink-50 px-2.5 text-sm2 outline-none"
          />
          <button
            onClick={() => openLayer('file-upload')}
            className="h-[34px] rounded-md border border-ink-300 bg-white px-2.5 text-sm2 font-semibold text-ink-700 hover:bg-ink-100"
          >
            증빙 업로드
          </button>
          <button
            onClick={() => openLayer('eco-export')}
            className="h-[34px] rounded-md bg-brand px-2.5 text-sm2 font-bold text-white hover:bg-brand-dark"
          >
            증빙 팩 내보내기
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-white">
          <div className="overflow-x-auto">
            <div className="sticky top-0 z-[1] grid min-w-[720px] grid-cols-[82px_minmax(180px,1fr)_minmax(180px,1.1fr)_76px_92px_84px] gap-2 border-b border-ink-200 bg-white px-[18px] py-[11px] text-xs2 font-extrabold text-ink-400">
              <span className="whitespace-nowrap text-center">문항</span>
              <span className="whitespace-nowrap text-center">질문 요약</span>
              <span className="whitespace-nowrap text-center">연결된 증빙 문서</span>
              <span className="whitespace-nowrap text-center">페이지</span>
              <span className="whitespace-nowrap text-center">검증</span>
              <span className="whitespace-nowrap text-center">유효기한</span>
            </div>
            {rows.map((r) => (
              <button
                key={r.no}
                onClick={() => {
                  if (r.fileId) {
                    setFolder('f2')
                    openFile(r.fileId)
                    setScreen('store')
                    openLayer('viewer')
                  } else {
                    openLayer('task-request')
                  }
                }}
                className="grid w-full min-w-[720px] grid-cols-[82px_minmax(180px,1fr)_minmax(180px,1.1fr)_76px_92px_84px] items-center gap-2 border-b border-l-2 border-ink-100 bg-white px-[18px] py-2.5 text-left hover:bg-ink-50"
                style={{ borderLeftColor: EVST[r.state].bar }}
              >
                <span className="flex justify-center">
                  <span className="whitespace-nowrap rounded bg-ink-200 px-2 py-0.5 font-mono text-tiny font-extrabold text-ink-600">
                    {r.no}
                  </span>
                </span>
                <span className="min-w-0 truncate text-label font-semibold">{r.q}</span>
                <span className="min-w-0">
                  {r.file ? (
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="flex size-[22px] flex-none items-center justify-center rounded-[5px] bg-ink-100 font-mono text-[7.3px] font-extrabold text-ink-600">
                        {r.ext}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm2 font-semibold">{r.file}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm2 font-bold text-warn-dark">미연결</span>
                      <span className="text-xs2 font-bold text-brand-link underline">자료 요청</span>
                    </span>
                  )}
                </span>
                <span className="text-center text-cap font-bold text-brand-link">{r.page}</span>
                <span className="flex justify-center">
                  <span
                    className="whitespace-nowrap rounded-full px-2 py-0.5 text-mini font-extrabold"
                    style={{ background: EVST[r.state].bg, color: EVST[r.state].fg }}
                  >
                    {r.state}
                  </span>
                </span>
                <span
                  className="whitespace-nowrap text-center text-cap font-semibold"
                  style={{ color: r.exp === 'soon' ? '#c2410c' : r.exp === 'none' ? '#94a3b8' : '#64748b' }}
                >
                  {r.expire}
                </span>
              </button>
            ))}
          </div>
        </div>
      </ResizablePanel>

      {/* 커버리지 */}
      <ResizableHandle />

      <ResizablePanel defaultSize={290} minSize={232} maxSize={460} className="flex flex-col overflow-auto bg-white">
        <div className="flex-none border-b border-ink-200 px-3.5 py-3">
          <div className="text-sm2 font-extrabold">증빙 커버리지</div>
          <div className="mt-1 text-xs2 text-ink-400">문항 대비 증빙 연결률</div>
        </div>
        <div className="p-3.5">
          <div className="mb-[9px] flex items-baseline gap-1.5">
            <span className="text-[25.7px] font-extrabold tracking-[-.02em] text-ok-dark">82</span>
            <span className="text-sm2 text-ink-500">% · 246 / 300문항</span>
          </div>
          <div className="mb-[11px]">
            <RatioBarChart slices={COVERAGE.map((c) => ({ label: c.label, count: c.count, color: c.color, pct: c.w }))} height={9} />
          </div>
          <div className="mb-4 flex flex-col gap-1.5">
            {COVERAGE.map((c) => (
              <div key={c.label} className="flex items-center gap-2">
                <span className="size-[7px] flex-none rounded-sm" style={{ background: c.color }} />
                <span className="flex-1 text-cap text-ink-500">{c.label}</span>
                <span className="text-sm2 font-bold">{c.count}</span>
              </div>
            ))}
          </div>
          <div className="mb-2 whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">확인 필요</div>
          <div className="flex flex-col gap-2">
            {ALERTS.map((a) => (
              <button
                key={a.tag}
                onClick={() => setState(a.to)}
                className="block rounded-lg border p-[11px] text-left hover:border-brand-fade"
                style={{ background: a.bg, borderColor: a.bd }}
              >
                <span className="mb-[3px] flex items-center gap-1.5">
                  <span className="text-mini font-extrabold" style={{ color: a.fg }}>
                    {a.tag}
                  </span>
                  <span className="ml-auto text-tiny font-extrabold" style={{ color: a.fg }}>
                    {a.count}건
                  </span>
                </span>
                <span className="block text-cap leading-[1.7] text-ink-700">{a.text}</span>
              </button>
            ))}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
