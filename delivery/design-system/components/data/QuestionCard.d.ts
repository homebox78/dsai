/**
 * 에코바디스 OCR 문항 카드 — 문항번호·상태 배지·질문 2줄·평가영역·증빙 첨부 수. 문항 목록 행으로 배치.
 * @startingPoint section="Data" subtitle="문항 카드 (답변완료·AI 초안·미처리·자료요청)" viewport="360x300"
 */
export interface QuestionCardProps {
  /** 문항번호 (ENV 1.1 등) */
  no: string;
  /** 답변완료 | AI 초안 | 검토대기 | 미처리 | 자료요청 */
  status: string;
  question: string;
  /** 평가영역 · 세부 (환경 · 정책) */
  category?: string;
  /** 연결된 증빙 수 (0이면 회색) */
  files?: number;
  selected?: boolean;
  onClick?: () => void;
}
export function QuestionCard(props: QuestionCardProps): JSX.Element;
