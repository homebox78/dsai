/** 진행률 바 — 처리 상태, 커버리지, 진행 단계 합산(segments)에 사용. */
export interface ProgressBarProps {
  /** 0~100 (segments를 주면 무시) */
  value?: number | string;
  tone?: 'brand' | 'done' | 'wait' | 'alert';
  height?: number;
  label?: string;
  /** 우측 수치 텍스트 */
  right?: string;
  /** 합산 100%를 여러 색으로 나눌 때 */
  segments?: Array<{ width: string; color: string }>;
}
export function ProgressBar(props: ProgressBarProps): JSX.Element;
