import { Icon } from '@/components/common/icon'

/**
 * 파일 확장자 아이콘.
 * 시안의 "PDF/XLSX" 텍스트 배지 대신 확장자별 Material Symbols 아이콘 + 고유 색으로 보여준다.
 */
const MAP: Record<string, { icon: string; fg: string; bg: string }> = {
  pdf: { icon: 'picture_as_pdf', fg: '#dc2626', bg: '#fef2f2' },
  xlsx: { icon: 'table_chart', fg: '#15803d', bg: '#ecfdf3' },
  xls: { icon: 'table_chart', fg: '#15803d', bg: '#ecfdf3' },
  csv: { icon: 'table_chart', fg: '#15803d', bg: '#ecfdf3' },
  docx: { icon: 'description', fg: '#1d4ed8', bg: '#eff6ff' },
  doc: { icon: 'description', fg: '#1d4ed8', bg: '#eff6ff' },
  hwp: { icon: 'article', fg: '#0369a1', bg: '#f0f9ff' },
  pptx: { icon: 'slideshow', fg: '#c2410c', bg: '#fff7ed' },
  ppt: { icon: 'slideshow', fg: '#c2410c', bg: '#fff7ed' },
  zip: { icon: 'folder_zip', fg: '#7c3aed', bg: '#f5f3ff' },
  png: { icon: 'image', fg: '#7c3aed', bg: '#f5f3ff' },
  jpg: { icon: 'image', fg: '#7c3aed', bg: '#f5f3ff' },
  jpeg: { icon: 'image', fg: '#7c3aed', bg: '#f5f3ff' },
}

export function FileExt({ ext, size = 26, className = '' }: { ext?: string; size?: number; className?: string }) {
  const k = (ext || '').toLowerCase().replace(/^\./, '')
  const d = MAP[k] ?? { icon: 'draft', fg: '#475569', bg: '#f1f5f9' }
  return (
    <span
      title={k.toUpperCase()}
      aria-label={`${k.toUpperCase()} 파일`}
      className={`flex flex-none items-center justify-center rounded-[5px] ${className}`}
      style={{ width: size, height: size, background: d.bg, color: d.fg }}
    >
      <Icon name={d.icon} size={Math.round(size * 0.66)} />
    </span>
  )
}
