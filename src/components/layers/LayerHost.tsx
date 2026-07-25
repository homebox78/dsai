import { useState } from 'react'
import { Icon } from '@/components/common/icon'
import { BtnDanger, BtnGhost, BtnPrimary, Field, Modal, Sheet, inputCls } from './Modal'
import { FormModal } from './FormModal'
import { SettingsModal } from './SettingsModal'
import { ViewerModal } from './ViewerModal'
import { ctx, findFile, folders, members, rooms, tasks, taskStatusTone } from '@/mocks/data'
import { useLayer } from '@/stores/layer-store'
import { useAppStore } from '@/stores/app-store'

/**
 * 모든 레이어(모달·시트)를 한 곳에서 렌더한다.
 * 화면 운영 원칙: 페이지를 늘리지 않고 이 레이어들이 셸 위에 겹쳐 뜬다.
 */
/** 시안 chipsPerm */
const PERM_CHIPS = ['편집 가능', '댓글 가능', '보기 전용']

export function LayerHost() {
  return (
    <>
      <FolderCreate />
      <FileUpload />
      <FileCreate />
      <FileDelete />
      <OrgCreate />
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
      <TaskAlertSheet />
      <TocEditSheet />
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
  const folder = useAppStore((s) => s.folder)
  const cur = folders.find((f) => f.id === folder) ?? folders[0]
  return (
    <FormModal
      open={isOpen}
      onClose={close}
      id="folder"
      title="폴더 추가"
      desc={`현재 위치: ${cur.name}`}
      width={440}
      cta="폴더 만들기"
      fields={[
        { label: '폴더 이름', type: 'text', required: true, placeholder: '예: 2026 제출본' },
        { label: '상위 폴더', type: 'select', options: folders.map((f) => f.name) },
        { label: '접근 권한', type: 'chips', options: ['전체 공개', '프로젝트 멤버', '비공개'] },
      ]}
    />
  )
}

function FileUpload() {
  const { isOpen, close } = useLayer('file-upload')
  const folder = useAppStore((s) => s.folder)
  const [dest, setDest] = useState(folder)
  const [indexing, setIndexing] = useState(true)
  const [tableMode, setTableMode] = useState(true)
  const [ocrLang, setOcrLang] = useState('한국어 + 영어')
  const [dupMode, setDupMode] = useState('새 버전으로 등록')
  const [access, setAccess] = useState('프로젝트 멤버 6명')
  const destName = folders.find((f) => f.id === dest)?.name ?? folders[0].name

  const chip = (label: string, on: boolean, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      className="whitespace-nowrap rounded-md border px-2.5 py-1.5 text-sm2"
      style={{
        background: on ? '#eff6ff' : '#fff',
        borderColor: on ? '#1750d8' : '#cbd5e1',
        color: on ? '#1345bd' : '#334155',
        fontWeight: on ? 700 : 500,
      }}
    >
      {label}
    </button>
  )

  const toggle = (on: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className="relative h-[22px] w-[38px] flex-none rounded-full transition-colors"
      style={{ background: on ? '#1750d8' : '#cbd5e1' }}
    >
      <span
        className="absolute top-[3px] size-4 rounded-full bg-white transition-all"
        style={{ left: on ? 19 : 3 }}
      />
    </button>
  )

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="파일 업로드"
      desc={`업로드 위치: ${destName}`}
      width={480}
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>취소</BtnGhost><BtnPrimary onClick={close}>파일을 선택하세요</BtnPrimary></>}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <Icon name="drive_file_move" size={17} className="text-ink-500" />
        <span className="whitespace-nowrap text-[11.6px] font-bold text-ink-600">저장 위치</span>
        <span className="min-w-0 truncate text-sm2 text-ink-400">문서 저장소 › {destName}</span>
      </div>
      <div className="mb-3.5 flex flex-wrap gap-1.5">
        {folders.filter((f) => f.depth > 0).map((f) => chip(f.name, f.id === dest, () => setDest(f.id)))}
      </div>

      <button className="mb-4 block w-full rounded-lg border border-dashed border-ink-300 bg-ink-50 px-4 py-9 text-center hover:border-brand hover:bg-brand-softer">
        <Icon name="upload" size={30} className="text-ink-400" />
        <span className="mt-2 block text-label font-bold">파일을 끌어다 놓거나 클릭해서 선택</span>
        <span className="mt-1 block text-sm2 text-ink-400">PDF, DOCX, XLSX, HWP, 이미지 · 1건당 100MB까지</span>
      </button>

      <div className="mb-2 whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">AI 처리 옵션</div>
      <div className="flex flex-col gap-2.5 rounded-lg border border-ink-200 bg-ink-50 p-3.5">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs2 font-bold">OCR + RAG 색인</div>
            <div className="mt-0.5 text-[11.2px] text-ink-500">색인 후 챗봇 추론 검색과 에코바디스 답변 찾기에 사용됩니다</div>
          </div>
          {toggle(indexing, () => setIndexing(!indexing))}
        </div>
        <div className="flex items-center gap-3 border-t border-ink-200 pt-2.5">
          <div className="min-w-0 flex-1">
            <div className="text-xs2 font-bold">표·서식 구조 인식</div>
            <div className="mt-0.5 text-[11.2px] text-ink-500">표가 많은 실적표·평가표의 셀 구조를 유지합니다</div>
          </div>
          {toggle(tableMode, () => setTableMode(!tableMode))}
        </div>
        <div className="border-t border-ink-200 pt-2.5">
          <div className="mb-1.5 text-[11.2px] font-bold text-ink-600">OCR 인식 언어</div>
          <div className="flex flex-wrap gap-1.5">
            {['한국어 + 영어', '한국어', '영어'].map((l) => chip(l, ocrLang === l, () => setOcrLang(l)))}
          </div>
        </div>
        <div className="border-t border-ink-200 pt-2.5">
          <div className="mb-1.5 text-[11.2px] font-bold text-ink-600">중복 파일 처리</div>
          <div className="flex flex-wrap gap-1.5">
            {['새 버전으로 등록', '건너뛰기', '둘 다 보관'].map((l) => chip(l, dupMode === l, () => setDupMode(l)))}
          </div>
        </div>
        <div className="border-t border-ink-200 pt-2.5">
          <div className="mb-1.5 text-[11.2px] font-bold text-ink-600">접근 권한</div>
          <div className="flex flex-wrap gap-1.5">
            {['프로젝트 멤버 6명', '나만 보기', '외부 협업자 포함'].map((l) => chip(l, access === l, () => setAccess(l)))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

function FileCreate() {
  const { isOpen, close } = useLayer('file-create')
  return (
    <FormModal
      open={isOpen}
      onClose={close}
      id="newfile"
      title="새 파일"
      desc="문서를 직접 작성해 저장소에 등록합니다"
      width={420}
      cta="만들기"
      fields={[
        { label: '파일 이름', type: 'text', required: true, placeholder: '파일 이름을 입력하세요' },
        { label: '파일 유형', type: 'select', required: true, options: ['DOC (워드 문서)', 'HWP (한글 문서)', 'MD (마크다운)'] },
        { label: '저장 폴더', type: 'select', options: folders.map((f) => f.name) },
      ]}
    />
  )
}

function FileDelete() {
  const { isOpen, close } = useLayer('file-delete')
  const fileId = useAppStore((s) => s.fileId)
  const name = (fileId ? findFile(fileId)?.name : null) ?? '표준 공급계약서_v3.docx'
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="파일을 삭제할까요?"
      desc="이 작업은 되돌릴 수 없습니다"
      width={440}
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>취소</BtnGhost><BtnDanger onClick={close}>삭제</BtnDanger></>}
    >
      <div className="text-label leading-[1.8] text-ink-700">
        <strong className="font-extrabold">{name}</strong> 파일을 삭제하면 RAG 색인에서도 제거되어 챗봇 검색 결과와
        에코바디스 답변 근거에서 사라집니다.
      </div>
      <div className="mt-[13px] rounded-lg border border-bad-border bg-bad-soft px-3.5 py-3 text-sm2 leading-[1.7] text-bad-dark">
        이 문서를 근거로 사용한 답변 3건이 영향을 받습니다.
      </div>
    </Modal>
  )
}

function OrgCreate() {
  const { isOpen, close } = useLayer('org-create')
  return (
    <FormModal
      open={isOpen}
      onClose={close}
      id="org"
      title="조직 만들기"
      desc="조직 단위로 조직&사업부와 멤버를 관리합니다"
      width={460}
      cta="조직 만들기"
      fields={[
        { label: '조직 이름', type: 'text', required: true, placeholder: '예: Amber Evolution' },
        { label: '사업자 등록번호', type: 'text', placeholder: '000-00-00000' },
        { label: '플랜', type: 'select', options: ['ENTERPRISE', 'BUSINESS', 'STARTER'] },
      ]}
    />
  )
}

function WsCreate() {
  const { isOpen, close } = useLayer('ws-create')
  return (
    <FormModal
      open={isOpen}
      onClose={close}
      id="ws"
      title="조직&사업부 만들기"
      desc="사업부·팀 단위 공간을 만듭니다"
      width={460}
      cta="만들기"
      fields={[
        { label: '조직&사업부 이름', type: 'text', required: true, placeholder: '예: ESG 전략팀' },
        { label: '상위 사업부', type: 'select', options: ['ESG 본부', '경영지원 본부', '구매 본부'] },
        { label: '설명', type: 'area', placeholder: '용도를 간단히 적어주세요' },
      ]}
    />
  )
}

function ProjCreate() {
  const { isOpen, close } = useLayer('proj-create')
  return (
    <FormModal
      open={isOpen}
      onClose={close}
      id="proj"
      title="프로젝트 만들기"
      desc="프로젝트 안에 문서·협업·에코바디스가 구성됩니다"
      width={460}
      cta="만들기"
      fields={[
        { label: '프로젝트 이름', type: 'text', required: true, placeholder: '예: 에코바디스 2026 대응' },
        { label: '공개 범위', type: 'chips', options: ['공개', '비공개'] },
        { label: '초대할 멤버', type: 'text', placeholder: '이메일을 쉼표로 구분' },
      ]}
    />
  )
}

function MemberInvite() {
  const { isOpen, close } = useLayer('member-invite')
  return (
    <FormModal
      open={isOpen}
      onClose={close}
      id="member"
      title="멤버 추가"
      desc="이메일로 초대하고 권한을 지정합니다"
      width={460}
      cta="초대 보내기"
      fields={[
        { label: '이메일', type: 'text', required: true, placeholder: 'name@company.com' },
        { label: '소속 팀', type: 'text', placeholder: '예: ESG팀' },
        { label: '기본 권한', type: 'chips', options: PERM_CHIPS },
      ]}
    />
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
  const room = useAppStore((s) => s.room)
  const cur = rooms.find((r) => r.id === room) ?? rooms[0]
  return (
    <FormModal
      open={isOpen}
      onClose={close}
      id="invite"
      title="채팅방 초대"
      desc={`${cur.name} 대화방에 멤버를 초대합니다`}
      width={460}
      cta="초대 링크 만들기"
      fields={[
        { label: '초대할 멤버', type: 'text', placeholder: '이름 또는 이메일 검색' },
        { label: '링크 만료', type: 'chips', options: ['7일 후 만료', '30일 후 만료', '만료 없음'] },
        { label: '기본 권한', type: 'chips', options: PERM_CHIPS },
      ]}
    />
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
  return (
    <FormModal
      open={isOpen}
      onClose={close}
      id="evpack"
      title="증빙 팩 내보내기"
      desc="문항별 답변과 증빙을 1개 파일로 묶어 내려받습니다"
      width={460}
      cta="내보내기 시작"
      fields={[
        { label: '포함 범위', type: 'chips', options: ['전체 문항', '답변완료만', '현재 필터'] },
        { label: '증빙 파일', type: 'chips', options: ['원본 첨부', '인용 페이지만', '링크만'] },
        { label: '출력 형식', type: 'select', options: ['PDF 통합본', 'ZIP (답변서 + 증빙 원본)', 'XLSX 답변표'] },
      ]}
    />
  )
}

function TaskRequestSheet() {
  const { isOpen, close, payload } = useLayer('task-request')
  const [to, setTo] = useState((payload?.to as string) ?? 'm3')
  const [dueIdx, setDueIdx] = useState(1)
  const [reqType, setReqType] = useState(0)
  return (
    <Sheet
      open={isOpen}
      onClose={close}
      title="업무 요청 (Task)"
      desc="담당자를 지정해 자료·업무를 요청합니다"
      width={420}
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
      <Field label="요청 유형">
        <div className="flex gap-1.5">
          {['자료 요청', '업무 처리', '검토 요청'].map((t, i) => {
            const on = reqType === i
            return (
              <button
                key={t}
                onClick={() => setReqType(i)}
                className="flex-1 whitespace-nowrap rounded-[7px] border py-2 text-sm2 font-bold"
                style={{
                  background: on ? '#1750d8' : '#fff',
                  borderColor: on ? '#1750d8' : '#cbd5e1',
                  color: on ? '#fff' : '#334155',
                }}
              >
                {t}
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

function TaskAlertSheet() {
  const { isOpen, close } = useLayer('task-alert')
  const { setTaskId, setScreen } = useAppStore()
  return (
    <Sheet
      open={isOpen}
      onClose={close}
      title="내 Task"
      desc="요청받은 업무와 진행 상태"
      width={420}
      footer={<><BtnGhost onClick={close}>닫기</BtnGhost><div className="flex-1" /><BtnPrimary onClick={() => { setScreen('task'); close() }}>업무 관리 열기</BtnPrimary></>}
    >
      <div className="flex flex-col">
        {tasks.map((t) => {
          const tone = taskStatusTone[t.status]
          return (
            <button
              key={t.id}
              onClick={() => { setTaskId(t.id); setScreen('task'); close() }}
              className="block w-full border-b border-l-2 border-ink-100 px-2.5 py-3 text-left last:border-b-0 hover:bg-ink-50"
              style={{ borderLeftColor: tone.bar }}
            >
              <span className="mb-[5px] flex items-center gap-1.5">
                <span
                  className="rounded-full px-2 py-0.5 text-mini font-extrabold"
                  style={{ background: tone.bg, color: tone.fg }}
                >
                  {t.status}
                </span>
                <span className="font-mono text-mini text-ink-400">TASK-{t.no}</span>
                <span className="ml-auto whitespace-nowrap text-mini text-ink-400">~{t.due}</span>
              </span>
              <span className="block text-sm2 font-bold leading-[1.6]">{t.title}</span>
              <span className="mt-1 block text-xs2 text-ink-500">
                {t.from} → {t.to} · {t.room}
              </span>
            </button>
          )
        })}
      </div>
    </Sheet>
  )
}

function TocEditSheet() {
  const { isOpen, close } = useLayer('toc-edit')
  const items: [string, number][] = [
    ['1. 개요', 0],
    ['2. 환경 경영', 0],
    ['2.1 인증 현황', 1],
    ['2.2 온실가스 배출', 1],
    ['3. 노동·인권', 0],
    ['4. 윤리 경영', 0],
  ]
  return (
    <Sheet
      open={isOpen}
      onClose={close}
      title="목차 편집"
      desc="드래그로 순서와 단계를 조정합니다"
      width={380}
      footer={<><BtnGhost onClick={close}>취소</BtnGhost><div className="flex-1" /><BtnPrimary onClick={close}>목차 적용</BtnPrimary></>}
    >
      <div className="flex flex-col">
        {items.map(([label, lv]) => (
          <div key={label} className="flex items-center gap-2 border-b border-ink-100 py-2.5 last:border-b-0">
            <Icon name="drag_indicator" size={17} className="text-ink-300" />
            <span
              className="min-w-0 flex-1 truncate text-label"
              style={{ paddingLeft: lv * 18, fontWeight: lv === 0 ? 700 : 500 }}
            >
              {label}
            </span>
            <span className="flex-none rounded bg-ink-100 px-1.5 py-0.5 text-mini font-extrabold text-ink-500">
              {lv === 0 ? 'H1' : 'H2'}
            </span>
          </div>
        ))}
      </div>
      <button className="mt-3 w-full rounded-lg border border-dashed border-ink-300 py-2.5 text-sm2 font-bold text-ink-500 hover:border-brand-link hover:text-brand-link">
        + 목차 항목 추가
      </button>
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
