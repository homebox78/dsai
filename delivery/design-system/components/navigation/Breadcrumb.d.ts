/**
 * 헤더 아래 경로 영역 — 계층 경로 + 배지(파일 수·색인률) + 우측 액션.
 * @startingPoint section="Navigation" subtitle="경로 + 배지 + 우측 액션 바" viewport="700x110"
 */
export interface BreadcrumbProps {
  items: Array<{ label: string; onClick?: () => void }>;
  /** 경로 옆 상태 배지 */
  badges?: React.ReactNode;
  /** 우측 액션 버튼 */
  actions?: React.ReactNode;
}
export function Breadcrumb(props: BreadcrumbProps): JSX.Element;
