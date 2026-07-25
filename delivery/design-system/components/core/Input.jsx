import React from 'react';

export function Input({ value, onChange, placeholder, label, required, hint, icon, underline, disabled, type = 'text', style }) {
  const [focus, setFocus] = React.useState(false);
  const field = (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
      background: disabled ? 'var(--slate-50)' : 'var(--white)',
      border: underline ? 'none' : '1px solid ' + (focus ? 'var(--focus-border)' : 'var(--border-control)'),
      borderBottom: underline ? '1px solid ' + (focus ? 'var(--focus-border)' : 'var(--border-structure)') : undefined,
      borderRadius: underline ? 0 : 'var(--r-md)',
      padding: underline ? '6px 2px' : '9px 11px',
      boxShadow: focus && !underline ? 'var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    }}>
      {icon ? <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 16, color: 'var(--text-meta)' }}>{icon}</span> : null}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'var(--font-ui)', fontSize: underline ? 'var(--fs-13)' : 'var(--fs-14)', color: 'var(--text-body)'
        }} />
    </div>
  );
  if (!label && !hint) return <div style={style}>{field}</div>;
  return (
    <div style={style}>
      {label ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
          <span style={{ fontSize: 'var(--fs-12-1)', fontWeight: 'var(--fw-bold)', color: 'var(--text-label)', whiteSpace: 'nowrap' }}>{label}</span>
          {required ? <span style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-black)', color: 'var(--red-600)' }}>필수</span> : null}
        </div>
      ) : null}
      {field}
      {hint ? <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-meta)', marginTop: 'var(--sp-2)', lineHeight: 'var(--lh-snug)' }}>{hint}</div> : null}
    </div>
  );
}
