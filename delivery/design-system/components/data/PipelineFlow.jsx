import React from 'react';

/* 문서 파이프라인 흐름. 처리 단계를 아이콘+수치+라벨로 가로 배치하고 라인으로 잇는다.
   대시보드의 업로드 → OCR → RAG 색인 → 검색 이용 요약에 사용. 단계 색으로 상태를 구분한다. */
const TONE = {
  idle:  'var(--slate-700)',
  wait:  'var(--amber-700)',
  done:  'var(--green-700)',
  brand: 'var(--blue-700)'
};

export function PipelineFlow({ stages = [], onStage }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px var(--row-px)' }}>
      {stages.map((st, i) => {
        const color = TONE[st.tone] || TONE.idle;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <button type="button" onClick={() => onStage && onStage(st)}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', display: 'block', cursor: onStage ? 'pointer' : 'default', fontFamily: 'var(--font-ui)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)' }}>
                <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 16, color }}>{st.icon}</span>
                <span style={{ fontSize: 'var(--fs-17)', fontWeight: 'var(--fw-black)', color }}>{st.count}</span>
              </span>
              <span style={{ display: 'block', fontSize: 'var(--fs-11)', color: 'var(--text-sub)', marginTop: 'var(--sp-1)', whiteSpace: 'nowrap' }}>{st.label}</span>
            </button>
            {i < stages.length - 1 ? <span style={{ flex: 1, height: 1, background: 'var(--border-structure)', margin: '0 var(--sp-3)' }} /> : null}
          </div>
        );
      })}
    </div>
  );
}
