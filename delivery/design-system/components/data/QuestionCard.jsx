import React from 'react';

/* 에코바디스 OCR 문항 카드. 문항번호(모노 배지) + 상태 배지, 질문 2줄 클램프,
   하단에 평가영역 + 증빙 첨부 수(연결되면 green). 목록 행으로 배치. */
const TONES = {
  '답변완료': ['done'], 'AI 초안': ['brand'], '검토대기': ['wait'], '미처리': ['idle'], '자료요청': ['soon']
};
export function QuestionCard({ no, status, question, category, files = 0, selected, onClick }) {
  const [hover, setHover] = React.useState(false);
  const tone = (TONES[status] || ['idle'])[0];
  const stBg = tone === 'brand' ? 'var(--surface-selected)' : 'var(--state-' + tone + '-bg)';
  const stFg = tone === 'brand' ? 'var(--text-accent)' : 'var(--state-' + tone + '-fg)';
  const hasFiles = files > 0;
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', display: 'block', textAlign: 'left',
        background: selected ? 'var(--surface-selected)' : (hover ? 'var(--surface-row-hover)' : 'var(--white)'),
        border: 'none', borderBottom: '1px solid var(--border-hairline)',
        borderLeft: '2px solid ' + (selected ? 'var(--border-brand)' : 'var(--state-' + tone + '-bar)'),
        padding: '12px var(--row-px)', cursor: 'pointer', fontFamily: 'var(--font-ui)'
      }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-1)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-10)', fontWeight: 'var(--fw-black)', color: 'var(--slate-600)', background: 'var(--slate-200)', borderRadius: 'var(--r-xs)', padding: '2px 5px' }}>{no}</span>
        <span style={{ marginLeft: 'auto', fontSize: 'var(--fs-10)', fontWeight: 'var(--fw-black)', borderRadius: 'var(--r-pill)', padding: '2px 8px', background: stBg, color: stFg }}>{status}</span>
      </span>
      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: 'var(--fs-12-1)', fontWeight: 'var(--fw-medium)', lineHeight: 1.65, color: 'var(--text-body)' }}>{question}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginTop: 'var(--sp-1)' }}>
        <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-meta)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{category}</span>
        <span style={{ marginLeft: 'auto', flex: 'none', display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', fontSize: 'var(--fs-10)', color: hasFiles ? 'var(--state-done-fg)' : 'var(--text-meta)' }}>
          <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 12.6 }}>attach_file</span>{files}
        </span>
      </span>
    </button>
  );
}
