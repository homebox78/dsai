/** 헤더 아이콘·컨트롤에 붙는 팝오버 컨테이너 (알림·도움말·프로필·스위처). */
export interface DropdownProps {
  open?: boolean;
  width?: number;
  /** 트리거 기준 정렬 */
  align?: 'left' | 'right';
  /** 트리거로부터의 top offset */
  top?: number;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}
export function Dropdown(props: DropdownProps): JSX.Element | null;
