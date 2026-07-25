import React from 'react';

export function KpiTile({ icon, label, value, unit, delta, deltaTone = 'idle', progress, tone = 'body', onClick }) {
  const [hover, setHover] = React.useState(false);
  const valueColor = tone === 'done' ? 'var(--state-done-fg)' : (tone === 'alert' ? 'var(--state-alert-fg)' : 'var(--text-body)');
  const deltaColor = deltaTone === 'done' ? 'var(--state-done-fg)' : (deltaTone === 'alert' ? 'var(--state-alert-fg)' : 'var(--text-meta)');
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        flex: 1, minWidth: 0, display: 'block', textAlign: 'left', cursor: onClick ? 'pointer' : 'default',
        background: hover && onClick ? 'var(--slate-50)' : 'var(--white)', border: 'none',
        borderRight: '1px solid var(--border-structure)', padding: 'var(--sp-5) var(--row-px)', fontFamily: 'var(--font-ui)'
      }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
        <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 17, color: 'var(--text-meta)' }}>{icon}</span>
        <span style={{ fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-bold)', color: 'var(--text-sub)', whiteSpace: 'nowrap' }}>{label}</span>
      </span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)', marginTop: 'var(--sp-3)' }}>
        <span style={{ fontSize: 'var(--fs-23)', fontWeight: 'var(--fw-black)', letterSpacing: 'var(--ls-display)', color: valueColor }}>{value}</span>
        {unit ? <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-meta)', whiteSpace: 'nowrap' }}>{unit}</span> : null}
        {delta ? <span style={{ marginLeft: 'auto', fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-bold)', color: deltaColor, whiteSpace: 'nowrap' }}>{delta}</span> : null}
      </span>
      {progress != null ? <span style={{ display: 'block', marginTop: 'var(--sp-3)' }}><ProgressBarInline value={progress} /></span> : null}
    </button>
  );
}

function ProgressBarInline({ value }) {
  return (
    <span style={{ display: 'block', height: 4, background: 'var(--slate-100)', borderRadius: 'var(--r-pill)', overflow: 'hidden' }}>
      <span style={{ display: 'block', width: value + '%', height: '100%', background: 'var(--blue-700)', borderRadius: 'var(--r-pill)' }} />
    </span>
  );
}
