import React from 'react';

export function Toggle({ checked, onChange, label, sub, disabled }) {
  const control = (
    <button type="button" disabled={disabled} onClick={() => onChange && onChange(!checked)}
      style={{
        position: 'relative', width: 38, height: 22, flex: 'none', padding: 0, border: 'none',
        borderRadius: 'var(--r-pill)', background: checked ? 'var(--surface-brand)' : 'var(--slate-300)',
        cursor: disabled ? 'default' : 'pointer', transition: 'background var(--dur-fast) var(--ease-out)', opacity: disabled ? .45 : 1
      }}>
      <span style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2, width: 18, height: 18, borderRadius: 'var(--r-pill)',
        background: 'var(--white)', boxShadow: 'var(--shadow-handle)', transition: 'left var(--dur-fast) var(--ease-out)'
      }} />
    </button>
  );
  if (!label) return control;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-bold)', color: 'var(--text-body)' }}>{label}</div>
        {sub ? <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-meta)', marginTop: 'var(--sp-1)', lineHeight: 'var(--lh-snug)' }}>{sub}</div> : null}
      </div>
      {control}
    </div>
  );
}
