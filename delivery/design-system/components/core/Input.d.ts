/**
 * 텍스트 입력. 폼에서는 테두리형, 목록 상단 검색에서는 underline 형을 쓴다.
 * @startingPoint section="Core" subtitle="라벨·필수·힌트·검색 underline 입력" viewport="700x180"
 */
export interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  /** 라벨 옆 "필수" 표기 */
  required?: boolean;
  hint?: string;
  /** 좌측 Material 아이콘 (검색은 'search') */
  icon?: string;
  /** 목록·패널 상단 검색용 밑줄 스타일 */
  underline?: boolean;
  disabled?: boolean;
  type?: string;
  style?: React.CSSProperties;
}
export function Input(props: InputProps): JSX.Element;
