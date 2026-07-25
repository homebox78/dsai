/**
 * 커스텀 셀렉트. 네이티브 <select>는 시스템 전체에서 사용 금지 — 항상 이 컴포넌트를 쓴다.
 * @startingPoint section="Forms" subtitle="펼침 목록 · 선택 체크 표시" viewport="700x200"
 */
export interface SelectProps {
  value: string;
  options: string[];
  onChange?: (value: string) => void;
  width?: number | string;
  /** 드롭다운 정렬 (우측 끝 컨트롤은 'right') */
  align?: 'left' | 'right';
  size?: 'sm' | 'md';
  disabled?: boolean;
}
export function Select(props: SelectProps): JSX.Element;
