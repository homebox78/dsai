import React from 'react';

const VARIANTS = {
  primary: { background: 'var(--surface-brand)', color: 'var(--text-on-brand)', border: '1px solid var(--surface-brand)' },
  secondary: { background: 'var(--white)', color: 'var(--text-label)', border: '1px solid var(--border-control)' },
  ghost: { background: 'transparent', color: 'var(--text-label)', border: '1px solid transparent' },
  link: { background: 'transparent', color: 'var(--text-link)', border: '1px solid transparent', padding: 0 },
  onBrand: { background: 'var(--on-brand-fill)', color: 'var(--text-on-brand)', border: '1px solid var(--on-brand-border)' },
  danger: { background: 'var(--white)', color: 'var(--state-alert-fg)', border: '1px solid var(--red-200)' }
};
const SIZES = {
  sm: { padding: '7px 11px', fontSize: 'var(--fs-12-1)', borderRadius: 'var(--r-md)' },
  md: { padding: '9px 14px', fontSize: 'var(--fs-13)', borderRadius: 'var(--r-lg)' },
  lg: { padding: '11px 20px', fontSize: 'var(--fs-14)', borderRadius: 'var(--r-xl)' }
};
const HOVER = { primary: 'var(--surface-brand-hover)', secondary: 'var(--slate-100)', ghost: 'var(--slate-100)', link: 'transparent', onBrand: 'var(--on-brand-fill-hover)', danger: 'var(--red-50)' };

export function Button({ variant = 'secondary', size = 'md', icon, iconEnd, fullWidth, disabled, children, onClick, title, style }) {
  const [hover, setHover] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.secondary;
  const s = SIZES[size] || SIZES.md;
  return (
    <button
      type="button" title={title} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-2)',
        fontFamily: 'var(--font-ui)', fontWeight: variant === 'primary' ? 'var(--fw-bold)' : 'var(--fw-medium)',
        lineHeight: 'var(--lh-tight)', whiteSpace: 'nowrap', cursor: disabled ? 'default' : 'pointer',
        width: fullWidth ? '100%' : undefined, opacity: disabled ? .45 : 1,
        transition: 'background var(--dur-fast) var(--ease-out)',
        ...v, ...s,
        background: hover && !disabled ? HOVER[variant] : v.background
      }}>
      {icon ? <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 17 }}>{icon}</span> : null}
      {children}
      {iconEnd ? <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 15 }}>{iconEnd}</span> : null}
    </button>
  );
}
