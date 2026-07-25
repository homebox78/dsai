import { Icon } from '@/components/common/icon'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/**
 * 문서 작성 (p43~45) — 목차 레일 186px + 본문
 * ⚠️ 목차 편집 페이지는 클라이언트(Aiden) 직접 제작 → 여기서는 시트 오픈까지만.
 */

const TOC: [string, number][] = [
  ['1. 개요', 0],
  ['2. 환경 경영', 0],
  ['2.1 인증 현황', 1],
  ['2.2 온실가스 배출', 1],
  ['3. 노동·인권', 0],
  ['4. 윤리 경영', 0],
]

const BLOCKS = [
  { head: true, text: '2.1 인증 현황' },
  {
    head: false,
    text: '당사는 전 사업장에 대해 ISO 14001 환경경영시스템 인증을 취득하여 2029년까지 유효한 상태로 유지하고 있습니다.',
  },
  {
    head: false,
    text: '2025년 기준 Scope 1·2 배출량은 전년 대비 8.4% 감소하였으며, 제3자 검증기관의 검증 의견을 첨부하였습니다.',
    ai: true,
  },
  {
    head: false,
    text: '재생에너지 전환율은 12.7%로 2030년 목표(30%) 달성을 위해 연간 3%p 이상 확대할 계획입니다.',
  },
]

export function EditorPane({ fileName }: { fileName: string }) {
  const setStoreMode = useAppStore((s) => s.setStoreMode)
  const openLayer = useLayerStore((s) => s.open)
  const btn = 'rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-sm2 font-semibold text-ink-700 hover:bg-ink-100'

  return (
    <>
      <div className="flex flex-none items-center gap-2 border-b border-ink-200 bg-white px-[18px] py-3.5">
        <span className="whitespace-nowrap text-body font-extrabold">{fileName}</span>
        <span className="flex-none whitespace-nowrap rounded-full bg-warn-soft px-2 py-0.5 text-mini font-bold text-warn-dark">
          임시 저장됨
        </span>
        <div className="flex-1" />
        <button onClick={() => openLayer('file-create')} className={btn}>
          목차 편집
        </button>
        <button onClick={() => setStoreMode('detail')} className={btn}>
          미리보기
        </button>
        <button className="rounded-md bg-brand px-2.5 py-1.5 text-sm2 font-bold text-white hover:bg-brand-dark">
          저장
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex w-[186px] flex-none flex-col border-r border-ink-200 bg-white">
          <div className="flex h-11 flex-none items-center gap-1.5 border-b border-ink-200 px-3.5">
            <span className="whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">목차</span>
            <button
              onClick={() => openLayer('file-create')}
              title="목차 편집"
              className="ml-auto size-[22px] p-0 text-ink-400 hover:text-brand"
            >
              <Icon name="edit" size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-auto py-1.5">
            {TOC.map(([label, lv], i) => {
              const on = i === 2
              return (
                <button
                  key={label}
                  onClick={() => openLayer('file-create')}
                  className="block w-full border-l-2 py-1.5 pr-2.5 text-left text-sm2 hover:bg-ink-100"
                  style={{
                    paddingLeft: 10 + lv * 12,
                    fontWeight: lv === 0 ? 700 : 500,
                    background: on ? '#eff6ff' : 'transparent',
                    borderLeftColor: on ? '#2563eb' : 'transparent',
                    color: on ? '#1d4ed8' : '#334155',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 justify-center overflow-auto bg-white">
          <div className="h-fit w-[min(680px,100%)] px-[26px] pb-[60px] pt-[30px]">
            <div className="mb-1.5 text-3xl2 font-extrabold tracking-[-.02em]">2026 지속가능경영 대응 문서</div>
            <div className="mb-[22px] border-b border-ink-200 pb-[13px] text-sm2 text-ink-400">
              작성자 홍길동 · 최종 저장 방금 전 · 목차 6단락
            </div>
            {BLOCKS.map((b, i) => (
              <div key={i} className="mb-4">
                {b.head ? (
                  <div className="mb-2.5 border-b border-ink-100 pb-[7px] text-[15px] font-extrabold">{b.text}</div>
                ) : (
                  <div
                    className="text-body leading-[1.85] text-ink-700"
                    style={
                      b.ai
                        ? { background: '#f8fafc', borderLeft: '2px solid #2563eb', padding: '10px 12px' }
                        : { borderLeft: '2px solid transparent', padding: 0 }
                    }
                  >
                    {b.text}
                  </div>
                )}
              </div>
            ))}
            <div className="mb-3.5 h-px w-full bg-ink-100" />
            <div className="text-label text-ink-300">여기에 이어서 작성하거나 AI 답변을 삽입하세요</div>
          </div>
        </div>
      </div>
    </>
  )
}
