import { useState } from 'react'
import { Icon } from '@/components/common/icon'
import { BtnDanger, BtnGhost, BtnPrimary, Field, Modal, Sheet, inputCls } from './Modal'
import { SettingsModal } from './SettingsModal'
import { ViewerModal } from './ViewerModal'
import { ctx, folders, members, tasks } from '@/mocks/data'
import { useLayer } from '@/stores/layer-store'

/**
 * 모든 레이어(모달·시트)를 한 곳에서 렌더한다.
 * 화면 운영 원칙: 페이지를 늘리지 않고 이 레이어들이 셸 위에 겹쳐 뜬다.
 */
export function LayerHost() {
  return (
    <>
      <FolderCreate />
      <FileUpload />
      <FileCreate />
      <FileDelete />
      <WsCreate />
      <ProjCreate />
      <MemberInvite />
      <PlanModal />
      <ChatInvite />
      <ChatInfo />
      <ChatLeave />
      <TaskPreview />
      <EcoExport />
      <TaskRequestSheet />
      <AiChatSheet />
      <SearchModal />
      <SettingsModal />
      <ViewerModal />
    </>
  )
}

/* ── 문서 ─────────────────────────────────────────── */

function FolderCreate() {
  const { isOpen, close } = useLayer('folder-create')
  const [access, setAccess] = useState('팀 전체')
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="폴더 추가"
      desc="문서 저장소 안에 새 폴더를 만듭니다"
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>취소</BtnGhost><BtnPrimary onClick={close}>만들기</BtnPrimary></>}
    >
      <Field label="폴더 이름">
        <input className={inputCls} placeholder="예: 2026 제출본" autoFocus />
      </Field>
      <Field label="상위 폴더">
        <select className={inputCls}>
          <option>최상위</option>
          {folders.map((f) => (
            <option key={f.id}>{f.name}</option>
          ))}
        </select>
      </Field>
      <Field label="접근 권한" hint="비공개는 나와 관리자만 볼 수 있습니다">
        <div className="flex gap-1.5">
          {['전체 공개', '팀 전체', '비공개'].map((a) => {
            const on = access === a
            return (
              <button
                key={a}
                onClick={() => setAccess(a)}
                className="flex-1 rounded-md border py-2 text-sm2 font-bold"
                style={{
                  background: on ? '#1750d8' : '#fff',
                  borderColor: on ? '#1750d8' : '#cbd5e1',
                  color: on ? '#fff' : '#334155',
                }}
              >
                {a}
              </button>
            )
          })}
        </div>
      </Field>
    </Modal>
  )
}

function FileUpload() {
  const { isOpen, close } = useLayer('file-upload')
  const [indexing, setIndexing] = useState(true)
  const [ocrLang, setOcrLang] = useState('한국어 + 영어')
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="파일 업로드"
      desc="업로드 후 OCR·RAG 색인이 자동으로 진행됩니다"
      width={560}
      footer={<><span className="text-xs2 text-ink-400">PDF · DOCX · XLSX · 이미지 · 최대 200MB</span><div className="flex-1" /><BtnGhost onClick={close}>취소</BtnGhost><BtnPrimary onClick={close}>업로드</BtnPrimary></>}
    >
      <div className="mb-4 rounded-lg border border-dashed border-ink-300 bg-ink-50 px-4 py-10 text-center">
        <Icon name="cloud_upload" size={34} className="text-ink-400" />
        <div className="mt-2 text-label font-bold">파일을 끌어다 놓거나 클릭해서 선택</div>
        <div className="mt-1 text-sm2 text-ink-400">여러 개를 한 번에 올릴 수 있습니다</div>
      </div>
      <Field label="저장 위치">
        <select className={inputCls}>
          {folders.map((f) => (
            <option key={f.id}>{f.name}</option>
          ))}
        </select>
      </Field>
      <Field label="OCR 기본 언어">
        <select className={inputCls} value={ocrLang} onChange={(e) => setOcrLang(e.target.value)}>
          <option>한국어 + 영어</option>
          <option>한국어</option>
          <option>English</option>
        </select>
      </Field>
      <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-ink-200 bg-ink-50 px-3.5 py-3">
        <input type="checkbox" checked={indexing} onChange={(e) => setIndexing(e.target.checked)} className="size-4 accent-brand" />
        <span className="min-w-0 flex-1">
          <span className="block text-label font-bold">AI 인덱싱 사용</span>
          <span className="mt-0.5 block text-xs2 text-ink-500">업로드 후 챗봇 추론 검색과 증빙 찾기에 사용됩니다</span>
        </span>
      </label>
    </Modal>
  )
}

function FileCreate() {
  const { isOpen, close } = useLayer('file-create')
  const [type, setType] = useState('doc')
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="새 파일 만들기"
      desc="문서를 직접 작성합니다"
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>취소</BtnGhost><BtnPrimary onClick={close}>만들기</BtnPrimary></>}
    >
      <Field label="파일 이름">
        <input className={inputCls} placeholder="예: 2026 지속가능경영 대응 문서" autoFocus />
      </Field>
      <Field label="파일 유형">
        <div className="flex gap-1.5">
          {[
            { id: 'doc', label: 'DOC', icon: 'description' },
            { id: 'hwp', label: 'HWP', icon: 'article' },
            { id: 'md', label: 'MD', icon: 'code' },
          ].map((t) => {
            const on = type === t.id
            return (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className="flex flex-1 flex-col items-center gap-1 rounded-lg border py-3 text-sm2 font-bold"
                style={{
                  background: on ? '#eff6ff' : '#fff',
                  borderColor: on ? '#bfdbfe' : '#cbd5e1',
                  color: on ? '#1345bd' : '#334155',
                }}
              >
                <Icon name={t.icon} size={20} />
                {t.label}
              </button>
            )
          })}
        </div>
      </Field>
      <Field label="저장 위치">
        <select className={inputCls}>
          {folders.map((f) => (
            <option key={f.id}>{f.name}</option>
          ))}
        </select>
      </Field>
    </Modal>
  )
}

function FileDelete() {
  const { isOpen, close } = useLayer('file-delete')
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="문서를 삭제할까요?"
      width={440}
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>취소</BtnGhost><BtnDanger onClick={close}>삭제</BtnDanger></>}
    >
      <div className="rounded-lg border border-bad-border bg-bad-soft px-3.5 py-3">
        <div className="flex items-center gap-1.5 text-label font-bold text-bad-dark">
          <Icon name="warning" size={17} />
          이 작업은 되돌릴 수 없습니다
        </div>
        <div className="mt-1.5 text-sm2 leading-[1.7] text-ink-600">
          RAG 색인에서도 함께 제거되며, 이 문서를 근거로 사용한 에코바디스 답변 3건의 증빙 연결이 끊깁니다.
        </div>
      </div>
    </Modal>
  )
}

/* ── 조직 · 멤버 ──────────────────────────────────── */

function WsCreate() {
  const { isOpen, close } = useLayer('ws-create')
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="조직&사업부 생성"
      desc={`${ctx.org} 아래에 새 조직&사업부를 만듭니다`}
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>취소</BtnGhost><BtnPrimary onClick={close}>생성</BtnPrimary></>}
    >
      <Field label="이름">
        <input className={inputCls} placeholder="예: 품질보증팀" autoFocus />
      </Field>
      <Field label="상위 사업부">
        <select className={inputCls}>
          <option>{ctx.biz}</option>
          <option>경영지원본부</option>
        </select>
      </Field>
      <Field label="설명" hint="선택 사항">
        <textarea className={`${inputCls} resize-none`} rows={3} placeholder="어떤 일을 하는 조직인지 적어주세요" />
      </Field>
    </Modal>
  )
}

function ProjCreate() {
  const { isOpen, close } = useLayer('proj-create')
  const [vis, setVis] = useState('공개')
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="프로젝트 생성"
      desc={`${ctx.ws} 안에 새 프로젝트를 만듭니다`}
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>취소</BtnGhost><BtnPrimary onClick={close}>생성</BtnPrimary></>}
    >
      <Field label="프로젝트 이름">
        <input className={inputCls} placeholder="예: 지속가능경영보고서 2027" autoFocus />
      </Field>
      <Field label="공개 범위" hint="공개면 조직&사업부 전체가 볼 수 있습니다">
        <div className="flex gap-1.5">
          {['공개', '비공개'].map((v) => {
            const on = vis === v
            return (
              <button
                key={v}
                onClick={() => setVis(v)}
                className="flex-1 rounded-md border py-2 text-sm2 font-bold"
                style={{
                  background: on ? '#1750d8' : '#fff',
                  borderColor: on ? '#1750d8' : '#cbd5e1',
                  color: on ? '#fff' : '#334155',
                }}
              >
                {v}
              </button>
            )
          })}
        </div>
      </Field>
      <Field label="기본 문서 저장소">
        <input className={inputCls} defaultValue="ESG 정책 문서, 에코바디스 증빙" />
      </Field>
    </Modal>
  )
}

function MemberInvite() {
  const { isOpen, close } = useLayer('member-invite')
  const [rows, setRows] = useState([{ email: '', role: '편집 가능' }])
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="멤버 초대"
      desc="이메일로 초대장을 보냅니다"
      width={560}
      footer={<><span className="text-xs2 text-ink-400">외부 이메일은 기본 30일 후 만료</span><div className="flex-1" /><BtnGhost onClick={close}>취소</BtnGhost><BtnPrimary onClick={close}>초대 보내기</BtnPrimary></>}
    >
      {rows.map((r, i) => (
        <div key={i} className="mb-2 flex gap-1.5">
          <input
            className={inputCls}
            placeholder="name@company.com"
            value={r.email}
            onChange={(e) => setRows((rs) => rs.map((x, xi) => (xi === i ? { ...x, email: e.target.value } : x)))}
          />
          <select
            className="w-[130px] flex-none rounded-md border border-ink-300 px-2 py-2 text-label outline-none"
            value={r.role}
            onChange={(e) => setRows((rs) => rs.map((x, xi) => (xi === i ? { ...x, role: e.target.value } : x)))}
          >
            <option>편집 가능</option>
            <option>댓글 가능</option>
            <option>보기 전용</option>
          </select>
          <button
            onClick={() => setRows((rs) => rs.filter((_, xi) => xi !== i))}
            className="size-[38px] flex-none rounded-md border border-ink-300 p-0 text-ink-400 hover:text-bad-dark"
          >
            <Icon name="close" size={17} />
          </button>
        </div>
      ))}
      <button
        onClick={() => setRows((rs) => [...rs, { email: '', role: '편집 가능' }])}
        className="w-full rounded-md border border-dashed border-ink-300 py-2 text-sm2 font-bold text-ink-500 hover:border-brand-link hover:text-brand-link"
      >
        + 초대 추가
      </button>
    </Modal>
  )
}

function PlanModal() {
  const { isOpen, close } = useLayer('plan')
  const plans = [
    { name: 'STARTER', price: '무료', desc: '문서 100건 · 색인 1GB', on: false },
    { name: 'BUSINESS', price: '₩49,000/월', desc: '문서 5,000건 · 색인 20GB', on: false },
    { name: 'ENTERPRISE', price: '문의', desc: '무제한 · 전용 색인 · SSO', on: true },
  ]
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="요금제 · 결제수단"
      desc={`현재 ${ctx.orgPlan} · 크레딧 ${ctx.credit}`}
      width={620}
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>닫기</BtnGhost><BtnPrimary onClick={close}>크레딧 충전</BtnPrimary></>}
    >
      <div className="grid grid-cols-3 gap-2">
        {plans.map((p) => (
          <div
            key={p.name}
            className="rounded-lg border p-3.5"
            style={{
              borderColor: p.on ? '#1750d8' : '#e2e8f0',
              background: p.on ? '#eff6ff' : '#fff',
            }}
          >
            <div className="text-tiny font-extrabold tracking-[.06em] text-ink-400">{p.name}</div>
            <div className="mt-1.5 text-lg2 font-extrabold">{p.price}</div>
            <div className="mt-1.5 text-xs2 leading-[1.7] text-ink-500">{p.desc}</div>
            {p.on && (
              <div className="mt-2.5 rounded-full bg-brand px-2 py-0.5 text-center text-mini font-extrabold text-white">
                현재 플랜
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  )
}

/* ── 협업 ─────────────────────────────────────────── */

function ChatInvite() {
  const { isOpen, close } = useLayer('chat-invite')
  const [tab, setTab] = useState<'email' | 'link'>('email')
  const [expire, setExpire] = useState('30일 후 만료')
  const [perm, setPerm] = useState('댓글 가능')
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="외부 협업자 초대"
      desc="조직 외부 인원을 이 대화방에 초대합니다"
      width={540}
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>취소</BtnGhost><BtnPrimary onClick={close}>{tab === 'email' ? '초대 보내기' : '링크 복사'}</BtnPrimary></>}
    >
      <div className="mb-4 flex gap-1 border-b border-ink-200">
        {([['email', '이메일 초대'], ['link', '초대 링크']] as const).map(([id, label]) => {
          const on = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="border-b-2 px-3 py-2 text-label font-bold"
              style={{ borderBottomColor: on ? '#1750d8' : 'transparent', color: on ? '#0f172a' : '#94a3b8' }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {tab === 'email' ? (
        <Field label="이메일">
          <input className={inputCls} placeholder="partner@company.com" autoFocus />
        </Field>
      ) : (
        <Field label="초대 링크">
          <div className="flex gap-1.5">
            <input className={inputCls} readOnly value="https://amber.evolvailab.com/invite/8f2a…" />
            <BtnGhost>복사</BtnGhost>
          </div>
        </Field>
      )}

      <Field label="링크 만료">
        <div className="flex gap-1.5">
          {['7일 후 만료', '30일 후 만료', '만료 없음'].map((e) => {
            const on = expire === e
            return (
              <button
                key={e}
                onClick={() => setExpire(e)}
                className="flex-1 rounded-md border py-2 text-sm2 font-bold"
                style={{
                  background: on ? '#eff6ff' : '#fff',
                  borderColor: on ? '#bfdbfe' : '#cbd5e1',
                  color: on ? '#1345bd' : '#334155',
                }}
              >
                {e}
              </button>
            )
          })}
        </div>
      </Field>
      <Field label="기본 권한">
        <div className="flex gap-1.5">
          {['편집 가능', '보기 전용', '댓글 가능'].map((p) => {
            const on = perm === p
            return (
              <button
                key={p}
                onClick={() => setPerm(p)}
                className="flex-1 rounded-md border py-2 text-sm2 font-bold"
                style={{
                  background: on ? '#eff6ff' : '#fff',
                  borderColor: on ? '#bfdbfe' : '#cbd5e1',
                  color: on ? '#1345bd' : '#334155',
                }}
              >
                {p}
              </button>
            )
          })}
        </div>
      </Field>
    </Modal>
  )
}

function ChatInfo() {
  const { isOpen, close } = useLayer('chat-info')
  const [noti, setNoti] = useState({ all: true, mention: false, pin: false })
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="대화방 정보"
      desc="ESG 전략 TF · 그룹 5명"
      width={520}
      footer={<><BtnGhost onClick={close}>대화방 나가기</BtnGhost><div className="flex-1" /><BtnPrimary onClick={close}>저장</BtnPrimary></>}
    >
      <div className="mb-4 grid grid-cols-2 gap-2">
        {[
          { label: '생성일', value: '2026.04.11' },
          { label: '생성자', value: '이수진' },
          { label: '유형', value: '팀 + 외부 협업' },
          { label: '메시지 수', value: '총 142건' },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-ink-200 bg-ink-50 px-3 py-2.5">
            <div className="text-tiny font-bold text-ink-400">{m.label}</div>
            <div className="mt-1 text-label font-bold">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-2 text-sm2 font-extrabold">참여자</div>
      <div className="mb-4 flex flex-col gap-1">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-2 rounded-md px-1.5 py-1.5">
            <span className="flex size-6 flex-none items-center justify-center rounded-full border border-ink-200 bg-ink-100 text-tiny font-extrabold text-ink-600">
              {m.name[0]}
            </span>
            <span className="min-w-0 flex-1 text-label font-semibold">{m.name}</span>
            <span className="text-xs2 text-ink-400">{m.perm}</span>
          </div>
        ))}
      </div>

      <div className="mb-2 text-sm2 font-extrabold">알림 설정</div>
      {([['all', '모든 메시지 알림'], ['mention', '멘션만 알림'], ['pin', '상단 고정']] as const).map(([id, label]) => (
        <label key={id} className="mb-1.5 flex cursor-pointer items-center gap-2.5 rounded-md border border-ink-200 px-3 py-2.5">
          <input
            type="checkbox"
            checked={noti[id]}
            onChange={(e) => setNoti((n) => ({ ...n, [id]: e.target.checked }))}
            className="size-4 accent-brand"
          />
          <span className="text-label">{label}</span>
        </label>
      ))}
    </Modal>
  )
}

function ChatLeave() {
  const { isOpen, close } = useLayer('chat-leave')
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="대화방을 정말 나가시겠습니까?"
      width={440}
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>아니오</BtnGhost><BtnDanger onClick={close}>예, 나가기</BtnDanger></>}
    >
      <div className="rounded-lg border border-bad-border bg-bad-soft px-3.5 py-3">
        <div className="flex items-center gap-1.5 text-label font-bold text-bad-dark">
          <Icon name="warning" size={17} />이 작업은 되돌릴 수 없습니다
        </div>
        <div className="mt-1.5 text-sm2 leading-[1.7] text-ink-600">
          ESG 전략 TF 대화방을 나가면 이전 대화 내용에 더 이상 접근할 수 없습니다. 연결된 업무는 유지됩니다.
        </div>
      </div>
    </Modal>
  )
}

function TaskPreview() {
  const { isOpen, close, payload } = useLayer('task-preview')
  const [tab, setTab] = useState<'preview' | 'version' | 'activity'>('preview')
  const task = tasks.find((t) => t.id === payload?.id) ?? tasks[0]
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title={task.title}
      desc={`TASK-${task.no} · ${task.from} → ${task.to} · 기한 ${task.due}`}
      width={720}
      footer={<><BtnGhost onClick={close}>다운로드</BtnGhost><div className="flex-1" /><BtnGhost onClick={close}>수정 요청</BtnGhost><BtnPrimary onClick={close}>완료 처리</BtnPrimary></>}
    >
      <div className="mb-4 flex gap-1 border-b border-ink-200">
        {([['preview', '미리보기'], ['version', '버전'], ['activity', '활동']] as const).map(([id, label]) => {
          const on = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="border-b-2 px-3 py-2 text-label font-bold"
              style={{ borderBottomColor: on ? '#1750d8' : 'transparent', color: on ? '#0f172a' : '#94a3b8' }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {tab === 'preview' && (
        <div className="grid h-[280px] place-items-center rounded-lg border border-ink-200 bg-ink-50">
          <div className="text-center">
            <Icon name="description" size={38} className="text-ink-300" />
            <div className="mt-2 text-sm2 text-ink-400">첨부 {task.files}건 · 미리보기를 불러오는 중…</div>
          </div>
        </div>
      )}
      {tab === 'version' && (
        <div className="flex flex-col gap-2">
          {['v3 · 현재', 'v2 · 보관', 'v1 · 최초'].map((v) => (
            <div key={v} className="flex items-center gap-3 rounded-lg border border-ink-200 px-3.5 py-3">
              <span className="rounded bg-ink-200 px-2 py-0.5 font-mono text-tiny font-extrabold text-ink-600">
                {v.split(' · ')[0]}
              </span>
              <span className="flex-1 text-label font-semibold">{v.split(' · ')[1]}</span>
              <BtnGhost>복원</BtnGhost>
            </div>
          ))}
        </div>
      )}
      {tab === 'activity' && (
        <div className="flex flex-col gap-3">
          {['요청 생성', '담당자 확인', '자료 회신'].map((a, i) => (
            <div key={a} className="flex gap-2.5">
              <span className="mt-1.5 size-2 flex-none rounded-full bg-brand-link" />
              <div>
                <div className="text-label font-bold">{a}</div>
                <div className="mt-0.5 text-xs2 text-ink-400">07.2{i + 2} · {members[i]?.name ?? '시스템'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

function EcoExport() {
  const { isOpen, close } = useLayer('eco-export')
  const [scope, setScope] = useState('답변완료만')
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="답변서 내려받기"
      desc="전체 문항의 답변과 증빙을 1개 파일로 내보냅니다"
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>취소</BtnGhost><BtnPrimary onClick={close}>내려받기</BtnPrimary></>}
    >
      <Field label="포함 범위">
        <div className="flex gap-1.5">
          {['전체 문항', '답변완료만', 'AI 초안 포함'].map((s) => {
            const on = scope === s
            return (
              <button
                key={s}
                onClick={() => setScope(s)}
                className="flex-1 rounded-md border py-2 text-sm2 font-bold"
                style={{
                  background: on ? '#eff6ff' : '#fff',
                  borderColor: on ? '#bfdbfe' : '#cbd5e1',
                  color: on ? '#1345bd' : '#334155',
                }}
              >
                {s}
              </button>
            )
          })}
        </div>
      </Field>
      <Field label="파일 형식">
        <select className={inputCls}>
          <option>PDF (답변 + 증빙 병합)</option>
          <option>XLSX (답변표)</option>
          <option>ZIP (증빙 원본 포함)</option>
        </select>
      </Field>
      <div className="rounded-lg border border-ink-200 bg-ink-50 px-3.5 py-3 text-sm2 leading-[1.7] text-ink-500">
        답변완료 214문항 · 증빙 246건이 포함됩니다. 미처리 45문항은 빈칸으로 표기됩니다.
      </div>
    </Modal>
  )
}

/* ── 시트 ─────────────────────────────────────────── */

function TaskRequestSheet() {
  const { isOpen, close, payload } = useLayer('task-request')
  const [to, setTo] = useState((payload?.to as string) ?? 'm3')
  const [dueIdx, setDueIdx] = useState(1)
  return (
    <Sheet
      open={isOpen}
      onClose={close}
      title="업무 요청"
      desc="특정 담당자에게 업무 또는 파일을 요청합니다"
      width={400}
      footer={<><BtnGhost onClick={close}>취소</BtnGhost><div className="flex-1" /><BtnPrimary onClick={close}>요청 보내기</BtnPrimary></>}
    >
      <Field label="담당자 지정">
        <div className="flex flex-wrap gap-1.5">
          {members.map((m) => {
            const on = to === m.id
            return (
              <button
                key={m.id}
                onClick={() => setTo(m.id)}
                className="flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-sm2 font-bold"
                style={{
                  background: on ? '#1750d8' : '#fff',
                  borderColor: on ? '#1750d8' : '#cbd5e1',
                  color: on ? '#fff' : '#334155',
                }}
              >
                <span
                  className="flex size-5 items-center justify-center rounded-full text-mini font-extrabold"
                  style={{ background: on ? 'rgba(255,255,255,.24)' : '#f1f5f9', color: on ? '#fff' : '#475569' }}
                >
                  {m.name[0]}
                </span>
                {m.name}
              </button>
            )
          })}
        </div>
      </Field>
      <Field label="요청 제목">
        <input className={inputCls} placeholder="예: 2025 표준계약서 최신본 전달" />
      </Field>
      <Field label="요청 내용">
        <textarea className={`${inputCls} resize-none`} rows={4} placeholder="필요한 업무 내용, 파일 조건 등을 적어주세요" />
      </Field>
      <Field label="처리 기한">
        <div className="flex gap-1.5">
          {['오늘', '3일 내', '1주 내', '직접 입력'].map((d, i) => {
            const on = dueIdx === i
            return (
              <button
                key={d}
                onClick={() => setDueIdx(i)}
                className="flex-1 whitespace-nowrap rounded-md border py-2 text-xs2 font-bold"
                style={{
                  background: on ? '#1750d8' : '#fff',
                  borderColor: on ? '#1750d8' : '#cbd5e1',
                  color: on ? '#fff' : '#334155',
                }}
              >
                {d}
              </button>
            )
          })}
        </div>
      </Field>
      <Field label="참고 파일 첨부">
        <button className="w-full rounded-lg border border-dashed border-ink-300 py-6 text-sm2 font-bold text-ink-500 hover:border-brand-link hover:text-brand-link">
          파일을 끌어다 놓거나 <span className="underline">찾아보기</span>
        </button>
      </Field>
    </Sheet>
  )
}

function AiChatSheet() {
  const { isOpen, close } = useLayer('ai-chat')
  const [input, setInput] = useState('')
  const suggests = ['이번 주 내 업무 요약', '에코바디스 미처리 문항', '최근 색인된 문서', '해지 조항 어디 있어?']
  return (
    <Sheet open={isOpen} onClose={close} title="AI 검색" desc="문서·대화·업무를 문장으로 물어보세요" width={400}>
      <div className="mb-5 rounded-lg border border-ink-200 bg-ink-50 px-3.5 py-3 text-label leading-[1.75] text-ink-700">
        안녕하세요, {ctx.me.name}님. 무엇을 도와드릴까요? 프로젝트 전체 RAG 색인에서 근거를 찾아 파일명과 페이지를 함께
        알려드립니다.
      </div>
      <div className="mb-4 flex flex-col gap-1.5">
        {suggests.map((s) => (
          <button
            key={s}
            onClick={() => setInput(s)}
            className="rounded-full border border-ink-200 bg-white px-3.5 py-2 text-left text-label font-semibold hover:border-brand-border hover:bg-brand-soft"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="무엇이든 물어보세요"
          className={inputCls}
        />
        <BtnPrimary>전송</BtnPrimary>
      </div>
    </Sheet>
  )
}

function SearchModal() {
  const { isOpen, close } = useLayer('search')
  const [q, setQ] = useState('')
  const results = [
    { icon: 'description', label: '표준 공급계약서_v3.docx', sub: '계약·법무 · p.47 해지 조항' },
    { icon: 'forum', label: 'ESG 전략 TF', sub: '업무 요청: 안전보건 교육 이수 내역' },
    { icon: 'task_alt', label: 'TASK-142', sub: '안전보건 교육 이수 내역 2025년 원본 전달' },
    { icon: 'checklist', label: 'LAB 1.2', sub: '아동노동 및 강제노동 금지 정책 문서' },
  ]
  return (
    <Modal open={isOpen} onClose={close} title="추론 검색" desc="문서 · 대화 · 업무를 한 번에 찾습니다" width={600}>
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-ink-300 px-3 py-2.5">
        <Icon name="search" size={19} className="text-ink-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
          placeholder="문장으로 물어보세요 — 단어가 달라도 의미로 찾습니다"
          className="min-w-0 flex-1 border-none bg-transparent p-0 text-body outline-none"
        />
        <span className="flex-none rounded border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-tiny text-ink-400">⌘K</span>
      </div>
      <div className="mb-2 text-tiny font-extrabold tracking-[.06em] text-ink-400">추천 결과</div>
      <div className="flex flex-col gap-1">
        {results.map((r) => (
          <button
            key={r.label}
            onClick={close}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left hover:bg-ink-100"
          >
            <Icon name={r.icon} size={19} className="text-ink-400" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-label font-bold">{r.label}</span>
              <span className="block truncate text-xs2 text-ink-400">{r.sub}</span>
            </span>
            <Icon name="chevron_right" size={16} className="text-ink-300" />
          </button>
        ))}
      </div>
    </Modal>
  )
}
