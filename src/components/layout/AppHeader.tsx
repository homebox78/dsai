import { Icon } from '@/components/common/icon'
import { ctx } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'
import { NotiDropdown } from './dropdowns/NotiDropdown'
import { HelpDropdown } from './dropdowns/HelpDropdown'
import { UserDropdown } from './dropdowns/UserDropdown'

/** 헤더 (p9~14) — 시안 실측: height 52 / bg #1750d8 / border-bottom #1345bd / padding 0 14px / gap 8 */
export function AppHeader() {
  const { notiOpen, helpOpen, userOpen, setDropdown, wsPopOpen } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)

  const iconBtn =
    'flex size-[30px] flex-none items-center justify-center rounded-md border border-white/24 bg-white/10 hover:bg-white/20'

  return (
    <header className="relative z-[60] flex h-header flex-none items-center gap-2 border-b border-[#1345bd] bg-brand px-3.5">
      {/* 로고 */}
      <div className="flex flex-none items-center gap-2 whitespace-nowrap pr-1.5">
        <img src="/amber-logo.png" alt="Amber" className="block h-[22px] w-auto" />
      </div>
      <div className="h-5 w-px bg-white/24" />

      {/* 조직명 + 플랜 */}
      <div className="flex max-w-[230px] flex-none items-center gap-2 whitespace-nowrap px-[3px]">
        <span className="truncate text-body font-bold text-white">{ctx.org}</span>
        <span className="flex-none whitespace-nowrap rounded border border-white/30 bg-white/16 px-[5px] py-0.5 text-mini font-extrabold tracking-[.05em] text-white">
          {ctx.orgPlan}
        </span>
      </div>

      <div className="flex-1" />

      {/* 검색 */}
      <button
        onClick={() => openLayer('search')}
        className="flex w-[300px] flex-none items-center gap-2 overflow-hidden whitespace-nowrap rounded-[7px] border border-white/22 bg-white/14 px-2.5 py-1.5 text-body text-white/78"
      >
        <Icon name="search" size={17} className="text-white/85" />
        <span className="truncate">문서·대화·Task 추론 검색</span>
        <span className="ml-auto flex-none rounded border border-white/28 bg-white/12 px-1 py-px text-[10.7px] text-white">
          ⌘K
        </span>
      </button>

      {/* 조직&사업부 전환 (N) */}
      <button
        onClick={() => setDropdown('wsPopOpen', !wsPopOpen)}
        title="조직&사업부 전환"
        className="relative flex size-[30px] flex-none items-center justify-center rounded-[7px] border border-white/34 bg-white p-0 hover:bg-brand-soft"
      >
        <span className="text-[14.6px] font-extrabold leading-[1.35] text-brand">{ctx.wsInitial}</span>
        <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-[1.5px] border-brand bg-ok" />
      </button>

      {/* AI 챗봇 시트 */}
      <button
        onClick={() => openLayer('ai-chat')}
        title="AI 챗봇 (시트)"
        className="flex size-[30px] flex-none items-center justify-center rounded-md border border-white/30 bg-white hover:bg-brand-soft"
      >
        <Icon name="auto_awesome" size={19.4} className="text-brand" />
      </button>

      {/* 설정 */}
      <button onClick={() => openLayer('settings')} title="설정" className={iconBtn}>
        <Icon name="settings" size={19.4} className="text-white" />
      </button>

      {/* 알림 */}
      <div className="relative flex-none">
        <button onClick={() => setDropdown('notiOpen', !notiOpen)} className={iconBtn}>
          <Icon name="notifications" size={19.4} className="text-white" />
          <span className="absolute -right-[3px] -top-[3px] rounded-full bg-bad-light px-1 py-px text-micro font-extrabold text-white">
            5
          </span>
        </button>
        {notiOpen && <NotiDropdown />}
      </div>

      {/* 도움말 */}
      <div className="relative flex-none">
        <button onClick={() => setDropdown('helpOpen', !helpOpen)} className={iconBtn}>
          <Icon name="help" size={19.4} className="text-white" />
        </button>
        {helpOpen && <HelpDropdown />}
      </div>

      <div className="h-5 w-px bg-white/24" />

      {/* 프로필 */}
      <div className="relative flex-none">
        <button
          onClick={() => setDropdown('userOpen', !userOpen)}
          className="flex flex-none items-center gap-2 whitespace-nowrap rounded-[7px] px-[7px] py-[5px] hover:bg-white/14"
        >
          <span className="flex size-7 flex-none items-center justify-center rounded-full border border-white/40 bg-white text-sm2 font-extrabold text-brand">
            {ctx.me.initial}
          </span>
          <span className="flex-none whitespace-nowrap text-left">
            <span className="block text-label font-bold leading-[1.5] text-white">{ctx.me.name}</span>
            <span className="block text-xs2 leading-[1.5] text-white/72">{ctx.me.title}</span>
          </span>
          <Icon name="expand_more" size={16} className="text-white/75" />
        </button>
        {userOpen && <UserDropdown />}
      </div>
    </header>
  )
}
