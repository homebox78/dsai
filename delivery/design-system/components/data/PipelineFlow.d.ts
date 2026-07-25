/**
 * 문서 파이프라인 흐름 — 처리 단계(업로드→OCR→RAG 색인→검색)를 아이콘+수치+라벨로 잇는 가로 요약.
 * @startingPoint section="Data" subtitle="파이프라인 단계 흐름 (대시보드)" viewport="700x110"
 */
export interface PipelineStage {
  /** Material 아이콘 */
  icon: string;
  /** 단계 수치 (문서 건수 등) */
  count: number | string;
  label: string;
  /** 단계 색 — idle=중립, wait=처리중(amber), done=완료(green), brand=이용(blue) */
  tone?: 'idle' | 'wait' | 'done' | 'brand';
}
export interface PipelineFlowProps {
  stages: PipelineStage[];
  onStage?: (stage: PipelineStage) => void;
}
export function PipelineFlow(props: PipelineFlowProps): JSX.Element;
