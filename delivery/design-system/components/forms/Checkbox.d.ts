/** 체크박스 — Material check_box 글리프 사용 (커스텀 사각형 그리지 않음). */
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
  /** 라벨 아래 설명 한 줄 */
  sub?: string;
  disabled?: boolean;
}
export function Checkbox(props: CheckboxProps): JSX.Element;
