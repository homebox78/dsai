import React from 'react';

/* 파일 상세 메타데이터 패널. 목업 파일 상세 '메타데이터' 탭(라벨↔값 정의 목록)을 컴포넌트화했다.
   각 행은 라벨 + 값, 값은 tone으로 강조(완료=green, 진행=amber, 인용=accent). 라인으로 구분. */
const TONE = {
  body: 'var(--text-body)', done: 'var(--state-done-fg)', wait: 'var(--state-wait-fg)',
  alert: 'var(--state-alert-fg)', accent: 'var(--text-accent)', sub: 'var(--text-sub)'
};

export function MetaPanel({ rows = [], labelWidth = 96, dense }) {
  const py = dense ? '8px' : '11px';
  return (
    <div style={{ border: '1px solid var(--border-structure)', borderRadius: 'var(--r-2xl)', overflow: 'hidden' }}>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'flex', gap: 'var(--sp-4)', alignItems: 'baseline',
          padding: py + ' var(--row-px)',
          borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--border-hairline)'
        }}>
          <span style={{ width: labelWidth, flex: 'none', fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-bold)', color: 'var(--text-sub)' }}>{r.label}</span>
          <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-13)', fontWeight: r.tone && r.tone !== 'body' ? 'var(--fw-bold)' : 'var(--fw-medium)', color: TONE[r.tone] || TONE.body, lineHeight: 'var(--lh-body)', wordBreak: 'break-word' }}>{r.value}</span>
          {r.action ? (
            <button type="button" onClick={r.onAction} style={{ flex: 'none', background: 'none', border: 'none', padding: 0, fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-bold)', color: 'var(--text-link)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>{r.action}</button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
