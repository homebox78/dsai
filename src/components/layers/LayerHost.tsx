import { FileExt } from '@/components/common/FileExt'
import { useState } from 'react'
import { Icon } from '@/components/common/icon'
import { BtnDanger, BtnGhost, BtnPrimary, Field, Modal, Sheet, inputCls } from './Modal'
import { FormModal } from './FormModal'
import { ChoiceRow } from '@/components/common/ChoiceRow'
import { Select } from '@/components/common/select'
import { SettingsModal } from './SettingsModal'
import { ViewerModal } from './ViewerModal'
import { ctx, findFile, folders, members, rooms, tasks, taskStatusTone } from '@/mocks/data'
import { email as emailRule, minLen, maxLen } from '@/lib/validate'
import { useLayer } from '@/stores/layer-store'
import { useAppStore } from '@/stores/app-store'

/**
 * 레이어(모달·시트) 호스트.
 *
 * 화면 운영 원칙상 페이지를 늘리지 않는다 — 상세·설정·요청은 전부 셸 위에 겹쳐 뜨는 레이어다.
 * 여는 방법은 `useLayerStore().open('<key>')` 하나뿐이고, 여기서 key 별로 컴포넌트를 매칭해 렌더한다.
 * 해시(`#modal=<key>`)로도 열리므로 검수 인덱스·딥링크가 그대로 동작한다.
 *
 * ── 목차 ──────────────────────────────────────────
 *  문서    FolderCreate · FileUpload · FileCreate · FileDelete
 *  조직    OrgCreate · WsCreate · ProjCreate · MemberInvite · PlanModal · WsDelete
 *  협업    ChatInvite · ChatInfo · ChatLeave · ExtCollab · ActivityAll
 *  업무    TaskPreview · TaskRequestSheet · TaskAlertSheet
 *  에코    EcoExport
 *  작성기  TocEditSheet
 *  AI      AiChatSheet · SearchModal
 *  외부    SettingsModal · ViewerModal (별도 파일)
 *
 * 폼이 있는 레이어는 대부분 FormModal 에 필드 정의만 넘긴다 (검증 규칙은 라벨로 자동 추론).
 * 직접 마크업을 쓰는 레이어는 시안에 고유 레이아웃이 있는 경우다.
 */

/** 권한 선택 칩 (시안 chipsPerm) — 초대·공유 계열 레이어에서 공용 */
const PERM_CHIPS = ['편집 가능', '댓글 가능', '보기 전용']
const REQ_TYPES = ['자료 요청', '업무 처리', '검토 요청']
const DUES = ['오늘', '3일 내', '1주 내', '직접 입력']

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
      <WsDelete />
      <ExtCollab />
      <ActivityAll />
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

/* ── 조직 · 멤버 ──────────────────────────────────── */

function OrgCreate() {
  const { isOpen, close } = useLayer('org-create')
  return (
    <FormModal
      open={isOpen}
      onClose={close}
      id="org"
      title="새로운 조직 등록하기"
      desc="조직의 기본 정보와 브랜드 정보를 입력합니다"
      width={460}
      cta="조직 등록"
      fields={[
        { label: '조직명', type: 'text', required: true, placeholder: '2-100자', rules: [minLen(2, '조직명'), maxLen(100, '조직명')] },
        { label: '조직 설명', type: 'area', placeholder: '조직을 간단히 소개해주세요' },
        { label: '웹사이트 URL', type: 'text', placeholder: 'https://birdlab.com' },
        { label: '사업자 등록번호', type: 'text', placeholder: '000-00-00000' },
        { label: '기본 아이콘', type: 'chips', options: ['자동 생성', '직접 업로드'] },
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
      title="새로운 조직&사업부 생성하기"
      desc="조직&사업부 이름과 분석할 URL을 입력해 주세요."
      width={460}
      cta="생성"
      fields={[
        { label: '조직&사업부 이름', type: 'text', required: true, placeholder: '2-100자', rules: [minLen(2, '조직&사업부 이름'), maxLen(100, '조직&사업부 이름')] },
        { label: '웹사이트 URL', type: 'text', placeholder: 'https://birdlab.com' },
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
      title="멤버 초대하기"
      desc="이메일로 초대하고 역할을 지정합니다"
      width={520}
      cta="초대하기"
      fields={[
        { label: '조직&사업부 명칭', type: 'readonly', value: ctx.ws },
        { label: '멤버', type: 'invite', required: true, options: PERM_CHIPS },
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

/** 채팅방 초대 시 지정할 수 있는 역할 (설계서 p48) */
const INVITE_ROLES = ['디자이너', '영상편집자', '카피라이터', '웹/그래픽', '마케터']
const LINK_EXPIRY = ['7일 후 만료', '30일 후 만료', '만료 없음']

/**
 * 채팅방 초대 (설계서 p48)
 * [이메일로 초대 | 초대 링크] 탭 전환. 외부 협업자는 지정한 프로젝트에만 접근한다는 안내를 함께 띄운다.
 */
function ChatInvite() {
  const { isOpen, close } = useLayer('chat-invite')
  const room = useAppStore((s) => s.room)
  const cur = rooms.find((r) => r.id === room) ?? rooms[0]
  const [tab, setTab] = useState<'email' | 'link'>('email')
  const [email, setEmail] = useState('')
  const [perm, setPerm] = useState(PERM_CHIPS[0])
  const [roles, setRoles] = useState<string[]>([])
  const [msg, setMsg] = useState('')
  const [expiry, setExpiry] = useState(LINK_EXPIRY[0])
  const [linkPerm, setLinkPerm] = useState(PERM_CHIPS[0])
  const [copied, setCopied] = useState(false)

  const badEmail = tab === 'email' && !!email.trim() && !!emailRule(email)

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="외부 협업자 초대"
      desc="초대 링크를 보내거나 이메일로 바로 추가하세요"
      width={480}
      footer={
        <>
          <div className="flex-1" />
          <BtnGhost onClick={close}>취소</BtnGhost>
          <BtnPrimary onClick={close}>{tab === 'email' ? '초대 보내기' : '링크 보내기'}</BtnPrimary>
        </>
      }
    >
      {/* 탭 */}
      <div className="mb-3 flex gap-1.5">
        {([['email', '이메일로 초대'], ['link', '초대 링크']] as const).map(([id, label]) => {
          const on = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 whitespace-nowrap rounded-md px-3 py-2 text-sm2 font-bold transition-colors"
              style={on ? { background: '#1750d8', color: '#fff' } : { background: '#f1f5f9', color: '#475569' }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {tab === 'email' ? (
        <>
          <Field label="이메일 주소" error={badEmail ? '이메일 형식이 올바르지 않습니다' : null}>
            <div className="flex items-stretch gap-1.5">
              <input
                className={`${inputCls} h-[34px] py-0${badEmail ? ' border-bad-border' : ''}`}
                placeholder="collaborator@example.com"
                value={email}
                aria-invalid={badEmail}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Select ddKey="invite:perm" className="h-[34px] w-[130px] flex-none" value={perm} options={PERM_CHIPS} onChange={setPerm} />
            </div>
          </Field>

          <Field label="역할 (선택)">
            <div className="flex flex-wrap gap-1.5">
              {INVITE_ROLES.map((r) => {
                const on = roles.includes(r)
                return (
                  <button
                    key={r}
                    onClick={() => setRoles(on ? roles.filter((x) => x !== r) : [...roles, r])}
                    aria-pressed={on}
                    className="whitespace-nowrap rounded-full border px-2.5 py-1.5 text-sm2 font-bold transition-colors"
                    style={
                      on
                        ? { background: '#eff6ff', borderColor: '#1750d8', color: '#1345bd' }
                        : { background: '#fff', borderColor: '#cbd5e1', color: '#475569' }
                    }
                  >
                    {r}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label="초대 메시지 (선택)">
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder={`안녕하세요. ${cur.name} 프로젝트에 협업자로 초대합니다.`}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
          </Field>

          <div className="flex gap-2 rounded-lg border border-brand-border bg-brand-soft px-3 py-2.5">
            <Icon name="info" size={17} className="mt-px flex-none text-brand" />
            <span className="text-sm2 leading-[1.65] text-brand-dark">
              외부 협업자는 <b className="font-bold">지정한 프로젝트</b>만 접근할 수 있으며, 조직&amp;사업부 전체에는
              접근할 수 없습니다.
            </span>
          </div>
        </>
      ) : (
        <>
          <Field label="공유 가능한 초대 링크">
            <div className="flex items-stretch gap-1.5">
              <input
                className={`${inputCls} h-[34px] py-0 bg-ink-50 font-mono text-sm2 text-ink-500`}
                value={`https://amber.console/invite?token=hub_x9k2s4b7`}
                readOnly
                tabIndex={-1}
              />
              <button
                onClick={() => setCopied(true)}
                className="flex h-[34px] flex-none items-center gap-1 whitespace-nowrap rounded-md border border-ink-300 bg-white px-3 text-sm2 font-bold text-ink-700 hover:border-brand hover:text-brand-dark"
              >
                <Icon name={copied ? 'check' : 'content_copy'} size={16} />
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
          </Field>
          <Field label="링크 만료">
            <Select ddKey="invite:expiry" value={expiry} options={LINK_EXPIRY} onChange={setExpiry} />
          </Field>
          <Field label="기본 권한">
            <Select ddKey="invite:linkperm" value={linkPerm} options={PERM_CHIPS} onChange={setLinkPerm} />
          </Field>
        </>
      )}
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

/** 외부 협업자 관리 (설계서 p62) */
function ExtCollab() {
  const { isOpen, close } = useLayer('ext-collab')
  const ext = members.filter((m) => m.dept === '외부 협업자')
  const stats = [
    { label: '협업 중', value: String(ext.length) },
    { label: '공유 프로젝트', value: '10' },
    { label: '평균 응답률', value: '87%' },
  ]
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="외부 협업자 관리"
      desc={`전체 ${ext.length}명 · 참여 중인 프로젝트 기준`}
      width={620}
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>닫기</BtnGhost><BtnPrimary onClick={close}>초대</BtnPrimary></>}
    >
      <div className="overflow-hidden rounded-lg border border-ink-200">
        <div className="grid grid-cols-[minmax(0,1fr)_120px_92px_72px] gap-2 border-b border-ink-200 bg-ink-50 px-3 py-2">
          {['협업자', '소속', '최근 활동', ''].map((h, i) => (
            <span key={i} className="text-center text-mini font-extrabold tracking-[.06em] text-ink-400">
              {h}
            </span>
          ))}
        </div>
        {ext.map((m) => (
          <div
            key={m.id}
            className="grid grid-cols-[minmax(0,1fr)_120px_92px_72px] items-center gap-2 border-b border-ink-100 px-3 py-2.5 last:border-b-0"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="flex size-7 flex-none items-center justify-center rounded-full border border-[#fed7aa] bg-[#fff7ed] text-[11.6px] font-extrabold text-[#c2410c]">
                {m.name[0]}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-label font-bold">{m.name}</span>
                <span className="block truncate text-left text-[11.2px] text-ink-400">{m.email}</span>
              </span>
            </span>
            <span className="truncate text-center text-sm2 text-ink-500">{m.role}</span>
            <span className="text-center text-sm2 text-ink-500">{m.last}</span>
            <span className="flex justify-center">
              <button className="h-[30px] rounded-md border border-ink-300 bg-white px-2.5 text-sm2 font-bold text-ink-600 hover:border-bad hover:text-bad">
                내보내기
              </button>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-ink-200 bg-ink-50 px-3 py-2.5 text-center">
            <div className="text-base2 font-extrabold text-brand-dark">{s.value}</div>
            <div className="mt-0.5 text-tiny text-ink-500">{s.label}</div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

/** 최근 활동 전체 보기 (설계서 p63) */
const ACTIVITY_FILTERS = ['전체', '업로드', '댓글', '발행'] as const

function ActivityAll() {
  const { isOpen, close } = useLayer('activity-all')
  const [filter, setFilter] = useState<string>('전체')
  const rows = [
    { kind: '발행', who: '김지원', text: 'SS26 키비주얼 v3을 컨펌했습니다', time: '2시간 전', dot: '#16a34a' },
    { kind: '업로드', who: '박디자이너', text: '새 시안을 업로드했습니다', time: '3시간 전', dot: '#2563eb' },
    { kind: '댓글', who: '박매니저', text: '코멘트를 남겼습니다', time: '5시간 전', dot: '#94a3b8' },
    { kind: '발행', who: '이대리', text: '3월 리포트를 발행했습니다', time: '2주 전', dot: '#16a34a' },
    { kind: '업로드', who: '박지원', text: 'ISO 14001 인증서를 업로드했습니다', time: '18분 전', dot: '#2563eb' },
    { kind: '댓글', who: '김대성', text: 'TASK-139에 코멘트를 남겼습니다', time: '3시간 전', dot: '#94a3b8' },
  ].filter((r) => filter === '전체' || r.kind === filter)

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="최근 활동 전체"
      desc={`총 ${rows.length}건 · 프로젝트 ${ctx.proj}`}
      width={560}
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>닫기</BtnGhost></>}
    >
      <ChoiceRow
        name="activity-filter"
        value={filter}
        options={[...ACTIVITY_FILTERS]}
        onChange={setFilter}
        className="mb-3"
      />
      <div className="overflow-hidden rounded-lg border border-ink-200">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2.5 border-b border-ink-100 px-3 py-2.5 last:border-b-0">
            <span className="size-1.5 flex-none rounded-full" style={{ background: r.dot }} />
            <span className="min-w-0 flex-1 truncate text-left text-label">
              <b className="font-bold">{r.who}</b>님이 {r.text}
            </span>
            <span className="flex-none whitespace-nowrap text-tiny text-ink-400">{r.time}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

/** 조직&사업부 삭제 (설계서 p34) — 이름을 정확히 입력해야 삭제된다 */
function WsDelete() {
  const { isOpen, close } = useLayer('ws-delete')
  const [typed, setTyped] = useState('')
  const ok = typed.trim() === ctx.ws
  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="조직&사업부 삭제"
      desc="삭제하면 모든 데이터가 영구적으로 제거됩니다."
      width={480}
      footer={
        <>
          <div className="flex-1" />
          <BtnGhost onClick={close}>취소</BtnGhost>
          <button
            disabled={!ok}
            onClick={close}
            className="h-[34px] rounded-md bg-bad px-3.5 text-sm2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            영구 삭제
          </button>
        </>
      }
    >
      <div className="rounded-lg border border-bad-border bg-bad-soft px-3.5 py-3">
        <div className="flex items-center gap-1.5 text-label font-bold text-bad-dark">
          <Icon name="warning" size={17} />이 작업은 되돌릴 수 없습니다
        </div>
        <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-4 text-sm2 leading-[1.7] text-ink-600">
          <li>모든 프로젝트·문서·색인 데이터가 삭제됩니다.</li>
          <li>소속된 모든 멤버의 접근 권한이 회수됩니다.</li>
          <li>남은 크레딧 및 구독은 환불되지 않습니다.</li>
        </ul>
      </div>
      <Field label={`확인을 위해 ${ctx.ws} 을(를) 입력하세요`} error={typed && !ok ? '이름이 일치하지 않습니다' : null}>
        <input
          className={inputCls + (typed && !ok ? ' border-bad-border' : '')}
          value={typed}
          aria-invalid={!!typed && !ok}
          placeholder={ctx.ws}
          onChange={(e) => setTyped(e.target.value)}
        />
      </Field>
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

/* ── 업무 ─────────────────────────────────────────── */

/**
 * Task 미리보기 (설계서 p51~53)
 *
 * 좌: [미리보기 · 버전 · 활동] 탭 / 우: 댓글·채팅 (탭과 무관하게 항상 열림)
 * 상단 액션 [공유][다운로드][캠페인에 사용] + 파일 메타·공개 배지.
 */

/** 버전 히스토리 (p52) */
const TASK_VERSIONS = [
  { v: 'v1', when: '2주 전', by: '김지원', how: '직접 업로드', size: '2.3 MB', ext: 'PDF', cur: true, memo: '겨울 시즌 캠페인 최종 성과 정리. KPI 달성률 및 채널별 분석 포함.' },
  { v: 'v2', when: '3주 전', by: '박디자이너', how: '', size: '2.1 MB', ext: 'PDF', cur: false, memo: '헤드라인 위치 조정 및 여백 수정 반영.' },
  { v: 'v3', when: '4주 전', by: '김지원', how: '최초 업로드', size: '1.8 MB', ext: 'PDF', cur: false, memo: '초안. 데이터 집계 전 구조 잡기용.' },
]

/** 활동 로그 (p53) */
const TASK_ACTIVITY = [
  { who: '김지원', text: '파일을 컨펌했습니다', sub: '캠페인 발행 승인', when: '2주 전', icon: 'check_circle', color: '#16a34a' },
  { who: '김지원', text: 'v1을 업로드했습니다', sub: '2.3 MB · PDF', when: '2주 전', icon: 'upload_file', color: '#1750d8' },
  { who: '이리더', text: '댓글을 남겼습니다', sub: '"히어로 위쪽 여백이 조금 더 있으면 좋을 것 같아요."', when: '3주 전', icon: 'chat_bubble', color: '#7c3aed' },
  { who: '박디자이너', text: 'v2를 업로드했습니다', sub: '2.1 MB · PDF', when: '3주 전', icon: 'upload_file', color: '#1750d8' },
  { who: '박디자이너', text: '댓글을 남겼습니다', sub: '"v4 올렸습니다. 헤드라인 위치 조정했어요."', when: '3주 전', icon: 'chat_bubble', color: '#7c3aed' },
  { who: '이리더', text: '파일을 열람했습니다', sub: '', when: '4주 전', icon: 'visibility', color: '#94a3b8' },
  { who: '김지원', text: '파일을 등록했습니다', sub: '겨울 시즌 회고', when: '4주 전', icon: 'add_circle', color: '#64748b' },
]

/** 댓글·채팅 (p51~53 우측 패널) */
const TASK_COMMENTS = [
  { who: '박디자이너', ext: true, when: '12분 전', text: 'v4 올렸습니다. 헤드라인 위치 조정했어요. 확인 부탁드려요.', me: false },
  { who: '이리더', ext: false, when: '1시간 전', text: '히어로 위쪽 여백이 조금 더 있으면 좋을 것 같아요.', me: false },
  { who: '박디자이너', ext: true, when: '2시간 전', text: '네 알겠습니다 다음 버전에 반영할게요', me: false },
  { who: '김지원 (나)', ext: false, when: '3시간 전', text: '감사합니다! 컬러는 톤 다운된 게 더 잘 어울리네요.', me: true },
]

function TaskPreview() {
  const { isOpen, close, payload } = useLayer('task-preview')
  const [tab, setTab] = useState<'preview' | 'version' | 'activity'>('preview')
  const [comment, setComment] = useState('')
  const task = tasks.find((t) => t.id === payload?.id) ?? tasks[0]

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title={task.title}
      desc={`TASK-${task.no} · ${task.from} → ${task.to} · 기한 ${task.due}`}
      width={860}
      footer={
        <>
          <span className="flex items-center gap-1.5 text-sm2 text-ink-400">
            <Icon name="schedule" size={15} />
            마지막 활동 2주 전
          </span>
          <div className="flex-1" />
          <BtnGhost onClick={close}>공유</BtnGhost>
          <BtnGhost onClick={close}>다운로드</BtnGhost>
          <BtnPrimary onClick={close}>캠페인에 사용</BtnPrimary>
        </>
      }
    >
      {/* 파일 메타 — 형식 아이콘 · 배지 · 업로드 경로 */}
      <div className="mb-3 flex items-center gap-2.5 rounded-lg border border-ink-200 bg-ink-50 px-3.5 py-2.5">
        <FileExt ext="pdf" size={30} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-label font-extrabold">{task.title}</span>
            <span className="flex-none whitespace-nowrap rounded-full bg-ink-200 px-2 py-0.5 text-mini font-bold text-ink-600">
              기타
            </span>
            <span className="flex-none whitespace-nowrap rounded-full bg-ok-soft px-2 py-0.5 text-mini font-bold text-ok-dark">
              공개
            </span>
          </div>
          <div className="mt-0.5 text-xs2 text-ink-400">직접 업로드 · v1 · 첨부 {task.files}건</div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_300px]">
        {/* 좌측 — 탭 */}
        <div className="min-w-0">
          <div className="mb-3 flex gap-1 border-b border-ink-200">
            {([['preview', '미리보기'], ['version', `버전 ${TASK_VERSIONS.length}`], ['activity', '활동']] as const).map(
              ([id, label]) => {
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
              },
            )}
          </div>

          {tab === 'preview' && (
            <div className="grid h-[300px] place-items-center rounded-lg border border-ink-200 bg-ink-50">
              <div className="text-center">
                <Icon name="description" size={38} className="text-ink-300" />
                <div className="mt-2 text-sm2 text-ink-400">첨부 {task.files}건 · 미리보기를 불러오는 중…</div>
              </div>
            </div>
          )}

          {tab === 'version' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-label font-extrabold">버전 히스토리</span>
                <button className="ml-auto flex h-[30px] items-center gap-1 whitespace-nowrap rounded-md border border-ink-300 bg-white px-2.5 text-sm2 font-bold text-ink-700 hover:border-brand hover:text-brand-dark">
                  <Icon name="add" size={16} />새 버전 업로드
                </button>
              </div>
              {TASK_VERSIONS.map((v) => (
                <div
                  key={v.v}
                  className="flex gap-2.5 rounded-lg border px-3 py-2.5"
                  style={{ borderColor: v.cur ? '#bfdbfe' : '#e2e8f0', background: v.cur ? '#f5f9ff' : '#fff' }}
                >
                  <FileExt ext={v.ext} size={38} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-label font-extrabold">{v.v}</span>
                      {v.cur && (
                        <span className="whitespace-nowrap rounded-full bg-brand-soft px-2 py-0.5 text-mini font-bold text-brand-dark">
                          현재
                        </span>
                      )}
                      <span className="whitespace-nowrap text-tiny text-ink-400">
                        {v.when}
                        {v.how ? ` · ${v.how}` : ''}
                      </span>
                    </div>
                    <div className="mt-1 text-sm2 leading-[1.6] text-ink-600">{v.memo}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-tiny text-ink-400">
                      <span className="flex size-4 items-center justify-center rounded-full bg-ink-200 text-[8px] font-extrabold text-ink-600">
                        {v.by[0]}
                      </span>
                      {v.by} · {v.size} · {v.ext}
                    </div>
                  </div>
                  <div className="flex flex-none flex-col gap-1">
                    <button className="h-[26px] whitespace-nowrap rounded border border-ink-300 bg-white px-2 text-tiny font-bold text-ink-600 hover:border-brand hover:text-brand-dark">
                      다운로드
                    </button>
                    <button
                      className="h-[26px] whitespace-nowrap rounded px-2 text-tiny font-bold"
                      style={
                        v.cur
                          ? { background: '#eff6ff', color: '#1345bd' }
                          : { border: '1px solid #cbd5e1', background: '#fff', color: '#475569' }
                      }
                    >
                      {v.cur ? '사용 중' : '복원'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'activity' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-label font-extrabold">활동 로그</span>
                <span className="ml-auto text-tiny text-ink-400">총 {TASK_ACTIVITY.length}건</span>
              </div>
              {TASK_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5 border-b border-ink-100 pb-2 last:border-b-0">
                  <span
                    className="mt-0.5 flex size-6 flex-none items-center justify-center rounded-full"
                    style={{ background: `${a.color}1a`, color: a.color }}
                  >
                    <Icon name={a.icon} size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm2">
                      <b className="font-bold">{a.who}</b>이(가) {a.text}
                    </div>
                    {a.sub && <div className="mt-0.5 truncate text-tiny text-ink-400">{a.sub}</div>}
                  </div>
                  <span className="flex-none whitespace-nowrap text-tiny text-ink-400">{a.when}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 우측 — 댓글·채팅 (탭과 무관하게 항상 열려 있다) */}
        <div className="flex min-w-0 flex-col rounded-lg border border-ink-200">
          <div className="flex items-center gap-1.5 border-b border-ink-200 px-3 py-2">
            <span className="text-sm2 font-extrabold">댓글 · 채팅</span>
            <span className="ml-auto text-tiny text-ink-400">{TASK_COMMENTS.length}건</span>
          </div>
          <div className="flex max-h-[320px] min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-3">
            {TASK_COMMENTS.map((c, i) => (
              <div key={i} className={`flex gap-2 ${c.me ? 'flex-row-reverse' : ''}`}>
                <span
                  className="flex size-6 flex-none items-center justify-center rounded-full text-mini font-extrabold"
                  style={c.me ? { background: '#1750d8', color: '#fff' } : { background: '#f1f5f9', color: '#475569' }}
                >
                  {c.who[0]}
                </span>
                <div className={`min-w-0 ${c.me ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap text-tiny font-bold">{c.who}</span>
                    {c.ext && (
                      <span className="whitespace-nowrap rounded-full bg-[#fff7ed] px-1.5 py-px text-[9.7px] font-extrabold text-[#c2410c]">
                        외부
                      </span>
                    )}
                    <span className="whitespace-nowrap text-tiny text-ink-400">{c.when}</span>
                  </div>
                  <div
                    className="mt-1 inline-block rounded-lg px-2.5 py-1.5 text-left text-sm2 leading-[1.6]"
                    style={c.me ? { background: '#1750d8', color: '#fff' } : { background: '#f1f5f9', color: '#334155' }}
                  >
                    {c.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-stretch gap-1.5 border-t border-ink-200 p-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder="메시지 입력… @로 멘션"
              className={`${inputCls} resize-none`}
            />
            <BtnPrimary onClick={() => setComment('')}>보내기</BtnPrimary>
          </div>
        </div>
      </div>
    </Modal>
  )
}

/* ── 에코바디스 ───────────────────────────────────── */

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
        <ChoiceRow
          name="req-type"
          value={REQ_TYPES[reqType]}
          options={REQ_TYPES}
          onChange={(v) => setReqType(REQ_TYPES.indexOf(v))}
        />
      </Field>
      <Field label="요청 제목">
        <input className={inputCls} placeholder="예: 2025 표준계약서 최신본 전달" />
      </Field>
      <Field label="요청 내용">
        <textarea className={`${inputCls} resize-none`} rows={4} placeholder="필요한 업무 내용, 파일 조건 등을 적어주세요" />
      </Field>
      <Field label="처리 기한">
        <ChoiceRow name="req-due" value={DUES[dueIdx]} options={DUES} onChange={(v) => setDueIdx(DUES.indexOf(v))} />
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

/* ── 문서 작성기 ──────────────────────────────────── */

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

/* ── AI 검색 ──────────────────────────────────────── */

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
