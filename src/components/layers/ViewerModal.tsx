import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@/components/common/icon'
import { ChatbotPanel } from '@/components/common/ChatbotPanel'
import { findFile } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayer } from '@/stores/layer-store'
import { DocPreview, fileUrl } from '@/components/common/DocPreview'

/**
 * 전체화면 문서 뷰어 (p40) — 실제 파일(public/files) 렌더 + 문서 챗봇.
 * PDF는 브라우저 뷰어, XLSX/DOCX는 파싱해 표·본문으로 보여준다.
 */

export function ViewerModal() {
  const { isOpen, close } = useLayer('viewer')
  const fileId = useAppStore((s) => s.fileId)
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(100)

  if (!isOpen) return null
  const file = (fileId ? findFile(fileId) : null) ?? findFile('c1')!

  const iconBtn = 'size-[28px] flex-none rounded-md border border-ink-300 bg-white p-0 text-ink-600 hover:bg-ink-100'

  return createPortal(
    <div className="anim-fade fixed inset-0 z-[90] flex flex-col bg-surface-rail">
      {/* 뷰어 헤더 */}
      <div className="flex h-[52px] flex-none items-center gap-2 border-b border-ink-200 bg-white px-3.5">
        <span className="flex size-7 flex-none items-center justify-center rounded-md bg-ink-100 font-mono text-[8.7px] font-extrabold text-ink-600">
          {file.ext}
        </span>
        <div className="min-w-0">
          <div className="truncate text-label font-extrabold">{file.name}</div>
          <div className="text-xs2 text-ink-400">
            {file.owner} 등록 · {file.pages}페이지 · RAG 색인 완료
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1 rounded-md bg-ink-200 px-1 py-[3px]">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="size-[22px] rounded border border-ink-200 bg-white p-0 text-ink-600"
          >
            <Icon name="chevron_left" size={16} />
          </button>
          <span className="min-w-[74px] text-center text-cap font-bold">
            {page} / {file.pages}p
          </span>
          <button
            onClick={() => setPage((p) => Math.min(file.pages, p + 1))}
            className="size-[22px] rounded border border-ink-200 bg-white p-0 text-ink-600"
          >
            <Icon name="chevron_right" size={16} />
          </button>
        </div>

        <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className={iconBtn}>
          <Icon name="zoom_out" size={17} />
        </button>
        <span className="w-[46px] text-center text-xs2 font-bold text-ink-600">{zoom}%</span>
        <button onClick={() => setZoom((z) => Math.min(200, z + 10))} className={iconBtn}>
          <Icon name="zoom_in" size={17} />
        </button>
        <a
          href={fileUrl(file)}
          download={file.name}
          className={`${iconBtn} flex items-center justify-center`}
          title="다운로드"
        >
          <Icon name="download" size={17} />
        </a>
        <button className={iconBtn} title="인쇄">
          <Icon name="print" size={17} />
        </button>
        <button
          onClick={close}
          className="ml-1 flex items-center gap-1 rounded-md border border-ink-300 bg-white px-2.5 py-1.5 text-sm2 font-bold text-ink-700 hover:bg-ink-100"
        >
          <Icon name="close" size={17} />
          닫기
        </button>
      </div>

      {/* 본문 + 챗봇 */}
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <DocPreview file={file} page={page} zoom={zoom} />
        </div>

        <ChatbotPanel
          kind="viewer"
          scopeLabel={`문서: ${file.name}`}
          scopeDesc="이 문서 안에서 의미로 추론해 페이지를 찾아줍니다"
          showTaskTab={false}
        />
      </div>
    </div>,
    document.body,
  )
}
