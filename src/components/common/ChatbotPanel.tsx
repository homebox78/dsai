import { useState } from 'react'
import { useQaState } from '@/lib/qa-state'
import { Icon } from '@/components/common/icon'
import { tasks, taskStatusTone } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/**
 * 4영역: 챗봇 / 업무 탭 (p35~45, p58) — 시안 실측: w 330 / bg #fff / border-left #e2e8f0
 * 목록 단계 = 폴더 내 파일을 AI로 찾는 용도 / 문서 보기 단계 = 문서 내용에서 찾기.
 */

export type BotKind = 'store' | 'eco' | 'viewer'

const INTRO: Record<BotKind, string> = {
  store: '선택한 폴더의 문서를 대상으로 답합니다. 파일을 찾거나 요약·초안 작성을 요청할 수 있습니다.',
  eco: '이 문항의 근거를 전체 RAG 색인에서 찾아드립니다. 지정 폴더에서 못 찾은 경우에도 문장으로 물어보세요 — 파일명과 페이지를 함께 제시합니다.',
  viewer:
    '이 문서는 OCR 후 RAG에 색인되어 있습니다. 찾고 싶은 내용을 문장으로 물어보면 문서에 쓰인 단어와 달라도 의미로 추론해 해당 페이지로 이동시켜 드립니다.',
}

const SUGGESTS: Record<BotKind, string[]> = {
  store: ['해지 조항 어디 있어?', '이 폴더 요약해줘'],
  eco: ['이 문항 근거 찾아줘', '유사 문항 답변 보기'],
  viewer: ['손해배상 기준은?', '이 페이지 요약'],
}

/** 삽입 위치 드롭다운 7종 (p45) */
const INSERT_OPTS = [
  '현재 커서에 삽입',
  '새 문단으로 삽입',
  '선택 문단 아래 삽입',
  '선택 영역 교체',
  '문서 끝에 추가',
  '제목으로 삽입',
  '표로 삽입',
]

interface Hit {
  ext: string
  name: string
  pageLabel: string
}

interface BotMsg {
  role: 'ai' | 'me'
  text: string
  hits?: Hit[]
  insertable?: boolean
}

export function ChatbotPanel({
  kind,
  scopeLabel,
  scopeDesc,
  showTaskTab = true,
}: {
  kind: BotKind
  scopeLabel: string
  scopeDesc: string
  showTaskTab?: boolean
}) {
  const { botTab, setBotTab, toggleBot, setTaskId, setScreen } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [msgs, setMsgs] = useState<BotMsg[]>([{ role: 'ai', text: INTRO[kind] }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [insertDemo] = useQaState('insertDemo', false)
  const [insertOpen, setInsertOpen] = useState<number | null>(insertDemo ? 0 : null)

  const myTasks = tasks.filter((t) => t.to === '나' && t.status !== '완료' && t.status !== '반려')

  const send = (text: string) => {
    if (!text.trim()) return
    setMsgs((m) => [...m, { role: 'me', text }])
    setInput('')
    setThinking(true)
    window.setTimeout(() => {
      setThinking(false)
      setMsgs((m) => [
        ...m,
        {
          role: 'ai',
          text: '표준 공급계약서 v3의 제12조(계약의 해지)에서 관련 내용을 찾았습니다. 손해배상 산정 기준은 별표 3에 정리되어 있습니다.',
          hits: [
            { ext: 'DOCX', name: '표준 공급계약서_v3.docx', pageLabel: 'p.47 해지 조항' },
            { ext: 'DOCX', name: '표준 공급계약서_v3.docx', pageLabel: 'p.132 배상 기준' },
          ],
          insertable: true,
        },
      ])
    }, 900)
  }

  const tabs: { id: 'chat' | 'task'; label: string; badge?: number }[] = showTaskTab
    ? [
        { id: 'chat', label: '챗봇' },
        { id: 'task', label: '업무', badge: myTasks.length },
      ]
    : [{ id: 'chat', label: '챗봇' }]

  return (
    <aside className="flex w-[330px] flex-none flex-col border-l border-ink-200 bg-white">
      <div className="flex flex-none items-center border-b border-ink-200">
        {tabs.map((t) => {
          const on = botTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setBotTab(t.id)}
              className="border-b-2 px-3.5 py-3 text-sm2 font-bold hover:text-ink-900"
              style={{ borderBottomColor: on ? '#1750d8' : 'transparent', color: on ? '#0f172a' : '#94a3b8' }}
            >
              {t.label}
              {!!t.badge && (
                <span className="ml-[5px] rounded-full bg-bad-soft px-2 py-0.5 text-mini font-extrabold text-bad-dark">
                  {t.badge}
                </span>
              )}
            </button>
          )
        })}
        <button onClick={toggleBot} className="ml-auto mr-2 size-[22px] p-0 text-ink-400 hover:text-ink-900">
          <Icon name="close" size={17.9} />
        </button>
      </div>

      {botTab === 'chat' ? (
        <>
          <div className="flex-none border-b border-ink-100 bg-ink-50 px-[13px] py-[9px]">
            <div className="text-xs2 font-bold text-ink-600">{scopeLabel}</div>
            <div className="mt-1 text-xs2 text-ink-400">{scopeDesc}</div>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-auto p-[13px]">
            {msgs.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'me' ? 'items-end' : 'items-start'}`}>
                <div
                  className="max-w-[92%] rounded-[9px] px-3 py-2 text-label leading-[1.7]"
                  style={
                    m.role === 'me'
                      ? { background: '#1750d8', color: '#fff' }
                      : { background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }
                  }
                >
                  {m.text}
                </div>

                {m.hits && (
                  <div className="mt-1.5 flex w-[92%] flex-col gap-1">
                    {m.hits.map((h, hi) => (
                      <button
                        key={hi}
                        onClick={() => openLayer('viewer')}
                        className="flex items-center gap-2 rounded-[7px] border border-ink-200 bg-ink-50 px-[9px] py-2 text-left hover:border-brand-fade hover:bg-brand-soft"
                      >
                        <span className="flex size-[22px] flex-none items-center justify-center rounded-[5px] border border-ink-200 bg-white font-mono text-[7.3px] font-extrabold text-ink-600">
                          {h.ext}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm2 font-bold">{h.name}</span>
                          <span className="mt-px block text-tiny font-bold text-brand-link">{h.pageLabel}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {m.insertable && (
                  <div className="mt-1.5 w-[92%] overflow-hidden rounded-[7px] border border-ink-200">
                    <button
                      onClick={() => setInsertOpen(insertOpen === i ? null : i)}
                      className="flex w-full items-center gap-1.5 bg-ink-50 px-2.5 py-1.5 text-left text-cap font-bold text-brand-link-dark hover:bg-brand-soft"
                    >
                      <span className="flex-1">문서에 삽입</span>
                      <Icon name={insertOpen === i ? 'expand_less' : 'expand_more'} size={16} className="text-ink-400" />
                    </button>
                    {insertOpen === i && (
                      <div className="border-t border-ink-200">
                        {INSERT_OPTS.map((o) => (
                          <button
                            key={o}
                            onClick={() => setInsertOpen(null)}
                            className="block w-full border-b border-ink-100 bg-white px-2.5 py-1.5 text-left text-sm2 font-semibold text-ink-700 hover:bg-ink-50"
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {thinking && (
              <div className="flex items-center gap-2 text-sm2 text-ink-500">
                <span className="block size-3 animate-spin rounded-full border-2 border-brand-border border-t-brand-link" />
                RAG 색인에서 근거를 추론 중…
              </div>
            )}
          </div>

          <div className="flex-none border-t border-ink-200 px-3 py-2">
            <div className="mb-2 flex flex-wrap gap-1">
              {SUGGESTS[kind].map((sg) => (
                <button
                  key={sg}
                  onClick={() => send(sg)}
                  className="rounded-full bg-ink-200 px-2.5 py-1 text-xs2 font-semibold text-ink-700 hover:text-ink-900"
                >
                  {sg}
                </button>
              ))}
            </div>
            <div className="flex items-stretch gap-1.5">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  // Enter 전송 / Shift+Enter 줄바꿈
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send(input)
                  }
                }}
                rows={2}
                placeholder="문장으로 물어보세요 · Enter 전송 / Shift+Enter 줄바꿈"
                className="min-h-[58px] flex-1 resize-none rounded-md border border-ink-300 px-3 py-2 text-label leading-[1.6] outline-none focus:border-brand-link"
              />
              <button
                onClick={() => send(input)}
                className="flex-none rounded-md bg-brand px-3.5 text-sm2 font-bold text-white hover:bg-brand-dark"
              >
                전송
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col gap-2 overflow-auto bg-ink-50 p-[11px]">
          {myTasks.map((t) => {
            const tone = taskStatusTone[t.status]
            return (
              <button
                key={t.id}
                onClick={() => { setTaskId(t.id); setScreen('task') }}
                className="block rounded-r-[7px] border border-l-2 border-ink-200 bg-white px-3.5 py-3 text-left hover:border-brand-fade"
                style={{ borderLeftColor: tone.bar }}
              >
                <span className="mb-[5px] flex items-center gap-1.5">
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
                  {t.from} → {t.to}
                </span>
              </button>
            )
          })}
          <button
            onClick={() => openLayer('task-request')}
            className="rounded-[7px] border border-dashed border-ink-300 p-2.5 text-sm2 font-bold text-ink-500 hover:border-brand-link hover:text-brand-link"
          >
            + 이 문서로 자료 요청 만들기
          </button>
        </div>
      )}
    </aside>
  )
}
