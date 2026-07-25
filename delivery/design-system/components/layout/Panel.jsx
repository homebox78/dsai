import React from 'react';

export function Panel({ title, icon, sub, actions, tint, flush, children, style }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0,
      background: tint ? 'var(--surface-canvas)' : 'var(--surface-panel)',
      border: '1px solid var(--border-structure)', borderRadius: 'var(--r-2xl)', ...style
    }}>
      {title ? (
        <div style={{
          height: 'var(--panel-header-h)', flex: 'none', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
          padding: '0 var(--row-px)', borderBottom: '1px solid var(--border-structure)'
        }}>
          {icon ? <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 17, color: 'var(--text-meta)' }}>{icon}</span> : null}
          <span style={{ fontSize: 'var(--fs-12-1)', fontWeight: 'var(--fw-black)', whiteSpace: 'nowrap' }}>{title}</span>
          {sub ? <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-meta)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span> : null}
          {actions ? <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>{actions}</span> : null}
        </div>
      ) : null}
      <div style={{ flex: 1, minHeight: 0, padding: flush ? 0 : 'var(--sp-5) var(--row-px)' }}>{children}</div>
    </div>
  );
}
