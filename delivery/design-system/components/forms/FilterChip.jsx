import React from 'react';

export function FilterChip({ label, count, active, icon, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)',
        background: active ? 'var(--surface-brand)' : (hover ? 'var(--slate-100)' : 'var(--white)'),
        border: '1px solid ' + (active ? 'var(--surface-brand)' : 'var(--border-control)'),
        color: active ? 'var(--text-on-brand)' : 'var(--text-label)',
        borderRadius: 'var(--r-pill)', padding: '6px 11px',
        fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-12-1)', fontWeight: 'var(--fw-bold)',
        whiteSpace: 'nowrap', cursor: 'pointer', transition: 'background var(--dur-fast) var(--ease-out)'
      }}>
      {icon ? <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 16 }}>{icon}</span> : null}
      {label}
      {count != null ? (
        <span style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-black)', color: active ? 'rgba(255,255,255,.8)' : 'var(--text-meta)' }}>{count}</span>
      ) : null}
    </button>
  );
}
