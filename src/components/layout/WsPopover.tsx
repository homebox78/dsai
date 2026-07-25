import { useQaState } from '@/lib/qa-state'
import { Icon } from '@/components/common/icon'
import { ctx, wsTree } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/** 조직&사업부 · 프로젝트 전환 팝오버 (p28~34) — 시안 실측: w 344 / radius 12 */
export function WsPopover() {
  const { closeDropdowns } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [expanded, setExpanded] = useQaState('wsExpanded', 'w1')
  const [query, setQuery] = useQaState('projQuery', '')

  const chips = [`멤버 ${ctx.projMembers}명`, `${ctx.wsChannels} channels`, `${ctx.wsStores} stores`, `${ctx.wsFiles} files`]

  return (
    <div className="fixed inset-0 z-[70]" onClick={closeDropdowns}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="anim-pop absolute left-[236px] top-[104px] flex max-h-[calc(100vh-140px)] w-[344px] flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-[0_20px_48px_rgba(15,23,42,.18)]"
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* 현재 조직&사업부 */}
          <div className="flex-none border-b border-ink-200 px-3.5 pb-3 pt-[13px]">
            <div className="mb-[9px] whitespace-nowrap text-mini font-extrabold tracking-[.06em] text-ink-400">
              현재 조직&amp;사업부
            </div>
            <div className="flex items-center gap-2">
              <span className="flex size-9 flex-none items-center justify-center rounded-[10px] bg-brand text-lg2 font-extrabold text-white">
                {ctx.wsInitial}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="truncate text-base2 font-extrabold">{ctx.ws}</span>
                  <Icon name="verified" size={16} className="text-brand" title="인증된 조직" />
                  <Icon name="error" size={16} className="text-bad" title="결제 정보 확인 필요" />
                </div>
                <div className="mt-1 whitespace-nowrap text-xs2 text-ink-400">마스터 · 멤버 {ctx.projMembers}명</div>
              </div>
              <button
                onClick={() => openLayer('settings')}
                title="조직&사업부 설정"
                className="flex size-[26px] flex-none items-center justify-center rounded-md border border-ink-200 bg-white p-0 text-ink-500 hover:border-brand hover:text-brand"
              >
                <Icon name="settings" size={17} />
              </button>
            </div>
            <div className="mt-[11px] rounded-lg border border-ink-200 bg-ink-50 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="flex-1 whitespace-nowrap text-cap text-ink-500">크레딧</span>
                <span className="whitespace-nowrap text-label font-extrabold">{ctx.credit}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="flex-1 whitespace-nowrap text-cap text-ink-500">요금제</span>
                <button
                  onClick={() => openLayer('plan')}
                  className="whitespace-nowrap text-sm2 font-bold text-brand underline"
                >
                  구독하기
                </button>
              </div>
            </div>
          </div>

          {/* 내 프로젝트 */}
          <div className="flex flex-none items-center gap-2 px-3.5 pb-2 pt-[11px]">
            <span className="whitespace-nowrap text-sm2 font-extrabold">내 프로젝트</span>
            <span className="text-cap font-extrabold text-brand">3</span>
            <button className="ml-auto flex items-center whitespace-nowrap text-xs2 font-bold text-brand">
              전체 보기
              <Icon name="chevron_right" size={14.1} />
            </button>
          </div>

          <div className="flex-none px-3.5 pb-[9px]">
            <div className="flex items-center gap-1.5 rounded-[7px] border border-ink-200 bg-ink-50 px-2.5 py-1.5">
              <Icon name="search" size={16} className="text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="조직&사업부 · 프로젝트 이름 검색"
                className="min-w-0 flex-1 border-none bg-transparent p-0 text-sm2 outline-none"
              />
            </div>
          </div>

          {/* 트리 */}
          <div className="flex-none px-2 pb-2">
            {wsTree
              .filter((w) => !query || w.name.includes(query) || w.projects.some((p) => p.name.includes(query)))
              .map((w) => {
                const on = expanded === w.id
                return (
                  <div key={w.id} className="mb-1">
                    <button
                      onClick={() => setExpanded(on ? '' : w.id)}
                      className={`flex w-full min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-ink-100 ${
                        on ? 'bg-ink-50' : ''
                      }`}
                    >
                      <Icon name={on ? 'expand_more' : 'chevron_right'} size={16} className="text-ink-400" />
                      <span className="flex size-6 flex-none items-center justify-center rounded-[7px] border border-brand-border bg-brand-soft text-tiny font-extrabold text-brand-dark">
                        {w.initial}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-label font-bold">{w.name}</span>
                        <span className="block whitespace-nowrap text-tiny text-ink-400">
                          {w.role} · {w.meta}
                        </span>
                      </span>
                    </button>
                    {on && (
                      <div className="py-0.5 pl-5">
                        {w.projects.map((pj) => {
                          const cur = pj.name === ctx.proj
                          return (
                            <button
                              key={pj.id}
                              className="flex w-full min-w-0 items-center gap-2 rounded-r-[7px] border-l-2 px-[9px] py-[7px] text-left hover:bg-ink-100"
                              style={{
                                background: cur ? '#eff6ff' : 'transparent',
                                borderLeftColor: cur ? '#2563eb' : 'transparent',
                              }}
                            >
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm2 font-semibold">{pj.name}</span>
                                <span className="block whitespace-nowrap text-tiny text-ink-400">
                                  {pj.members} members · {pj.files} files
                                </span>
                              </span>
                              <span
                                className="flex-none whitespace-nowrap rounded-full px-2 py-0.5 text-mini font-bold"
                                style={
                                  pj.vis === '공개'
                                    ? { background: '#ecfdf3', color: '#15803d' }
                                    : { background: '#f1f5f9', color: '#64748b' }
                                }
                              >
                                {pj.vis}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>

          {/* 현재 프로젝트 요약 */}
          <div className="flex-none border-t border-ink-200 bg-ink-50 px-3.5 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-[34px] flex-none items-center justify-center rounded-[9px] border border-ink-200 bg-white">
                <Icon name="folder_special" size={19.4} className="text-brand" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="truncate text-body font-extrabold">{ctx.proj}</span>
                  <span className="flex-none whitespace-nowrap rounded-full bg-ok-soft px-2 py-0.5 text-mini font-bold text-ok-dark">
                    {ctx.projVis}
                  </span>
                </div>
                <div className="mt-1 truncate text-xs2 text-ink-400">{ctx.ws}</div>
              </div>
            </div>
            <div className="mt-[9px] flex flex-wrap gap-1">
              {chips.map((c) => (
                <span
                  key={c}
                  className="whitespace-nowrap rounded-full border border-brand-border bg-brand-soft px-[9px] py-[2.5px] text-tiny font-bold text-brand-dark"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 액션 */}
        <div className="flex flex-none flex-col gap-1.5 border-t border-ink-200 bg-white px-3.5 py-3">
          <div className="flex gap-1.5">
            <button
              onClick={() => openLayer('ws-create')}
              className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-[7px] bg-brand py-[9px] text-sm2 font-bold text-white hover:bg-brand-dark"
            >
              <Icon name="add" size={17} />
              조직&amp;사업부 생성
            </button>
            <button
              onClick={() => openLayer('proj-create')}
              className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-[7px] border border-ink-300 bg-white py-[9px] text-sm2 font-bold text-ink-700 hover:bg-ink-100"
            >
              <Icon name="add" size={17} />
              프로젝트 생성
            </button>
          </div>
          <button
            onClick={() => openLayer('member-invite')}
            className="w-full whitespace-nowrap rounded-[7px] bg-ink-100 py-[9px] text-sm2 font-bold text-ink-700 hover:bg-ink-200"
          >
            초대하기
          </button>
          <button className="flex w-full items-center justify-center gap-1 whitespace-nowrap py-2 text-sm2 font-bold text-ink-500 hover:text-bad-dark">
            <Icon name="logout" size={17} />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  )
}
