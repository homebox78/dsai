/**
 * 파일·업무·멤버 목록의 행. 상하 11px / 좌우 18px 고정, 구분은 hairline 라인.
 * @startingPoint section="Layout" subtitle="파일·업무 목록 행 (선택·hover·확장자 타일)" viewport="700x200"
 */
export interface ListRowProps {
  /** 확장자 타일 표시 */
  tile?: boolean;
  /** 타일 안 문자 (PDF, DOCX …) */
  tileLabel?: string;
  /** 타일 대신 Material 아이콘 */
  icon?: string;
  title: React.ReactNode;
  /** 제목 아래 메타 한 줄 */
  meta?: React.ReactNode;
  /** 우측 배지·상태 */
  right?: React.ReactNode;
  selected?: boolean;
  /** 좌측 액센트 라인 색 (상태 강조) */
  accent?: string;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}
export function ListRow(props: ListRowProps): JSX.Element;
