import { Icon } from '@/components/common/icon'
import { useQaState } from '@/lib/qa-state'
import { reqs, reqStatusTone, type ReqStatus } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'
import { useLayoutMetrics } from '@/lib/responsive'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

/**
 * 에코바디스 자료요청 (p59) — 요청 상태 206px | 요청 목록 | 요청 상세 326px 3분할.
 * 문항 근거가 없을 때 담당자에게 보낸 요청의 진행·제출 자료를 확인하고 증빙으로 반영한다.
 */

const STATES: ('전체' | ReqStatus)[] = ['전체', '요청됨', '진행중', '제출됨', '반영완료', '기한초과']
const OWNERS = ['최민호', '김대성', '박지원', '이수진']
const GRID = '88px minmax(180px,1.3fr) 96px 100px 84px 92px'

export function EcoReqView() {
  const { setScreen, setFolder } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const { chatRowMin, contentMin } = useLayoutMetrics()
  const [filter, setFilter] = useQaState<'전체' | ReqStatus>('rqFilter', '전체')
  const [query, setQuery] = useQaState('rqQuery', '')
  const [sel, setSel] = useQaState('rqSel', 'REQ-142')

  const q = query.trim()
  const list = reqs.filter(
    (r) =>
      (filter === '전체' || r.status === filter) &&
      (!q || r.title.includes(q) || r.to.includes(q) || r.no.includes(q) || r.qno.includes(q)),
  )
  const curNo = reqs.some((r) => r.no === sel) ? sel : (list[0]?.no ?? reqs[0].no)
  const cur = reqs.find((r) => r.no === curNo)!
  const curTone = reqStatusTone[cur.status]
  const overdue = reqs.filter((r) => r.status === '기한초과').length

  const meta = [
    { k: '연결 문항', v: cur.qno, color: '#1750d8' },
    { k: '담당자', v: cur.to, color: '#0f172a' },
    { k: '기한', v: cur.due + (cur.overdue ? ' (초과)' : ''), color: cur.overdue ? '#b91c1c' : '#0f172a' },
    { k: '요청자', v: '홍길동 · 성과 리드', color: '#0f172a' },
  ]

  const railLabel = 'text-tiny font-extrabold tracking-[.06em] text-ink-400 whitespace-nowrap'
  const head = 'text-[11.2px] font-extrabold text-ink-400 whitespace-nowrap'

  return (
    <ResizablePanelGroup orientation="horizontal" className="flex min-h-0 flex-1" style={{ minWidth: chatRowMin }}>
      {/* 요청 상태 레일 */}
      <ResizablePanel defaultSize={206} minSize={168} maxSize={340} className="flex flex-col bg-white">
        <div className="flex h-11 flex-none items-center border-b border-ink-200 px-3.5">
          <span className={railLabel}>요청 상태</span>
        </div>
        <div className="flex-1 overflow-auto py-[5px]">
          {STATES.map((label) => {
            const on = filter === label
            const count = label === '전체' ? reqs.length : reqs.filter((r) => r.status === label).length
            const dot = label === '전체' ? '#94a3b8' : reqStatusTone[label].dot
            return (
              <button
                key={label}
                onClick={() => setFilter(label)}
                className="flex w-full items-center gap-2 border-l-2 px-3 py-2 text-left hover:bg-ink-100"
                style={{
                  background: on ? '#eff6ff' : 'transparent',
                  borderLeftColor: on ? '#1750d8' : 'transparent',
                  color: on ? '#1345bd' : '#334155',
                }}
              >
                <span className="size-1.5 flex-none rounded-full" style={{ background: dot }} />
                <span className="flex-1 text-xs2" style={{ fontWeight: on ? 700 : 500 }}>
                  {label}
                </span>
                <span className="text-[11.2px] text-ink-400">{count}</span>
              </button>
            )
          })}
        </div>
        <div className="flex-none border-t border-ink-200 px-3.5 py-3">
          <div className={`${railLabel} mb-2`}>담당자별 미제출</div>
          <div className="flex flex-col gap-[7px]">
            {OWNERS.map((name) => {
              const open = reqs.filter((r) => r.to === name && r.status !== '반영완료').length
              return (
                <button
                  key={name}
                  onClick={() => {
                    setQuery(name)
                    setFilter('전체')
                  }}
                  className="flex items-center gap-2 text-left hover:opacity-70"
                >
                  <span className="flex size-[22px] flex-none items-center justify-center rounded-full border border-ink-200 bg-ink-100 text-[10.7px] font-extrabold text-ink-600">
                    {name[0]}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm2 font-semibold">{name}</span>
                  <span className="text-[11.2px] font-extrabold" style={{ color: open > 1 ? '#b91c1c' : '#475569' }}>
                    {open}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </ResizablePanel>

      {/* 요청 목록 */}
      <ResizableHandle />

      <ResizablePanel minSize={Number(String(contentMin).replace('px', '')) || 280} className="flex flex-col bg-white">
        <div className="flex h-11 flex-none items-center gap-2 border-b border-ink-200 px-[18px]">
          <span className="whitespace-nowrap text-label font-extrabold">자료요청</span>
          <span className="whitespace-nowrap text-[11.2px] text-ink-400">
            {list.length}건 · 기한초과 {overdue}건
          </span>
          <div className="flex-1" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="요청 자료·담당자 검색"
            className="w-[184px] border-none border-b border-b-ink-300 bg-transparent px-0.5 py-[5px] text-sm2 outline-none"
          />
          <button
            onClick={() => openLayer('task-request')}
            className="whitespace-nowrap rounded-md bg-brand px-[11px] py-1.5 text-sm2 font-bold text-white hover:bg-brand-dark"
          >
            + 자료 요청
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="overflow-x-auto">
            <div
              className="sticky top-0 z-[1] grid min-w-[700px] gap-2 border-b border-ink-200 bg-white px-[18px] py-[11px]"
              style={{ gridTemplateColumns: GRID }}
            >
              <span className={head}>요청번호</span>
              <span className={head}>요청 자료</span>
              <span className={head}>연결 문항</span>
              <span className={head}>담당자</span>
              <span className={`${head} text-center`}>기한</span>
              <span className={`${head} text-center`}>상태</span>
            </div>
            {list.map((r) => {
              const tone = reqStatusTone[r.status]
              const on = r.no === curNo
              return (
                <button
                  key={r.no}
                  onClick={() => setSel(r.no)}
                  className="grid w-full min-w-[700px] items-center gap-2 border-b border-ink-100 border-l-2 px-[18px] py-[11px] text-left hover:bg-ink-50"
                  style={{
                    gridTemplateColumns: GRID,
                    background: on ? '#eff6ff' : '#fff',
                    borderLeftColor: on ? '#1750d8' : 'transparent',
                  }}
                >
                  <span className="whitespace-nowrap font-mono text-[10.7px] font-extrabold text-ink-600">{r.no}</span>
                  <span className="min-w-0 truncate text-xs2 font-semibold">{r.title}</span>
                  <span className="whitespace-nowrap text-[11.2px] font-bold text-brand">{r.qno}</span>
                  <span className="whitespace-nowrap text-sm2 text-ink-700">{r.to}</span>
                  <span
                    className="whitespace-nowrap text-center text-[11.6px] font-semibold"
                    style={{ color: r.overdue ? '#b91c1c' : '#64748b' }}
                  >
                    {r.due}
                  </span>
                  <span className="text-center">
                    <span
                      className="whitespace-nowrap rounded-full px-2 py-0.5 text-[10.2px] font-extrabold"
                      style={{ background: tone.bg, color: tone.fg }}
                    >
                      {r.status}
                    </span>
                  </span>
                </button>
              )
            })}
            {!list.length && (
              <div className="py-14 text-center text-sm2 text-ink-400">조건에 맞는 요청이 없습니다</div>
            )}
          </div>
        </div>
      </ResizablePanel>

      {/* 요청 상세 */}
      <ResizableHandle />

      <ResizablePanel defaultSize={326} minSize={260} maxSize={520} className="flex flex-col overflow-auto bg-white">
        <div className="flex h-11 flex-none items-center gap-2 border-b border-ink-200 px-4">
          <span className="whitespace-nowrap text-xs2 font-extrabold">{cur.no}</span>
          <span
            className="whitespace-nowrap rounded-full px-2 py-0.5 text-[10.2px] font-extrabold"
            style={{ background: curTone.bg, color: curTone.fg }}
          >
            {cur.status}
          </span>
        </div>

        <div className="border-b border-ink-200 px-4 py-3.5">
          <div className="mb-2 text-[14px] font-extrabold leading-[1.5]">{cur.title}</div>
          <div className="flex flex-col gap-[7px]">
            {meta.map((m) => (
              <div key={m.k} className="flex items-center gap-2">
                <span className="w-[74px] flex-none whitespace-nowrap text-[11.2px] text-ink-400">{m.k}</span>
                <span className="min-w-0 flex-1 text-sm2 font-semibold" style={{ color: m.color }}>
                  {m.v}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-ink-200 px-4 py-[13px]">
          <div className={`${railLabel} mb-2`}>요청 사유 · 평가기관 요구</div>
          <div className="text-sm2 leading-[1.7] text-ink-700">{cur.reason}</div>
        </div>

        <div className="border-b border-ink-200 px-4 py-[13px]">
          <div className="mb-[9px] flex items-center gap-[7px]">
            <span className={railLabel}>제출된 자료</span>
            <span className="ml-auto whitespace-nowrap text-[11.2px] text-ink-400">{cur.files.length}건</span>
          </div>
          {cur.files.length ? (
            <div className="flex flex-col gap-[7px]">
              {cur.files.map((f) => (
                <button
                  key={f.name}
                  onClick={() => {
                    setFolder('f5')
                    setScreen('store')
                  }}
                  className="flex w-full items-center gap-[9px] border-l-2 border-ink-300 px-2.5 py-[7px] text-left hover:bg-ink-50"
                >
                  <Icon name="description" size={18} className="text-ink-500" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm2 font-semibold">{f.name}</span>
                    <span className="mt-1 block text-[10.7px] text-ink-400">
                      {f.who} · {f.time} · {f.size}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l-2 border-[#fbbf24] bg-warn-soft px-2.5 py-[9px]">
              <Icon name="pending" size={18} className="text-warn-dark" />
              <span className="text-[11.6px] leading-[1.6] text-warn-dark">
                아직 제출된 자료가 없습니다. 담당자에게 알림을 보내세요.
              </span>
            </div>
          )}
        </div>

        <div className="border-b border-ink-200 px-4 py-[13px]">
          <div className={`${railLabel} mb-2.5`}>진행 이력</div>
          <div className="flex flex-col gap-[11px]">
            {cur.history.map((h, i) => (
              <div key={i} className="flex gap-[9px]">
                <span className="mt-1.5 size-[7px] flex-none rounded-full" style={{ background: h.dot }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="whitespace-nowrap text-[11.6px] font-bold">{h.who}</span>
                    <span className="whitespace-nowrap text-[10.2px] text-ink-400">{h.time}</span>
                  </div>
                  <div className="mt-1 text-[11.6px] leading-[1.7] text-ink-700">{h.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-none flex-col gap-[7px] border-t border-ink-200 bg-ink-50 px-4 py-3">
          <div className="flex gap-[7px]">
            <button
              onClick={() => openLayer('task-alert')}
              className="flex-1 whitespace-nowrap rounded-[7px] border border-ink-300 bg-white py-2 text-sm2 font-bold text-ink-700 hover:bg-ink-100"
            >
              알림 보내기
            </button>
            <button
              onClick={() => setScreen('chat')}
              className="flex-1 whitespace-nowrap rounded-[7px] border border-ink-300 bg-white py-2 text-sm2 font-bold text-ink-700 hover:bg-ink-100"
            >
              대화로 확인
            </button>
          </div>
          <button
            onClick={() => (cur.files.length ? setScreen('ecoDocs') : openLayer('task-request'))}
            className="w-full whitespace-nowrap rounded-[7px] bg-brand py-[9px] text-xs2 font-bold text-white hover:bg-brand-dark"
          >
            {cur.files.length ? '증빙으로 반영하고 요청 종료' : '담당자에게 재요청'}
          </button>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
