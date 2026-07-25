/** 우측에서 밀려 들어오는 시트 — 업무 요청, 전역 챗, 알림 스트림처럼 화면 문맥을 유지해야 하는 흐름. */
export interface SheetProps {
  open?: boolean;
  title: string;
  sub?: string;
  /** 340~420px */
  width?: number;
  onClose?: () => void;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}
export function Sheet(props: SheetProps): JSX.Element | null;
