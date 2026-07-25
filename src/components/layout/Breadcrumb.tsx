import { Icon } from '@/components/common/icon'
import { ctx, folders, findFile } from '@/mocks/data'
import { useAppStore, type ScreenKey } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/** 경로 breadcrumb (p8) — 시안 실측: height 42 / bg #fff / border-bottom #e2e8f0 / padding 0 16 */

const SCREEN_NAMES: Record<ScreenKey, string> = {
  index: '작업 목록',
  dash: '대시보드',
  members: '멤버',
  store: '문서 저장소',
  chat: '채팅',
  task: '업무 관리',
  ecoSum: '에코바디스 요약',
  ecoWork: '에코바디스 문항',
  ecoDocs: '증빙자료',
  ecoReq: '자료요청',
}

export function Breadcrumb() {
  const { screen, folder, fileId, storeMode, setDropdown, setScreen, setOverlay } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)

  const crumbs: { label: string; onClick?: () => void }[] = [
    { label: ctx.org, onClick: () => setDropdown('wsPopOpen', true) },
    { label: ctx.ws, onClick: () => setDropdown('wsPopOpen', true) },
    { label: ctx.proj, onClick: () => setDropdown('wsPopOpen', true) },
    { label: SCREEN_NAMES[screen] },
  ]
  if (screen === 'store') {
    crumbs.push({ label: folders.find((f) => f.id === folder)?.name ?? '' })
    if (storeMode !== 'list' && fileId) crumbs.push({ label: findFile(fileId)?.name ?? '' })
  }

  const badges =
    screen === 'store'
      ? [{ label: `RAG 색인 ${folders.find((f) => f.id === folder)?.count ?? 0}건`, bg: '#ecfdf3', fg: '#15803d', bd: '#bbf7d0' }]
      : screen === 'ecoWork' || screen === 'ecoSum'
        ? [{ label: 'OCR 300문항', bg: '#f0fdf4', fg: '#15803d', bd: '#bbf7d0' }]
        : []

  const actions = [
    { label: '작업 목록', onClick: () => setScreen('index') },
    { label: '전체 메뉴', onClick: () => setOverlay(true) },
    { label: '설정', onClick: () => openLayer('settings') },
  ]

  return (
    <div className="flex h-crumb flex-none items-center gap-2 overflow-hidden whitespace-nowrap border-b border-ink-200 bg-white px-4">
      {crumbs.map((c, i) => (
        <div key={`${c.label}-${i}`} className="flex items-center gap-2">
          <button
            onClick={c.onClick}
            className={`text-label hover:text-brand-link ${
              i === crumbs.length - 1 ? 'font-bold text-ink-900' : 'font-medium text-ink-500'
            }`}
          >
            {c.label}
          </button>
          {i < crumbs.length - 1 && <Icon name="chevron_right" size={15} className="text-ink-300" />}
        </div>
      ))}

      {badges.map((b) => (
        <span
          key={b.label}
          className="rounded-full border px-[9px] py-[2.5px] text-xs2 font-bold"
          style={{ background: b.bg, color: b.fg, borderColor: b.bd }}
        >
          {b.label}
        </span>
      ))}

      <div className="flex-1" />

      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.onClick}
          className="flex-none whitespace-nowrap rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-label font-semibold text-ink-700 hover:bg-ink-100"
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}
