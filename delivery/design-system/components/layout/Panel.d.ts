/**
 * 콘텐츠 영역의 기본 컨테이너. 44px 헤더 라인 + 본문. 테이블을 담을 때는 flush.
 * @startingPoint section="Layout" subtitle="44px 헤더 라인 + 본문 패널" viewport="700x220"
 */
export interface PanelProps {
  title?: string;
  /** 헤더 좌측 Material 아이콘 */
  icon?: string;
  /** 제목 옆 보조 설명 */
  sub?: string;
  /** 헤더 우측 액션 (Button variant="link" 등) */
  actions?: React.ReactNode;
  /** 연회색 배경 패널 */
  tint?: boolean;
  /** 본문 패딩 제거 (테이블·목록을 라인으로 붙일 때) */
  flush?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Panel(props: PanelProps): JSX.Element;
