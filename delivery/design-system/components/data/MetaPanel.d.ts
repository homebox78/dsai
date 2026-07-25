/**
 * 파일 상세 메타데이터 패널 — 라벨↔값 정의 목록. 목업 파일 상세 '메타데이터' 탭 그대로.
 * @startingPoint section="Data" subtitle="파일 메타 · 라벨↔값 정의 목록" viewport="480x360"
 */
export interface MetaRow {
  label: string;
  value: React.ReactNode;
  /** 값 강조 톤 (OCR/RAG 완료=done, 처리중=wait, 인용 현황=accent) */
  tone?: 'body' | 'done' | 'wait' | 'alert' | 'accent' | 'sub';
  /** 우측 인라인 액션 (복사·이동 등) */
  action?: string;
  onAction?: () => void;
}
export interface MetaPanelProps {
  rows: MetaRow[];
  /** 라벨 열 폭 (기본 96px) */
  labelWidth?: number;
  dense?: boolean;
}
export function MetaPanel(props: MetaPanelProps): JSX.Element;
