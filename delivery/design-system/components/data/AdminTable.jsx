import React from 'react';

/* 관리자 시스템 테이블. 목업의 조직&사업부 / 채널 관리 / 권한 그룹 테이블이 공유하는 폼:
   아이콘 타일 + 이름/부제 · 가운데 정렬 데이터 열 2개 · 태그 배지 · 행 액션 버튼.
   cols(grid-template-columns) 와 headers 로 열 구성을 바꾼다. */
const TAG = {
  open:   { bg: 'var(--blue-50)',  fg: 'var(--blue-900)' },   // 공개
  limit:  { bg: 'var(--orange-50)', fg: 'var(--orange-700)' }, // 제한
  admin:  { bg: 'var(--green-50)',  fg: 'var(--green-700)' },  // 관리자
  idle:   { bg: 'var(--slate-100)', fg: 'var(--slate-500)' }   // 비공개·일반
};

export function AdminTable({ cols, headers = [], rows = [], minWidth = 660, onAction }) {
  const grid = { display: 'grid', gridTemplateColumns: cols, gap: 'var(--sp-3)', minWidth };
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border-structure)', borderRadius: 'var(--r-2xl)', overflowX: 'auto' }}>
      <div style={{ ...grid, padding: '9px var(--sp-5)', borderBottom: '1px solid var(--border-structure)', fontSize: 'var(--fs-11-2)', fontWeight: 'var(--fw-black)', color: 'var(--text-meta)' }}>
        {headers.map((h, i) => <span key={i} style={{ whiteSpace: 'nowrap', textAlign: i === 0 ? 'left' : 'center' }}>{h}</span>)}
      </div>
      {rows.map((r, ri) => {
        const tag = TAG[r.tagTone] || TAG.idle;
        return (
          <div key={ri} style={{ ...grid, alignItems: 'center', padding: 'var(--row-py) var(--row-px)', borderBottom: ri === rows.length - 1 ? 'none' : '1px solid var(--border-hairline)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', minWidth: 0 }}>
              <span style={{ flex: 'none', width: 26, height: 26, borderRadius: 'var(--r-lg)', background: 'var(--blue-50)', border: '1px solid var(--border-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 16, color: 'var(--blue-900)' }}>{r.icon}</span>
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-bold)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
                <span style={{ display: 'block', fontSize: 'var(--fs-11-2)', color: 'var(--text-meta)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.sub}</span>
              </span>
            </span>
            {(r.cells || []).map((c, ci) => (
              <span key={ci} style={{ fontSize: 'var(--fs-12-1)', color: 'var(--text-sub)', whiteSpace: 'nowrap', textAlign: 'center' }}>{c}</span>
            ))}
            <span style={{ display: 'flex', justifyContent: 'center' }}>
              <span style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-black)', borderRadius: 'var(--r-pill)', padding: '2px 8px', background: tag.bg, color: tag.fg, whiteSpace: 'nowrap' }}>{r.tag}</span>
            </span>
            <span style={{ display: 'flex', justifyContent: 'center' }}>
              <button type="button" onClick={() => onAction && onAction(r)} style={{ background: '#fff', border: '1px solid var(--border-control)', borderRadius: 'var(--r-sm)', padding: '5px 10px', fontSize: 'var(--fs-11-2)', fontWeight: 'var(--fw-bold)', color: 'var(--text-label)', whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>{r.action}</button>
            </span>
          </div>
        );
      })}
    </div>
  );
}
