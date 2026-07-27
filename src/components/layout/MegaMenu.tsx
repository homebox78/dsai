import { useQaState } from '@/lib/qa-state'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@/components/common/icon'
import { ctx, tasks, taskStatusTone } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore, type LayerKey } from '@/stores/layer-store'

/**
 * 전체 메뉴 오버레이 (p60) — 화면 전체를 덮는 메가메뉴.
 * 메뉴를 찾아 들어가는 게 아니라 현재 현황과 할 일을 한 화면에서 바로 찾는다.
 * 시안 실측: 헤더 52px #1750d8 / 바로가기 바 #f8fafc / 본문 grid 1fr 300px
 */

interface MenuAction {
  label: string
  icon: string
  badge?: number
  run: (a: Actions) => void
}

interface Actions {
  go: (s: ReturnType<typeof useAppStore.getState>['screen']) => void
  set: (patch: Partial<ReturnType<typeof useAppStore.getState>>) => void
  layer: (k: LayerKey) => void
}

const GROUPS: { title: string; icon: string; items: MenuAction[] }[] = [
  {
    title: '검수',
    icon: 'fact_check',
    items: [
      { label: '작업 목록 (스토리보드 대비)', icon: 'fact_check', run: (a) => a.go('index') },
      { label: '로그인 화면 보기', icon: 'login', run: () => (window.location.href = '/login') },
      { label: '초기 셋업 보기', icon: 'rocket_launch', run: () => (window.location.href = '/setup') },
    ],
  },
  {
    title: '프로젝트',
    icon: 'space_dashboard',
    items: [
      { label: '대시보드', icon: 'space_dashboard', run: (a) => a.go('dash') },
      { label: '멤버', icon: 'group', run: (a) => a.set({ screen: 'members', sysTab: 'member', overlay: false }) },
      { label: '채널 관리', icon: 'forum', run: (a) => a.set({ screen: 'members', sysTab: 'channel', overlay: false }) },
      { label: '프로젝트 설정', icon: 'settings', run: (a) => a.layer('proj-create') },
    ],
  },
  {
    title: '협업공간',
    icon: 'forum',
    items: [
      { label: '채팅룸 전체', icon: 'forum', badge: 4, run: (a) => a.go('chat') },
      { label: '업무 관리', icon: 'task_alt', run: (a) => a.go('task') },
      { label: '업무 요청 만들기', icon: 'add_task', run: (a) => a.layer('task-request') },
      { label: '채팅방 초대', icon: 'person_add', run: (a) => a.layer('chat-invite') },
      { label: '내가 보낸 요청', icon: 'send', run: (a) => a.set({ screen: 'task', taskFilter: 'sent', overlay: false }) },
    ],
  },
  {
    title: '문서',
    icon: 'folder_open',
    items: [
      { label: '문서 저장소', icon: 'folder_open', run: (a) => a.set({ screen: 'store', storeMode: 'list', overlay: false }) },
      { label: '문서 작성', icon: 'edit_document', run: (a) => a.set({ screen: 'store', storeMode: 'editor', overlay: false }) },
      { label: '폴더 추가', icon: 'create_new_folder', run: (a) => a.layer('folder-create') },
      { label: '파일 업로드', icon: 'upload', run: (a) => a.layer('file-upload') },
      {
        label: '문서 뷰어',
        icon: 'visibility',
        run: (a) => {
          a.set({ screen: 'store', storeMode: 'detail', folder: 'f4', fileId: 'c1', overlay: false })
          a.layer('viewer')
        },
      },
    ],
  },
  {
    title: '에코바디스',
    icon: 'checklist',
    items: [
      { label: '요약 · 결과보기', icon: 'monitoring', run: (a) => a.go('ecoSum') },
      { label: '문항 처리', icon: 'checklist', badge: 300, run: (a) => a.go('ecoWork') },
      { label: '증빙자료', icon: 'verified_user', badge: 54, run: (a) => a.go('ecoDocs') },
      { label: '자료요청', icon: 'move_to_inbox', badge: 3, run: (a) => a.go('ecoReq') },
      { label: '자료 요청 만들기', icon: 'add_task', run: (a) => a.layer('task-request') },
      { label: '증빙 팩 내보내기', icon: 'download', run: (a) => { a.set({ screen: 'ecoDocs', overlay: false }); a.layer('eco-export') } },
    ],
  },
  {
    title: '조직 · 계정',
    icon: 'apartment',
    items: [
      { label: '조직 만들기', icon: 'apartment', run: (a) => a.layer('ws-create') },
      { label: '조직&사업부 만들기', icon: 'account_tree', run: (a) => a.layer('ws-create') },
      { label: '멤버 추가', icon: 'person_add', run: (a) => a.layer('member-invite') },
      { label: '내 계정 · 보안', icon: 'shield_person', run: (a) => a.layer('settings') },
      { label: '알림 설정', icon: 'notifications', run: (a) => a.layer('settings') },
    ],
  },
]

const QUICK: MenuAction[] = [
  { label: '파일 업로드', icon: 'upload', run: (a) => a.layer('file-upload') },
  { label: '업무 요청', icon: 'task_alt', run: (a) => a.layer('task-request') },
  { label: '새 문서 작성', icon: 'edit_document', run: (a) => a.set({ screen: 'store', storeMode: 'editor', overlay: false }) },
  { label: 'AI 챗봇', icon: 'auto_awesome', run: (a) => a.layer('ai-chat') },
  { label: '멤버 초대', icon: 'person_add', run: (a) => a.layer('member-invite') },
]

const RECENT: (MenuAction & { time: string })[] = [
  {
    label: '표준 공급계약서_v3.docx',
    icon: 'description',
    time: '방금',
    run: (a) => a.set({ screen: 'store', storeMode: 'detail', folder: 'f4', fileId: 'c1', overlay: false }),
  },
  { label: '에코바디스 문항 LAB 1.2', icon: 'checklist', time: '12분 전', run: (a) => a.set({ screen: 'ecoWork', qId: 'q3', overlay: false }) },
  { label: 'ESG 전략 TF 채팅', icon: 'forum', time: '1시간 전', run: (a) => a.set({ screen: 'chat', room: 'r1', overlay: false }) },
  { label: 'TASK-139 업무 상세', icon: 'assignment', time: '어제', run: (a) => a.set({ screen: 'task', taskId: 't3', overlay: false }) },
]

const STATS = [
  { label: '색인 완료 문서', value: '1,284건', color: '#15803d' },
  { label: '진행중 업무', value: `${tasks.filter((t) => t.status === '진행중').length}건`, color: '#1750d8' },
  { label: '에코바디스 답변', value: '214 / 300', color: '#0f172a' },
  { label: '증빙 미연결', value: '54문항', color: '#b91c1c' },
]

export function MegaMenu() {
  const overlay = useAppStore((s) => s.overlay)
  const setOverlay = useAppStore((s) => s.setOverlay)

  // Esc로 전체 메뉴 닫기 (닫기 버튼의 Esc 힌트와 동작 일치)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOverlay(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOverlay])
  const openLayer = useLayerStore((s) => s.open)
  const [query, setQuery] = useQaState('menuQuery', '')
  if (!overlay) return null

  const myOpen = tasks.filter((t) => t.to === '나' && t.status !== '완료' && t.status !== '반려')

  const a: Actions = {
    go: (screen) => useAppStore.setState({ screen, overlay: false }),
    set: (patch) => useAppStore.setState(patch),
    layer: (k) => { setOverlay(false); openLayer(k) },
  }

  const q = query.trim()
  const groups = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((it) => !q || it.label.includes(q) || g.title.includes(q)),
  })).filter((g) => g.items.length)

  const todos = [
    ...myOpen.map((t) => ({
      title: t.title,
      meta: `${t.from} 요청 · ~${t.due}`,
      bar: taskStatusTone[t.status].bar,
      onClick: () => useAppStore.setState({ screen: 'task', taskId: t.id, overlay: false }),
    })),
    {
      title: '에코바디스 미처리 45문항',
      meta: 'AI 초안 41건 검토 대기',
      bar: '#f59e0b',
      onClick: () => a.go('ecoWork'),
    },
    { title: 'OCR 처리중 문서 3건', meta: '색인 완료 후 검색 가능', bar: '#cbd5e1', onClick: () => a.go('store') },
  ]

  return createPortal(
    <div className="anim-fade fixed inset-0 z-[85] flex flex-col bg-white">
      {/* 헤더 */}
      <div className="flex h-header flex-none items-center gap-2 border-b border-brand-dark bg-brand px-[18px]">
        <img src="/amber-logo.png" alt="Amber" className="block h-[22px] w-auto" />
        <div className="whitespace-nowrap text-[15px] font-extrabold text-white">전체 메뉴</div>
        <span className="whitespace-nowrap text-cap text-white/75">
          {ctx.org} · {ctx.ws} · {ctx.proj}
        </span>
        <div className="flex-1" />
        <div className="flex w-[280px] items-center gap-2 rounded-[7px] border border-white/25 bg-white/10 px-2.5 py-1.5">
          <Icon name="search" size={17} className="text-white/85" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="메뉴·화면 검색"
            className="min-w-0 flex-1 border-none bg-transparent p-0 text-label text-white placeholder:text-white/60 focus:outline-none"
          />
        </div>
      </div>

      {/* 바로가기 */}
      <div className="flex flex-none items-center gap-2 border-b border-ink-200 bg-ink-50 px-7 py-[11px]">
        <span className="whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">바로가기</span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK.map((k) => (
            <button
              key={k.label}
              onClick={() => k.run(a)}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ink-300 bg-white px-2.5 py-1.5 text-sm2 font-bold text-ink-700 hover:border-brand hover:text-brand-dark"
            >
              <Icon name={k.icon} size={16} className="text-brand" />
              {k.label}
            </button>
          ))}
        </div>

        {/* 전체 메뉴 닫기 — 바로가기 줄 우측 끝 */}
        <button
          onClick={() => setOverlay(false)}
          title="전체 메뉴 닫기 (Esc)"
          className="ml-auto flex h-[34px] flex-none items-center gap-1.5 whitespace-nowrap rounded-[7px] border border-ink-300 bg-white px-3 text-sm2 font-bold text-ink-600 hover:border-brand hover:bg-brand-soft hover:text-brand-dark"
        >
          <Icon name="close" size={17} />
          닫기
          <span className="ml-0.5 rounded border border-ink-200 bg-ink-50 px-1.5 py-px font-mono text-tiny font-bold text-ink-400">
            Esc
          </span>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-7 py-6">
        <div className="grid max-w-[1620px] grid-cols-[minmax(0,1fr)_300px] items-start gap-5">
          {/* 메뉴 그룹 */}
          <div className="grid min-w-0 gap-5 [grid-template-columns:repeat(auto-fit,minmax(186px,1fr))]">
            {groups.map((g) => (
              <div key={g.title}>
                <div className="mb-1.5 flex items-center gap-2 border-b border-ink-200 pb-2">
                  <Icon name={g.icon} size={17} className="text-brand" />
                  <span className="whitespace-nowrap text-xs2 font-extrabold tracking-[.06em] text-ink-400">{g.title}</span>
                </div>
                {g.items.map((it) => {
                  const hit = !!q && it.label.includes(q)
                  return (
                    <button
                      key={it.label}
                      onClick={() => it.run(a)}
                      className="flex w-full items-center gap-2 rounded-r-[7px] border-l-2 px-2.25 py-2 text-left hover:bg-ink-100"
                      style={{ background: hit ? '#eff6ff' : 'transparent', borderLeftColor: hit ? '#1750d8' : 'transparent' }}
                    >
                      <Icon name={it.icon} size={17} className="text-ink-400" />
                      <span className="min-w-0 flex-1 truncate text-body font-semibold text-ink-900">{it.label}</span>
                      {!!it.badge && (
                        <span
                          className="flex-none whitespace-nowrap rounded-full px-2 py-0.5 text-mini font-extrabold"
                          style={{
                            background: it.badge > 99 ? '#f1f5f9' : '#fef2f2',
                            color: it.badge > 99 ? '#475569' : '#b91c1c',
                          }}
                        >
                          {it.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* 우측 요약 */}
          <div className="flex min-w-0 flex-col gap-3">
            <div className="rounded-[10px] border border-ink-200 bg-ink-50 p-4">
              <div className="mb-2.75 flex items-center gap-2">
                <span className="whitespace-nowrap text-label font-extrabold">내가 해야 할 일</span>
                <span className="rounded-full bg-bad-soft px-2 py-0.5 text-mini font-extrabold text-bad-dark">
                  {myOpen.length}
                </span>
                <button onClick={() => a.go('task')} className="ml-auto whitespace-nowrap text-xs2 font-bold text-brand">
                  전체
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {todos.map((t) => (
                  <button
                    key={t.title}
                    onClick={t.onClick}
                    className="block rounded-r-lg border border-l-2 border-ink-200 bg-white px-2.75 py-2.5 text-left hover:border-brand-fade"
                    style={{ borderLeftColor: t.bar }}
                  >
                    <span className="block text-sm2 font-bold leading-[1.6]">{t.title}</span>
                    <span className="mt-1 block text-xs2 text-ink-500">{t.meta}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[10px] border border-ink-200 bg-white p-4">
              <div className="mb-2.5 whitespace-nowrap text-label font-extrabold">최근 본 화면</div>
              <div className="flex flex-col gap-1">
                {RECENT.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => r.run(a)}
                    className="flex items-center gap-2 rounded-md px-1.5 py-1.75 text-left hover:bg-ink-100"
                  >
                    <Icon name={r.icon} size={16} className="text-ink-400" />
                    <span className="min-w-0 flex-1 truncate text-sm2 font-semibold">{r.label}</span>
                    <span className="whitespace-nowrap text-tiny text-ink-400">{r.time}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[10px] border border-ink-200 bg-white p-4">
              <div className="mb-2.5 whitespace-nowrap text-label font-extrabold">프로젝트 현황</div>
              <div className="flex flex-col gap-2">
                {STATS.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="flex-1 whitespace-nowrap text-sm2 text-ink-500">{s.label}</span>
                    <span className="whitespace-nowrap text-label font-extrabold" style={{ color: s.color }}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
