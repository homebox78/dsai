import React from 'react';

export function Checkbox({ checked, onChange, label, sub, disabled }) {
  return (
    <button type="button" disabled={disabled} onClick={() => onChange && onChange(!checked)}
      style={{
        display: 'flex', alignItems: sub ? 'flex-start' : 'center', gap: 'var(--sp-3)', justifyContent: 'flex-start',
        background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? .45 : 1
      }}>
      <span className="msym" style={{
        fontFamily: 'var(--font-icon)', fontSize: 19, flex: 'none',
        color: checked ? 'var(--blue-700)' : 'var(--slate-300)', marginTop: sub ? 1 : 0
      }}>{checked ? 'check_box' : 'check_box_outline_blank'}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)', color: 'var(--text-body)' }}>{label}</span>
        {sub ? <span style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--text-meta)', marginTop: 'var(--sp-1)', lineHeight: 'var(--lh-snug)' }}>{sub}</span> : null}
      </span>
    </button>
  );
}
