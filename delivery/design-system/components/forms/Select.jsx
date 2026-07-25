import React from 'react';

export function Select({ value, options = [], onChange, width = 200, align = 'left', size = 'md', disabled }) {
  const [open, setOpen] = React.useState(false);
  const pad = size === 'sm' ? '6px 9px' : '9px 11px';
  const fs = size === 'sm' ? 'var(--fs-12-1)' : 'var(--fs-13)';
  return (
    <div style={{ position: 'relative', width, flex: 'none' }}>
      <button type="button" disabled={disabled} onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: pad,
          background: 'var(--white)', border: '1px solid ' + (open ? 'var(--focus-border)' : 'var(--border-control)'),
          borderRadius: 'var(--r-md)', fontFamily: 'var(--font-ui)', fontSize: fs, color: 'var(--text-body)',
          fontWeight: 'var(--fw-medium)', cursor: 'pointer', boxShadow: open ? 'var(--focus-ring)' : 'none'
        }}>
        <span style={{ flex: 1, minWidth: 0, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 16, color: 'var(--text-meta)' }}>expand_more</span>
      </button>
      {open ? (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: align === 'left' ? 0 : undefined, right: align === 'right' ? 0 : undefined,
          minWidth: '100%', background: 'var(--white)', border: '1px solid var(--border-structure)',
          borderRadius: 'var(--r-2xl)', boxShadow: 'var(--shadow-dropdown)', padding: 5, zIndex: 40,
          animation: 'ds-pop-in var(--dur-fast) var(--ease-out)'
        }}>
          {options.map(o => {
            const on = o === value;
            return (
              <button key={o} type="button"
                onClick={() => { setOpen(false); onChange && onChange(o); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', justifyContent: 'flex-start',
                  background: on ? 'var(--surface-selected)' : 'transparent', border: 'none', borderRadius: 'var(--r-lg)',
                  padding: '8px 10px', fontFamily: 'var(--font-ui)', fontSize: fs,
                  fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)', color: on ? 'var(--text-accent)' : 'var(--text-body)',
                  textAlign: 'left', whiteSpace: 'nowrap', cursor: 'pointer'
                }}>
                <span style={{ flex: 1 }}>{o}</span>
                {on ? <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 16, color: 'var(--blue-700)' }}>check</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
