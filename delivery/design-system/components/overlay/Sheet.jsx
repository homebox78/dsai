import React from 'react';

export function Sheet({ open = true, title, sub, width = 380, onClose, footer, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--scrim)', zIndex: 80, animation: 'ds-fade-in var(--dur-fast) var(--ease-out)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width, maxWidth: '100%',
          display: 'flex', flexDirection: 'column', background: 'var(--surface-panel)',
          borderLeft: '1px solid var(--border-structure)', boxShadow: 'var(--shadow-sheet)',
          animation: 'ds-sheet-in var(--dur-base) var(--ease-out)'
        }}>
        <div style={{ flex: 'none', display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)', padding: '15px var(--sp-6)', borderBottom: '1px solid var(--border-structure)' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--fs-15)', fontWeight: 'var(--fw-black)', letterSpacing: 'var(--ls-title)' }}>{title}</div>
            {sub ? <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-sub)', marginTop: 'var(--sp-1)' }}>{sub}</div> : null}
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
