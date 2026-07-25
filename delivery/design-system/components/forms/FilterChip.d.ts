/**
 * 목록 상단 필터 칩. 활성 상태는 블루 채움, 우측에 해당 건수를 함께 노출한다.
 * @startingPoint section="Forms" subtitle="상태 필터 칩 · 건수 표기" viewport="700x120"
 */
export interface FilterChipProps {
  label: string;
  /** 필터에 해당하는 항목 수 */
  count?: number;
  active?: boolean;
  icon?: string;
  onClick?: () => void;
}
export function FilterChip(props: FilterChipProps): JSX.Element;
