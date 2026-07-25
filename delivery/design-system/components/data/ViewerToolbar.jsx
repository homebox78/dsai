import React from 'react';

/* 전체화면 문서 뷰어 상단 툴바. 목업 문서 뷰어 헤더를 그대로 컴포넌트화했다.
   확장자 타일 · 파일명 + OCR/RAG 상태 배지 + 전체 페이지수 · 페이지 페이저 · 다운로드 · 닫기. */
export function ViewerToolbar({ ext, name, ocr = true, rag = true, page = 1, pages = 1, onPrev, onNext, onDownload, onClose }) {
  return (
    <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', borderBottom: '1px solid var(--border-structure)', background: 'var(--surface-panel)' }}>
      <span style={{ flex: 'none', width: 28, height: 28, borderRadius: 'var(--r-md)', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 8.7, fontWeight: 'var(--fw-black)', color: 'var(--slate-600)' }}>{ext}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-black)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          {ocr ? <span style={{ fontSize: 'var(--fs-10)', fontWeight: 'var(--fw-bold)', borderRadius: 'var(--r-pill)', padding: '2px 8px', background: 'var(--green-50)', color: 'var(--state-done-fg)' }}>OCR 완료</span> : null}
          {rag ? <span style={{ fontSize: 'var(--fs-10)', fontWeight: 'var(--fw-bold)', borderRadius: 'var(--r-pill)', padding: '2px 8px', background: '#ecfdf3', color: 'var(--state-done-fg)', whiteSpace: 'nowrap' }}>RAG 준비 완료</span> : null}
          <span style={{ fontSize: 'var(--fs-11-2)', color: 'var(--text-meta)' }}>전체 {pages}p</span>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--border-structure)', borderRadius: 'var(--r-md)', padding: '3px 5px' }}>
        <button type="button" onClick={onPrev} style={{ width: 24, height: 24, flex: 'none', padding: 0, background: '#fff', border: '1px solid var(--border-structure)', borderRadius: 'var(--r-sm)', color: 'var(--slate-600)', cursor: 'pointer' }}><span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 17 }}>chevron_left</span></button>
        <span style={{ fontSize: 'var(--fs-12-1)', fontWeight: 'var(--fw-bold)', minWidth: 76, textAlign: 'center' }}>{page} / {pages}p</span>
        <button type="button" onClick={onNext} style={{ width: 24, height: 24, flex: 'none', padding: 0, background: '#fff', border: '1px solid var(--border-structure)', borderRadius: 'var(--r-sm)', color: 'var(--slate-600)', cursor: 'pointer' }}><span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 17 }}>chevron_right</span></button>
      </div>
      <button type="button" onClick={onDownload} style={{ background: '#fff', border: '1px solid var(--border-control)', borderRadius: 'var(--r-md)', padding: '6px 10px', fontSize: 'var(--fs-12-1)', fontWeight: 'var(--fw-medium)', color: 'var(--text-label)', cursor: 'pointer', fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap' }}>다운로드</button>
      <button type="button" onClick={onClose} title="닫기" style={{ background: 'none', border: 'none', color: 'var(--text-meta)', width: 26, height: 26, padding: 0, cursor: 'pointer' }}><span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 17.9 }}>close</span></button>
    </div>
  );
}
