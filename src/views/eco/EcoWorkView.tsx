import { useState } from 'react'
import { Icon } from '@/components/common/icon'
import { ChatbotPanel } from '@/components/common/ChatbotPanel'
import { PanelHandle } from '@/components/layout/PanelHandle'
import { ecoQuestions, ecoStatusTone, folders } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/**
 * 에코바디스 처리부 (p58)
 * 질문 목록 300 | 질문 상세·OCR 수정·폴더 지정 AI 검색·프로세스·답변 | 챗봇 330
 * 진행률은 AI 초안/미처리/답변완료 합산 100% 기준.
 */

const FILTERS: [string, string][] = [
  ['전체', '전체'],
  ['답변완료', '완료'],
  ['AI 초안', '초안'],
  ['미처리', '미처리'],
]

const PROCESS = ['OCR 인식', '근거 검색', '답변 작성', '확정'] as const

const REQ_ITEMS = [
  { label: '정책 문서 원본 (PDF) 제출', icon: 'check_circle', color: '#16a34a' },
  { label: '경영진 승인 근거 포함', icon: 'check_circle', color: '#16a34a' },
  { label: '최근 3년 내 개정 이력', icon: 'radio_button_unchecked', color: '#cbd5e1' },
]

const ANSWER_ACTIONS = ['AI 초안 삽입', '유사 문항 답변 참조']

type SearchState = 'idle' | 'searching' | 'hit' | 'miss'

export function EcoWorkView() {
  const { qId, setQId, botOpen, toggleBot } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('전체')
  const [editing, setEditing] = useState(false)
  const [search, setSearch] = useState<SearchState>('idle')
  const [answer, setAnswer] = useState('')
  const [attachments, setAttachments] = useState([
    { ext: 'PDF', name: '윤리경영 행동강령_v2.pdf', path: 'ESG 정책 문서 / 노동·인권', page: 'p.12~14' },
  ])

  const rows = ecoQuestions
    .filter((q) => filter === '전체' || q.status === filter)
    .filter((q) => !query.trim() || q.no.includes(query.trim()) || q.q.includes(query.trim()))
  const cur = ecoQuestions.find((q) => q.id === qId) ?? ecoQuestions[0]
  const curIdx = ecoQuestions.findIndex((q) => q.id === cur.id)
  const tone = ecoStatusTone[cur.status]

  const runSearch = () => {
    setSearch('searching')
    window.setTimeout(() => setSearch(cur.files > 0 ? 'hit' : 'miss'), 1100)
  }

  const doneStep = cur.status === '답변완료' ? 3 : cur.status === 'AI 초안' ? 2 : 0

  return (
    <div className="flex min-h-0 min-w-[1176px] flex-1">
      {/* OCR 인식 질문 목록 */}
      <div className="flex w-[300px] flex-none flex-col border-r border-ink-200 bg-white">
        <div className="flex-none border-b border-ink-200 px-3.5 py-3">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">
              OCR 인식 질문 목록
            </span>
            <span className="ml-auto whitespace-nowrap text-xs2 text-ink-400">300문항</span>
          </div>
          <div className="mb-[7px] flex items-center gap-1.5 rounded-md border border-ink-200 bg-ink-50 px-2.5 py-1.5">
            <Icon name="search" size={16} className="text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="문항번호 · 질문 내용 검색"
              className="min-w-0 flex-1 border-none bg-transparent p-0 text-sm2 outline-none"
            />
          </div>
          <div className="flex gap-1">
            {FILTERS.map(([id, short]) => {
              const on = filter === id
              return (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className="flex-1 rounded-[5px] border py-1 text-tiny font-bold"
                  style={{
                    background: on ? '#eff6ff' : '#fff',
                    borderColor: on ? '#bfdbfe' : '#cbd5e1',
                    color: on ? '#1345bd' : '#334155',
                  }}
                >
                  {short}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {rows.map((q) => {
            const t = ecoStatusTone[q.status]
            const on = q.id === qId
            return (
              <button
                key={q.id}
                onClick={() => { setQId(q.id); setSearch('idle') }}
                className="block w-full border-b border-l-2 border-ink-100 px-3.5 py-3 text-left hover:bg-ink-50"
                style={{ background: on ? '#eff6ff' : '#fff', borderLeftColor: on ? '#2563eb' : 'transparent' }}
              >
                <span className="mb-1 flex items-center gap-1.5">
                  <span className="rounded bg-ink-200 px-[5px] py-0.5 font-mono text-mini font-extrabold text-ink-600">
                    {q.no}
                  </span>
                  <span
                    className="ml-auto rounded-full px-2 py-0.5 text-mini font-extrabold"
                    style={{ background: t.bg, color: t.fg }}
                  >
                    {q.status}
                  </span>
                </span>
                <span className="line-clamp-2 block text-sm2 font-semibold leading-[1.65]">{q.q}</span>
                <span className="mt-1 flex items-center gap-1.5">
                  <span className="truncate text-tiny text-ink-400">{q.cat}</span>
                  <span
                    className="ml-auto flex flex-none items-center gap-1 whitespace-nowrap text-mini"
                    style={{ color: q.files ? '#16a34a' : '#cbd5e1' }}
                  >
                    <Icon name="attach_file" size={12.6} />
                    {q.files}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 처리부 */}
      <div className="flex min-w-[420px] flex-1 flex-col overflow-auto bg-ink-50">
        {/* 질문 상세 + OCR 수정 */}
        <div className="flex-none border-b border-ink-200 bg-white px-3.5 py-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-ink-200 px-[7px] py-[2.5px] font-mono text-xs2 font-extrabold text-ink-600">
              {cur.no}
            </span>
            <span className="whitespace-nowrap text-xs2 text-ink-400">{cur.cat}</span>
            <span
              className="whitespace-nowrap rounded-full px-2 py-0.5 text-mini font-extrabold"
              style={{ background: tone.bg, color: tone.fg }}
            >
              {cur.status}
            </span>
            <div className="flex-1" />
            <button
              onClick={() => setEditing((v) => !v)}
              className="whitespace-nowrap rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-cap font-semibold text-ink-700 hover:bg-ink-100"
            >
              {editing ? '수정 취소' : 'OCR 문항 수정'}
            </button>
            <button
              onClick={() => openLayer('task-request')}
              className="flex items-center gap-1 whitespace-nowrap rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-cap font-semibold text-ink-700 hover:bg-ink-100"
            >
              <Icon name="person_add" size={16} />
              담당자 지정
            </button>
            <div className="flex items-center gap-1 rounded-md bg-ink-200 px-1 py-[3px]">
              <button
                onClick={() => setQId(ecoQuestions[Math.max(0, curIdx - 1)].id)}
                title="이전 문항"
                className="size-[22px] rounded border border-ink-200 bg-white p-0 text-ink-600"
              >
                <Icon name="chevron_left" size={16} />
              </button>
              <span className="min-w-[52px] whitespace-nowrap text-center text-xs2 font-bold text-ink-600">
                {curIdx + 1} / {ecoQuestions.length}
              </span>
              <button
                onClick={() => setQId(ecoQuestions[Math.min(ecoQuestions.length - 1, curIdx + 1)].id)}
                title="다음 문항"
                className="size-[22px] rounded border border-ink-200 bg-white p-0 text-ink-600"
              >
                <Icon name="chevron_right" size={16} />
              </button>
            </div>
          </div>

          {editing ? (
            <>
              <textarea
                defaultValue={cur.q}
                rows={3}
                className="w-full resize-none rounded-[7px] border border-brand-link px-3 py-2 text-base2 leading-[1.7] outline-none"
              />
              <div className="mt-[7px] flex items-center gap-2">
                <span className="text-xs2 text-ink-400">OCR 인식 오류를 직접 수정할 수 있습니다</span>
                <div className="flex-1" />
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-md bg-brand px-2.5 py-1.5 text-cap font-bold text-white"
                >
                  문항 저장
                </button>
              </div>
            </>
          ) : (
            <div className="text-md2 font-bold leading-[1.7]">{cur.q}</div>
          )}
        </div>

        {/* 폴더 지정 AI 검색 (1회성) */}
        <div className="flex-none border-b border-ink-200 bg-white px-3.5 py-3">
          <div className="mb-2 whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">
            답변 자료 찾기 · 폴더 지정 AI 검색
          </div>
          <div className="flex items-center gap-1.5">
            <select className="w-[220px] rounded-md border border-ink-300 bg-white px-3 py-2 text-label outline-none">
              {folders.map((f) => (
                <option key={f.id}>{f.name}</option>
              ))}
            </select>
            <button
              onClick={runSearch}
              className="rounded-md bg-brand px-3.5 py-2 text-sm2 font-bold text-white hover:bg-brand-dark"
            >
              AI로 답변 찾기
            </button>
            <span className="truncate text-xs2 text-ink-400">
              1회성 검색 · 못 찾으면 챗봇 또는 자료 요청으로 진행
            </span>
          </div>

          {search === 'searching' && (
            <div className="mt-[11px] flex items-center gap-2 text-sm2 text-ink-500">
              <span className="block size-3 animate-spin rounded-full border-2 border-brand-border border-t-brand-link" />
              지정 폴더의 RAG 색인에서 근거 추론 중…
            </div>
          )}

          {search === 'hit' && (
            <div className="mt-[11px] rounded-r-[7px] border border-l-2 border-ink-200 border-l-ok bg-ink-50 px-3.5 py-3">
              <div className="mb-[7px] flex items-center gap-1.5">
                <span className="whitespace-nowrap rounded-full bg-ok-softer px-2 py-0.5 text-mini font-extrabold text-ok-dark">
                  근거 발견
                </span>
                <span className="whitespace-nowrap text-xs2 text-ink-500">신뢰도 92%</span>
              </div>
              <div className="mb-[9px] text-label leading-[1.8] text-ink-700">
                「윤리경영 행동강령_v2」 제3장에 아동노동·강제노동 전면 금지 조항과 대표이사 승인 서명이 포함되어 있습니다.
              </div>
              <button
                onClick={() => openLayer('viewer')}
                className="flex items-center gap-2 rounded-[7px] border border-ink-200 bg-white px-3 py-2 hover:border-brand-fade"
              >
                <span className="flex size-6 flex-none items-center justify-center rounded-[5px] bg-ink-100 font-mono text-[7.3px] font-extrabold text-ink-600">
                  PDF
                </span>
                <span className="text-left">
                  <span className="block text-sm2 font-bold">윤리경영 행동강령_v2.pdf</span>
                  <span className="block text-tiny font-bold text-brand-link">
                    ESG 정책 문서 / 노동·인권 · p.12~14
                  </span>
                </span>
              </button>
            </div>
          )}

          {search === 'miss' && (
            <div className="mt-[11px] rounded-r-[7px] border border-l-2 border-ink-200 border-l-warn bg-warn-soft px-3.5 py-3">
              <div className="mb-1 text-label font-bold">지정 폴더에서 근거를 찾지 못했습니다</div>
              <div className="mb-[9px] text-sm2 leading-[1.7] text-ink-500">
                우측 챗봇으로 전체 색인을 검색하거나, 자료를 보유한 담당자에게 요청을 보내세요.
              </div>
              <div className="flex gap-1.5">
                <button className="rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-cap font-bold text-ink-700 hover:bg-ink-100">
                  챗봇으로 검색
                </button>
                <button
                  onClick={() => openLayer('task-request')}
                  className="rounded-md bg-brand px-2.5 py-1.5 text-cap font-bold text-white"
                >
                  담당자에게 자료 요청
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 프로세스 + 답변 */}
        <div className="flex-1 px-4 pb-5 pt-3.5">
          <div className="mb-3.5 flex items-center">
            {PROCESS.map((label, i) => {
              const done = i <= doneStep
              return (
                <div key={label} className="flex flex-1 items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex size-[22px] flex-none items-center justify-center rounded-full border text-tiny font-extrabold"
                      style={{
                        background: done ? '#eff6ff' : '#fff',
                        borderColor: done ? '#bfdbfe' : '#e2e8f0',
                        color: done ? '#1345bd' : '#cbd5e1',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="whitespace-nowrap text-sm2 font-bold"
                      style={{ color: done ? '#0f172a' : '#94a3b8' }}
                    >
                      {label}
                    </span>
                  </div>
                  {i < PROCESS.length - 1 && <span className="mx-2.5 h-px flex-1 bg-ink-200" />}
                </div>
              )
            })}
          </div>

          <div className="border-t border-ink-200 bg-white px-[18px] py-3.5">
            <div className="mb-[9px] flex items-center gap-2">
              <span className="whitespace-nowrap text-sm2 font-extrabold">답변 내용</span>
              <span className="truncate text-xs2 text-ink-400">AI 초안 검토 후 확정 · 수작업 등록 가능</span>
            </div>

            <div className="mb-[11px] rounded-lg border border-ink-200 bg-ink-50 px-3.5 py-3">
              <div className="mb-2 text-tiny font-extrabold tracking-[.05em] text-ink-400">평가기관 요구 항목</div>
              <div className="flex flex-col gap-1.5">
                {REQ_ITEMS.map((r) => (
                  <button key={r.label} className="flex items-center gap-2 text-left hover:opacity-75">
                    <Icon name={r.icon} size={17} style={{ color: r.color }} />
                    <span className="min-w-0 flex-1 text-sm2 leading-[1.65] text-ink-700">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              placeholder="답변 내용을 입력하거나 AI 초안을 삽입하세요"
              className="w-full resize-none rounded-[7px] border border-ink-300 px-3.5 py-3 text-body leading-[1.75] outline-none"
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="whitespace-nowrap text-xs2 text-ink-400">{answer.length}자 · 권장 300~800자</span>
              <div className="flex-1" />
              {ANSWER_ACTIONS.map((a) => (
                <button
                  key={a}
                  onClick={() =>
                    setAnswer(
                      '당사는 「윤리경영 행동강령 v2」를 통해 아동노동 및 강제노동을 전면 금지하고 있으며, 대표이사 승인을 거쳐 전 사업장과 협력사에 배포하였습니다. 관련 조항은 제3장 12~14페이지에 명시되어 있습니다.',
                    )
                  }
                  className="whitespace-nowrap rounded-full bg-ink-200 px-[11px] py-1 text-xs2 font-bold text-ink-700 hover:text-ink-900"
                >
                  {a}
                </button>
              ))}
            </div>

            <div className="mb-2 mt-3.5 whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">
              첨부된 증빙 파일
            </div>
            <div className="mb-3.5 flex flex-col gap-1.5">
              {attachments.map((at) => (
                <div
                  key={at.name}
                  className="flex items-center gap-2 rounded-[7px] border border-ink-200 bg-ink-50 px-3 py-2"
                >
                  <span className="flex size-6 flex-none items-center justify-center rounded-[5px] border border-ink-200 bg-white font-mono text-[7.3px] font-extrabold text-ink-600">
                    {at.ext}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm2 font-bold">{at.name}</span>
                    <span className="block text-tiny text-ink-500">
                      {at.path} · {at.page}
                    </span>
                  </span>
                  <button
                    onClick={() => openLayer('viewer')}
                    className="flex-none rounded-[5px] border border-ink-300 bg-white px-[9px] py-[5px] text-xs2 font-semibold text-ink-700 hover:bg-ink-100"
                  >
                    열기
                  </button>
                  <button
                    onClick={() => setAttachments((a) => a.filter((x) => x.name !== at.name))}
                    className="size-[22px] flex-none p-0 text-ink-400 hover:text-bad-dark"
                  >
                    <Icon name="close" size={17} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => openLayer('file-upload')}
                className="rounded-[7px] border border-dashed border-ink-300 p-[9px] text-cap font-bold text-ink-500 hover:border-brand-link hover:text-brand-link"
              >
                + 증빙 파일 직접 첨부
              </button>
            </div>

            <div className="flex gap-1.5 border-t border-ink-100 pt-[13px]">
              <button
                onClick={() => openLayer('task-request')}
                className="rounded-md border border-ink-300 bg-white px-3 py-2 text-sm2 font-bold text-ink-700 hover:bg-ink-100"
              >
                자료 요청
              </button>
              <div className="flex-1" />
              <button className="rounded-md border border-ink-300 bg-white px-3 py-2 text-sm2 font-bold text-ink-700 hover:bg-ink-100">
                AI 초안으로 저장
              </button>
              <button className="rounded-md bg-brand px-[15px] py-2 text-sm2 font-bold text-white hover:bg-brand-dark">
                답변 확정
              </button>
            </div>
          </div>
        </div>
      </div>

      <PanelHandle side="right" open={botOpen} onClick={toggleBot} title={botOpen ? '챗봇 접기' : '챗봇 펼치기'} />
      {botOpen && (
        <ChatbotPanel
          kind="eco"
          scopeLabel="전체 RAG 색인 검색"
          scopeDesc="AI가 파일명과 페이지를 함께 제시합니다"
        />
      )}
    </div>
  )
}
