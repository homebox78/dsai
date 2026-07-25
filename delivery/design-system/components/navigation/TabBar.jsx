import React from 'react';

export function TabBar({ tabs = [], value, onChange, variant = 'underline' }) {
  if (variant === 'segment') {
    return (
      <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
        {tabs.map(t => {
          const on = t.id === value;
          return (
            <button key={t.id} type="button" onClick={() => onChange && onChange(t.id)}
              style={{
                background: on ? 'var(--surface-brand)' : 'var(--white)',
                border: '1px solid ' + (on ? 'var(--surface-brand)' : 'var(--border-control)'),
                color: on ? 'var(--text-on-brand)' : 'var(--text-label)',
                borderRadius: 'var(--r-lg)', padding: '7px 13px',
                fontFamily: 'var(--font-ui)', fontSize: 'var(--fs-12-1)', fontWeight: 'var(--fw-bold)', cursor: 'pointer', whiteSpace: 'nowrap'
              }}>{t.label}{t.count != null ? ' ' + t.count : ''}</button>
          );
        })}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 'var(--sp-6)', borderBottom: '1px solid var(--border-structure)' }}>
      {tabs.map(t => {
        const on = t.id === value;
        return (
          <button key={t.id} type="button" onClick={() => onChange && onChange(t.id)}
            style={{
              background: 'none', border: 'none', borderBottom: '2px solid ' + (on ? 'var(--border-brand)' : 'transparent'),
              padding: '10px 0', marginBottom: -1, cursor: 'pointer', fontFamily: 'var(--font-ui)',
              fontSize: 'var(--fs-13)', fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)',
              color: on ? 'var(--text-accent)' : 'var(--text-sub)', whiteSpace: 'nowrap'
            }}>{t.label}</button>
        );
      })}
    </div>
  );
}
