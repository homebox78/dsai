import { Icon } from '@/components/common/icon'
import { ctx } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'
import { useLayoutMetrics } from '@/lib/responsive'
import { NotiDropdown } from './dropdowns/NotiDropdown'
import { HelpDropdown } from './dropdowns/HelpDropdown'
import { UserDropdown } from './dropdowns/UserDropdown'

/** 헤더 (p9~14) — 시안 실측: height 52 / bg #1750d8 / border-bottom #1345bd / padding 0 14px / gap 8 */
export function AppHeader() {
  const { notiOpen, helpOpen, userOpen, setDropdown, wsPopOpen, setScreen } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const { searchWide, searchW, profileWide } = useLayoutMetrics()

  // 헤더 아이콘 버튼 2종 — 크기·라운드·보더를 하나로 맞춘다
  /** 기본(반투명) — 설정·알림·도움말 */
  const iconBtn =
    'flex size-[30px] flex-none items-center justify-center rounded-[7px] border border-white/24 bg-white/10 transition-colors hover:bg-white/20'
  /** 강조(흰 배경) — 조직 전환·AI 챗봇처럼 눈에 띄어야 하는 진입점 */
  const iconBtnSolid =
    'relative flex size-[30px] flex-none items-center justify-center rounded-[7px] border border-white/30 bg-white p-0 transition-colors hover:bg-brand-soft'

  return (
    <header className="relative z-[60] flex h-header flex-none items-center gap-2 border-b border-[#1345bd] bg-brand px-3.5">
      {/* 로고 = 심볼 + 조직명 + 플랜 배지 한 덩어리. 누르면 대시보드로 (홈 역할) */}
      <button
        onClick={() => setScreen('dash')}
        title="대시보드로 이동"
        className="flex max-w-[320px] flex-none items-center gap-2 whitespace-nowrap rounded-md px-1.5 py-1 transition-colors hover:bg-white/14"
      >
        <img src="/amber-logo.png" alt="Amber 홈" className="block h-[22px] w-auto flex-none" />
        <span className="h-5 w-px flex-none bg-white/24" />
        <span className="truncate text-body font-bold text-white">{ctx.org}</span>
        <span className="flex-none whitespace-nowrap rounded border border-white/30 bg-white/16 px-[5px] py-0.5 text-mini font-extrabold tracking-[.05em] text-white">
          {ctx.orgPlan}
        </span>
      </button>

      <div className="flex-1" />

      {/* 검색 */}
      <button
        onClick={() => openLayer('search')}
        style={{ width: searchW }}
        className="flex flex-none items-center gap-2 overflow-hidden whitespace-nowrap rounded-[7px] border border-white/22 bg-white/14 px-2.5 py-1.5 text-body text-white/78"
      >
        <Icon name="search" size={17} className="text-white/85" />
        {searchWide && <span className="truncate">문서·대화·Task 추론 검색</span>}
      </button>

      {/* 조직&사업부 전환 (N) */}
      <button
        onClick={() => setDropdown('wsPopOpen', !wsPopOpen)}
        title="조직&사업부 전환"
        className={iconBtnSolid}
      >
        <span className="text-[14.6px] font-extrabold leading-none text-brand">{ctx.wsInitial}</span>
        {/* 접속 상태 점 — 버튼 안쪽에 붙여 모서리에서 잘리지 않게 한다 */}
        <span className="absolute bottom-[3px] right-[3px] size-[6px] rounded-full bg-ok ring-[1.5px] ring-white" />
      </button>

      {/* AI 챗봇 시트 */}
      <button
        onClick={() => openLayer('ai-chat')}
        title="AI 챗봇 (시트)"
        className={iconBtnSolid}
      >
        <Icon name="auto_awesome" size={18} className="text-brand" />
      </button>

      {/* 설정 */}
      <button onClick={() => openLayer('settings')} title="설정" className={iconBtn}>
        <Icon name="settings" size={19.4} className="text-white" />
      </button>

      {/* 알림 */}
      <div className="relative flex-none">
        <button onClick={() => setDropdown('notiOpen', !notiOpen)} title="알림 5건" className={iconBtn}>
          <Icon name="notifications" size={19.4} className="text-white" />
          <span className="absolute -right-1 -top-1 min-w-[15px] rounded-full bg-bad-mid px-1 py-px text-center text-micro font-extrabold leading-[1.35] text-white ring-2 ring-brand">
            5
          </span>
        </button>
        {notiOpen && <NotiDropdown />}
      </div>

      {/* 도움말 */}
      <div className="relative flex-none">
        <button onClick={() => setDropdown('helpOpen', !helpOpen)} title="도움말" className={iconBtn}>
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
          {profileWide && (
            <>
              <span className="flex-none whitespace-nowrap text-left">
                <span className="block text-label font-bold leading-[1.5] text-white">{ctx.me.name}</span>
                <span className="block text-xs2 leading-[1.5] text-white/72">{ctx.me.title}</span>
              </span>
              <Icon name="expand_more" size={16} className="text-white/75" />
            </>
          )}
        </button>
        {userOpen && <UserDropdown />}
      </div>
    </header>
  )
}
