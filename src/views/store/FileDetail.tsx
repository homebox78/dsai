import { useState } from 'react'
import { useQaState } from '@/lib/qa-state'
import { Icon } from '@/components/common/icon'
import { fileStatusTone, type DocFile } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'
import { DocPreview, fileUrl } from '@/components/common/DocPreview'

/** 파일 상세 (p40) — 요약 hide/show · 탭 4종 · 뷰어 · 메타/버전/활동 */

const TABS: [string, string][] = [
  ['preview', '문서 보기'],
  ['meta', '메타데이터'],
  ['version', '버전'],
  ['activity', '활동'],
]

const VERSIONS = [
  { ver: 'v3', note: '법무 검토 반영 · 해지 조항 개정', who: '김대성', time: '07.21 16:40', size: '1.2MB', state: '현재', stBg: '#ecfdf3', stFg: '#15803d', bar: '#16a34a', action: '다운로드' },
  { ver: 'v2', note: '조항 번호 정리', who: '우덕성', time: '07.14 11:05', size: '1.1MB', state: '보관', stBg: '#f1f5f9', stFg: '#64748b', bar: '#cbd5e1', action: '복원' },
  { ver: 'v1', note: '최초 업로드', who: '김대성', time: '06.30 09:12', size: '1.0MB', state: '보관', stBg: '#f1f5f9', stFg: '#64748b', bar: '#cbd5e1', action: '복원' },
]

const ACTIVITY = [
  { who: '이수진', time: '07.24 10:20', tag: '검색', text: '챗봇에서 이 문서를 근거로 조회 (p.47 해지 조항)', dot: '#1750d8' },
  { who: '시스템', time: '07.21 16:45', tag: 'RAG', text: 'v3 색인 완료 · 청크 654개 재생성', dot: '#16a34a' },
  { who: '김대성', time: '07.21 16:40', tag: '버전', text: 'v3 업로드 · 법무 검토 반영', dot: '#94a3b8' },
  { who: '나', time: '07.20 14:02', tag: '공유', text: '김대성 채팅룸에 파일 공유', dot: '#94a3b8' },
  { who: '시스템', time: '06.30 09:15', tag: 'OCR', text: '텍스트 추출 완료 · 218페이지', dot: '#16a34a' },
]

const KEY_PAGES = [
  { label: 'p.47 해지 조항', page: 47, quote: '제12조(계약의 해지) ① 일방 당사자가 본 계약상 의무를 중대하게 위반한 경우…' },
  { label: 'p.132 배상 기준', page: 132, quote: '[별표 3] 손해배상 예정액 산정 기준 — 지연 1일당 계약금액의 1,000분의 1.5' },
]

export function FileDetail({ file, folderName }: { file: DocFile; folderName: string }) {
  const { setStoreMode } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [tab, setTab] = useQaState('detailTab', 'preview')
  const [summaryOpen, setSummaryOpen] = useQaState('summaryOpen', true)
  const [page, setPage] = useState(1)
  const [highlight, setHighlight] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)

  const st = fileStatusTone[file.status]

  const metaRows = [
    { label: '파일명', value: file.name, color: '#0f172a' },
    { label: '위치', value: `문서 저장소 / ${folderName}`, color: '#0f172a' },
    { label: '형식 · 용량', value: `${file.ext} · ${file.size} · ${file.pages}페이지`, color: '#0f172a' },
    { label: '등록자 · 등록일', value: `${file.owner} · 2026.${file.date}`, color: '#0f172a' },
    { label: 'OCR 처리', value: file.status === 'OCR 처리중' ? '진행중 (62%)' : `완료 · 텍스트 추출 ${file.pages}페이지`, color: file.status === 'OCR 처리중' ? '#b45309' : '#15803d' },
    { label: 'RAG 색인', value: file.status === 'RAG 색인 완료' ? `완료 · 청크 ${file.pages * 3}개 · 추론 검색 가능` : '대기중', color: file.status === 'RAG 색인 완료' ? '#15803d' : '#64748b' },
    { label: '문서 분류', value: file.tags.join(' · '), color: '#0f172a' },
    { label: '보존 기한', value: '2031.12.31 (5년 보존)', color: '#0f172a' },
    { label: '접근 권한', value: '프로젝트 멤버 6명 · 외부 공유 없음', color: '#0f172a' },
    { label: '인용 현황', value: '에코바디스 답변 3건에서 근거로 사용', color: '#1345bd' },
  ]

  const btn = 'rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-sm2 font-semibold text-ink-700 hover:bg-ink-100'

  return (
    <>
      <div className="flex-none border-b border-ink-200 bg-white">
        <div className="flex items-center gap-2 px-3.5 py-3">
          <span className="flex size-7 flex-none items-center justify-center rounded-md bg-ink-100 font-mono text-[8.7px] font-extrabold text-ink-600">
            {file.ext}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-base2 font-extrabold">{file.name}</div>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className="whitespace-nowrap rounded-full px-2 py-0.5 text-mini font-bold"
                style={{ background: st.bg, color: st.fg }}
              >
                {file.status}
              </span>
              <span className="whitespace-nowrap rounded-full bg-ok-soft px-2 py-0.5 text-mini font-bold text-ok-dark">
                RAG 준비 완료
              </span>
              <span className="whitespace-nowrap text-xs2 text-ink-400">
                {file.owner} 등록 · {file.date} · {file.pages}p
              </span>
            </div>
          </div>
          <button onClick={() => setSummaryOpen((v) => !v)} className={btn}>
            {summaryOpen ? '요약 숨기기' : '요약 보기'}
          </button>
          <button onClick={() => setStoreMode('editor')} className={btn}>
            문서 수정
          </button>
          <button className={btn}>다운로드</button>
          <button
            onClick={() => openLayer('viewer')}
            className="rounded-md bg-brand px-2.5 py-1.5 text-sm2 font-bold text-white hover:bg-brand-dark"
          >
            뷰어 열기
          </button>
          <button
            onClick={() => openLayer('file-delete')}
            className="rounded-md border border-bad-border bg-white px-2.5 py-1.5 text-sm2 font-semibold text-bad-dark hover:bg-bad-soft"
          >
            삭제
          </button>
        </div>

        {summaryOpen && (
          <div className="px-3.5 pb-3">
            <div className="rounded-r-[7px] border border-l-2 border-ink-200 border-l-brand-link bg-ink-50 px-3.5 py-3">
              <div className="mb-[5px] text-tiny font-extrabold tracking-[.05em] text-brand-link-dark">AI 문서 요약</div>
              <div className="text-label leading-[1.75] text-ink-700">
                {file.summary}. 문서 내 주요 조항과 수치는 RAG 색인에 저장되어 챗봇 추론 검색으로 페이지 단위 조회가 가능합니다.
              </div>
              <div className="mt-[9px] flex flex-wrap gap-1.5">
                {file.tags.map((t) => (
                  <span
                    key={t}
                    className="whitespace-nowrap rounded-full border border-ink-200 bg-white px-2 py-0.5 text-tiny font-semibold text-ink-600"
                  >
                    {t}
                  </span>
                ))}
                {KEY_PAGES.map((k) => (
                  <button
                    key={k.label}
                    onClick={() => { setPage(k.page); setHighlight(k.quote); setTab('preview') }}
                    className="whitespace-nowrap rounded-full border border-brand-border bg-white px-[9px] py-0.5 text-tiny font-bold text-brand-dark hover:bg-brand-soft"
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-surface-rail">
        <div className="flex h-[38px] flex-none items-center gap-2 border-b border-ink-200 bg-white px-3.5">
          {TABS.map(([id, label]) => {
            const on = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="whitespace-nowrap border-b-2 px-[9px] py-2.5 text-cap font-bold hover:text-ink-900"
                style={{ borderBottomColor: on ? '#1750d8' : 'transparent', color: on ? '#0f172a' : '#94a3b8' }}
              >
                {label}
              </button>
            )
          })}
          <div className="flex-1" />
          {tab === 'preview' && (
            <>
              <div className="flex items-center gap-1 rounded-md bg-ink-200 px-[5px] py-[3px]">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); setHighlight(null) }}
                  className="size-[22px] flex-none rounded border border-ink-200 bg-white p-0 text-ink-600"
                >
                  <Icon name="chevron_left" size={17} />
                </button>
                <span className="min-w-[74px] text-center text-cap font-bold">
                  {page} / {file.pages}p
                </span>
                <button
                  onClick={() => { setPage((p) => Math.min(file.pages, p + 1)); setHighlight(null) }}
                  className="size-[22px] flex-none rounded border border-ink-200 bg-white p-0 text-ink-600"
                >
                  <Icon name="chevron_right" size={17} />
                </button>
              </div>
              <button
                onClick={() => setZoom((z) => Math.max(60, z - 20))}
                title="축소"
                className="size-[26px] rounded-[5px] border border-ink-300 bg-white p-0 text-ink-700 hover:bg-ink-100"
              >
                <Icon name="zoom_out" size={17} />
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(200, z + 20))}
                title="확대"
                className="size-[26px] rounded-[5px] border border-ink-300 bg-white p-0 text-ink-700 hover:bg-ink-100"
              >
                <Icon name="zoom_in" size={17} />
              </button>
              <a
                href={fileUrl(file)}
                download={file.name}
                title="원본 내려받기"
                className="flex size-[26px] items-center justify-center rounded-[5px] border border-ink-300 bg-white text-ink-700 hover:bg-ink-100"
              >
                <Icon name="download" size={17} />
              </a>
            </>
          )}
        </div>

        {tab === 'preview' && (
          <div className="flex min-h-0 flex-1 flex-col">
            {highlight && (
              <div className="flex-none border-b border-warn-light bg-warn-soft px-4 py-3 text-label leading-[1.8]">
                <div className="mb-[5px] text-mini font-extrabold tracking-[.05em] text-warn-dark">AI가 찾은 구절</div>
                {highlight}
              </div>
            )}
            {/* 실제 파일 렌더 — public/files/<id>.<ext> */}
            <div className="min-h-0 flex-1">
              <DocPreview file={file} page={page} zoom={zoom} />
            </div>
          </div>
        )}

        {tab === 'meta' && (
          <div className="flex-1 overflow-auto bg-white p-4">
            <div className="w-full">
              {metaRows.map((m) => (
                <div key={m.label} className="grid grid-cols-[132px_1fr] gap-3 border-b border-ink-100 px-[18px] py-[11px]">
                  <span className="whitespace-nowrap text-sm2 text-ink-400">{m.label}</span>
                  <span className="min-w-0 text-label font-semibold" style={{ color: m.color }}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-[11px] rounded-md border border-ink-300 bg-white px-3 py-2 text-sm2 font-bold text-ink-700 hover:bg-ink-100">
              메타데이터 수정
            </button>
          </div>
        )}

        {tab === 'version' && (
          <div className="flex-1 overflow-auto bg-ink-50 p-4">
            <div className="flex w-full flex-col gap-2">
              {VERSIONS.map((v) => (
                <div
                  key={v.ver}
                  className="flex items-center gap-3 rounded-r-lg border border-l-2 border-ink-200 bg-white px-3.5 py-3"
                  style={{ borderLeftColor: v.bar }}
                >
                  <span className="flex-none rounded bg-ink-200 px-[7px] py-[2.5px] font-mono text-tiny font-extrabold text-ink-600">
                    {v.ver}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-label font-bold">{v.note}</span>
                    <span className="mt-1 block whitespace-nowrap text-xs2 text-ink-400">
                      {v.who} · {v.time} · {v.size}
                    </span>
                  </span>
                  <span
                    className="flex-none whitespace-nowrap rounded-full px-2 py-0.5 text-tiny font-extrabold"
                    style={{ background: v.stBg, color: v.stFg }}
                  >
                    {v.state}
                  </span>
                  <button className="flex-none whitespace-nowrap rounded-[5px] border border-ink-300 bg-white px-[9px] py-[5px] text-xs2 font-bold text-ink-700 hover:bg-ink-100">
                    {v.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <div className="flex-1 overflow-auto bg-ink-50 p-4">
            <div className="flex w-full flex-col">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex w-2.5 flex-none flex-col items-center">
                    <span className="mt-1 size-[9px] flex-none rounded-full" style={{ background: a.dot }} />
                    <span className="mt-1 w-px flex-1 bg-ink-200" />
                  </div>
                  <div className="min-w-0 flex-1 pb-[15px]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="whitespace-nowrap text-sm2 font-bold">{a.who}</span>
                      <span className="whitespace-nowrap text-tiny text-ink-400">{a.time}</span>
                      <span className="whitespace-nowrap rounded-full bg-ink-200 px-[7px] py-px text-mini font-bold text-ink-700">
                        {a.tag}
                      </span>
                    </div>
                    <div className="mt-1 text-label leading-[1.7] text-ink-700">{a.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
