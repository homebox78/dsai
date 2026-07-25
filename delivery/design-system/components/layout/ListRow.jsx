import React from 'react';

export function ListRow({ tile, tileLabel, icon, title, meta, right, selected, accent, onClick, onContextMenu, children }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick} onContextMenu={onContextMenu}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', justifyContent: 'flex-start',
        background: selected ? 'var(--surface-selected)' : (hover ? 'var(--surface-row-hover)' : 'var(--white)'),
        border: 'none', borderBottom: '1px solid var(--border-hairline)',
        borderLeft: '2px solid ' + (selected ? 'var(--border-brand)' : (accent || 'transparent')),
        padding: 'var(--row-py) var(--row-px)', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-ui)'
      }}>
      {tile ? (
        <span style={{
          flex: 'none', width: 28, height: 28, borderRadius: 'var(--r-md)', background: 'var(--slate-100)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 'var(--fw-black)', color: 'var(--slate-600)'
        }}>{tileLabel}</span>
      ) : null}
      {icon ? <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 18, color: 'var(--slate-600)', flex: 'none' }}>{icon}</span> : null}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', color: 'var(--text-body)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
        {meta ? <span style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--text-meta)', marginTop: 'var(--sp-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta}</span> : null}
        {children}
      </span>
      {right ? <span style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>{right}</span> : null}
    </button>
  );
}
