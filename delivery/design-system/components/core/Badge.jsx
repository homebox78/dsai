import React from 'react';

const TONES = {
  done: ['var(--state-done-bg)', 'var(--state-done-fg)'],
  wait: ['var(--state-wait-bg)', 'var(--state-wait-fg)'],
  soon: ['var(--state-soon-bg)', 'var(--state-soon-fg)'],
  alert: ['var(--state-alert-bg)', 'var(--state-alert-fg)'],
  idle: ['var(--state-idle-bg)', 'var(--state-idle-fg)'],
  brand: ['var(--surface-selected)', 'var(--text-accent)']
};

export function Badge({ tone = 'idle', children, count, style }) {
  const [bg, fg] = TONES[tone] || TONES.idle;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-1)',
      background: bg, color: fg, borderRadius: 'var(--r-pill)',
      padding: count != null ? '1px 7px' : '2px 8px',
      fontSize: count != null ? 'var(--fs-11)' : 'var(--fs-10)',
      fontWeight: 'var(--fw-black)', whiteSpace: 'nowrap', lineHeight: 'var(--lh-tight)', ...style
    }}>{count != null ? count : children}</span>
  );
}
