/**
 * ⚠️ 검수 전용 — 클라이언트 검수가 끝나면 삭제합니다.
 *    제거 명령: npm run remove-qa   (미리보기: npm run remove-qa -- --dry)
 */
import { Icon } from '@/components/common/icon'
import { useQaState } from '@/lib/qa-state'
import { useOpenIdxItem } from '@/lib/qa-open'
import { IDX_ALL, IDX_GROUPS, type IdxKind, type IdxState } from './index-data'

/**
 * 작업 목록 · 검수 인덱스 — 시안(dc.html)의 116항목을 그대로 옮긴 화면.
 * "열기"를 누르면 해당 화면·레이어가 그 상태 그대로 열린다(페이지 이동 없음).
 * ⚠️ 납품 시 제거 대상.
 */

const KIND_TONE: Record<IdxKind, { bg: string; fg: string }> = {
  화면: { bg: '#eff6ff', fg: '#1d4ed8' },
  모달: { bg: '#f5f3ff', fg: '#6d28d9' },
  시트: { bg: '#fff7ed', fg: '#c2410c' },
  드롭다운: { bg: '#f1f5f9', fg: '#475569' },
  오버레이: { bg: '#ecfdf3', fg: '#15803d' },
  패널: { bg: '#f1f5f9', fg: '#475569' },
}

const STATE_TONE: Record<IdxState, { bg: string; fg: string }> = {
  완료: { bg: '#ecfdf3', fg: '#15803d' },
  부분: { bg: '#fffbeb', fg: '#b45309' },
  '범위 외': { bg: '#f1f5f9', fg: '#64748b' },
}

const FILTERS: ('전체' | IdxKind)[] = ['전체', '화면', '모달', '시트', '드롭다운', '패널', '오버레이']

export function IndexView() {
  const [filter, setFilter] = useQaState<'전체' | IdxKind>('idxFilter', '전체')
  const openItem = useOpenIdxItem()

  const stats = [
    { label: '전체 항목', count: IDX_ALL.length, color: '#0f172a' },
    { label: '완료', count: IDX_ALL.filter((i) => i.state === '완료').length, color: '#15803d' },
    { label: '부분', count: IDX_ALL.filter((i) => i.state === '부분').length, color: '#b45309' },
    { label: '범위 외', count: IDX_ALL.filter((i) => i.state === '범위 외').length, color: '#64748b' },
  ]

  return (
    <div className="min-w-[760px] flex-1 overflow-auto bg-ink-50">
      <div className="mx-auto max-w-[1180px] px-5 pb-8 pt-[18px]">
        <div className="flex items-start gap-4">
          <div>
            <h1 className="text-[17.9px] font-extrabold tracking-[-.02em]">작업 목록 · 검수 인덱스</h1>
            <p className="mt-1.5 text-sm2 text-ink-500">
              스토리보드 63p 대비 제작 현황입니다. <b className="font-bold text-ink-900">열기</b>를 누르면 해당 화면·모달·시트가
              그 상태 그대로 열립니다 (페이지 이동 없음).
            </p>
            {/* 검수 완료 후 제거 대상임을 화면에서도 알린다 */}
            <p className="mt-2 flex items-center gap-1.5 text-sm2 text-ink-400">
              <Icon name="schedule" size={15} />
              이 화면과 우하단 검수 바는 <b className="font-bold text-ink-600">검수용 임시 도구</b>로, 검수 완료 후
              <code className="mx-1 rounded bg-ink-100 px-1.5 py-px font-mono text-tiny text-ink-700">npm run remove-qa</code>
              로 삭제됩니다.
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            {stats.map((k) => (
              <div key={k.label} className="rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-center">
                <div className="text-3xl2 font-extrabold" style={{ color: k.color }}>
                  {k.count}
                </div>
                <div className="mt-0.5 whitespace-nowrap text-tiny text-ink-400">{k.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const on = filter === f
            const count = f === '전체' ? IDX_ALL.length : IDX_ALL.filter((i) => i.kind === f).length
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="rounded-full border px-3 py-1.5 text-sm2 font-bold"
                style={{
                  background: on ? '#1750d8' : '#fff',
                  borderColor: on ? '#1750d8' : '#cbd5e1',
                  color: on ? '#fff' : '#334155',
                }}
              >
                {f} <span className={on ? 'text-white/75' : 'text-ink-400'}>{count}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-5 space-y-5">
          {IDX_GROUPS.map((g) => {
            const items = g.items.filter((i) => filter === '전체' || i.kind === filter)
            if (!items.length) return null
            return (
              <section key={g.g} className="overflow-hidden rounded-xl border border-ink-200 bg-white">
                <div className="flex items-center gap-2 border-b border-ink-200 bg-ink-50 px-4 py-2.5">
                  <Icon name={g.icon} size={17} className="text-brand" />
                  <span className="text-label font-extrabold">{g.g}</span>
                  <span className="text-xs2 text-ink-400">{items.length}항목</span>
                </div>
                {items.map((it) => {
                  const kind = KIND_TONE[it.kind]
                  const state = STATE_TONE[it.state]
                  return (
                    <div
                      key={`${g.g}-${it.name}`}
                      className="flex items-center gap-3 border-b border-ink-100 px-4 py-2.5 last:border-b-0 hover:bg-ink-50"
                    >
                      <span className="w-9 flex-none rounded bg-ink-100 py-0.5 text-center font-mono text-tiny font-bold text-ink-500">
                        {it.page}
                      </span>
                      <span className="w-[210px] flex-none truncate text-label font-bold">{it.name}</span>
                      <span
                        className="w-[62px] flex-none rounded-full py-0.5 text-center text-mini font-extrabold"
                        style={{ background: kind.bg, color: kind.fg }}
                      >
                        {it.kind}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm2 text-ink-500">{it.desc}</span>
                      <span
                        className="flex-none whitespace-nowrap rounded-full px-2 py-0.5 text-mini font-extrabold"
                        style={{ background: state.bg, color: state.fg }}
                      >
                        {it.state}
                      </span>
                      <button
                        onClick={() => openItem(it)}
                        disabled={!it.st}
                        className="flex-none rounded-md bg-brand px-3 py-1.5 text-xs2 font-bold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-400"
                      >
                        열기
                      </button>
                    </div>
                  )
                })}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
