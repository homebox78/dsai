/**
 * 생성·업로드·확인 등 모든 입력 흐름은 모달 레이어로 처리한다 (새 페이지 금지).
 * @startingPoint section="Overlay" subtitle="헤더·본문·5:5 푸터 모달" viewport="700x420"
 */
export interface ModalProps {
  open?: boolean;
  title: string;
  /** 제목 아래 한 줄 설명 */
  sub?: string;
  /** 460~540px 사이 값을 권장 */
  width?: number;
  onClose?: () => void;
  /** 푸터 버튼 (두 개일 때 각각 fullWidth로 5:5) */
  footer?: React.ReactNode;
  children?: React.ReactNode;
}
export function Modal(props: ModalProps): JSX.Element | null;
