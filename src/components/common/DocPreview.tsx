import { useEffect, useState } from 'react'
import { Icon } from '@/components/common/icon'
import type { DocFile } from '@/mocks/data'

/**
 * 실제 파일 렌더러 — public/files/<id>.<ext> 의 실물 문서를 그대로 보여준다.
 * PDF = 브라우저 내장 뷰어(iframe, #page= 로 페이지 이동)
 * XLSX = SheetJS로 파싱해 시트 탭 + 표
 * DOCX = mammoth로 HTML 변환
 * 파일이 없으면(색인 대기 등) 안내 플레이스홀더.
 */

export const fileUrl = (f: DocFile) => `${import.meta.env.BASE_URL}files/${f.id}.${f.ext.toLowerCase()}`

export function DocPreview({ file, page, zoom = 100 }: { file: DocFile; page: number; zoom?: number }) {
  const ext = file.ext.toLowerCase()
  if (ext === 'pdf') return <PdfPreview file={file} page={page} zoom={zoom} />
  if (ext === 'xlsx') return <XlsxPreview file={file} />
  if (ext === 'docx') return <DocxPreview file={file} zoom={zoom} />
  return <Missing name={file.name} />
}

function Missing({ name }: { name: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-ink-400">
      <Icon name="draft" size={34} />
      <div className="text-label font-bold text-ink-500">{name}</div>
      <div className="text-sm2">미리보기를 만들 수 없는 형식입니다</div>
    </div>
  )
}

function Loading() {
  return (
    <div className="flex h-full items-center justify-center gap-2 text-sm2 text-ink-400">
      <Icon name="progress_activity" size={18} className="animate-spin" />
      문서를 여는 중…
    </div>
  )
}

function PdfPreview({ file, page, zoom }: { file: DocFile; page: number; zoom: number }) {
  // #page= 로 해당 페이지를 열고, 페이지가 바뀌면 key로 다시 로드한다
  return (
    <iframe
      key={`${file.id}-${page}`}
      title={file.name}
      src={`${fileUrl(file)}#page=${page}&zoom=${zoom}&toolbar=0&navpanes=0`}
      className="h-full w-full border-none bg-white"
    />
  )
}

function XlsxPreview({ file }: { file: DocFile }) {
  const [sheets, setSheets] = useState<{ name: string; rows: string[][] }[] | null>(null)
  const [active, setActive] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setSheets(null)
    setError(null)
    ;(async () => {
      try {
        const [{ read, utils }, res] = await Promise.all([import('xlsx'), fetch(fileUrl(file))])
        if (!res.ok) throw new Error('파일을 찾을 수 없습니다')
        const wb = read(await res.arrayBuffer(), { type: 'array' })
        const parsed = wb.SheetNames.map((name) => ({
          name,
          rows: utils.sheet_to_json<string[]>(wb.Sheets[name], { header: 1, defval: '', raw: false }),
        }))
        if (alive) {
          setSheets(parsed)
          setActive(0)
        }
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : '열 수 없습니다')
      }
    })()
    return () => {
      alive = false
    }
  }, [file.id])

  if (error) return <Missing name={file.name} />
  if (!sheets) return <Loading />

  const cur = sheets[active]
  return (
    <div className="flex h-full flex-col bg-white">
      {sheets.length > 1 && (
        <div className="flex flex-none gap-1 border-b border-ink-200 bg-ink-50 px-3 py-1.5">
          {sheets.map((s, i) => {
            const on = i === active
            return (
              <button
                key={s.name}
                onClick={() => setActive(i)}
                className="rounded-t-md border-b-2 px-2.5 py-1 text-sm2"
                style={{
                  borderBottomColor: on ? '#1750d8' : 'transparent',
                  color: on ? '#0f172a' : '#64748b',
                  fontWeight: on ? 700 : 500,
                  background: on ? '#fff' : 'transparent',
                }}
              >
                {s.name}
              </button>
            )
          })}
        </div>
      )}
      <div className="flex-1 overflow-auto">
        <table className="border-collapse text-sm2">
          <tbody>
            {cur.rows.map((row, ri) => (
              <tr key={ri} className={ri === 0 ? 'bg-ink-50' : undefined}>
                <td className="sticky left-0 z-[1] w-10 border border-ink-200 bg-ink-50 px-2 py-1 text-center font-mono text-mini text-ink-400">
                  {ri + 1}
                </td>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="whitespace-nowrap border border-ink-200 px-2.5 py-1"
                    style={{ fontWeight: ri === 0 ? 700 : 400, color: ri === 0 ? '#0f172a' : '#334155' }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DocxPreview({ file, zoom }: { file: DocFile; zoom: number }) {
  const [html, setHtml] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    setHtml(null)
    setError(false)
    ;(async () => {
      try {
        const [mammoth, res] = await Promise.all([import('mammoth/mammoth.browser'), fetch(fileUrl(file))])
        if (!res.ok) throw new Error('없음')
        const out = await mammoth.convertToHtml({ arrayBuffer: await res.arrayBuffer() })
        if (alive) setHtml(out.value)
      } catch {
        if (alive) setError(true)
      }
    })()
    return () => {
      alive = false
    }
  }, [file.id])

  if (error) return <Missing name={file.name} />
  if (html === null) return <Loading />

  return (
    <div className="flex h-full justify-center overflow-auto bg-ink-100 p-4">
      <div
        className="docx-body h-fit w-[min(760px,100%)] rounded-sm bg-white px-[52px] py-[46px] shadow-[0_1px_6px_rgba(15,23,42,.12)]"
        style={{ fontSize: `${(zoom / 100) * 14}px` }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
