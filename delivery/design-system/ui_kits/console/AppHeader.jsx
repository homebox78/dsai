import React from 'react';
import { IconButton } from '../../components/core/IconButton.jsx';
import { Dropdown } from '../../components/overlay/Dropdown.jsx';
import { Badge } from '../../components/core/Badge.jsx';

export function AppHeader() {
  const [open, setOpen] = React.useState(null);
  return (
    <header style={{
      height: 'var(--header-h)', flex: 'none', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
      padding: '0 14px', background: 'var(--surface-brand)', borderBottom: '1px solid var(--blue-900)', position: 'relative', zIndex: 60
    }}>
      <img src="../../assets/logo/amber-logo.png" alt="Amber" style={{ height: 22, width: 'auto', display: 'block' }} />
      <div style={{ width: 1, height: 20, background: 'var(--on-brand-border)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', maxWidth: 230 }}>
        <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-bold)', color: 'var(--text-on-brand)', whiteSpace: 'nowrap' }}>Amber Evolution</span>
        <span style={{ fontSize: 10.2, fontWeight: 'var(--fw-black)', letterSpacing: '.05em', background: 'var(--on-brand-fill)', border: '1px solid var(--on-brand-border)', color: 'var(--text-on-brand)', borderRadius: 'var(--r-xs)', padding: '2px 5px' }}>ENTERPRISE</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', background: 'var(--on-brand-fill)', border: '1px solid rgba(255,255,255,.22)', borderRadius: 'var(--r-lg)', padding: '6px 10px', width: 250, color: 'rgba(255,255,255,.78)', fontSize: 'var(--fs-14)' }}>
        <span className="msym" style={{ fontSize: 17, color: 'rgba(255,255,255,.85)' }}>search</span>
        문서·대화·Task 추론 검색
        <span style={{ marginLeft: 'auto', fontSize: 10, border: '1px solid rgba(255,255,255,.28)', background: 'var(--on-brand-fill)', borderRadius: 'var(--r-xs)', padding: '1px 4px', color: '#fff' }}>⌘K</span>
      </div>
      <button type="button" style={{ width: 30, height: 30, padding: 0, border: '1px solid rgba(255,255,255,.3)', background: '#fff', borderRadius: 'var(--r-md)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="AI 챗봇">
        <span className="msym" style={{ fontSize: 18, color: 'var(--blue-700)' }}>auto_awesome</span>
      </button>
      <IconButton icon="settings" onBrand title="설정" />
      <div style={{ position: 'relative' }}>
        <IconButton icon="notifications" onBrand badge={4} title="알림" onClick={() => setOpen(o => o === 'noti' ? null : 'noti')} />
        <Dropdown open={open === 'noti'} width={300} header={<><span style={{ fontSize: 'var(--fs-12-1)', fontWeight: 'var(--fw-black)' }}>알림</span><span style={{ marginLeft: 'auto', fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-bold)', color: 'var(--text-link)' }}>모두 읽음</span></>}>
          {[['업무 요청', '3분 전', '이수진님이 「안전보건 교육 이수 내역」 자료를 요청했습니다.'],
            ['색인 완료', '18분 전', 'ISO 14001 인증서_2026.pdf 의 OCR·RAG 색인이 완료되었습니다.'],
            ['멘션', '1시간 전', 'ESG 전략 TF에서 @홍길동 을 호출했습니다.']].map(([t, ti, x]) => (
            <div key={t} style={{ padding: '10px var(--row-px)', borderBottom: '1px solid var(--border-hairline)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <Badge tone="brand">{t}</Badge>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-meta)' }}>{ti}</span>
              </div>
              <div style={{ fontSize: 'var(--fs-12)', marginTop: 'var(--sp-1)', lineHeight: 'var(--lh-snug)' }}>{x}</div>
            </div>
          ))}
        </Dropdown>
      </div>
      <IconButton icon="help" onBrand title="도움말" />
      <div style={{ width: 1, height: 20, background: 'var(--on-brand-border)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
        <span style={{ width: 28, height: 28, borderRadius: 'var(--r-pill)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-black)', color: 'var(--blue-700)' }}>홍</span>
        <span>
          <span style={{ display: 'block', fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-bold)', color: '#fff', lineHeight: 1.25 }}>홍길동</span>
          <span style={{ display: 'block', fontSize: 'var(--fs-11)', color: 'var(--on-brand-text-soft)', lineHeight: 1.25 }}>성과 리드</span>
        </span>
      </div>
    </header>
  );
}
