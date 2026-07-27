/**
 * ⚠️ 검수 전용 — 클라이언트 검수가 끝나면 삭제합니다.
 *    제거 명령: npm run remove-qa   (미리보기: npm run remove-qa -- --dry)
 */
import { useEffect, useState } from 'react'
import { Icon } from '@/components/common/icon'
import { useOpenIdxItem } from '@/lib/qa-open'
import { useAppStore } from '@/stores/app-store'
import { IDX_ALL, IDX_GROUPS, type IdxKind } from '@/views/index/index-data'

/**
 * 검수용 플로팅 인덱스 — 시안(dc.html)의 "검수 플로팅바" 그대로.
 * 이전/다음으로 116항목을 순서대로 넘겨보고, 패널에서 그룹별로 골라 연다.
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

/** 바로 열 수 있는(상태가 정의된) 항목만 순회 대상 */
const OPENABLE = IDX_ALL.filter((i) => i.st)

export function QaBar() {
  const [hidden, setHidden] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [group, setGroup] = useState('전체')
  const [cursor, setCursor] = useState(-1)
  const setScreen = useAppStore((s) => s.setScreen)
  const openItem = useOpenIdxItem()

  // 검수 자동화용 훅 — 콘솔에서 __qaOpen(i)로 항목을 순서대로 열 수 있다.
  useEffect(() => {
    ;(window as unknown as { __qaOpen?: (i: number) => void; __qaCount?: number }).__qaOpen = (i: number) => {
      setCursor(i)
      openItem(OPENABLE[i])
    }
    ;(window as unknown as { __qaCount?: number }).__qaCount = OPENABLE.length
  })

  if (hidden) return null

  const go = (next: number) => {
    const i = (next + OPENABLE.length) % OPENABLE.length
    setCursor(i)
    openItem(OPENABLE[i])
  }

  const current = cursor >= 0 ? OPENABLE[cursor] : null
  const listed = (group === '전체' ? IDX_GROUPS : IDX_GROUPS.filter((g) => g.g === group)).flatMap((g) =>
    g.items.filter((i) => i.st)
  )

  return (
    <div className="fixed bottom-3.5 right-3.5 z-[120] flex flex-col items-end gap-2">
      {panelOpen && (
        <div className="flex max-h-[64vh] w-[330px] flex-col overflow-hidden rounded-xl border border-ink-300 bg-white shadow-[0_18px_44px_rgba(15,23,42,.22)]">
          <div className="flex flex-none items-center gap-2 border-b border-ink-200 bg-ink-50 px-[18px] py-[11px]">
            <Icon name="fact_check" size={18} className="text-brand" />
            <span className="text-xs2 font-extrabold">검수 인덱스</span>
            <span className="text-mini text-ink-400">
              바로열기 {OPENABLE.length} / 전체 {IDX_ALL.length}
            </span>
            <button
              onClick={() => setScreen('index')}
              className="ml-auto rounded-[5px] border border-ink-300 bg-white px-2 py-1 text-[11.2px] font-bold text-ink-700 hover:bg-ink-100"
            >
              전체 목록
            </button>
            <button onClick={() => setPanelOpen(false)} className="text-ink-400 hover:text-ink-900" title="닫기">
              <Icon name="close" size={16} />
            </button>
          </div>

          <div className="flex flex-none flex-wrap gap-1 border-b border-ink-100 px-3 py-2">
            {['전체', ...IDX_GROUPS.map((g) => g.g)].map((label) => {
              const on = group === label
              return (
                <button
                  key={label}
                  onClick={() => setGroup(label)}
                  className="rounded-full border px-2 py-0.5 text-mini font-bold"
                  style={{
                    background: on ? '#1750d8' : '#fff',
                    borderColor: on ? '#1750d8' : '#cbd5e1',
                    color: on ? '#fff' : '#334155',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="flex-1 overflow-auto">
            {listed.map((it) => {
              const tone = KIND_TONE[it.kind]
              const on = current?.name === it.name
              return (
                <button
                  key={`${it.page}-${it.name}`}
                  onClick={() => {
                    setCursor(OPENABLE.indexOf(it))
                    openItem(it)
                  }}
                  className="flex w-full items-center gap-2 border-b border-ink-100 px-3 py-2 text-left hover:bg-ink-100"
                  style={{ background: on ? '#eff6ff' : undefined, borderLeft: `2px solid ${on ? '#1750d8' : 'transparent'}` }}
                >
                  <span className="flex-none rounded-[3px] bg-ink-200 px-[5px] py-0.5 font-mono text-[9.7px] font-bold text-ink-700">
                    {it.page}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12.1px] font-semibold">{it.name}</span>
                  <span
                    className="flex-none rounded-full px-2 py-0.5 text-[9.7px] font-extrabold"
                    style={{ background: tone.bg, color: tone.fg }}
                  >
                    {it.kind}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex flex-none items-center gap-1.5 border-t border-ink-200 bg-ink-50 px-3 py-2">
            <button title="이전 항목"
              onClick={() => go(cursor - 1)}
              className="flex flex-1 items-center justify-center rounded-md border border-ink-300 bg-white py-[7px] text-[11.6px] font-bold text-ink-700 hover:bg-ink-100"
            >
              <Icon name="chevron_left" size={15} />
              이전
            </button>
            <button title="다음 항목"
              onClick={() => go(cursor + 1)}
              className="flex flex-1 items-center justify-center rounded-md bg-brand py-[7px] text-[11.6px] font-bold text-white hover:bg-brand-dark"
            >
              다음
              <Icon name="chevron_right" size={15} />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {current && (
          <div className="flex items-center gap-2 rounded-full bg-ink-900 px-2.5 py-1.5 text-white shadow-[0_8px_22px_rgba(15,23,42,.28)]">
            <span className="font-mono text-[10.2px] font-bold text-[#93b4e8]">{current.page}</span>
            <span className="max-w-[220px] truncate text-[12.1px] font-bold">{current.name}</span>
            <span className="text-mini text-[#93b4e8]">
              {cursor + 1}/{OPENABLE.length}
            </span>
          </div>
        )}
        <button
          onClick={() => go(cursor - 1)}
          title="이전 항목"
          className="flex size-[34px] items-center justify-center rounded-full border border-ink-300 bg-white text-ink-700 shadow-[0_6px_18px_rgba(15,23,42,.16)] hover:bg-ink-100"
        >
          <Icon name="chevron_left" size={19} />
        </button>
        <button
          onClick={() => setPanelOpen((v) => !v)}
          title="검수 인덱스"
          className="flex h-[34px] items-center gap-1 rounded-full bg-brand px-3.5 text-[12.1px] font-bold text-white shadow-[0_6px_18px_rgba(23,80,216,.36)] hover:bg-brand-dark"
        >
          <Icon name="fact_check" size={18} />
          검수
        </button>
        <button
          onClick={() => go(cursor + 1)}
          title="다음 항목"
          className="flex size-[34px] items-center justify-center rounded-full border border-ink-300 bg-white text-ink-700 shadow-[0_6px_18px_rgba(15,23,42,.16)] hover:bg-ink-100"
        >
          <Icon name="chevron_right" size={19} />
        </button>
        <button
          onClick={() => setHidden(true)}
          title="검수바 숨기기"
          className="flex size-7 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-400 hover:text-ink-900"
        >
          <Icon name="close" size={16} />
        </button>
      </div>
    </div>
  )
}
