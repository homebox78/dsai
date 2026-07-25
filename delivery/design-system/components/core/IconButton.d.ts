/** 정사각 아이콘 버튼 — 헤더 컨트롤, 툴바, 행 액션에 사용. */
export interface IconButtonProps {
  /** Material Symbols Rounded 아이콘명 */
  icon: string;
  /** 기본 30px (헤더/툴바), 22px는 경계 핸들 전용 */
  size?: number;
  /** 딥블루 헤더 위 배치 */
  onBrand?: boolean;
  active?: boolean;
  /** 우상단 카운트 배지 */
  badge?: number | string;
  title?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function IconButton(props: IconButtonProps): JSX.Element;
