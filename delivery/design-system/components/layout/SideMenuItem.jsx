import React from 'react';

export function SideMenuItem({ icon, label, badge, badgeTone = 'idle', active, collapsed, onClick }) {
  const [hover, setHover] = React.useState(false);
  const tone = badgeTone === 'alert'
    ? { background: 'var(--state-alert-bg)', color: 'var(--state-alert-fg)', border: '1px solid var(--red-200)' }
    : { background: 'var(--white)', color: 'var(--text-sub)', border: '1px solid var(--border-structure)' };
  return (
    <button type="button" onClick={onClick} title={collapsed ? label + (badge ? ' · ' + badge : '') : label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: active ? 'var(--surface-selected)' : (hover ? 'var(--slate-100)' : 'transparent'),
        border: 'none', borderLeft: '2px solid ' + (active ? 'var(--border-brand)' : 'transparent'),
        padding: collapsed ? '6.4px 0' : '6.4px 12px', textAlign: 'left', cursor: 'pointer',
        color: active ? 'var(--text-accent)' : 'var(--text-body)', fontFamily: 'var(--font-ui)'
      }}>
      <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 18.4, lineHeight: 1, opacity: active ? 1 : .9 }}>{icon}</span>
      {collapsed ? null : (
        <>
          <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-14)', fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
          {badge ? (
            <span style={{ flex: 'none', borderRadius: 'var(--r-pill)', padding: '1px 7px', fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-black)', ...tone }}>{badge}</span>
          ) : null}
        </>
      )}
    </button>
  );
}
