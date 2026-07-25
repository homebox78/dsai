/**
 * 관리자 시스템 테이블 — 조직&사업부 / 채널 관리 / 권한 그룹이 공유하는 폼. 아이콘 타일 + 이름/부제, 가운데 데이터 열, 태그 배지, 행 액션.
 * @startingPoint section="Data" subtitle="관리 테이블 · 채널·조직&사업부·권한 그룹" viewport="720x260"
 */
export interface AdminRow {
  /** Material 아이콘 (좌측 타일) */
  icon: string;
  name: string;
  sub?: string;
  /** 가운데 정렬 데이터 셀들 (헤더 개수 - 3개) */
  cells?: React.ReactNode[];
  tag: string;
  /** 태그 배지 톤 */
  tagTone?: 'open' | 'limit' | 'admin' | 'idle';
  action: string;
}
export interface AdminTableProps {
  /** grid-template-columns (첫 열 이름, 마지막 두 열 태그·액션) */
  cols: string;
  headers: string[];
  rows: AdminRow[];
  minWidth?: number;
  onAction?: (row: AdminRow) => void;
}
export function AdminTable(props: AdminTableProps): JSX.Element;
