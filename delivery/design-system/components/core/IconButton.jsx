import React from 'react';

export function IconButton({ icon, size = 30, onBrand, active, title, onClick, badge, style }) {
  const [hover, setHover] = React.useState(false);
  const bg = onBrand
    ? (hover ? 'var(--on-brand-fill-hover)' : 'var(--on-brand-fill)')
    : (active ? 'var(--surface-selected)' : (hover ? 'var(--slate-100)' : 'var(--white)'));
  return (
    <button type="button" title={title} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', width: size, height: size, flex: 'none', padding: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: bg,
        border: '1px solid ' + (onBrand ? 'var(--on-brand-border)' : (active ? 'var(--border-tint)' : 'var(--border-structure)')),
        borderRadius: 'var(--r-md)', cursor: 'pointer',
        transition: 'background var(--dur-fast) var(--ease-out)', ...style
      }}>
      <span className="msym" style={{
        fontFamily: 'var(--font-icon)', fontSize: Math.round(size * .6),
        color: onBrand ? 'var(--text-on-brand)' : (active ? 'var(--text-accent)' : 'var(--slate-600)')
      }}>{icon}</span>
      {badge ? (
        <span style={{
          position: 'absolute', top: -3, right: -3, background: onBrand ? 'var(--red-400)' : 'var(--red-600)',
          color: 'var(--white)', borderRadius: 'var(--r-pill)', fontSize: 9, fontWeight: 'var(--fw-black)', padding: '1px 4px'
        }}>{badge}</span>
      ) : null}
    </button>
  );
}
