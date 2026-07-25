import React from 'react';

export function Modal({ open = true, title, sub, width = 480, onClose, footer, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--scrim)', zIndex: 80,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'ds-fade-in var(--dur-fast) var(--ease-out)'
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{
          width, maxWidth: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          background: 'var(--surface-panel)', border: '1px solid var(--border-structure)',
          borderRadius: 'var(--r-3xl)', boxShadow: 'var(--shadow-modal)', overflow: 'hidden'
        }}>
        <div style={{ flex: 'none', display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)', padding: '15px var(--sp-6)', borderBottom: '1px solid var(--border-structure)' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--fs-15)', fontWeight: 'var(--fw-black)', letterSpacing: 'var(--ls-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
            {sub ? <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-sub)', marginTop: 'var(--sp-1)', lineHeight: 'var(--lh-snug)' }}>{sub}</div> : null}
          </div>
          <button type="button" onClick={onClose} style={{ flex: 'none', width: 24, height: 24, padding: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-meta)' }}>
            <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 17 }}>close</span>
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--sp-6)' }}>{children}</div>
        {footer ? (
          <div style={{ flex: 'none', display: 'flex', gap: 'var(--sp-3)', padding: '14px var(--sp-6)', borderTop: '1px solid var(--border-structure)', background: 'var(--surface-footer)' }}>{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
