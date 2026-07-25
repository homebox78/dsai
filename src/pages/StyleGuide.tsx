import { Icon } from '@/components/common/icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

/**
 * 디자인 토큰 · 컴포넌트 확인용 스타일 가이드.
 * 시안이 갱신되면 여기부터 대조한다 (색/아이콘/컨트롤 높이).
 */

const brand = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
const ink = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
const states = [
  { name: 'success', label: '성공 · 완료' },
  { name: 'warning', label: '주의 · 대기' },
  { name: 'danger', label: '실패 · 삭제' },
  { name: 'info', label: '정보 · 진행' },
  { name: 'idle', label: '미처리' },
]
const icons = [
  'dashboard', 'folder', 'description', 'chat_bubble', 'task_alt', 'inventory_2',
  'search', 'upload_file', 'create_new_folder', 'note_add', 'auto_awesome', 'smart_toy',
  'notifications', 'settings', 'help', 'account_circle', 'group', 'apartment',
  'menu_open', 'chevron_right', 'expand_more', 'close', 'check', 'more_vert',
  'download', 'delete', 'edit_document', 'visibility', 'lock', 'schedule',
]

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-ink-200 py-8 first:border-t-0">
      <h2 className="text-[15px] font-bold text-ink-900">{title}</h2>
      {desc && <p className="mt-1 text-[13px] text-ink-500">{desc}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

export function StyleGuide() {
  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* 헤더 미리보기 — 블루톤 */}
      <header className="flex h-header items-center gap-3 bg-surface-header px-5 text-white">
        <span className="grid size-7 place-items-center rounded-md bg-white/15">
          <Icon name="hub" size={18} className="text-white" />
        </span>
        <span className="text-[15px] font-bold tracking-tight">Amber 콘솔</span>
        <Badge className="border-0 bg-white/20 text-[11px] font-medium text-white hover:bg-white/20">
          엔터프라이즈
        </Badge>
        <div className="ml-auto flex items-center gap-1">
          {['help', 'settings', 'auto_awesome', 'notifications'].map((n) => (
            <button key={n} className="grid size-8 place-items-center rounded-md hover:bg-white/15">
              <Icon name={n} size={19} className="text-white" />
            </button>
          ))}
          <div className="ml-2 flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-white/20 text-[12px] font-bold">홍</span>
            <div className="leading-tight">
              <p className="text-[13px] font-bold">홍길동</p>
              <p className="text-[11px] text-white/70">성과 리드</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100%-var(--spacing-header))]">
        {/* 사이드메뉴 미리보기 — 연한 그레이 #fafbfc */}
        <aside className="w-menu shrink-0 border-r border-ink-200 bg-surface-sidebar p-4">
          <p className="text-[13px] font-bold text-ink-900">ESG 평가 2026</p>
          <p className="mt-0.5 text-[11px] text-ink-400">선택된 프로젝트</p>
          <nav className="mt-5 space-y-0.5">
            {[
              { icon: 'dashboard', label: '대시보드', active: true },
              { icon: 'group', label: '멤버' },
              { icon: 'chat_bubble', label: '협업공간' },
              { icon: 'folder', label: '문서 저장소' },
              { icon: 'description', label: '문서' },
              { icon: 'verified', label: '에코바디스' },
            ].map((m) => (
              <button
                key={m.label}
                className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] ${
                  m.active ? 'bg-brand-50 font-bold text-brand-700' : 'text-ink-600 hover:bg-ink-100'
                }`}
              >
                <Icon name={m.icon} size={18} filled={m.active} />
                {m.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* 본문 */}
        <main className="min-w-0 flex-1 px-8 pb-16">
          <div className="border-b border-ink-200 py-5">
            <h1 className="text-[20px] font-bold text-ink-900">디자인 토큰 · 컴포넌트 확인</h1>
            <p className="mt-1 text-[13px] text-ink-500">
              Phase 0 셋업 검증 화면입니다. 시안 갱신 시 이 화면부터 대조합니다.
            </p>
          </div>

          <Section title="브랜드 블루" desc="채움 버튼 600 · 헤더 700 · 셋업 패널 800">
            <div className="flex flex-wrap gap-2">
              {brand.map((k) => (
                <div key={k} className="w-[84px]">
                  <div
                    className="h-14 rounded-md border border-ink-200"
                    style={{ background: `var(--color-brand-${k})` }}
                  />
                  <p className="mt-1.5 text-[11px] text-ink-500">brand-{k}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="중립 (블루 그레이)" desc="영역 구분은 카드가 아닌 라인 — ink-200">
            <div className="flex flex-wrap gap-2">
              {ink.map((k) => (
                <div key={k} className="w-[84px]">
                  <div
                    className="h-14 rounded-md border border-ink-200"
                    style={{ background: `var(--color-ink-${k})` }}
                  />
                  <p className="mt-1.5 text-[11px] text-ink-500">ink-{k}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="상태 색" desc="배지 · 진행률 · 처리 상태">
            <div className="flex flex-wrap gap-3">
              {states.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center gap-2 rounded-md border border-ink-200 px-3 py-2"
                >
                  <span
                    className="size-3 rounded-full"
                    style={{ background: `var(--color-state-${s.name})` }}
                  />
                  <span className="text-[12px] text-ink-700">{s.label}</span>
                  <code className="text-[11px] text-ink-400">{s.name}</code>
                </div>
              ))}
              <div className="flex items-center gap-2 rounded-md border border-ink-200 px-3 py-2">
                <span className="size-3 rounded-full bg-ai" />
                <span className="text-[12px] text-ink-700">AI 생성물</span>
                <code className="text-[11px] text-ink-400">ai</code>
              </div>
            </div>
          </Section>

          <Section title="아이콘" desc="전 화면 Google Material Symbols 사용 (로컬 번들, CDN 없음)">
            <div className="flex flex-wrap gap-4">
              {icons.map((n) => (
                <div key={n} className="grid w-[92px] place-items-center gap-1.5">
                  <Icon name={n} size={24} className="text-ink-700" />
                  <span className="w-full truncate text-center text-[10px] text-ink-400">{n}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="폼 컨트롤" desc="같은 줄 컨트롤 높이는 항상 동일 (h-9 = 36px)">
            <div className="flex flex-wrap items-center gap-2">
              <Input placeholder="파일명 또는 요약으로 검색" className="h-9 w-[260px]" />
              <Select>
                <SelectTrigger className="h-9 w-[150px]">
                  <SelectValue placeholder="전체 상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="done">답변완료</SelectItem>
                  <SelectItem value="draft">AI 초안</SelectItem>
                  <SelectItem value="none">미처리</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-9">
                <Icon name="search" size={17} />
                검색
              </Button>
              <Button variant="outline" className="h-9">
                <Icon name="upload_file" size={17} />
                파일 업로드
              </Button>
              <Button variant="ghost" className="h-9">
                초기화
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox id="sg-ck" defaultChecked />
                <Label htmlFor="sg-ck" className="text-[13px]">감사 로그 사용</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="sg-sw" defaultChecked />
                <Label htmlFor="sg-sw" className="text-[13px]">AI 인덱싱</Label>
              </div>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">전체</TabsTrigger>
                  <TabsTrigger value="unread">안 읽음</TabsTrigger>
                  <TabsTrigger value="mention">멘션</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Section>

          <Section title="배지 · 진행률" desc="문서 처리 상태 표기">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-state-success-soft text-state-success hover:bg-state-success-soft">OCR 완료</Badge>
              <Badge className="bg-state-info-soft text-state-info hover:bg-state-info-soft">RAG 준비</Badge>
              <Badge className="bg-state-warning-soft text-state-warning hover:bg-state-warning-soft">OCR 대기</Badge>
              <Badge className="bg-state-danger-soft text-state-danger hover:bg-state-danger-soft">처리 실패</Badge>
              <Badge className="bg-ai-soft text-ai hover:bg-ai-soft">AI 초안</Badge>
              <Badge variant="outline">v3</Badge>
            </div>
            <div className="mt-5 max-w-[420px] space-y-3">
              {[
                { label: 'OCR', value: 100 },
                { label: '메타데이터', value: 96 },
                { label: '청킹', value: 100 },
                { label: 'RAG 색인', value: 92 },
              ].map((p) => (
                <div key={p.label}>
                  <div className="mb-1 flex justify-between text-[12px]">
                    <span className="text-ink-600">{p.label}</span>
                    <span className="font-medium text-ink-900">{p.value}%</span>
                  </div>
                  <Progress value={p.value} className="h-1.5" />
                </div>
              ))}
            </div>
          </Section>

          <Section title="타이포" desc="Pretendard Variable (로컬 번들)">
            <div className="space-y-2">
              <p className="text-[24px] font-bold text-ink-900">기업 문서 지식을 AI로 연결합니다</p>
              <p className="text-[15px] text-ink-700">에코바디스 평가 문항 356건의 증빙을 자동으로 찾습니다.</p>
              <p className="text-[13px] text-ink-500">
                본문 텍스트 — 프로젝트에 색인된 문서 1,284건에서 관련 내용을 검색합니다.
              </p>
              <p className="font-mono text-[12px] text-ink-400">ESG-2026-EVAL · org_01H_AMBER</p>
            </div>
          </Section>
        </main>
      </div>
    </div>
  )
}
