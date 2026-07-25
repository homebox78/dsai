import { Icon } from '@/components/common/icon'
import { useAppStore } from '@/stores/app-store'

/**
 * 도움말 드롭다운 (p12) — 시안 실측: w 308 / top 38
 * ⚠️ 상세 페이지 4종은 클라이언트(Aiden) 직접 제작 → 드롭다운까지만 구현
 */
const ITEMS = [
  { label: '사용 가이드', desc: '업로드 → 색인 → 검색 기본 흐름', icon: 'menu_book' },
  { label: '도움말 문서', desc: '기능별 상세 설명 · FAQ', icon: 'help_center' },
  { label: '약관 · 개인정보 정책', desc: '데이터 보관·처리 기준', icon: 'gavel' },
  { label: '고객센터', desc: '평일 09:00~18:00 · 1일 내 회신', icon: 'headset_mic' },
]

export function HelpDropdown() {
  const closeDropdowns = useAppStore((s) => s.closeDropdowns)

  return (
    <div className="anim-pop absolute right-0 top-[38px] w-[308px] overflow-hidden rounded-[10px] border border-ink-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,.14)]">
      <div className="border-b border-ink-200 bg-ink-50 px-3.5 py-3">
        <div className="whitespace-nowrap text-label font-extrabold">도움이 필요하신가요?</div>
        <div className="mt-1 truncate text-xs2 text-ink-500">기능 안내와 문의 채널을 확인하세요</div>
      </div>
      <div className="px-2.5 pb-1 pt-[9px]">
        <div className="mb-1 text-tiny font-extrabold tracking-[.05em] text-ink-400">가이드 · 정책</div>
        {ITEMS.map((h) => (
          <button
            key={h.label}
            onClick={closeDropdowns}
            className="flex w-full items-center gap-2 rounded-[7px] px-3 py-2 text-left hover:bg-ink-100"
          >
            <Icon name={h.icon} size={17} className="text-ink-500" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-label font-semibold text-ink-900">{h.label}</span>
              <span className="mt-px block truncate text-tiny text-ink-400">{h.desc}</span>
            </span>
            <Icon name="open_in_new" size={15} className="text-ink-300" />
          </button>
        ))}
      </div>
    </div>
  )
}
