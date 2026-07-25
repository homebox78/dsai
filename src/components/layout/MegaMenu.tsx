import { createPortal } from 'react-dom'
import { Icon } from '@/components/common/icon'
import { ICON, ctx, tasks, taskStatusTone, wsTree } from '@/mocks/data'
import { useAppStore, type ScreenKey } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/**
 * 전체 메뉴 오버레이 (p60) — 화면 전체를 덮는 메가메뉴.
 * 메뉴를 찾아 들어가는 게 아니라 현재 현황과 할 일을 한 화면에서 바로 찾는다.
 */

const COLUMNS: { title: string; items: { label: string; icon: string; screen?: ScreenKey; badge?: number }[] }[] = [
  {
    title: '프로젝트',
    items: [
      { label: '대시보드', icon: ICON.dash, screen: 'dash' },
      { label: '멤버', icon: ICON.user, screen: 'members' },
      { label: '작업 목록', icon: 'fact_check', screen: 'index' },
    ],
  },
  {
    title: '협업공간',
    items: [
      { label: 'ESG 전략 TF', icon: ICON.chat, screen: 'chat', badge: 3 },
      { label: '김대성', icon: ICON.chat, screen: 'chat' },
      { label: '최민호', icon: ICON.chat, screen: 'chat', badge: 1 },
      { label: '업무 관리', icon: ICON.task, screen: 'task', badge: 2 },
    ],
  },
  {
    title: '문서',
    items: [
      { label: '문서 저장소', icon: ICON.folder, screen: 'store' },
      { label: '문서 작성', icon: ICON.doc, screen: 'store' },
    ],
  },
  {
    title: '에코바디스',
    items: [
      { label: '요약', icon: ICON.chart, screen: 'ecoSum' },
      { label: '문항', icon: ICON.list, screen: 'ecoWork', badge: 300 },
      { label: '증빙자료', icon: ICON.shield, screen: 'ecoDocs' },
      { label: '자료요청', icon: ICON.inbox, screen: 'ecoReq', badge: 2 },
    ],
  },
]

export function MegaMenu() {
  const { overlay, setOverlay, setScreen, setTaskId } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  if (!overlay) return null

  const myOpen = tasks.filter((t) => t.to === '나' && t.status !== '완료' && t.status !== '반려')

  return createPortal(
    <div className="anim-fade fixed inset-0 z-[85] flex flex-col bg-white">
      <div className="flex h-[52px] flex-none items-center gap-3 border-b border-ink-200 px-5">
        <img src="/amber-logo.png" alt="Amber" className="h-[22px] w-auto" />
        <span className="text-body font-extrabold">전체 메뉴</span>
        <span className="text-xs2 text-ink-400">
          {ctx.org} · {ctx.ws} · {ctx.proj}
        </span>
        <div className="flex-1" />
        <button
          onClick={() => setOverlay(false)}
          className="flex items-center gap-1 rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-sm2 font-bold text-ink-700 hover:bg-ink-100"
        >
          <Icon name="close" size={17} />
          닫기
        </button>
      </div>

      <div className="flex min-h-0 flex-1 overflow-auto">
        {/* 메뉴 컬럼 */}
        <div className="min-w-0 flex-1 px-8 py-7">
          <div className="grid grid-cols-4 gap-7">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <div className="mb-2.5 border-b border-ink-200 pb-2 text-tiny font-extrabold tracking-[.07em] text-ink-400">
                  {c.title}
                </div>
                <div className="flex flex-col gap-0.5">
                  {c.items.map((it) => (
                    <button
                      key={it.label}
                      onClick={() => it.screen && setScreen(it.screen)}
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-ink-100"
                    >
                      <Icon name={it.icon} size={18} className="text-ink-500" />
                      <span className="min-w-0 flex-1 truncate text-label font-semibold">{it.label}</span>
                      {!!it.badge && (
                        <span className="flex-none rounded-full border border-ink-200 bg-white px-2 py-0.5 text-tiny font-extrabold text-ink-600">
                          {it.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 조직&사업부 전환 */}
          <div className="mt-8">
            <div className="mb-2.5 border-b border-ink-200 pb-2 text-tiny font-extrabold tracking-[.07em] text-ink-400">
              조직&amp;사업부 · 프로젝트 전환
            </div>
            <div className="grid grid-cols-2 gap-3">
              {wsTree.map((w) => (
                <div key={w.id} className="rounded-lg border border-ink-200 p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 flex-none items-center justify-center rounded-md border border-brand-border bg-brand-soft text-xs2 font-extrabold text-brand-dark">
                      {w.initial}
                    </span>
                    <span className="text-label font-extrabold">{w.name}</span>
                    <span className="ml-auto text-tiny text-ink-400">
                      {w.role} · {w.meta}
                    </span>
                  </div>
                  <div className="mt-2.5 flex flex-col gap-1">
                    {w.projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setScreen('dash')}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-ink-100"
                      >
                        <span className="min-w-0 flex-1 truncate text-sm2 font-semibold">{p.name}</span>
                        <span className="text-tiny text-ink-400">
                          {p.members}명 · {p.files}건
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 내가 해야 할 일 */}
        <aside className="w-[340px] flex-none border-l border-ink-200 bg-ink-50 px-5 py-7">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-label font-extrabold">내가 해야 할 일</span>
            <span className="rounded-full bg-bad-soft px-2 py-0.5 text-xs2 font-bold text-bad-dark">
              {myOpen.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {myOpen.map((t) => {
              const tone = taskStatusTone[t.status]
              return (
                <button
                  key={t.id}
                  onClick={() => { setTaskId(t.id); setScreen('task') }}
                  className="block rounded-lg border border-l-2 border-ink-200 bg-white px-3.5 py-3 text-left hover:border-brand-fade"
                  style={{ borderLeftColor: tone.bar }}
                >
                  <span className="mb-1 flex items-center gap-1.5">
                    <span
                      className="rounded-full px-2 py-0.5 text-mini font-extrabold"
                      style={{ background: tone.bg, color: tone.fg }}
                    >
                      {t.status}
                    </span>
                    <span className="ml-auto text-tiny text-ink-400">~{t.due}</span>
                  </span>
                  <span className="block text-label font-bold leading-[1.6]">{t.title}</span>
                  <span className="mt-1 block text-xs2 text-ink-500">
                    {t.from} · {t.room}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 rounded-lg border border-ink-200 bg-white p-3.5">
            <div className="mb-2 text-sm2 font-extrabold">에코바디스 제출까지</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl2 font-extrabold text-bad-dark">D-18</span>
              <span className="text-xs2 text-ink-500">답변 214 / 300문항</span>
            </div>
            <button
              onClick={() => setScreen('ecoWork')}
              className="mt-2.5 w-full rounded-md bg-brand py-2 text-sm2 font-bold text-white hover:bg-brand-dark"
            >
              처리부로 이동
            </button>
          </div>

          <button
            onClick={() => openLayer('task-request')}
            className="mt-3 w-full rounded-md border border-ink-300 bg-white py-2 text-sm2 font-bold text-ink-700 hover:bg-ink-100"
          >
            + 업무 요청 만들기
          </button>
        </aside>
      </div>
    </div>,
    document.body,
  )
}
