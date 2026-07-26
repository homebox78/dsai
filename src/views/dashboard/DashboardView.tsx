import { useState } from 'react'
import { useQaState } from '@/lib/qa-state'
import { Icon } from '@/components/common/icon'
import { RatioBarChart } from '@/components/common/RatioBarChart'
import { ctx, findFile, fileStatusTone, rooms, tasks, taskStatusTone } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/** 대시보드 (p59~60) — 시안 실측 1:1. min-width 1150 / bg #fff */

const KPIS = [
  { label: '색인 완료 문서', value: '1,284', unit: '건', color: '#15803d', delta: '+42', deltaColor: '#16a34a', icon: 'topic', bar: '#16a34a', pct: '92%', go: 'store' as const },
  { label: '내가 처리할 업무', value: '', unit: '건', color: '#b91c1c', delta: '임박 1건', deltaColor: '#b45309', icon: 'assignment_late', bar: '#dc2626', pct: '40%', go: 'task' as const },
  { label: '에코바디스 답변', value: '214', unit: '/ 300문항', color: '#0f172a', delta: '71%', deltaColor: '#2563eb', icon: 'checklist', bar: '#1750d8', pct: '71%', go: 'ecoWork' as const },
  { label: 'OCR 처리중', value: '3', unit: '건', color: '#b45309', delta: '~4분', deltaColor: '#64748b', icon: 'document_scanner', bar: '#f59e0b', pct: '34%', go: 'store' as const },
]

const ECO_BARS = [
  { label: '답변완료', count: 214, w: '71%', color: '#16a34a' },
  { label: 'AI 초안', count: 41, w: '14%', color: '#f59e0b' },
  { label: '미처리', count: 45, w: '15%', color: '#cbd5e1' },
]

const ECO_BY_CAT = [
  { label: '환경', pct: '84%', color: '#16a34a' },
  { label: '노동·인권', pct: '62%', color: '#f59e0b' },
  { label: '윤리', pct: '78%', color: '#1750d8' },
  { label: '지속가능 조달', pct: '51%', color: '#f59e0b' },
]

const DASH_REQS = [
  { no: 'LAB 3.1', title: '안전보건 교육 이수 내역', state: '자료 요청중', color: '#b45309', q: 'q4' },
  { no: 'SUP 1.3', title: '공급업체 행동강령 서명 현황', state: '증빙 미연결', color: '#b91c1c', q: '' },
  { no: 'ETH 2.2', title: '신고채널 운영 보고', state: 'AI 초안 검토', color: '#f59e0b', q: 'q6' },
]

const PIPELINE = [
  { label: '업로드', count: 1287, icon: 'upload_file', color: '#334155', line: true },
  { label: 'OCR 처리', count: 3, icon: 'document_scanner', color: '#b45309', line: true },
  { label: 'RAG 색인', count: 1284, icon: 'auto_awesome', color: '#15803d', line: true },
  { label: '검색 이용', count: 412, icon: 'search_insights', color: '#1750d8', line: false },
]

const AI_JOBS = [
  { name: '에너지 사용 실적_월별.xlsx', stage: 'OCR 62%', pct: '62%', color: '#2563eb', eta: '남은 시간 약 1분 40초' },
  { name: '폐기물 처리 위탁계약_2026.pdf', stage: '색인 대기', pct: '8%', color: '#f59e0b', eta: '대기열 2번째' },
  { name: '에코바디스 답변 초안 생성', stage: '추론 34%', pct: '34%', color: '#16a34a', eta: '41문항 중 14문항 완료' },
]

const GUESTS = [
  { name: '정하늘', org: '메가존 · 개발 파트너', initial: '정', expire: '7일 후 만료', color: '#b45309' },
  { name: '오세훈', org: '외부 심사원', initial: '오', expire: '30일 후 만료', color: '#64748b' },
]

const ACTIVITIES = [
  { text: '박지원님이 ISO 14001 인증서를 업로드했습니다.', time: '18분 전', dot: '#2563eb' },
  { text: 'ETH 1.1 문항 답변이 확정되었습니다.', time: '1시간 전', dot: '#16a34a' },
  { text: '김대성님이 TASK-139에 코멘트를 남겼습니다.', time: '3시간 전', dot: '#94a3b8' },
]

const STORAGE = [
  { label: '문서', size: '2.8GB', w: '14%', color: '#2563eb' },
  { label: '증빙', size: '1.1GB', w: '5.5%', color: '#93b4e8' },
  { label: '첨부', size: '0.3GB', w: '1.5%', color: '#cbd5e1' },
]

const DASH_FILE_IDS = ['a1', 'c1', 'a3', 'b1']

function SectionHead({ title, action, onAction, extra }: { title: string; action: string; onAction: () => void; extra?: React.ReactNode }) {
  return (
    <div className="flex h-11 flex-none items-center gap-2 border-b border-ink-200 px-[18px]">
      <span className="whitespace-nowrap text-body font-extrabold">{title}</span>
      {extra}
      <button onClick={onAction} className="ml-auto flex items-center text-sm2 font-semibold text-brand-link">
        {action}
        <Icon name="chevron_right" size={16} />
      </button>
    </div>
  )
}

export function DashboardView() {
  const { setScreen, setQId, setTaskId, setRoom, openFile, setFolder } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [range, setRange] = useState('week')
  const [taskTab, setTaskTab] = useQaState<'mine' | 'sent'>('dashTaskTab', 'mine')

  const myOpen = tasks.filter((t) => t.to === '나' && t.status !== '완료' && t.status !== '반려').length
  const sentTasks = tasks.filter((t) => t.from === '나')
  const waitCount = sentTasks.filter((t) => t.status === '요청됨' || t.status === '진행중').length
  const shownTasks = tasks.filter((t) => (taskTab === 'sent' ? t.from === '나' : t.to === '나')).slice(0, 5)

  return (
    <div className="flex min-w-[1150px] flex-1 flex-col overflow-auto bg-white">
      {/* 헤드 */}
      <div className="flex items-end gap-3 border-b border-ink-200 px-5 pb-[13px] pt-4">
        <div>
          <div className="text-[17.9px] font-extrabold tracking-[-.02em]">{ctx.proj} 대시보드</div>
          <div className="mt-1 text-label text-ink-500">
            2026년 7월 25일 토요일 · 내가 처리할 일 {myOpen}건, 에코바디스 제출까지 D-18
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex gap-1.5">
          {[['week', '이번 주'], ['month', '이번 달'], ['all', '전체']].map(([id, label]) => {
            const on = range === id
            return (
              <button
                key={id}
                onClick={() => setRange(id)}
                className="rounded-md border px-2.5 py-1.5 text-sm2 font-bold"
                style={{
                  background: on ? '#eff6ff' : '#fff',
                  borderColor: on ? '#bfdbfe' : '#cbd5e1',
                  color: on ? '#1345bd' : '#334155',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
        <button
          onClick={() => openLayer('task-request')}
          className="flex items-center gap-1 rounded-md bg-brand px-2.5 py-1.5 text-sm2 font-bold text-white hover:bg-brand-dark"
        >
          <Icon name="add" size={17} />
          업무 요청
        </button>
      </div>

      {/* KPI 4분할 */}
      <div className="grid grid-cols-4 border-b border-ink-200">
        {KPIS.map((k) => (
          <button
            key={k.label}
            onClick={() => setScreen(k.go)}
            className="block border-r border-ink-200 px-5 py-3.5 text-left hover:bg-ink-50"
          >
            <span className="flex items-center gap-1.5">
              <Icon name={k.icon} size={17} style={{ color: k.bar }} />
              <span className="whitespace-nowrap text-cap font-bold text-ink-500">{k.label}</span>
            </span>
            <span className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[23.3px] font-extrabold tracking-[-.02em]" style={{ color: k.color }}>
                {k.value || myOpen}
              </span>
              <span className="whitespace-nowrap text-cap text-ink-400">{k.unit}</span>
            </span>
            <span className="mt-[7px] flex items-center gap-1.5">
              <span className="h-1 flex-1 overflow-hidden rounded-full bg-ink-100">
                <span className="block h-full rounded-full" style={{ width: k.pct, background: k.bar }} />
              </span>
              <span className="whitespace-nowrap text-xs2 font-bold" style={{ color: k.deltaColor }}>
                {k.delta}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-none items-stretch">
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 1행: 내가 해야 할 일 | 에코바디스 진행 상태 */}
          <div className="flex items-stretch border-b border-ink-200">
            <div className="flex min-w-[320px] flex-[1.1] flex-col border-r border-ink-200">
              <SectionHead
                title="내가 해야 할 일"
                action="업무 전체"
                onAction={() => setScreen('task')}
                extra={
                  <>
                    <span className="rounded-full bg-bad-soft px-2 py-0.5 text-xs2 font-bold text-bad-dark">{myOpen}</span>
                    <div className="ml-1.5 flex gap-1">
                      {(['mine', 'sent'] as const).map((id) => {
                        const on = taskTab === id
                        const count = id === 'mine' ? tasks.filter((t) => t.to === '나').length : sentTasks.length
                        return (
                          <button
                            key={id}
                            onClick={() => setTaskTab(id)}
                            className="rounded-full border px-2 py-0.5 text-xs2 font-bold"
                            style={{
                              background: on ? '#1750d8' : '#fff',
                              borderColor: on ? '#1750d8' : '#cbd5e1',
                              color: on ? '#fff' : '#334155',
                            }}
                          >
                            {id === 'mine' ? '받은' : '보낸'} {count}
                          </button>
                        )
                      })}
                    </div>
                  </>
                }
              />
              {shownTasks.map((t) => {
                const tone = taskStatusTone[t.status]
                const overdue = t.due < '07.25' && t.status !== '완료' && t.status !== '반려'
                return (
                  <button
                    key={t.id}
                    onClick={() => { setTaskId(t.id); setScreen('task') }}
                    className="flex w-full items-center gap-3 border-b border-ink-100 bg-white px-[18px] py-[11px] text-left hover:bg-ink-50"
                  >
                    <span
                      className="w-[52px] flex-none rounded-full py-[2.5px] text-center text-tiny font-extrabold"
                      style={{ background: tone.bg, color: tone.fg }}
                    >
                      {t.status}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body font-semibold">{t.title}</span>
                      <span className="mt-px block truncate text-xs2 text-ink-400">
                        {t.from} · {t.room}
                      </span>
                    </span>
                    <span className="flex flex-none items-center gap-1.5">
                      {overdue && <Icon name="error" size={16} className="text-bad" />}
                      <span
                        className="whitespace-nowrap text-cap font-bold"
                        style={{ color: t.due < '07.25' ? '#b91c1c' : '#64748b' }}
                      >
                        {t.due < '07.25' ? '기한 초과' : `~${t.due}`}
                      </span>
                    </span>
                  </button>
                )
              })}
              <div className="flex items-center gap-2 border-t border-ink-100 bg-ink-50 px-[18px] py-2.5">
                <Icon name="history" size={16} className="text-ink-500" />
                <span className="whitespace-nowrap text-cap text-ink-500">
                  내가 보낸 요청 {sentTasks.length}건 · 회신 대기 {waitCount}건
                </span>
                <button onClick={() => setScreen('task')} className="ml-auto text-cap font-bold text-brand-link">
                  보낸 요청 보기
                </button>
              </div>
            </div>

            <div className="min-w-[300px] flex-1">
              <SectionHead title="에코바디스 진행 상태" action="처리부" onAction={() => setScreen('ecoWork')} />
              <div className="px-[18px] py-3.5">
                <RatioBarChart slices={ECO_BARS.map((b) => ({ label: b.label, count: b.count, color: b.color, pct: b.w }))} height={10} unit="문항" />
                <div className="mt-[11px] flex gap-4">
                  {ECO_BARS.map((b) => (
                    <div key={b.label} className="flex items-center gap-1.5">
                      <span className="size-2 rounded-sm" style={{ background: b.color }} />
                      <span className="whitespace-nowrap text-cap text-ink-500">{b.label}</span>
                      <span className="text-sm2 font-extrabold">{b.count}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3.5 border-t border-ink-100 pt-3">
                  <div className="mb-[9px] whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">
                    영역별 진행률
                  </div>
                  <div className="mb-[13px] flex flex-col gap-2">
                    {ECO_BY_CAT.map((c) => (
                      <div key={c.label} className="flex items-center gap-2">
                        <span className="w-[76px] flex-none truncate text-cap text-ink-700">{c.label}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                          <span className="block h-full rounded-full" style={{ width: c.pct, background: c.color }} />
                        </span>
                        <span className="w-[34px] flex-none text-right text-xs2 font-bold text-ink-600">{c.pct}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-2 whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">
                    막힌 문항 · 조치 필요
                  </div>
                  <div className="flex flex-col gap-2">
                    {DASH_REQS.map((r) => (
                      <button
                        key={r.no}
                        onClick={() => { if (r.q) setQId(r.q); setScreen(r.q ? 'ecoWork' : 'ecoDocs') }}
                        className="flex items-center gap-2 rounded-md px-1 py-[5px] text-left hover:bg-ink-50"
                      >
                        <span className="flex-none rounded bg-ink-200 px-1.5 py-0.5 font-mono text-tiny font-bold text-ink-600">
                          {r.no}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-label">{r.title}</span>
                        <span className="flex-none whitespace-nowrap text-xs2 font-bold" style={{ color: r.color }}>
                          {r.state}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2행: 문서 파이프라인 | 협업공간 활동 */}
          <div className="flex flex-none items-stretch border-b border-ink-200">
            <div className="flex min-w-[320px] flex-[1.1] flex-col border-r border-ink-200">
              <SectionHead title="문서 파이프라인" action="문서 저장소" onAction={() => setScreen('store')} />
              <div className="flex items-center border-b border-ink-100 px-[18px] py-3">
                {PIPELINE.map((p) => (
                  <div key={p.label} className="flex min-w-0 flex-1 items-center">
                    <button onClick={() => setScreen('store')} className="block text-left">
                      <span className="flex items-center gap-1">
                        <Icon name={p.icon} size={16} style={{ color: p.color }} />
                        <span className="text-lg2 font-extrabold" style={{ color: p.color }}>
                          {p.count}
                        </span>
                      </span>
                      <span className="mt-1 block whitespace-nowrap text-tiny text-ink-500">{p.label}</span>
                    </button>
                    {p.line && <span className="mx-2 h-px flex-1 bg-ink-200" />}
                  </div>
                ))}
              </div>
              {DASH_FILE_IDS.map((id) => {
                const f = findFile(id)
                if (!f) return null
                const st = fileStatusTone[f.status]
                return (
                  <button
                    key={id}
                    onClick={() => { setFolder(f.id.startsWith('a') ? 'f2' : f.id.startsWith('b') ? 'f3' : 'f4'); openFile(id); setScreen('store') }}
                    className="flex w-full items-center gap-3 border-b border-ink-100 bg-white px-[18px] py-[11px] text-left hover:bg-ink-50"
                  >
                    <span className="flex size-7 flex-none items-center justify-center rounded-md bg-ink-100 font-mono text-[8.7px] font-extrabold text-ink-600">
                      {f.ext}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body font-semibold">{f.name}</span>
                      <span className="block text-xs2 text-ink-400">ESG 정책 문서 · {f.date}</span>
                    </span>
                    <span
                      className="flex-none rounded-full px-2 py-0.5 text-tiny font-bold"
                      style={{ background: st.bg, color: st.fg }}
                    >
                      {f.status}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex min-w-[300px] flex-1 flex-col">
              <SectionHead title="협업공간 활동" action="채팅" onAction={() => setRoom('r1')} />
              {rooms.slice(0, 3).map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRoom(r.id)}
                  className="flex w-full items-center gap-3 border-b border-ink-100 bg-white px-[18px] py-[11px] text-left hover:bg-ink-50"
                >
                  <span className="flex size-7 flex-none items-center justify-center rounded-full border border-brand-border bg-brand-soft text-cap font-extrabold text-brand-link-dark">
                    {r.name[0]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-body font-bold">{r.name}</span>
                    <span className="block truncate text-cap text-ink-400">{r.last}</span>
                  </span>
                  {!!r.unread && (
                    <span className="flex-none rounded-full bg-brand px-2 py-0.5 text-tiny font-extrabold text-white">
                      {r.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 우측 위젯 레일 (p61~63) */}
        <aside className="flex w-[300px] flex-none flex-col border-b border-l border-ink-200">
          <div className="border-b border-ink-200 px-[18px] py-3.5">
            <div className="mb-[11px] flex items-center gap-2">
              <span className="text-sm2 font-extrabold">AI 처리 상태</span>
              <span className="ml-auto text-tiny text-ink-400">실시간</span>
            </div>
            <div className="flex flex-col gap-3">
              {AI_JOBS.map((j) => (
                <div key={j.name}>
                  <div className="mb-[5px] flex items-baseline gap-1.5">
                    <span className="min-w-0 flex-1 truncate text-cap font-semibold">{j.name}</span>
                    <span className="flex-none text-tiny font-bold" style={{ color: j.color }}>
                      {j.stage}
                    </span>
                  </div>
                  <div className="h-[5px] overflow-hidden rounded-full bg-ink-100">
                    <div className="h-full rounded-full" style={{ width: j.pct, background: j.color }} />
                  </div>
                  <div className="mt-1 text-mini text-ink-400">{j.eta}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-ink-200 px-[18px] py-3.5">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="text-sm2 font-extrabold">외부 협업자</span>
              <button onClick={() => openLayer('member-invite')} className="ml-auto text-xs2 font-bold text-brand-link">
                관리
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {GUESTS.map((g) => (
                <div key={g.name} className="flex items-center gap-2">
                  <span className="flex size-6 flex-none items-center justify-center rounded-full border border-ink-200 bg-ink-100 text-tiny font-extrabold text-ink-600">
                    {g.initial}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-cap font-semibold">{g.name}</span>
                    <span className="block text-mini text-ink-400">{g.org}</span>
                  </span>
                  <span className="flex-none text-mini font-bold" style={{ color: g.color }}>
                    {g.expire}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-ink-200 px-[18px] py-3.5">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="text-sm2 font-extrabold">최근 활동</span>
              <button className="ml-auto text-xs2 font-bold text-brand-link">전체</button>
            </div>
            <div className="flex flex-col gap-2">
              {ACTIVITIES.map((a) => (
                <div key={a.text} className="flex gap-2">
                  <span className="mt-[5px] size-1.5 flex-none rounded-full" style={{ background: a.dot }} />
                  <div className="min-w-0 flex-1">
                    <div className="text-cap leading-[1.65] text-ink-700">{a.text}</div>
                    <div className="mt-1 text-mini text-ink-400">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-[18px] py-3.5">
            <div className="mb-[9px] flex items-baseline gap-1.5">
              <span className="text-sm2 font-extrabold">스토리지</span>
              <span className="ml-auto text-xs2 text-ink-500">4.2GB / 20GB</span>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full border border-ink-200">
              {STORAGE.map((s) => (
                <span key={s.label} style={{ width: s.w, background: s.color }} />
              ))}
            </div>
            <div className="mt-[9px] flex flex-wrap gap-2">
              {STORAGE.map((s) => (
                <div key={s.label} className="flex items-center gap-1">
                  <span className="size-[7px] rounded-sm" style={{ background: s.color }} />
                  <span className="text-tiny text-ink-500">{s.label}</span>
                  <span className="text-tiny font-bold">{s.size}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
