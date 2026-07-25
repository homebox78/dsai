import React from 'react';

export function Breadcrumb({ items = [], badges, actions }) {
  return (
    <div style={{
      height: 'var(--crumb-h)', flex: 'none', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
      padding: '0 var(--row-px)', background: 'var(--surface-panel)', borderBottom: '1px solid var(--border-structure)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', minWidth: 0 }}>
        {items.map((it, i) => (
          <React.Fragment key={i}>
            {i > 0 ? <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 14, color: 'var(--slate-300)' }}>chevron_right</span> : null}
            <button type="button" onClick={it.onClick}
              style={{
                background: 'none', border: 'none', padding: '2px 3px', cursor: it.onClick ? 'pointer' : 'default',
                fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-13)',
                fontWeight: i === items.length - 1 ? 'var(--fw-bold)' : 'var(--fw-medium)',
                color: i === items.length - 1 ? 'var(--text-body)' : 'var(--text-sub)',
                whiteSpace: 'nowrap', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis'
              }}>{it.label}</button>
          </React.Fragment>
        ))}
      </div>
      {badges ? <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>{badges}</span> : null}
      <div style={{ flex: 1 }} />
      {actions ? <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>{actions}</span> : null}
    </div>
  );
}
