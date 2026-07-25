import React from 'react';

export function ProgressBar({ value = 0, tone = 'brand', height = 5, label, right, segments }) {
  const COLORS = { brand: 'var(--blue-700)', done: 'var(--green-600)', wait: 'var(--amber-500)', alert: 'var(--red-600)' };
  return (
    <div>
      {(label || right) ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
          {label ? <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-label)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span> : null}
          {right ? <span style={{ flex: 'none', fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-bold)', color: 'var(--text-sub)', whiteSpace: 'nowrap' }}>{right}</span> : null}
        </div>
      ) : null}
      <div style={{ display: 'flex', height, background: 'var(--slate-100)', borderRadius: 'var(--r-pill)', overflow: 'hidden' }}>
        {segments && segments.length
          ? segments.map((s, i) => <span key={i} style={{ width: s.width, background: s.color }} />)
          : <span style={{ width: typeof value === 'number' ? value + '%' : value, background: COLORS[tone] || COLORS.brand, borderRadius: 'var(--r-pill)', transition: 'width var(--dur-slow) var(--ease-out)' }} />}
      </div>
    </div>
  );
}
