import React from 'react';
import { Panel } from '../../components/layout/Panel.jsx';
import { Badge } from '../../components/core/Badge.jsx';
import { Button } from '../../components/core/Button.jsx';
import { Input } from '../../components/core/Input.jsx';
import { ProgressBar } from '../../components/data/ProgressBar.jsx';
import { FilterChip } from '../../components/forms/FilterChip.jsx';

const ROWS = [
  ['ENV 1.1', '환경 정책 문서 보유 여부', '환경정책 선언문_국문영문.pdf', 'p.1~4', '검증완료', 'done', '2027.06'],
  ['ENV 3.2', '환경경영시스템 인증 현황', 'ISO 14001 인증서_2026.pdf', 'p.1', '만료임박', 'soon', '2026.09'],
  ['LAB 1.2', '아동·강제노동 금지 정책', '윤리경영 행동강령_v2.pdf', 'p.12~14', '검토대기', 'wait', '2028.01'],
  ['LAB 3.1', '안전보건 교육 실시 기록', null, '-', '미연결', 'alert', '-'],
  ['ETH 1.1', '부패 방지 정책 및 배포', '윤리경영 행동강령_v2.pdf', 'p.4~7', '검증완료', 'done', '2028.01'],
  ['SUP 2.1', '공급업체 ESG 실사 수행', null, '-', '미연결', 'alert', '-']
];
const COLS = '86px minmax(160px,1fr) minmax(170px,1.1fr) 78px 92px 84px';

export function EvidenceScreen() {
  const [cat, setCat] = React.useState('전체');
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0, minWidth: 0 }}>
      <aside style={{ width: 206, flex: 'none', background: 'var(--surface-panel)', borderRight: '1px solid var(--border-structure)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 40, flex: 'none', display: 'flex', alignItems: 'center', padding: '0 12px', borderBottom: '1px solid var(--border-structure)' }}>
          <span style={{ fontSize: 'var(--fs-11-2)', fontWeight: 'var(--fw-black)', color: 'var(--text-meta)', letterSpacing: 'var(--ls-label)' }}>평가 영역</span>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '5px 0' }}>
          {['전체', '환경', '노동·인권', '윤리', '지속가능한 조달'].map(n => {
            const on = n === cat;
            return (
              <button key={n} type="button" onClick={() => setCat(n)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', justifyContent: 'flex-start',
                  background: on ? 'var(--surface-selected)' : 'transparent', border: 'none',
                  borderLeft: '2px solid ' + (on ? 'var(--border-brand)' : 'transparent'), padding: '8px 12px',
                  cursor: 'pointer', fontFamily: 'var(--font-ui)', color: on ? 'var(--text-accent)' : 'var(--text-body)' }}>
                <span style={{ flex: 1, textAlign: 'left', fontSize: 'var(--fs-13)', fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)' }}>{n}</span>
                <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-meta)' }}>{n === '전체' ? ROWS.length : ROWS.filter(r => r[0].startsWith(n === '환경' ? 'ENV' : n === '윤리' ? 'ETH' : n === '노동·인권' ? 'LAB' : 'SUP')).length}</span>
              </button>
            );
          })}
        </div>
      </aside>
      <div style={{ flex: 1, minWidth: 360, display: 'flex', flexDirection: 'column', background: 'var(--surface-canvas)', minHeight: 0 }}>
        <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: '12px var(--row-px)', background: 'var(--surface-panel)', borderBottom: '1px solid var(--border-structure)' }}>
          <div>
            <div style={{ fontSize: 'var(--fs-15)', fontWeight: 'var(--fw-black)', letterSpacing: 'var(--ls-title)' }}>증빙자료 매핑</div>
            <div style={{ fontSize: 'var(--fs-11-2)', color: 'var(--text-sub)', marginTop: 'var(--sp-1)' }}>문항 ↔ 문서 ↔ 페이지 연결 상태 · 총 {ROWS.length}건</div>
          </div>
          <div style={{ flex: 1 }} />
          <Input underline icon="search" placeholder="문항번호·파일명 검색" style={{ width: 190 }} />
          <Button size="sm" icon="upload">증빙 업로드</Button>
          <Button size="sm" variant="primary" icon="download">증빙 팩 내보내기</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--sp-4) var(--sp-6)' }}>
          <Panel flush>
            <div style={{ minWidth: 700, display: 'grid', gridTemplateColumns: COLS, gap: 'var(--sp-3)', padding: 'var(--row-py) var(--row-px)', borderBottom: '1px solid var(--border-structure)', fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-black)', color: 'var(--text-meta)' }}>
              <span>문항</span><span>질문 요약</span><span>연결된 증빙 문서</span><span>페이지</span><span>검증</span><span>유효기한</span>
            </div>
            {ROWS.map(([no, q, file, page, st, tone, exp]) => (
              <div key={no} style={{ minWidth: 700, display: 'grid', gridTemplateColumns: COLS, gap: 'var(--sp-3)', alignItems: 'center', padding: 'var(--row-py) var(--row-px)', borderBottom: '1px solid var(--border-hairline)', borderLeft: '2px solid var(--state-' + tone + '-bar)' }}>
                <span><span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 'var(--fw-black)', color: 'var(--slate-600)', background: 'var(--slate-100)', borderRadius: 'var(--r-xs)', padding: '2.5px 6px' }}>{no}</span></span>
                <span style={{ minWidth: 0, fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q}</span>
                <span style={{ minWidth: 0 }}>
                  {file ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', minWidth: 0 }}>
                      <span style={{ flex: 'none', width: 22, height: 22, borderRadius: 'var(--r-sm)', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 7, fontWeight: 'var(--fw-black)', color: 'var(--slate-600)' }}>PDF</span>
                      <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file}</span>
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                      <span style={{ fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-bold)', color: 'var(--state-wait-fg)' }}>미연결</span>
                      <span style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-bold)', color: 'var(--text-link)', textDecoration: 'underline' }}>자료 요청</span>
                    </span>
                  )}
                </span>
                <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-link)', fontWeight: 'var(--fw-bold)' }}>{page}</span>
                <span><Badge tone={tone}>{st}</Badge></span>
                <span style={{ fontSize: 'var(--fs-12)', color: exp === '-' ? 'var(--text-meta)' : 'var(--text-sub)', fontWeight: 'var(--fw-medium)' }}>{exp}</span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
      <aside style={{ width: 290, flex: 'none', background: 'var(--surface-panel)', borderLeft: '1px solid var(--border-structure)', overflow: 'auto' }}>
        <div style={{ height: 'var(--panel-header-h)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: '0 var(--row-px)', borderBottom: '1px solid var(--border-structure)' }}>
          <span className="msym" style={{ fontSize: 17, color: 'var(--text-meta)' }}>donut_large</span>
          <span style={{ fontSize: 'var(--fs-12-1)', fontWeight: 'var(--fw-black)' }}>증빙 커버리지</span>
        </div>
        <div style={{ padding: 'var(--sp-5) var(--row-px)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
            <span style={{ fontSize: 'var(--fs-23)', fontWeight: 'var(--fw-black)', letterSpacing: 'var(--ls-display)', color: 'var(--state-done-fg)' }}>82</span>
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-sub)' }}>% · 246 / 300문항</span>
          </div>
          <ProgressBar height={9} segments={[{ width: '66%', color: 'var(--green-600)' }, { width: '16%', color: 'var(--amber-500)' }, { width: '18%', color: 'var(--red-200)' }]} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', marginTop: 'var(--sp-4)' }}>
            {[['검증완료 증빙', 198, 'var(--green-600)'], ['검토대기', 48, 'var(--amber-500)'], ['미연결', 54, 'var(--red-200)']].map(([l, n, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: c, flex: 'none' }} />
                <span style={{ flex: 1, fontSize: 'var(--fs-11-2)', color: 'var(--text-sub)' }}>{l}</span>
                <span style={{ fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-bold)' }}>{n}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-black)', color: 'var(--text-meta)', letterSpacing: 'var(--ls-label)', margin: 'var(--sp-6) 0 var(--sp-3)' }}>확인 필요</div>
          {[['유효기한 임박', 6, '90일 내 만료되는 인증서·허가증이 있습니다.', 'soon'],
            ['증빙 미연결', 54, '문항에 연결된 문서가 없습니다. 자료 요청을 보내세요.', 'alert'],
            ['중복 참조', 3, '동일 문서가 5개 이상 문항에 인용되어 있습니다.', 'idle']].map(([t, n, x, tone]) => (
            <div key={t} style={{ display: 'block', borderLeft: '2px solid var(--state-' + tone + '-bar)', background: 'var(--state-' + tone + '-bg)', padding: '10px 11px', marginBottom: 'var(--sp-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <span style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-black)', color: 'var(--state-' + tone + '-fg)' }}>{t}</span>
                <span style={{ marginLeft: 'auto', fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-black)', color: 'var(--state-' + tone + '-fg)' }}>{n}건</span>
              </div>
              <div style={{ fontSize: 'var(--fs-11-2)', color: 'var(--text-label)', lineHeight: 'var(--lh-snug)', marginTop: 'var(--sp-1)' }}>{x}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
