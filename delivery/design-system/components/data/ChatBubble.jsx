import React from 'react';

/* 채팅룸 메시지. 목업 Amber Document Intelligence.dc.html 의 chatMsgs 렌더를 그대로 컴포넌트화했다.
   이름·시간 헤더(항상) → 버블(+호버 액션·읽음) → 리액션 → 첨부/업무요청(버블 아래 형제). */
export function ChatBubble({ mine, name, time, text, read, reactions, file, task, onReply, onPin, onTask, onFile, onTaskOpen }) {
  const align = mine ? 'flex-end' : 'flex-start';
  const bg = mine ? '#1750d8' : '#f1f5f9';
  const fg = mine ? '#fff' : '#0f172a';
  const rowDir = mine ? 'row-reverse' : 'row';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-bold)', whiteSpace: 'nowrap' }}>{name}</span>
        <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-meta)' }}>{time}</span>
      </div>
      {text ? (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, flexDirection: rowDir }}>
            <div style={{ maxWidth: 520, borderRadius: 'var(--r-xl)', padding: '8px 12px', fontSize: 'var(--fs-14)', lineHeight: 'var(--lh-body)', background: bg, color: fg }}>{text}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingBottom: 2 }}>
              {read ? <span style={{ fontSize: 'var(--fs-10)', fontWeight: 'var(--fw-bold)', color: 'var(--text-meta)', whiteSpace: 'nowrap' }}>{read}</span> : null}
              <BubbleAction icon="reply" title="답장" hover="#1750d8" onClick={onReply} />
              <BubbleAction icon="push_pin" title="고정" hover="#b45309" onClick={onPin} />
              <BubbleAction icon="task_alt" title="이 메시지로 업무 요청" hover="#16a34a" onClick={onTask} />
            </div>
          </div>
          {reactions && reactions.length ? (
            <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
              {reactions.map((rc, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface-footer)', border: '1px solid var(--border-structure)', borderRadius: 'var(--r-pill)', padding: '2px 8px', fontSize: 'var(--fs-11-2)', fontWeight: 'var(--fw-bold)', color: 'var(--slate-600)' }}>
                  <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 14, color: rc.color }}>{rc.icon}</span>{rc.count}
                </span>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
      {file ? (
        <button type="button" onClick={onFile}
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, background: '#fff', border: 'none', borderLeft: '2px solid var(--border-control)', padding: '8px 12px', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
          <span style={{ flex: 'none', width: 26, height: 26, borderRadius: 'var(--r-md)', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 8.2, fontWeight: 'var(--fw-black)', color: 'var(--slate-600)' }}>{file.ext}</span>
          <span style={{ textAlign: 'left' }}>
            <span style={{ display: 'block', fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-bold)' }}>{file.name}</span>
            <span style={{ display: 'block', fontSize: 'var(--fs-11)', color: 'var(--text-meta)' }}>{file.size} · 문서 저장소에서 열기</span>
          </span>
        </button>
      ) : null}
      {task ? (
        <button type="button" onClick={onTaskOpen}
          style={{ marginTop: 6, width: 330, background: '#fff', border: 'none', borderLeft: '2px solid ' + (task.bar || 'var(--state-wait-bar)'), borderTop: '1px solid var(--border-structure)', borderBottom: '1px solid var(--border-structure)', padding: '12px 14px', textAlign: 'left', cursor: 'pointer', display: 'block', fontFamily: 'var(--font-ui)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <span style={{ fontSize: 'var(--fs-10)', fontWeight: 'var(--fw-black)', color: 'var(--slate-600)', letterSpacing: 'var(--ls-label)' }}>업무 요청</span>
            <span style={{ marginLeft: 'auto', fontSize: 'var(--fs-10)', fontWeight: 'var(--fw-black)', borderRadius: 'var(--r-pill)', padding: '2px 8px', background: 'var(--state-' + (task.tone || 'wait') + '-bg)', color: 'var(--state-' + (task.tone || 'wait') + '-fg)' }}>{task.status}</span>
          </span>
          <span style={{ display: 'block', fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-bold)' }}>{task.title}</span>
          <span style={{ display: 'block', fontSize: 'var(--fs-11-2)', color: 'var(--slate-600)', marginTop: 4 }}>담당 {task.to} · 기한 {task.due}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-bold)', color: 'var(--text-link)', marginTop: 7 }}>빠른 처리 열기<span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 15 }}>open_in_new</span></span>
        </button>
      ) : null}
    </div>
  );
}

function BubbleAction({ icon, title, hover, onClick }) {
  const [h, setH] = React.useState(false);
  return (
    <button type="button" title={title} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 22, height: 22, padding: 0, background: 'none', border: 'none', cursor: 'pointer', color: h ? hover : 'var(--slate-300)' }}>
      <span className="msym" style={{ fontFamily: 'var(--font-icon)', fontSize: 16 }}>{icon}</span>
    </button>
  );
}
