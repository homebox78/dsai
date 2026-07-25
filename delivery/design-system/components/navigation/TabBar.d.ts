/** 탭 — 패널 내부 전환은 underline, 좁은 영역(업무 존·미리보기 모달)은 segment. */
export interface TabBarProps {
  tabs: Array<{ id: string; label: string; count?: number }>;
  value: string;
  onChange?: (id: string) => void;
  variant?: 'underline' | 'segment';
}
export function TabBar(props: TabBarProps): JSX.Element;
