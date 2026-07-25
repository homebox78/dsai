/** 좌측 프로젝트 메뉴 항목. 접힘 상태에서는 아이콘만 48px 폭 중앙 정렬. */
export interface SideMenuItemProps {
  /** Material Symbols Rounded 아이콘명 */
  icon: string;
  label: string;
  badge?: number | string;
  /** 미처리 건수는 'alert' */
  badgeTone?: 'idle' | 'alert';
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}
export function SideMenuItem(props: SideMenuItemProps): JSX.Element;
