import { create } from 'zustand'
import {
  filesByFolder as seedFiles,
  folders as seedFolders,
  members as seedMembers,
  msgs as seedMsgs,
  reqs as seedReqs,
  tasks as seedTasks,
  type DocFile,
  type Folder,
  type Member,
  type Msg,
  type ReqRow,
  type Task,
} from '@/mocks/data'

/**
 * 목업 데이터 상태 — DB만 없을 뿐, 화면에서 하는 일은 실제로 반영된다.
 * 폴더 추가·파일 업로드/생성/삭제·멤버 초대·업무 요청/처리·메시지 전송·자료요청이 모두 여기에 쌓인다.
 * (새로고침하면 초기값으로 돌아가는 인메모리 저장소)
 */

let seq = 1000
const nextId = (prefix: string) => `${prefix}${++seq}`
const today = () => {
  const d = new Date()
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export interface Toast {
  id: string
  text: string
}

interface DataState {
  folders: Folder[]
  filesByFolder: Record<string, DocFile[]>
  members: Member[]
  tasks: Task[]
  msgs: Record<string, Msg[]>
  reqs: ReqRow[]
  toasts: Toast[]

  /** 문서 저장소 */
  addFolder: (name: string, parentId?: string) => Folder
  addFile: (folderId: string, file: Partial<DocFile> & { name: string }) => DocFile
  deleteFile: (id: string) => void
  renameFile: (id: string, name: string) => void
  setFileStatus: (id: string, status: DocFile['status']) => void

  /** 조직 · 멤버 */
  addMember: (m: { name?: string; email: string; role?: string; perm?: string }) => Member
  setMemberPerm: (id: string, perm: string) => void
  removeMembers: (ids: string[]) => void

  /** 업무 */
  addTask: (t: { title: string; to: string; due?: string; room?: string }) => Task
  setTaskStatus: (id: string, status: Task['status']) => void

  /** 채팅 */
  addMsg: (m: { room: string; text: string; who?: string; taskId?: string }) => Msg

  /** 자료요청 */
  addReq: (r: { title: string; qno: string; to: string; due?: string; reason?: string }) => ReqRow
  addReqFile: (no: string, file: { name: string; who: string; size: string }) => void

  toast: (text: string) => void
  dismissToast: (id: string) => void
}

export const useDataStore = create<DataState>((set, get) => ({
  folders: [...seedFolders],
  filesByFolder: Object.fromEntries(Object.entries(seedFiles).map(([k, v]) => [k, [...v]])),
  members: [...seedMembers],
  tasks: [...seedTasks],
  msgs: Object.fromEntries(Object.entries(seedMsgs).map(([k, v]) => [k, [...v]])),
  reqs: [...seedReqs],
  toasts: [],

  addFolder: (name, parentId) => {
    const folder: Folder = { id: nextId('f'), name, depth: parentId ? 1 : 0, count: 0 }
    set((s) => ({
      folders: [...s.folders, folder],
      filesByFolder: { ...s.filesByFolder, [folder.id]: [] },
    }))
    get().toast(`폴더 “${name}”을(를) 만들었습니다`)
    return folder
  },

  addFile: (folderId, file) => {
    const ext = (file.ext ?? file.name.split('.').pop() ?? 'PDF').toUpperCase()
    const doc: DocFile = {
      id: nextId('u'),
      name: file.name,
      ext,
      size: file.size ?? '1.2MB',
      pages: file.pages ?? 12,
      owner: file.owner ?? '홍길동',
      date: file.date ?? today(),
      status: file.status ?? 'OCR 처리중',
      summary: file.summary ?? '업로드 직후 · OCR·RAG 색인 대기중',
      tags: file.tags ?? ['신규'],
    }
    set((s) => {
      const list = s.filesByFolder[folderId] ?? []
      return {
        filesByFolder: { ...s.filesByFolder, [folderId]: [doc, ...list] },
        folders: s.folders.map((f) => (f.id === folderId ? { ...f, count: f.count + 1 } : f)),
      }
    })
    // OCR → 색인 완료까지 시뮬레이션 (AI 처리 연출)
    window.setTimeout(() => get().setFileStatus(doc.id, 'RAG 색인 완료'), 4000)
    get().toast(`“${doc.name}” 업로드 · OCR 처리를 시작했습니다`)
    return doc
  },

  deleteFile: (id) =>
    set((s) => {
      const next: Record<string, DocFile[]> = {}
      let owner: string | null = null
      for (const [fid, list] of Object.entries(s.filesByFolder)) {
        if (list.some((f) => f.id === id)) owner = fid
        next[fid] = list.filter((f) => f.id !== id)
      }
      return {
        filesByFolder: next,
        folders: s.folders.map((f) => (f.id === owner ? { ...f, count: Math.max(0, f.count - 1) } : f)),
      }
    }),

  renameFile: (id, name) =>
    set((s) => ({
      filesByFolder: Object.fromEntries(
        Object.entries(s.filesByFolder).map(([fid, list]) => [fid, list.map((f) => (f.id === id ? { ...f, name } : f))]),
      ),
    })),

  setFileStatus: (id, status) =>
    set((s) => ({
      filesByFolder: Object.fromEntries(
        Object.entries(s.filesByFolder).map(([fid, list]) => [
          fid,
          list.map((f) => (f.id === id ? { ...f, status, summary: status === 'RAG 색인 완료' ? '색인 완료 · 추론 검색 가능' : f.summary } : f)),
        ]),
      ),
    })),

  addMember: ({ name, email, role, perm }) => {
    const m: Member = {
      id: nextId('m'),
      name: name || email.split('@')[0],
      role: role || '신규 멤버',
      dept: role || '미지정',
      email,
      perm: perm || '편집 가능',
      on: false,
      state: '초대 대기',
      last: '-',
    }
    set((s) => ({ members: [...s.members, m] }))
    get().toast(`${email} 로 초대를 보냈습니다`)
    return m
  },

  setMemberPerm: (id, perm) => set((s) => ({ members: s.members.map((m) => (m.id === id ? { ...m, perm } : m)) })),

  removeMembers: (ids) => {
    set((s) => ({ members: s.members.filter((m) => !ids.includes(m.id)) }))
    get().toast(`${ids.length}명을 내보냈습니다`)
  },

  addTask: ({ title, to, due, room }) => {
    const t: Task = {
      id: nextId('t'),
      no: String(140 + Math.floor(Math.random() * 60)),
      title,
      from: '나',
      to,
      due: due ?? today(),
      status: '요청됨',
      room: room ?? 'ESG 전략 TF',
      files: 0,
    }
    set((s) => ({ tasks: [t, ...s.tasks] }))
    get().toast(`${to}님에게 업무를 요청했습니다`)
    return t
  },

  setTaskStatus: (id, status) => {
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) }))
    get().toast(`업무 상태를 “${status}”(으)로 변경했습니다`)
  },

  addMsg: ({ room, text, who, taskId }) => {
    const now = new Date()
    const m: Msg = {
      who: who ?? '나',
      mine: !who,
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      text,
      task: taskId,
    }
    set((s) => ({ msgs: { ...s.msgs, [room]: [...(s.msgs[room] ?? []), m] } }))
    return m
  },

  addReq: ({ title, qno, to, due, reason }) => {
    const r: ReqRow = {
      no: `REQ-${150 + Math.floor(Math.random() * 40)}`,
      title,
      qno,
      to,
      due: due ?? today(),
      status: '요청됨',
      overdue: false,
      reason: reason ?? '평가 근거 문서가 필요합니다.',
      files: [],
      history: [{ who: '나', time: `${today()} ${new Date().getHours()}:00`, text: '자료 요청을 생성했습니다.', dot: '#1750d8' }],
    }
    set((s) => ({ reqs: [r, ...s.reqs] }))
    get().toast(`${to}님에게 자료를 요청했습니다`)
    return r
  },

  addReqFile: (no, file) =>
    set((s) => ({
      reqs: s.reqs.map((r) =>
        r.no === no
          ? {
              ...r,
              status: '제출됨',
              files: [...r.files, { ...file, time: `${today()} ${new Date().getHours()}:00` }],
              history: [...r.history, { who: file.who, time: `${today()}`, text: '자료를 제출했습니다.', dot: '#f59e0b' }],
            }
          : r,
      ),
    })),

  toast: (text) => {
    const id = nextId('toast')
    set((s) => ({ toasts: [...s.toasts, { id, text }] }))
    window.setTimeout(() => get().dismissToast(id), 2600)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
