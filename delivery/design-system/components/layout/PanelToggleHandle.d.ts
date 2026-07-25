/** 패널 경계선 위에 떠 있는 22px 원형 접기 핸들. 메뉴·서브목록·챗봇 영역 공통. */
export interface PanelToggleHandleProps {
  /** 핸들이 붙는 경계의 방향 */
  side?: 'left' | 'right';
  open?: boolean;
  /** 상단에서의 거리 (기본 96px) */
  top?: number;
  title?: string;
  onClick?: () => void;
}
export function PanelToggleHandle(props: PanelToggleHandleProps): JSX.Element;
