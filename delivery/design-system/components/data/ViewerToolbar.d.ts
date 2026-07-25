/**
 * 전체화면 문서 뷰어 상단 툴바 (목업 문서 뷰어 헤더 그대로). 확장자 타일 · 파일명 + OCR/RAG 배지 · 페이지 페이저 · 다운로드 · 닫기.
 * @startingPoint section="Data" subtitle="문서 뷰어 툴바 · 페이지 페이저" viewport="820x110"
 */
export interface ViewerToolbarProps {
  /** 확장자 (PDF, DOCX …) */
  ext: string;
  name: string;
  /** OCR 완료 배지 */
  ocr?: boolean;
  /** RAG 준비 완료 배지 */
  rag?: boolean;
  page?: number;
  pages?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onDownload?: () => void;
  onClose?: () => void;
}
export function ViewerToolbar(props: ViewerToolbarProps): JSX.Element;
