import { useState } from 'react'
import { Icon } from '@/components/common/icon'
import { tasks, taskStatusTone } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/** 에코바디스 자료요청 — 문항 근거가 없을 때 담당자에게 보낸 요청 현황 */

const LINKED: Record<string, string> = {
  t1: 'LAB 3.1',
  t2: 'ENV 3.2',
  t3: 'SUP 1.3',
  t4: 'ENV 2.4',
}

export function EcoReqView() {
  const { setTaskId, setScreen, setQId } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [filter, setFilter] = useState('전체')

  const rows = tasks.filter((t) => filter === '전체' || t.status === filter)
  const open = tasks.filter((t) => t.status !== '완료' && t.status !== '반려').length

  return (
    <div className="flex min-h-0 min-w-[900px] flex-1 flex-col bg-white">
      <div className="flex flex-none items-center gap-2 border-b border-ink-200 px-[18px] py-3.5">
        <div>
          <div className="text-lg2 font-extrabold tracking-[-.01em]">자료요청</div>
          <div className="mt-1 text-sm2 text-ink-500">
            문항 근거가 없어 담당자에게 요청한 증빙 · 진행중 {open}건
          </div>
        </div>
        <div className="flex-1" />
        {['전체', '요청됨', '진행중', '완료'].map((f) => {
          const on = filter === f
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-full border px-2.5 py-1 text-xs2 font-bold"
              style={{
                background: on ? '#1750d8' : '#fff',
                borderColor: on ? '#1750d8' : '#cbd5e1',
                color: on ? '#fff' : '#334155',
              }}
            >
              {f}
            </button>
          )
        })}
        <button
          onClick={() => openLayer('task-request')}
          className="flex items-center gap-1 rounded-md bg-brand px-3 py-2 text-label font-bold text-white hover:bg-brand-dark"
        >
          <Icon name="add" size={17} />
          자료 요청
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {rows.map((t) => {
          const tone = taskStatusTone[t.status]
          const q = LINKED[t.id]
          return (
            <div
              key={t.id}
              role="button"
              tabIndex={0}
              onClick={() => { setTaskId(t.id); setScreen('task') }}
              className="flex w-full cursor-pointer items-center gap-3 border-b border-ink-100 px-[18px] py-3 text-left hover:bg-ink-50"
            >
              <span
                className="w-[60px] flex-none rounded-full py-[2.5px] text-center text-mini font-extrabold"
                style={{ background: tone.bg, color: tone.fg }}
              >
                {t.status}
              </span>
              {q ? (
                <button
                  onClick={(e) => { e.stopPropagation(); setQId('q4'); setScreen('ecoWork') }}
                  className="flex-none rounded bg-ink-200 px-2 py-0.5 font-mono text-tiny font-extrabold text-ink-600 hover:bg-brand-soft hover:text-brand-dark"
                >
                  {q}
                </button>
              ) : (
                <span className="w-[62px] flex-none" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-body font-semibold">{t.title}</span>
                <span className="mt-1 block text-xs2 text-ink-400">
                  {t.from} → {t.to} · {t.room} · 첨부 {t.files}건
                </span>
              </span>
              <span
                className="flex-none whitespace-nowrap text-cap font-bold"
                style={{ color: t.due < '07.25' ? '#b91c1c' : '#64748b' }}
              >
                {t.due < '07.25' ? '기한 초과' : `~${t.due}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
