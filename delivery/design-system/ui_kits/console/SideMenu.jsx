import React from 'react';
import { SideMenuItem } from '../../components/layout/SideMenuItem.jsx';

const GROUPS = [
  { title: '프로젝트', items: [['space_dashboard', '대시보드', 'dash'], ['group', '멤버', 'members']] },
  { title: '협업공간', items: [['forum', 'ESG 전략 TF', 'chat', 3], ['forum', '김대성', 'chat2'], ['task_alt', '업무', 'task', 2, 'alert']] },
  { title: '문서', items: [['folder_open', '문서 저장소', 'store'], ['description', '문서', 'editor']] },
  { title: '에코바디스', items: [['monitoring', '요약', 'ecoSum'], ['checklist', '문항', 'ecoWork', 300], ['verified_user', '증빙자료', 'ecoDocs'], ['move_to_inbox', '자료요청', 'ecoReq', 2, 'alert']] },
  { title: '시스템', items: [['group', '멤버등록', 'sysMember'], ['settings', '설정', 'settings']] }
];

export function SideMenu({ screen, onScreen, collapsed }) {
  return (
    <aside style={{
      width: collapsed ? 'var(--menu-w-collapsed)' : 'var(--menu-w)', flex: 'none',
      background: 'var(--surface-side)', borderRight: '1px solid var(--border-structure)',
      display: 'flex', flexDirection: 'column', transition: 'width var(--dur-base) var(--ease-out)', overflow: 'hidden'
    }}>
      {collapsed ? null : (
        <div style={{ flex: 'none', borderBottom: '1px solid var(--border-structure)', padding: '11px 13px' }}>
          <div style={{ fontSize: 'var(--fs-11-2)', fontWeight: 'var(--fw-black)', color: 'var(--text-meta)', letterSpacing: 'var(--ls-label)' }}>현재 조직&사업부</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginTop: 'var(--sp-1)' }}>
            <span style={{ fontSize: 'var(--fs-15)', fontWeight: 'var(--fw-black)', letterSpacing: 'var(--ls-title)' }}>ESG 전략팀</span>
            <span className="msym" style={{ marginLeft: 'auto', fontSize: 16, color: 'var(--text-meta)' }}>expand_more</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)', fontSize: 'var(--fs-11-2)', color: 'var(--text-sub)' }}>
            <span>8 stores</span><span style={{ color: 'var(--border-structure)' }}>|</span><span>1,284 files</span><span style={{ color: 'var(--border-structure)' }}>|</span><span>8 channels</span>
          </div>
        </div>
      )}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
        {GROUPS.map(g => (
          <div key={g.title} style={{ marginBottom: 'var(--sp-3)' }}>
            {collapsed
              ? <div style={{ height: 1, background: 'var(--border-structure)', margin: '7px 10px' }} />
              : <div style={{ fontSize: 'var(--fs-11-2)', fontWeight: 'var(--fw-black)', color: 'var(--text-meta)', letterSpacing: 'var(--ls-label)', padding: '5px 12px' }}>{g.title}</div>}
            {g.items.map(([icon, label, id, badge, tone]) => (
              <SideMenuItem key={label} icon={icon} label={label} badge={badge} badgeTone={tone || 'idle'}
                active={screen === id} collapsed={collapsed} onClick={() => onScreen && onScreen(id)} />
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
