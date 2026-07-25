/**
 * 목업 도메인 타입.
 * 스토리보드의 데이터 출력 패널(p3·p24·p25)에 명시된 필드명을 그대로 따른다.
 * 백엔드가 붙을 때 이 타입이 API 계약의 출발점이 된다.
 */

/* ── 계층 ─────────────────────────────────────────── */

export interface Organization {
  id: string
  name: string
  slug: string
  type: string
  industry: string
  bizRegNo?: string
  country: string
  timezone: string
  language: string
  ownerId: string
  region: string
  policy: { private: boolean; auditEnabled: boolean }
  logoText: string
}

export interface Workspace {
  id: string
  organizationId: string
  name: string
  slug: string
  visibility: 'private' | 'public'
  purpose: string
  managerId: string
  memberIds: string[]
  defaultRole: MemberRole
  guestPolicy: string
  createdAt: string
}

export interface Project {
  id: string
  workspaceId: string
  name: string
  code: string
  type: string
  status: '진행중' | '보류' | '완료'
  ownerId: string
  memberIds: string[]
  visibility: '공개' | '비공개'
  defaultStoreIds: string[]
  counts: { members: number; channels: number; stores: number; files: number }
  createdAt: string
}

/* ── 사용자 ───────────────────────────────────────── */

export type MemberRole = '마스터' | '관리자' | '편집자' | '뷰어' | '파트너'
export type UserStatus = '활성' | '초대 대기' | '비활성'

export interface User {
  id: string
  name: string
  email: string
  title: string
  role: MemberRole
  status: UserStatus
  department?: string
  initials: string
  color: string
  online?: boolean
  external?: boolean
  externalTag?: string
}

/* ── 문서 ─────────────────────────────────────────── */

export type FileFormat = 'pdf' | 'docx' | 'xlsx' | 'csv' | 'md' | 'hwp' | 'image'
export type FileProcessState = 'OCR 완료' | 'OCR 대기' | 'RAG 준비' | '색인 완료' | '메타 추출' | '처리 실패'

export interface DocStore {
  id: string
  projectId: string
  name: string
  fileCount: number
  description?: string
}

export interface DocFolder {
  id: string
  storeId: string
  name: string
  fileCount: number
  access: '전체 공개' | '팀만' | '비공개'
}

export interface DocFile {
  id: string
  folderId: string
  name: string
  format: FileFormat
  sizeMb: number
  pages?: number
  uploaderId: string
  uploadedAt: string
  version: number
  states: FileProcessState[]
  summary: string
  progress: { ocr: number; metadata: number; chunking: number; ragIndex: number }
  metadata: { key: string; value: string }[]
  relations: { label: string; sub: string }[]
  lastQueriedAt?: string
  thumbnailPage?: number
}

/* ── 협업 ─────────────────────────────────────────── */

export type ChatRoomKind = '팀' | '외부 협업' | 'DM'

export interface ChatRoom {
  id: string
  projectId: string
  name: string
  kind: ChatRoomKind
  group: string
  memberIds: string[]
  unread: number
  pinned?: boolean
  lastMessage: string
  lastAt: string
  description?: string
  createdAt: string
  createdBy: string
  messageCount: number
}

export interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  body: string
  at: string
  attachments?: { name: string; sizeMb: number; format: FileFormat }[]
  mine?: boolean
}

/* ── 업무(Task) ───────────────────────────────────── */

export type TaskStatus = '요청됨' | '수락됨' | '진행중' | '검토' | '완료' | '보류'
export type TaskPriority = '긴급' | '보통' | '낮음'

export interface Task {
  id: string
  code: string
  projectId: string
  roomId?: string
  title: string
  description: string
  requesterId: string
  assigneeId: string
  reviewerId?: string
  status: TaskStatus
  priority: TaskPriority
  dueAt: string
  createdAt: string
  attachments: { name: string; sizeMb: number; format: FileFormat; state?: string }[]
  comments: { id: string; authorId: string; body: string; at: string }[]
  timeline: { status: TaskStatus; at: string; byId: string; done: boolean }[]
}

/* ── EcoVadis ─────────────────────────────────────── */

export type EcoAnswerState = '답변완료' | 'AI 초안' | '미처리' | '검색중' | '증빙없음' | 'OCR 확인'

export interface EcoQuestion {
  id: string
  code: string
  category: string
  theme: string
  title: string
  ocrText: string
  ocrConfidence: number
  ocrVerified: boolean
  state: EcoAnswerState
  answer?: string
  evidences: EcoEvidence[]
  assigneeId?: string
  requestedTaskId?: string
}

export interface EcoEvidence {
  fileId: string
  fileName: string
  page: number
  confidence: number
  excerpt: string
  attached: boolean
  manual?: boolean
}

/* ── 알림·활동 ────────────────────────────────────── */

export type NotificationKind = '메시지' | '경고' | '멘션' | '리포트' | '워크플로'

export interface AppNotification {
  id: string
  kind: NotificationKind
  title: string
  body: string
  at: string
  read: boolean
  mention?: boolean
}

export interface ActivityLog {
  id: string
  actorId: string
  action: string
  target: string
  at: string
  icon: string
}

/* ── AI ───────────────────────────────────────────── */

export interface AiMessage {
  id: string
  role: 'user' | 'assistant'
  body: string
  at: string
  sources?: { fileName: string; page: number }[]
  pending?: boolean
}
