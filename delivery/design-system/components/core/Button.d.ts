/**
 * 시스템의 기본 액션 버튼. 프라이머리는 화면·모달당 1개 원칙.
 * @startingPoint section="Core" subtitle="Primary · secondary · ghost · onBrand 버튼" viewport="700x150"
 */
export interface ButtonProps {
  /** 시각 위계. onBrand는 딥블루 헤더 위에서만 사용 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'onBrand' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Material Symbols Rounded 아이콘명 (예: 'upload') */
  icon?: string;
  iconEnd?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  title?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Button(props: ButtonProps): JSX.Element;
