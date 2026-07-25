import React from 'react';
import { Panel } from '../../components/layout/Panel.jsx';
import { ListRow } from '../../components/layout/ListRow.jsx';
import { Badge } from '../../components/core/Badge.jsx';
import { Button } from '../../components/core/Button.jsx';
import { Input } from '../../components/core/Input.jsx';
import { FilterChip } from '../../components/forms/FilterChip.jsx';
import { PanelToggleHandle } from '../../components/layout/PanelToggleHandle.jsx';
import { TabBar } from '../../components/navigation/TabBar.jsx';

const FOLDERS = [
  ['환경 정책', 42], ['인증서 · 허가증', 18], ['에너지 · 배출', 63], ['노동 · 인권', 27], ['윤리 · 준법', 31], ['공급망 실사', 55]
];
const FILES = [
  { id: 'a1', ext: 'PDF', name: 'ISO 14001 인증서_2026.pdf', meta: '2.4MB · 07.23 · 홍길동', tone: 'done', st: '색인 완료' },
  { id: 'a2', ext: 'XLSX', name: '에너지 사용 실적_월별.xlsx', meta: '1.1MB · 07.22 · 박지원', tone: 'wait', st: 'OCR 62%' },
  { id: 'a3', ext: 'PDF', name: '온실가스 배출량 보고서_2025.pdf', meta: '5.8MB · 07.20 · 박지원', tone: 'done', st: '색인 완료' },
  { id: 'a4', ext: 'DOCX', name: '고충처리 및 신고채널 운영보고.docx', meta: '740KB · 07.18 · 이수진', tone: 'idle', st: '대기' }
];

export function DocumentStoreScreen() {
  const [file, setFile] = React.useState('a1');
  const [folder, setFolder] = React.useState('인증서 · 허가증');
  const [listOpen, setListOpen] = React.useState(true);
  const [botOpen, setBotOpen] = React.useState(true);
  const [tab, setTab] = React.useState('summary');
  const cur = FILES.find(f => f.id === file);
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0, minWidth: 0 }}>
      <aside style={{ width: 212, flex: 'none', background: 'var(--surface-panel)', borderRight: '1px solid var(--border-structure)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 'none', padding: '9px 12px', borderBottom: '1px solid var(--border-structure)' }}>
          <Input underline icon="search" placeholder="폴더 검색" />
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '5px 0' }}>
          {FOLDERS.map(([n, c]) => {
            const on = n === folder;
            return (
              <button key={n} type="button" onClick={() => setFolder(n)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', justifyContent: 'flex-start',
                  background: on ? 'var(--surface-selected)' : 'transparent', border: 'none', borderLeft: '2px solid ' + (on ? 'var(--border-brand)' : 'transparent'),
                  padding: '7px 12px', textAlign: 'left', cursor: 'pointer', color: on ? 'var(--text-accent)' : 'var(--text-body)', fontFamily: 'var(--font-ui)' }}>
                <span className="msym" style={{ fontSize: 17, opacity: .85 }}>folder</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-13)', fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n}</span>
                <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-meta)' }}>{c}</span>
              </button>
            );
          })}
        </div>
        <div style={{ flex: 'none', borderTop: '1px solid var(--border-structure)', padding: '9px 12px' }}>
          <Button size="sm" icon="create_new_folder" fullWidth>폴더 추가</Button>
        </div>
      </aside>
      {listOpen ? (
        <div style={{ width: 'var(--subpanel-w)', flex: 'none', background: 'var(--surface-panel)', borderRight: '1px solid var(--border-structure)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 'none', padding: '9px 12px', borderBottom: '1px solid var(--border-structure)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
              <span style={{ flex: 1, fontSize: 'var(--fs-12-1)', fontWeight: 'var(--fw-black)', whiteSpace: 'nowrap' }}>{folder}</span>
              <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-meta)' }}>{FILES.length}건</span>
            </div>
            <Input underline icon="search" placeholder="파일명·내용 검색" />
            <div style={{ display: 'flex', gap: 'var(--sp-1)', marginTop: 'var(--sp-3)', flexWrap: 'wrap' }}>
              <FilterChip label="전체" count={4} active />
              <FilterChip label="색인 완료" count={2} />
              <FilterChip label="대기" count={1} />
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {FILES.map(f => (
              <ListRow key={f.id} tile tileLabel={f.ext} title={f.name} meta={f.meta}
                right={<Badge tone={f.tone}>{f.st}</Badge>} selected={f.id === file} onClick={() => setFile(f.id)} />
            ))}
          </div>
        </div>
      ) : null}
      <PanelToggleHandle side="left" open={listOpen} title={listOpen ? '목록 접기' : '목록 펼치기'} onClick={() => setListOpen(o => !o)} />
      <div style={{ flex: 1, minWidth: 360, display: 'flex', flexDirection: 'column', background: 'var(--surface-canvas)', minHeight: 0 }}>
        <div style={{ flex: 'none', background: 'var(--surface-panel)', borderBottom: '1px solid var(--border-structure)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: '12px var(--row-px)' }}>
            <span style={{ flex: 'none', width: 28, height: 28, borderRadius: 'var(--r-md)', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 'var(--fw-black)', color: 'var(--slate-600)' }}>{cur.ext}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--fs-15)', fontWeight: 'var(--fw-black)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cur.name}</div>
              <div style={{ fontSize: 'var(--fs-11-2)', color: 'var(--text-meta)', marginTop: 'var(--sp-1)' }}>{cur.meta}</div>
            </div>
            <Badge tone={cur.tone}>{cur.st}</Badge>
            <Button size="sm" icon="download">다운로드</Button>
            <Button size="sm" variant="primary" icon="assignment_add">업무 요청</Button>
          </div>
          <div style={{ padding: '0 var(--row-px)' }}>
            <TabBar value={tab} onChange={setTab} tabs={[{ id: 'summary', label: '요약' }, { id: 'meta', label: '메타데이터' }, { id: 'version', label: '버전' }, { id: 'activity', label: '활동' }]} />
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--sp-4) var(--sp-6)' }}>
          <Panel title="AI 요약" icon="auto_awesome" sub="근거 페이지를 클릭하면 뷰어가 해당 위치로 이동합니다"
            actions={<Button variant="link">숨기기</Button>}>
            <div style={{ fontSize: 'var(--fs-14)', lineHeight: 'var(--lh-loose)', color: 'var(--text-body)' }}>
              2026년 갱신된 환경경영시스템(ISO 14001:2015) 인증서입니다. 인증 범위는 국내 3개 사업장이며 유효기간은 2026.09.14까지로,
              에코바디스 ENV 3.2 문항의 증빙으로 연결되어 있습니다.
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-2)', marginTop: 'var(--sp-4)', flexWrap: 'wrap' }}>
              {['p.1 인증 범위', 'p.2 유효기간', 'p.4 사업장 목록'].map(p => (
                <button key={p} type="button" style={{ background: 'var(--surface-selected)', border: '1px solid var(--border-tint)', color: 'var(--text-accent)', borderRadius: 'var(--r-pill)', padding: '4px 10px', fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-bold)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>{p}</button>
              ))}
            </div>
          </Panel>
          <div style={{ height: 'var(--sp-4)' }} />
          <Panel title="문서 뷰어" icon="picture_as_pdf" sub="1 / 4 페이지" flush>
            <div style={{ padding: 'var(--sp-6)', display: 'flex', justifyContent: 'center', background: 'var(--surface-canvas)' }}>
              <div style={{ width: 'min(520px,100%)', background: '#fff', border: '1px solid var(--border-structure)', padding: '34px 38px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-11)', color: 'var(--text-meta)', marginBottom: 'var(--sp-5)' }}>1p / {cur.name}</div>
                <div style={{ fontSize: 'var(--fs-17)', fontWeight: 'var(--fw-black)', marginBottom: 'var(--sp-4)' }}>환경경영시스템 인증서</div>
                <div style={{ fontSize: 'var(--fs-13)', lineHeight: 'var(--lh-loose)', color: 'var(--text-sub)' }}>
                  인증 규격 ISO 14001:2015 · 인증 범위 국내 3개 사업장 · 최초 인증 2020.09.15 · 유효기간 2026.09.14
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
      <PanelToggleHandle side="right" open={botOpen} title={botOpen ? '챗봇 접기' : '챗봇 펼치기'} onClick={() => setBotOpen(o => !o)} />
      {botOpen ? (
        <aside style={{ width: 'var(--aside-w)', flex: 'none', background: 'var(--surface-panel)', borderLeft: '1px solid var(--border-structure)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 'var(--panel-header-h)', flex: 'none', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: '0 var(--row-px)', borderBottom: '1px solid var(--border-structure)' }}>
            <span className="msym" style={{ fontSize: 17, color: 'var(--blue-700)' }}>auto_awesome</span>
            <span style={{ fontSize: 'var(--fs-12-1)', fontWeight: 'var(--fw-black)' }}>문서 내 챗봇</span>
            <span style={{ marginLeft: 'auto', fontSize: 'var(--fs-11)', color: 'var(--text-meta)' }}>RAG</span>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 'var(--sp-4) var(--row-px)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div style={{ alignSelf: 'flex-end', maxWidth: '86%', background: 'var(--surface-brand)', color: '#fff', borderRadius: 'var(--r-xl)', padding: '9px 12px', fontSize: 'var(--fs-13)', lineHeight: 'var(--lh-snug)' }}>
              인증 유효기간이 언제까지야?
            </div>
            <div style={{ maxWidth: '92%', background: 'var(--slate-100)', borderRadius: 'var(--r-xl)', padding: '9px 12px', fontSize: 'var(--fs-13)', lineHeight: 'var(--lh-loose)' }}>
              2026년 9월 14일까지입니다. 갱신 심사는 만료 3개월 전 신청이 필요합니다.
              <div style={{ display: 'flex', gap: 'var(--sp-2)', marginTop: 'var(--sp-3)' }}>
                <span style={{ background: '#fff', border: '1px solid var(--border-structure)', borderRadius: 'var(--r-pill)', padding: '3px 9px', fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-bold)', color: 'var(--text-link)' }}>근거 p.2</span>
              </div>
            </div>
          </div>
          <div style={{ flex: 'none', borderTop: '1px solid var(--border-structure)', padding: '10px var(--row-px)' }}>
            <Input placeholder="이 문서에 대해 질문하세요" />
          </div>
        </aside>
      ) : null}
    </div>
  );
}
