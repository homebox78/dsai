/**
 * 채팅룸 메시지 버블 (목업 chatMsgs 렌더 그대로). 이름·시간 헤더 + 버블 + 호버 액션(답장·고정·업무요청) + 리액션 + 첨부/업무요청 카드.
 * @startingPoint section="Data" subtitle="채팅 메시지 · 리액션 · 첨부 · 업무요청" viewport="700x420"
 */
export interface ChatBubbleProps {
  /** 내가 보낸 메시지 (우측 정렬·블루 채움, 이름은 '나') */
  mine?: boolean;
  /** 발신자 표시명 (내 메시지는 '나') */
  name: string;
  time?: string;
  text?: React.ReactNode;
  /** 내 메시지 읽음 표기 (예: '읽음 3') */
  read?: string;
  /** 이모지 리액션 칩 */
  reactions?: Array<{ icon: string; count: number; color: string }>;
  /** 첨부 파일 (버블 아래 좌측 라인 카드) */
  file?: { ext: string; name: string; size?: string };
  /** 업무요청 카드 */
  task?: { title: string; status: string; tone?: 'done' | 'wait' | 'soon' | 'alert' | 'idle'; bar?: string; to: string; due: string };
  onReply?: () => void;
  onPin?: () => void;
  onTask?: () => void;
  onFile?: () => void;
  onTaskOpen?: () => void;
}
export function ChatBubble(props: ChatBubbleProps): JSX.Element;
