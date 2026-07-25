import { useState } from 'react'
import { Icon } from '@/components/common/icon'
import { useAppStore, type ScreenKey } from '@/stores/app-store'
import { useLayerStore, type LayerKey } from '@/stores/layer-store'

/**
 * 작업 목록 · 검수 인덱스 — 스토리보드 63p 대비 제작 현황.
 * "열기"를 누르면 해당 화면·레이어가 이 화면 위에 바로 열린다(페이지 이동 없음).
 * ⚠️ 납품 시 제거 대상.
 */

type Kind = '화면' | '모달' | '시트' | '드롭다운' | '패널' | '오버레이'

interface Item {
  page: string
  name: string
  kind: Kind
  desc: string
  screen?: ScreenKey
  layer?: LayerKey
  route?: string
  todo?: boolean
}

interface Group {
  title: string
  icon: string
  items: Item[]
}

const GROUPS: Group[] = [
  {
    title: '인증 · 초기 셋업',
    icon: 'login',
    items: [
      { page: 'p7', name: '로그인', kind: '화면', desc: '블루 컨셉 · AI 파형 애니메이션 배경', route: '/login' },
      { page: 'p7', name: '회원가입', kind: '화면', desc: '초대 배너 · 비밀번호 강도 · 약관 동의', route: '/login?tab=signup' },
      { page: 'p7', name: '아이디·비밀번호 찾기', kind: '화면', desc: '재설정 링크 발송 · SSO 안내', route: '/login?tab=find' },
      { page: 'p7', name: '2단계 인증(2FA)', kind: '화면', desc: 'OTP 6칸 · 카운트다운 · 백업 코드', route: '/login?tab=2fa' },
      { page: 'p23', name: '초기 셋업 1 · 조직 생성', kind: '화면', desc: '플랜 카드 선택 + 계층 미리보기', route: '/setup' },
      { page: 'p24', name: '초기 셋업 2 · 조직&사업부', kind: '화면', desc: '상위 사업부·설명 · 향후 모달 대체', route: '/setup?step=1' },
      { page: 'p25', name: '초기 셋업 3 · 프로젝트', kind: '화면', desc: '공개 범위 · 멤버 초대 칩 · 완료 구성', route: '/setup?step=2' },
    ],
  },
  {
    title: '공통 셸 · 헤더 (형태1)',
    icon: 'dashboard',
    items: [
      { page: 'p5', name: '4단 레이아웃 · 패널 펼침', kind: '화면', desc: '메뉴 | 파일목록 | 컨텐츠 | 챗봇', screen: 'store' },
      { page: 'p5', name: '메뉴 숨김 (아이콘만)', kind: '패널', desc: '숨김 시 아이콘 노출 · 축소/확대 토글', screen: 'store' },
      { page: 'p8', name: '경로 breadcrumb 영역', kind: '패널', desc: '경로 + 배지 + 우측 액션 버튼', screen: 'store' },
      { page: 'p9', name: '조직&사업부 스위처 (N)', kind: '드롭다운', desc: '전환 + 크레딧 + 생성', layer: undefined },
      { page: 'p12', name: '도움말 드롭다운', kind: '드롭다운', desc: '가이드·정책 문서 4종 (상세는 클라이언트 제작)' },
      { page: 'p13', name: '알림 드롭다운', kind: '드롭다운', desc: '전체·안읽음·멘션 탭 + 모두 읽음' },
      { page: 'p14', name: '프로필 드롭다운', kind: '드롭다운', desc: '계정·설정·권한·로그아웃' },
      { page: 'p17', name: 'AI 검색 시트', kind: '시트', desc: '헤더 ✦ 클릭 시 우측 슬라이드', layer: 'ai-chat' },
      { page: 'p18', name: '설정 (5영역)', kind: '모달', desc: '내 계정·보안·조직&사업부·AI·알림', layer: 'settings' },
      { page: 'p60', name: '전체 메뉴 오버레이', kind: '오버레이', desc: '화면 전체를 덮는 메가메뉴 + 할 일' },
    ],
  },
  {
    title: '대시보드',
    icon: 'space_dashboard',
    items: [
      { page: 'p59', name: '대시보드', kind: '화면', desc: 'KPI 4 + 내 업무 + 에코바디스 + 파이프라인', screen: 'dash' },
      { page: 'p61', name: 'AI 처리 상태 위젯', kind: '패널', desc: '단계별 진행률 · 남은 시간', screen: 'dash' },
      { page: 'p62', name: '외부 협업자 · 최근 활동', kind: '패널', desc: '만료 표시 · 활동 타임라인', screen: 'dash' },
      { page: 'p63', name: '스토리지 위젯', kind: '패널', desc: '문서·증빙·첨부 분해 게이지', screen: 'dash' },
    ],
  },
  {
    title: '문서 저장소',
    icon: 'folder_open',
    items: [
      { page: 'p37', name: '초기 진입 · 파일 목록', kind: '화면', desc: '폴더 트리 + 목록 + 테이블', screen: 'store' },
      { page: 'p39', name: '폴더 선택 · 목록 2종', kind: '화면', desc: '용도가 다른 목록 2개 동시 구성', screen: 'store' },
      { page: 'p40', name: '파일 상세', kind: '화면', desc: 'AI 요약 hide/show · 뷰어 · 탭 4종', screen: 'store' },
      { page: 'p38', name: '폴더 추가', kind: '모달', desc: '이름 + 접근 권한', layer: 'folder-create' },
      { page: 'p41', name: '파일 업로드', kind: '모달', desc: '드래그&드롭 · AI 인덱싱 토글', layer: 'file-upload' },
      { page: 'p42', name: '새 파일 만들기', kind: '모달', desc: '이름 + 유형(doc/hwp/md)', layer: 'file-create' },
      { page: 'p43', name: '문서 작성기', kind: '화면', desc: '목차 레일 + 본문 + AI 삽입', screen: 'store' },
      { page: 'p45', name: 'AI 답변 삽입 7종', kind: '패널', desc: '커서/문단/교체/문서끝/제목/표', screen: 'store' },
      { page: 'p40', name: '전체화면 문서 뷰어', kind: '모달', desc: 'react-pdf · 이미지 프리뷰', layer: 'viewer' },
      { page: 'p44', name: '목차 편집 페이지', kind: '화면', desc: '클라이언트(Aiden) 직접 제작', todo: true },
    ],
  },
  {
    title: '협업공간 · 업무',
    icon: 'forum',
    items: [
      { page: 'p46', name: '채팅 기본 형태', kind: '화면', desc: '룸 목록 + 대화 + 업무존(항상 열림)', screen: 'chat' },
      { page: 'p47', name: '업무존 탭 전환', kind: '패널', desc: '업무 ↔ 대화방 정보 탭', screen: 'chat' },
      { page: 'p48', name: '외부 협업자 초대', kind: '모달', desc: '이메일 / 초대 링크 · 만료 · 권한', layer: 'chat-invite' },
      { page: 'p49', name: '업무 요청 시트', kind: '시트', desc: '담당자·기한·참고 파일', layer: 'task-request' },
      { page: 'p50', name: '대화방 정보', kind: '모달', desc: '참여자 · 공유 파일 · 알림 설정', layer: 'chat-info' },
      { page: 'p54', name: '대화방 나가기', kind: '모달', desc: '되돌릴 수 없음 경고', layer: 'chat-leave' },
      { page: 'p51', name: 'Task 빠른 처리', kind: '모달', desc: '미리보기 · 버전 · 활동 3탭', layer: 'task-preview' },
      { page: 'p55', name: '업무 관리', kind: '화면', desc: '상태 · 목록 · 상세 · 실시간 스트림', screen: 'task' },
      { page: 'p56', name: '업무 상세 처리', kind: '화면', desc: '타임라인 · 증빙 업로드 · 코멘트', screen: 'task' },
    ],
  },
  {
    title: '에코바디스',
    icon: 'verified_user',
    items: [
      { page: 'p57', name: '에코바디스 요약', kind: '화면', desc: '질문지 + 문항 결과 + 요청 자료', screen: 'ecoSum' },
      { page: 'p58', name: '처리부', kind: '화면', desc: 'OCR 수정 · 폴더 AI 검색 · 답변 확정', screen: 'ecoWork' },
      { page: 'p58', name: '증빙자료 매핑', kind: '화면', desc: '문항 ↔ 문서 ↔ 페이지 + 커버리지', screen: 'ecoDocs' },
      { page: 'p58', name: '자료요청', kind: '화면', desc: '문항 근거 부족 시 담당자 요청 현황', screen: 'ecoReq' },
      { page: 'p58', name: '답변서 내려받기', kind: '모달', desc: '전체를 1개 파일로 내보내기', layer: 'eco-export' },
    ],
  },
  {
    title: '시스템',
    icon: 'settings',
    items: [
      { page: 'p19', name: '멤버 관리', kind: '화면', desc: '권한 · 상태 · 최근 접속', screen: 'members' },
      { page: 'p22', name: '채널 관리', kind: '화면', desc: '채널 · 참여자 · 메시지 수', screen: 'members' },
      { page: 'p11', name: '멤버 초대', kind: '모달', desc: '이메일 행 추가 · 역할 지정', layer: 'member-invite' },
      { page: 'p10', name: '조직&사업부 생성', kind: '모달', desc: '이름 · 상위 사업부 · 설명', layer: 'ws-create' },
      { page: 'p10', name: '프로젝트 생성', kind: '모달', desc: '이름 · 공개 범위 · 기본 저장소', layer: 'proj-create' },
      { page: 'p32', name: '요금제 · 결제수단', kind: '모달', desc: '플랜 비교 · 크레딧 충전', layer: 'plan' },
    ],
  },
]

const KIND_TONE: Record<Kind, { bg: string; fg: string }> = {
  화면: { bg: '#eff6ff', fg: '#1d4ed8' },
  모달: { bg: '#f5f3ff', fg: '#7c3aed' },
  시트: { bg: '#ecfdf3', fg: '#15803d' },
  드롭다운: { bg: '#fffbeb', fg: '#b45309' },
  패널: { bg: '#f1f5f9', fg: '#475569' },
  오버레이: { bg: '#fef2f2', fg: '#b91c1c' },
}

const FILTERS: ('전체' | Kind)[] = ['전체', '화면', '모달', '시트', '드롭다운', '패널', '오버레이']

export function IndexView() {
  const { setScreen, setOverlay } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [filter, setFilter] = useState<'전체' | Kind>('전체')

  const all = GROUPS.flatMap((g) => g.items)
  const done = all.filter((i) => !i.todo).length

  const open = (it: Item) => {
    if (it.route) return window.open(it.route, '_blank')
    if (it.layer) openLayer(it.layer)
    if (it.name === '전체 메뉴 오버레이') return setOverlay(true)
    if (it.screen) setScreen(it.screen)
  }

  return (
    <div className="min-w-[900px] flex-1 overflow-auto bg-ink-50">
      <div className="mx-auto max-w-[1180px] px-6 py-6">
        <div className="flex items-start gap-4">
          <div>
            <h1 className="text-3xl2 font-extrabold tracking-[-.02em]">작업 목록 · 검수 인덱스</h1>
            <p className="mt-1.5 text-label text-ink-500">
              스토리보드 63p 대비 제작 현황입니다. <b className="font-bold text-ink-900">열기</b>를 누르면 해당 화면·모달·시트가
              이 화면 위에 바로 열립니다 (페이지 이동 없음).
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            {[
              { label: '전체 항목', value: all.length, color: '#0f172a' },
              { label: '완료', value: done, color: '#15803d' },
              { label: '범위 외', value: all.length - done, color: '#b45309' },
            ].map((k) => (
              <div key={k.label} className="rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-center">
                <div className="text-3xl2 font-extrabold" style={{ color: k.color }}>
                  {k.value}
                </div>
                <div className="mt-0.5 whitespace-nowrap text-tiny text-ink-400">{k.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const on = filter === f
            const count = f === '전체' ? all.length : all.filter((i) => i.kind === f).length
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="rounded-full border px-3 py-1.5 text-sm2 font-bold"
                style={{
                  background: on ? '#1750d8' : '#fff',
                  borderColor: on ? '#1750d8' : '#cbd5e1',
                  color: on ? '#fff' : '#334155',
                }}
              >
                {f} <span className={on ? 'text-white/75' : 'text-ink-400'}>{count}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-5 space-y-5">
          {GROUPS.map((g) => {
            const items = g.items.filter((i) => filter === '전체' || i.kind === filter)
            if (!items.length) return null
            return (
              <section key={g.title} className="overflow-hidden rounded-xl border border-ink-200 bg-white">
                <div className="flex items-center gap-2 border-b border-ink-200 bg-ink-50 px-4 py-2.5">
                  <Icon name={g.icon} size={17} className="text-brand" />
                  <span className="text-label font-extrabold">{g.title}</span>
                  <span className="text-xs2 text-ink-400">{items.length}항목</span>
                </div>
                {items.map((it) => {
                  const tone = KIND_TONE[it.kind]
                  return (
                    <div
                      key={`${g.title}-${it.name}`}
                      className="flex items-center gap-3 border-b border-ink-100 px-4 py-2.5 last:border-b-0 hover:bg-ink-50"
                    >
                      <span className="w-9 flex-none rounded bg-ink-100 py-0.5 text-center font-mono text-tiny font-bold text-ink-500">
                        {it.page}
                      </span>
                      <span className="w-[210px] flex-none truncate text-label font-bold">{it.name}</span>
                      <span
                        className="w-[62px] flex-none rounded-full py-0.5 text-center text-mini font-extrabold"
                        style={{ background: tone.bg, color: tone.fg }}
                      >
                        {it.kind}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm2 text-ink-500">{it.desc}</span>
                      {it.todo ? (
                        <span className="flex-none whitespace-nowrap rounded-full bg-warn-soft px-2 py-0.5 text-mini font-extrabold text-warn-dark">
                          범위 외
                        </span>
                      ) : (
                        <span className="flex-none whitespace-nowrap rounded-full bg-ok-softer px-2 py-0.5 text-mini font-extrabold text-ok-dark">
                          완료
                        </span>
                      )}
                      <button
                        onClick={() => open(it)}
                        disabled={it.todo}
                        className="flex-none rounded-md bg-brand px-3 py-1.5 text-xs2 font-bold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-400"
                      >
                        열기
                      </button>
                    </div>
                  )
                })}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
