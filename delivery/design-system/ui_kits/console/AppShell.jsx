import React from 'react';
import { PanelToggleHandle } from '../../components/layout/PanelToggleHandle.jsx';
import { SideMenu } from './SideMenu.jsx';
import { AppHeader } from './AppHeader.jsx';

export function AppShell({ screen, onScreen, breadcrumb, children, aside }) {
  const [menuOpen, setMenuOpen] = React.useState(true);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-canvas)', overflow: 'hidden' }}>
      <AppHeader />
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflowX: 'auto' }}>
        <SideMenu screen={screen} onScreen={onScreen} collapsed={!menuOpen} />
        <PanelToggleHandle side="left" open={menuOpen} title={menuOpen ? '메뉴 접기' : '메뉴 펼치기'} onClick={() => setMenuOpen(o => !o)} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {breadcrumb}
          <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
            <div style={{ flex: 1, minWidth: 360, display: 'flex', flexDirection: 'column', minHeight: 0 }}>{children}</div>
            {aside}
          </div>
        </div>
      </div>
    </div>
  );
}
