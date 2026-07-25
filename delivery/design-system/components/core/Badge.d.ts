/** 상태·카운트 배지. 알약 형태, 800 weight, 10~11px. */
export interface BadgeProps {
  /** done=완료/검증, wait=검토대기, soon=임박, alert=미처리/초과, idle=중립, brand=선택 */
  tone?: 'done' | 'wait' | 'soon' | 'alert' | 'idle' | 'brand';
  /** 숫자 카운트 모드 (메뉴 배지) */
  count?: number | string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Badge(props: BadgeProps): JSX.Element;
