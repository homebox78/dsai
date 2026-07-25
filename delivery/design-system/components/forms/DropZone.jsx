import React from 'react';

/* 파일 업로드 드롭존. 점선 테두리 + 업로드 아이콘 + 안내/허용 형식.
   hover 시 블루 테두리 + 블루 tint. 업로드 모달·업무 첨부·참고자료 첨부에 공용. */
export function DropZone({ title = '파일을 끌어다 놓거나 클릭해서 선택', hint = 'PDF, DOCX, XLSX, HWP, 이미지 · 1건당 100MB까지', icon = 'upload', compact, onSelect }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onSelect}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-2)',
        border: '1px dashed ' + (hover ? 'var(--focus-border)' : 'var(--border-control)'),
        background: hover ? 'var(--surface-selected)' : (compact ? 'transparent' : 'var(--surface-canvas)'),
        borderRadius: 'var(--r-2xl)', padding: compact ? '10px 16px' : '22px 16px', cursor: 'pointer',
        transition: 'border-color var(--dur-fast), background var(--dur-fast)', fontFamily: 'var(--font-ui)'
      }}>
      <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: compact ? 20 : 27.6, color: 'var(--blue-700)' }}>{icon}</span>
      <span style={{ fontSize: compact ? 'var(--fs-12-1)' : 'var(--fs-14)', fontWeight: 'var(--fw-bold)', color: 'var(--text-label)', textAlign: 'center' }}>{title}</span>
      {hint ? <span style={{ fontSize: 'var(--fs-11-2)', color: 'var(--text-meta)', textAlign: 'center' }}>{hint}</span> : null}
    </button>
  );
}
