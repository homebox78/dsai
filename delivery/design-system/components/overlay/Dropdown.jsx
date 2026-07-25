import React from 'react';

export function Dropdown({ open = true, width = 288, align = 'right', top = 38, header, footer, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', top, left: align === 'left' ? 0 : undefined, right: align === 'right' ? 0 : undefined,
      width, background: 'var(--surface-panel)', border: '1px solid var(--border-structure)',
      borderRadius: 'var(--r-2xl)', boxShadow: 'var(--shadow-dropdown)', overflow: 'hidden', zIndex: 60,
      animation: 'ds-pop-in var(--dur-fast) var(--ease-out)'
    }}>
      {header ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: '11px var(--sp-6)', borderBottom: '1px solid var(--border-structure)' }}>{header}</div>
      ) : null}
      <div style={{ maxHeight: 320, overflow: 'auto' }}>{children}</div>
      {footer ? (
        <div style={{ padding: '10px var(--sp-6)', borderTop: '1px solid var(--border-structure)', background: 'var(--surface-footer)' }}>{footer}</div>
      ) : null}
    </div>
  );
}
