/**
 * 대시보드 상단 KPI. 카드가 아니라 세로 라인으로 구분된 타일 4개를 한 줄에 놓는다.
 * @startingPoint section="Data" subtitle="KPI 타일 4분할 · 진행 바 · 증감" viewport="700x140"
 */
export interface KpiTileProps {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  /** 증감 표기 (예: '+128') */
  delta?: string;
  deltaTone?: 'idle' | 'done' | 'alert';
  /** 0~100 진행 바 */
  progress?: number;
  /** 수치 색 강조 */
  tone?: 'body' | 'done' | 'alert';
  onClick?: () => void;
}
export function KpiTile(props: KpiTileProps): JSX.Element;
