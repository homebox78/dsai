import React from 'react';
import { KpiTile } from '../../components/data/KpiTile.jsx';
import { Panel } from '../../components/layout/Panel.jsx';
import { ListRow } from '../../components/layout/ListRow.jsx';
import { Badge } from '../../components/core/Badge.jsx';
import { Button } from '../../components/core/Button.jsx';
import { ProgressBar } from '../../components/data/ProgressBar.jsx';
import { TabBar } from '../../components/navigation/TabBar.jsx';

export function DashboardScreen() {
  const [tab, setTab] = React.useState('in');
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--surface-canvas)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--sp-4)', padding: '16px 20px 13px', background: 'var(--surface-panel)', borderBottom: '1px solid var(--border-structure)' }}>
        <div>
          <div style={{ fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-black)', letterSpacing: 'var(--ls-display)' }}>에코바디스 2026 대응 대시보드</div>
          <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-sub)', marginTop: 'var(--sp-1)' }}>2026.07.25 금요일 · 내가 처리할 일 2건, 에코바디스 제출까지 D-18</div>
        </div>
        <div style={{ flex: 1 }} />
        <Button variant="primary" size="sm" icon="assignment_add">업무 요청</Button>
      </div>
      <div style={{ display: 'flex', background: 'var(--surface-panel)', borderBottom: '1px solid var(--border-structure)' }}>
        <KpiTile icon="description" label="색인 문서" value="1,284" unit="건" delta="+128" deltaTone="done" progress={82} onClick={() => {}} />
        <KpiTile icon="task_alt" label="진행중 업무" value="6" unit="건" delta="기한초과 2" deltaTone="alert" progress={45} onClick={() => {}} />
        <KpiTile icon="checklist" label="답변 완료" value="152" unit="/ 300문항" progress={51} onClick={() => {}} />
        <KpiTile icon="verified_user" label="증빙 커버리지" value="82" unit="%" tone="done" progress={82} onClick={() => {}} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr) 290px', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-6) var(--sp-8)', alignItems: 'start' }}>
        <Panel title="내가 해야 할 일" icon="assignment" flush
          actions={<Button variant="link" iconEnd="chevron_right">업무 전체</Button>}>
          <div style={{ padding: '10px var(--row-px) 0' }}>
            <TabBar variant="segment" value={tab} onChange={setTab}
              tabs={[{ id: 'in', label: '받은 요청 2' }, { id: 'out', label: '보낸 요청 3' }]} />
          </div>
          <div style={{ marginTop: 10 }}>
            {[['안전보건 교육 이수 내역 자료 요청', '이수진 → 나 · ~07.26', 'alert', '기한 D-1'],
              ['공급업체 행동강령 서명본 검토', '김대성 → 나 · ~07.29', 'wait', '진행중'],
              ['탄소배출 산정 근거 확인', '나 → 박지원 · ~07.28', 'idle', '회신 대기']].map(([t, m, tone, st]) => (
              <ListRow key={t} icon="assignment" title={t} meta={m} right={<Badge tone={tone}>{st}</Badge>} onClick={() => {}} />
            ))}
          </div>
        </Panel>
        <Panel title="에코바디스 진행 상태" icon="monitoring"
          actions={<Button variant="link" iconEnd="chevron_right">처리부</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {[['환경', 84], ['노동·인권', 62], ['윤리', 78], ['지속가능한 조달', 51]].map(([l, v]) => (
              <ProgressBar key={l} label={l} right={v + '%'} value={v} />
            ))}
          </div>
        </Panel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <Panel title="AI 처리 상태" icon="auto_awesome" sub="실시간">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              {[['에너지 사용 실적_월별.xlsx', 'OCR 62%', 62, 'brand'],
                ['폐기물 처리 위탁계약_2026.pdf', '색인 대기', 8, 'wait'],
                ['에코바디스 답변 초안 생성', '추론 34%', 34, 'done']].map(([n, s, v, tone]) => (
                <ProgressBar key={n} label={n} right={s} value={v} tone={tone} />
              ))}
            </div>
          </Panel>
          <Panel title="스토리지" icon="database" sub="4.2GB / 20GB">
            <ProgressBar height={9} segments={[{ width: '14%', color: 'var(--blue-700)' }, { width: '5.5%', color: '#93b4e8' }, { width: '1.5%', color: 'var(--slate-300)' }]} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-3)', marginTop: 'var(--sp-3)' }}>
              {[['문서', '2.8GB', 'var(--blue-700)'], ['증빙', '1.1GB', '#93b4e8'], ['첨부', '0.3GB', 'var(--slate-300)']].map(([l, s, c]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: c }} />
                  <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-sub)' }}>{l}</span>
                  <span style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-bold)' }}>{s}</span>
                </span>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
