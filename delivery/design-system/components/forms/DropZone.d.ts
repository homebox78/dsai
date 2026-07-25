/**
 * 파일 업로드 드롭존 — 점선 테두리, 업로드 아이콘, 안내·허용 형식. 업로드 모달·업무 첨부·참고자료 첨부 공용.
 * @startingPoint section="Forms" subtitle="파일 드롭존 (기본·compact)" viewport="700x220"
 */
export interface DropZoneProps {
  title?: string;
  /** 허용 형식·용량 안내. 빈 문자열이면 숨김 */
  hint?: string;
  /** Material 아이콘 (기본 upload) */
  icon?: string;
  /** 작은 버전 (인라인 첨부 버튼) */
  compact?: boolean;
  onSelect?: () => void;
}
export function DropZone(props: DropZoneProps): JSX.Element;
