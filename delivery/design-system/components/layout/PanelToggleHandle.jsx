import React from 'react';

export function PanelToggleHandle({ side = 'left', open = true, top = 96, title, onClick }) {
  const [hover, setHover] = React.useState(false);
  const icon = side === 'left' ? (open ? 'chevron_left' : 'chevron_right') : (open ? 'chevron_right' : 'chevron_left');
  return (
    <div style={{ position: 'relative', width: 0, flex: 'none', zIndex: 55 }}>
      <span style={{ position: 'absolute', top: top - 8, left: -3, width: 6, height: 38, background: 'var(--white)' }} />
      <button type="button" title={title} onClick={onClick}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          position: 'absolute', top, left: -11, width: 'var(--handle-size)', height: 'var(--handle-size)', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--white)', border: '1px solid ' + (hover ? 'var(--border-brand)' : 'var(--border-control)'),
          borderRadius: 'var(--r-pill)', cursor: 'pointer',
          boxShadow: hover ? 'var(--shadow-handle-hover)' : 'var(--shadow-handle)',
          transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
        }}>
        <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 16, color: hover ? 'var(--blue-700)' : 'var(--slate-600)' }}>{icon}</span>
      </button>
    </div>
  );
}
