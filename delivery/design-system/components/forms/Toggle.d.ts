/** 설정 스위치 — 라벨+설명과 함께 행 단위로 사용. */
export interface ToggleProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: string;
  sub?: string;
  disabled?: boolean;
}
export function Toggle(props: ToggleProps): JSX.Element;
