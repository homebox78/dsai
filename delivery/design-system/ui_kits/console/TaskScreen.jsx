import React from 'react';
import { Panel } from '../../components/layout/Panel.jsx';
import { ListRow } from '../../components/layout/ListRow.jsx';
import { Badge } from '../../components/core/Badge.jsx';
import { Button } from '../../components/core/Button.jsx';
import { Input } from '../../components/core/Input.jsx';
import { FilterChip } from '../../components/forms/FilterChip.jsx';
import { Select } from '../../components/forms/Select.jsx';
import { TabBar } from '../../components/navigation/TabBar.jsx';

const TASKS = [
  { id: 't1', no: 'TASK-141', title: '안전보건 교육 이수 내역 자료 요청', from: '이수진 → 나', due: '~07.26', state: '요청됨', tone: 'alert', over: true },
  { id: 't2', no: 'TASK-139', title: '공급업체 행동강령 서명본 검토', from: '김대성 → 나', due: '~07.29', state: '진행중', tone: 'wait' },
  { id: 't3', no: 'TASK-136', title: '탄소배출 산정 근거 확인', from: '나 → 박지원', due: '~07.28', state: '검토대기', tone: 'idle' },
  { id: 't4', no: 'TASK-128', title: '폐기물 위탁 계약서 스캔 업로드', from: '나 → 정하늘', due: '완료 07.21', state: '완료', tone: 'done' }
];
const STAGES = ['요청됨', '진행중', '검토대기', '완료'];

export function TaskScreen() {
  const [sel, setSel] = React.useState('t1');
  const [sort, setSort] = React.useState('기한순');
  const [due, setDue] = React.useState('전체');
  const cur = TASKS.find(t => t.id === sel);
  const stageIdx = STAGES.indexOf(cur.state);
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0, minWidth: 0 }}>
      <aside style={{ width: 196, flex: 'none', background: 'var(--surface-panel)', borderRight: '1px solid var(--border-structure)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 'none', padding: '9px 12px', borderBottom: '1px solid var(--border-structure)' }}>
          <Input underline icon="search" placeholder="업무·담당자 검색" />
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '5px 0' }}>
          {STAGES.map((s, i) => {
            const n = TASKS.filter(t => t.state === s).length;
            const on = cur.state === s;
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: '8px 12px',
                background: on ? 'var(--surface-selected)' : 'transparent', borderLeft: '2px solid ' + (on ? 'var(--border-brand)' : 'transparent') }}>
                <span style={{ width: 7, height: 7, borderRadius: 'var(--r-pill)', flex: 'none', background: i === 3 ? 'var(--green-600)' : (i === 0 ? 'var(--red-600)' : 'var(--amber-500)') }} />
                <span style={{ flex: 1, fontSize: 'var(--fs-13)', fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)', color: on ? 'var(--text-accent)' : 'var(--text-body)' }}>{s}</span>
                <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-meta)' }}>{n}</span>
              </div>
            );
          })}
        </div>
      </aside>
      <div style={{ width: 322, flex: 'none', background: 'var(--surface-panel)', borderRight: '1px solid var(--border-structure)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 'none', padding: '9px 12px', borderBottom: '1px solid var(--border-structure)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <span style={{ flex: 1, fontSize: 'var(--fs-12-1)', fontWeight: 'var(--fw-black)' }}>업무 목록</span>
            <Select value={sort} options={['기한순', '최신순', '상태순']} onChange={setSort} width={110} size="sm" align="right" />
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-1)', flexWrap: 'wrap' }}>
            {[['전체', 4], ['기한초과', 1], ['임박', 2]].map(([l, c]) => (
              <FilterChip key={l} label={l} count={c} active={due === l} onClick={() => setDue(l)} />
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {TASKS.map(t => (
            <ListRow key={t.id} title={t.title} meta={t.no + ' · ' + t.from + ' · ' + t.due}
              icon={t.over ? 'warning' : 'assignment'} accent={t.over ? 'var(--state-alert-bar)' : undefined}
              right={<Badge tone={t.tone}>{t.state}</Badge>} selected={t.id === sel} onClick={() => setSel(t.id)} />
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 360, display: 'flex', flexDirection: 'column', background: 'var(--surface-canvas)', minHeight: 0 }}>
        <div style={{ flex: 'none', background: 'var(--surface-panel)', borderBottom: '1px solid var(--border-structure)', padding: '12px var(--row-px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-black)', color: 'var(--slate-600)', background: 'var(--slate-200)', borderRadius: 'var(--r-xs)', padding: '2px 6px' }}>{cur.no}</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-15)', fontWeight: 'var(--fw-black)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cur.title}</span>
            <Badge tone={cur.tone}>{cur.state}</Badge>
            <Button size="sm" icon="upload">증빙 첨부</Button>
            <Button size="sm" variant="primary" icon="check">완료 처리</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            {STAGES.map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 ? <span style={{ flex: 1, height: 1, background: i <= stageIdx ? 'var(--blue-700)' : 'var(--border-structure)' }} /> : null}
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', fontSize: 'var(--fs-11-2)', fontWeight: 'var(--fw-bold)', color: i <= stageIdx ? 'var(--text-accent)' : 'var(--text-meta)', whiteSpace: 'nowrap' }}>
                  <span className="msym" style={{ fontSize: 15 }}>{i < stageIdx ? 'check_circle' : (i === stageIdx ? 'radio_button_checked' : 'radio_button_unchecked')}</span>{s}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 'var(--sp-4) var(--sp-6)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <Panel title="요청 내용" icon="description">
            <div style={{ fontSize: 'var(--fs-14)', lineHeight: 'var(--lh-loose)' }}>
              2025년 하반기 안전보건 교육 이수 내역(부서별 명단·이수 시간 포함)을 요청합니다. 에코바디스 LAB 3.1 문항 증빙으로 사용됩니다.
            </div>
          </Panel>
          <Panel title="처리 이력" icon="history" flush>
            {[['이수진', '3분 전', '요청', '자료가 아직 등록되지 않았습니다. 확인 부탁드립니다.'],
              ['나', '1시간 전', '회신', '구매팀에 원본 요청해 두었습니다. 오늘 중 회신 예정입니다.'],
              ['시스템', '2시간 전', '알림', '기한 D-1 알림이 담당자에게 발송되었습니다.']].map(([who, t, tag, txt]) => (
              <div key={t} style={{ display: 'flex', gap: 'var(--sp-3)', padding: 'var(--row-py) var(--row-px)', borderBottom: '1px solid var(--border-hairline)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 'var(--r-pill)', background: 'var(--blue-700)', marginTop: 6, flex: 'none' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)' }}>
                    <span style={{ fontSize: 'var(--fs-12-1)', fontWeight: 'var(--fw-bold)' }}>{who}</span>
                    <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-meta)' }}>{t}</span>
                    <Badge tone="idle">{tag}</Badge>
                  </div>
                  <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-label)', lineHeight: 'var(--lh-loose)', marginTop: 'var(--sp-1)' }}>{txt}</div>
                </div>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}
