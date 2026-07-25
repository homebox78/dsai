/**
 * 목업 픽스처 — 전부 완성 시안 `delivery/Amber Document Intelligence.dc.html` 의 데이터를 그대로 옮긴 것.
 * 세계관: Amber Evolution(조직) › ESG 본부 › ESG 전략팀(조직&사업부) › 에코바디스 2026 대응(프로젝트)
 * ⚠️ 값을 임의로 바꾸지 말 것 — 시안이 진리원.
 */

/* ── 컨텍스트 ─────────────────────────────────────── */

export const ctx = {
  org: 'Amber Evolution',
  orgPlan: 'ENTERPRISE',
  biz: 'ESG 본부',
  ws: 'ESG 전략팀',
  wsInitial: 'E',
  proj: '에코바디스 2026 대응',
  projVis: '공개',
  projMembers: 6,
  wsStores: 8,
  wsFiles: '1,284',
  wsChannels: 8,
  credit: '1,000 Credit',
  me: { name: '홍길동', title: '성과 리드', email: 'hong@evolvailab.com', initial: '홍' },
}

/** 조직&사업부 트리 (전환 팝오버) */
export const wsTree = [
  {
    id: 'w1',
    name: 'ESG 전략팀',
    initial: 'E',
    role: '마스터',
    meta: '프로젝트 3',
    projects: [
      { id: 'p1', name: '에코바디스 2026 대응', members: 6, files: 284, vis: '공개' },
      { id: 'p2', name: '지속가능경영보고서', members: 4, files: 132, vis: '비공개' },
      { id: 'p3', name: '공급망 실사 2026', members: 5, files: 96, vis: '공개' },
    ],
  },
  {
    id: 'w2',
    name: '법무팀',
    initial: 'L',
    role: '멤버',
    meta: '프로젝트 2',
    projects: [
      { id: 'p4', name: '표준계약 개정', members: 3, files: 218, vis: '비공개' },
      { id: 'p5', name: '규제 대응', members: 2, files: 64, vis: '비공개' },
    ],
  },
]

/* ── 아이콘 (시안 ICON 맵) ────────────────────────── */

export const ICON = {
  dash: 'space_dashboard',
  user: 'group',
  chat: 'forum',
  task: 'task_alt',
  folder: 'folder_open',
  doc: 'description',
  chart: 'monitoring',
  list: 'checklist',
  shield: 'verified_user',
  inbox: 'move_to_inbox',
  gear: 'settings',
} as const

/* ── 문서 ─────────────────────────────────────────── */

export interface Folder {
  id: string
  name: string
  depth: number
  count: number
}

export const folders: Folder[] = [
  { id: 'f1', name: 'ESG 정책 문서', depth: 0, count: 42 },
  { id: 'f2', name: '환경 인증·실적', depth: 1, count: 23 },
  { id: 'f3', name: '노동·인권', depth: 1, count: 19 },
  { id: 'f4', name: '계약·법무', depth: 0, count: 34 },
  { id: 'f5', name: '에코바디스 증빙', depth: 0, count: 47 },
  { id: 'f6', name: '2026 제출본', depth: 1, count: 21 },
  { id: 'f7', name: '공급망 실사', depth: 0, count: 26 },
]

export type FileStatus = 'RAG 색인 완료' | 'OCR 처리중' | '색인 대기'

export interface DocFile {
  id: string
  name: string
  ext: string
  size: string
  pages: number
  owner: string
  date: string
  status: FileStatus
  summary: string
  tags: string[]
}

export const filesByFolder: Record<string, DocFile[]> = {
  f2: [
    { id: 'a1', name: 'ISO 14001 인증서_2026.pdf', ext: 'PDF', size: '2.1MB', pages: 12, owner: '박지원', date: '07.20', status: 'RAG 색인 완료', summary: '환경경영시스템 인증서 · 유효기간 2029년까지', tags: ['환경', '인증서', '2026'] },
    { id: 'a2', name: '온실가스 배출량 보고서_2025.pdf', ext: 'PDF', size: '6.4MB', pages: 218, owner: '이수진', date: '07.18', status: 'RAG 색인 완료', summary: 'Scope 1·2·3 배출량 산정 결과 및 검증 의견', tags: ['온실가스', '검증', 'Scope3'] },
    { id: 'a3', name: '에너지 사용 실적_월별.xlsx', ext: 'XLSX', size: '450KB', pages: 24, owner: '박지원', date: '07.15', status: 'OCR 처리중', summary: '사업장별 월간 전력·가스 사용량 집계', tags: ['에너지', '월별'] },
    { id: 'a4', name: '환경정책 선언문_국문영문.pdf', ext: 'PDF', size: '1.1MB', pages: 6, owner: '이수진', date: '07.11', status: 'RAG 색인 완료', summary: '대표이사 서명 환경경영 방침 선언문', tags: ['정책', '선언문'] },
    { id: 'a5', name: '폐기물 처리 위탁계약_2026.pdf', ext: 'PDF', size: '3.2MB', pages: 41, owner: '최민호', date: '07.08', status: '색인 대기', summary: '지정폐기물 처리업체 위탁 계약 및 허가증 사본', tags: ['폐기물', '계약'] },
    { id: 'a6', name: '용수 사용 및 재이용 실적.docx', ext: 'DOCX', size: '820KB', pages: 18, owner: '박지원', date: '07.02', status: 'RAG 색인 완료', summary: '취수량·방류량·재이용률 3개년 추이', tags: ['용수', '재이용'] },
  ],
  f3: [
    { id: 'b1', name: '윤리경영 행동강령_v2.pdf', ext: 'PDF', size: '890KB', pages: 34, owner: '김대성', date: '07.19', status: 'RAG 색인 완료', summary: '아동·강제노동 금지 및 차별금지 조항 포함', tags: ['행동강령', '인권'] },
    { id: 'b2', name: '안전보건 교육 이수 내역_2025.xlsx', ext: 'XLSX', size: '1.4MB', pages: 52, owner: '최민호', date: '07.14', status: 'RAG 색인 완료', summary: '전 사업장 법정 교육 이수율 98.2%', tags: ['안전보건', '교육'] },
    { id: 'b3', name: '고충처리 및 신고채널 운영보고.docx', ext: 'DOCX', size: '640KB', pages: 22, owner: '이수진', date: '07.05', status: 'RAG 색인 완료', summary: '내부 신고 채널 접수 12건 처리 결과', tags: ['신고채널', '고충처리'] },
  ],
  f4: [
    { id: 'c1', name: '표준 공급계약서_v3.docx', ext: 'DOCX', size: '1.2MB', pages: 218, owner: '김대성', date: '07.21', status: 'RAG 색인 완료', summary: '법무 검토 완료 · 해지·손해배상 조항 개정본', tags: ['계약', '법무', 'v3'] },
    { id: 'c2', name: '공급업체 행동강령_서명본.pdf', ext: 'PDF', size: '2.4MB', pages: 28, owner: '우덕성', date: '07.16', status: 'RAG 색인 완료', summary: '주요 협력사 128개사 서명 완료 현황 포함', tags: ['공급망', '서명본'] },
    { id: 'c3', name: 'NDA 표준양식_2026.pdf', ext: 'PDF', size: '320KB', pages: 8, owner: '김대성', date: '07.03', status: 'RAG 색인 완료', summary: '3자 비밀유지계약 표준 양식', tags: ['NDA', '양식'] },
  ],
}

export const allFiles = Object.values(filesByFolder).flat()
export const findFile = (id: string) => allFiles.find((f) => f.id === id)

/** 상태 배지 색 (시안 ST) */
export const fileStatusTone: Record<FileStatus, { bg: string; fg: string }> = {
  'RAG 색인 완료': { bg: '#ecfdf3', fg: '#15803d' },
  'OCR 처리중': { bg: '#fffbeb', fg: '#b45309' },
  '색인 대기': { bg: '#e2e8f0', fg: '#334155' },
}

/* ── 멤버 ─────────────────────────────────────────── */

export interface Member {
  id: string
  name: string
  role: string
  dept: string
  email: string
  perm: string
  on: boolean
  state: string
  last: string
}

export const members: Member[] = [
  { id: 'm1', name: '김대성', role: '법무팀 · 매니저', dept: '법무팀', email: 'ds.kim@corp.com', perm: '편집 가능', on: true, state: '활성', last: '방금 전' },
  { id: 'm2', name: '이수진', role: 'ESG팀 · 리드', dept: 'ESG팀', email: 'sj.lee@corp.com', perm: '편집 가능', on: true, state: '활성', last: '12분 전' },
  { id: 'm3', name: '박지원', role: '환경안전팀', dept: '환경안전팀', email: 'jw.park@corp.com', perm: '댓글 가능', on: false, state: '활성', last: '2시간 전' },
  { id: 'm4', name: '최민호', role: '구매팀', dept: '구매팀', email: 'mh.choi@corp.com', perm: '보기 전용', on: false, state: '초대 대기', last: '-' },
]

/* ── 업무 ─────────────────────────────────────────── */

export type TaskStatus = '요청됨' | '진행중' | '검토대기' | '완료' | '반려'

export interface Task {
  id: string
  no: string
  title: string
  from: string
  to: string
  due: string
  status: TaskStatus
  room: string
  files: number
}

export const tasks: Task[] = [
  { id: 't1', no: '142', title: '안전보건 교육 이수 내역 2025년 원본 전달', from: '이수진', to: '나', due: '07.28', status: '요청됨', room: 'ESG 전략 TF', files: 0 },
  { id: 't2', no: '141', title: '폐기물 처리업체 허가증 최신본 업로드', from: '나', to: '최민호', due: '07.26', status: '진행중', room: '최민호', files: 1 },
  { id: 't3', no: '139', title: '공급업체 행동강령 서명 현황 집계', from: '김대성', to: '나', due: '07.25', status: '진행중', room: '김대성', files: 2 },
  { id: 't4', no: '136', title: '용수 재이용률 산정 근거 자료 요청', from: '나', to: '박지원', due: '07.22', status: '검토대기', room: 'ESG 전략 TF', files: 3 },
  { id: 't5', no: '131', title: '표준계약서 개정본 법무 검토 회신', from: '나', to: '김대성', due: '07.18', status: '완료', room: '김대성', files: 2 },
  { id: 't6', no: '128', title: '전년도 감사보고서 원본 제공', from: '최민호', to: '나', due: '07.15', status: '반려', room: '최민호', files: 0 },
]

export interface TaskHistory {
  who: string
  time: string
  text: string
  tag?: string
  file?: string
  fileExt?: string
}

export const taskHistory: Record<string, TaskHistory[]> = {
  t1: [
    { who: '이수진', time: '07.24 09:12', text: '에코바디스 노동·인권 섹션에 필요한 2025년 안전보건 교육 이수 내역 원본이 필요합니다. 사업장별로 구분된 파일이면 좋겠습니다.', tag: '업무 요청' },
    { who: '시스템', time: '07.24 09:12', text: 'Task가 생성되어 담당자에게 알림이 발송되었습니다.', tag: '자동' },
  ],
  t3: [
    { who: '김대성', time: '07.22 14:30', text: '공급업체 행동강령 서명 현황 집계 부탁드립니다. 미서명 업체 리스트도 함께 필요합니다.', tag: '업무 요청' },
    { who: '나', time: '07.23 11:05', text: '128개사 중 119개사 서명 완료 확인했습니다. 미서명 9개사 목록 첨부합니다.', file: '공급업체 행동강령_서명본.pdf', fileExt: 'PDF' },
    { who: '김대성', time: '07.23 16:40', text: '확인했습니다. 미서명 업체는 구매팀과 협의해서 이번 주 내로 마무리하겠습니다.', tag: '코멘트' },
  ],
}

/* ── 채팅 ─────────────────────────────────────────── */

export interface Room {
  id: string
  name: string
  type: string
  time: string
  unread: number
  last: string
}

export const rooms: Room[] = [
  { id: 'r1', name: 'ESG 전략 TF', type: '그룹 · 5명', time: '10:42', unread: 3, last: '업무 요청: 안전보건 교육 이수 내역 전달' },
  { id: 'r2', name: '김대성', type: '1:1', time: '09:18', unread: 0, last: '미서명 업체는 구매팀과 협의하겠습니다' },
  { id: 'r3', name: '최민호', type: '1:1', time: '어제', unread: 1, last: '허가증 스캔본 확인 부탁드립니다' },
  { id: 'r4', name: '법무 검토 채널', type: '그룹 · 4명', time: '07.22', unread: 0, last: '표준계약서 v3 최종 승인되었습니다' },
]

export interface Msg {
  who: string
  mine: boolean
  time: string
  text?: string
  task?: string
  file?: string
  fileExt?: string
  fileSize?: string
}

export const msgs: Record<string, Msg[]> = {
  r1: [
    { who: '이수진', mine: false, time: '09:08', text: '에코바디스 노동·인권 섹션 증빙이 아직 부족합니다. 교육 이수 내역이 필수 항목이에요.' },
    { who: '나', mine: true, time: '09:10', text: '2025년 자료는 구매팀 쪽에 원본이 있을 것 같습니다. 확인해서 올려두겠습니다.' },
    { who: '이수진', mine: false, time: '09:12', task: 't1' },
    { who: '박지원', mine: false, time: '10:36', text: '환경 섹션 쪽은 인증서까지 색인 완료했습니다.' },
    { who: '박지원', mine: false, time: '10:42', file: 'ISO 14001 인증서_2026.pdf', fileExt: 'PDF', fileSize: '2.1MB' },
  ],
  r2: [
    { who: '김대성', mine: false, time: '08:50', text: '표준계약서 v3 어디 있는지 못 찾겠어요. 해지 조항 개정본이요.' },
    { who: '나', mine: true, time: '08:55', text: '계약·법무 폴더에 있습니다. 218페이지짜리라 챗봇으로 p.47 바로 열 수 있어요.' },
    { who: '나', mine: true, time: '08:56', file: '표준 공급계약서_v3.docx', fileExt: 'DOCX', fileSize: '1.2MB' },
    { who: '김대성', mine: false, time: '09:18', task: 't3' },
  ],
  r3: [
    { who: '최민호', mine: false, time: '어제 17:20', text: '허가증 스캔본 확인 부탁드립니다.' },
    { who: '나', mine: true, time: '어제 17:35', task: 't2' },
  ],
  r4: [{ who: '김대성', mine: false, time: '07.22', text: '표준계약서 v3 최종 승인되었습니다.' }],
}

/* ── 에코바디스 ───────────────────────────────────── */

export type EcoStatus = '답변완료' | 'AI 초안' | '미처리'

export interface EcoQuestion {
  id: string
  no: string
  cat: string
  q: string
  status: EcoStatus
  files: number
  filesSize: string
  owner: string
}

export const ecoQuestions: EcoQuestion[] = [
  { id: 'q1', no: 'ENV 1.1', cat: '환경 · 정책', q: '환경 이슈에 대한 공식 정책 문서를 보유하고 있습니까? 해당 문서를 제출하십시오.', status: '답변완료', files: 2, filesSize: '3.2MB', owner: '이수진' },
  { id: 'q2', no: 'ENV 2.4', cat: '환경 · 실행', q: '에너지 소비 및 온실가스 배출량을 정기적으로 모니터링하는 체계가 있습니까?', status: '답변완료', files: 3, filesSize: '8.1MB', owner: '박지원' },
  { id: 'q3', no: 'LAB 1.2', cat: '노동·인권 · 정책', q: '아동노동 및 강제노동 금지에 관한 정책 문서를 제출하십시오. 경영진 승인 근거를 포함해야 합니다.', status: 'AI 초안', files: 1, filesSize: '890KB', owner: '-' },
  { id: 'q4', no: 'LAB 3.1', cat: '노동·인권 · 실행', q: '임직원 안전보건 교육을 실시하고 그 기록을 관리하고 있습니까?', status: '미처리', files: 0, filesSize: '-', owner: '-' },
  { id: 'q5', no: 'ETH 1.1', cat: '윤리 · 정책', q: '부패 방지에 관한 공식 정책이 있으며 전 임직원에게 배포되었습니까?', status: '답변완료', files: 2, filesSize: '1.7MB', owner: '김대성' },
  { id: 'q6', no: 'ETH 2.2', cat: '윤리 · 실행', q: '내부 신고 채널의 운영 현황과 처리 결과를 설명하십시오.', status: 'AI 초안', files: 1, filesSize: '640KB', owner: '-' },
  { id: 'q7', no: 'SUP 1.3', cat: '지속가능한 조달', q: '공급업체 행동강령을 배포하고 서명을 확보하고 있습니까?', status: '미처리', files: 0, filesSize: '-', owner: '-' },
  { id: 'q8', no: 'SUP 2.1', cat: '지속가능한 조달', q: '주요 공급업체에 대한 ESG 실사를 수행하고 결과를 관리합니까?', status: 'AI 초안', files: 2, filesSize: '4.4MB', owner: '-' },
]

/** 문항 상태 배지 색 (시안 QST) */
export const ecoStatusTone: Record<EcoStatus, { bg: string; fg: string; bar: string; color: string }> = {
  답변완료: { bg: '#f0fdf4', fg: '#15803d', bar: '#16a34a', color: '#16a34a' },
  'AI 초안': { bg: '#fffbeb', fg: '#b45309', bar: '#f59e0b', color: '#f59e0b' },
  미처리: { bg: '#e2e8f0', fg: '#334155', bar: '#94a3b8', color: '#94a3b8' },
}

/** 업무 상태 배지 색 (시안 ST) */
export const taskStatusTone: Record<TaskStatus, { bg: string; fg: string; dot: string; bar: string }> = {
  요청됨: { bg: '#e2e8f0', fg: '#334155', dot: '#94a3b8', bar: '#94a3b8' },
  진행중: { bg: '#eff6ff', fg: '#1d4ed8', dot: '#2563eb', bar: '#2563eb' },
  검토대기: { bg: '#fffbeb', fg: '#b45309', dot: '#f59e0b', bar: '#f59e0b' },
  완료: { bg: '#f0fdf4', fg: '#15803d', dot: '#16a34a', bar: '#16a34a' },
  반려: { bg: '#fef2f2', fg: '#b91c1c', dot: '#ef4444', bar: '#ef4444' },
}
