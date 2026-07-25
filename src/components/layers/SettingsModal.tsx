import { useState } from 'react'
import { Icon } from '@/components/common/icon'
import { Modal, BtnGhost, BtnPrimary } from './Modal'
import { useLayer } from '@/stores/layer-store'

/** 설정 (p18·p29~34) — 5영역: 내 계정 · 보안 · 조직&사업부 · AI·색인 · 알림 */

type Row =
  | { label: string; desc: string; kind: 'action'; action: string; danger?: boolean }
  | { label: string; desc: string; kind: 'toggle'; on: boolean }
  | { label: string; desc: string; kind: 'select'; options: string[] }

const NAV = [
  { id: 'account', label: '내 계정', icon: 'person', title: '내 계정', desc: '이름·직함·언어 등 개인 정보' },
  { id: 'security', label: '보안 · 로그인', icon: 'lock', title: '보안 및 로그인', desc: '비밀번호 · 2단계 인증 · 세션' },
  { id: 'org', label: '조직&사업부', icon: 'apartment', title: '조직&사업부 설정', desc: '멤버 정책 · 외부 공유 · 스토리지' },
  { id: 'ai', label: 'AI · 색인', icon: 'auto_awesome', title: 'AI · 색인 정책', desc: 'OCR·RAG 처리와 답변 인용 정책' },
  { id: 'noti', label: '알림', icon: 'notifications', title: '알림 설정', desc: '업무·멘션·색인 알림 채널' },
] as const

const ROWS: Record<string, Row[]> = {
  account: [
    { label: '이름 · 직함', desc: '홍길동 · 성과 리드', kind: 'action', action: '변경' },
    { label: '이메일', desc: 'hong@evolvailab.com · 조직 인증 계정', kind: 'action', action: '변경' },
    { label: '표시 언어', desc: '화면 전체에 적용됩니다', kind: 'select', options: ['한국어', 'English'] },
    { label: '시간대', desc: '기한·알림 시각 기준', kind: 'select', options: ['(GMT+9) 서울', '(GMT+0) UTC'] },
    { label: '기본 진입 화면', desc: '로그인 후 처음 열리는 화면', kind: 'select', options: ['대시보드', '문서 저장소', '업무 관리'] },
  ],
  security: [
    { label: '비밀번호', desc: '마지막 변경 2026.05.02', kind: 'action', action: '변경' },
    { label: '2단계 인증 (2FA)', desc: '인증 앱 코드로 추가 확인 · Google Authenticator 등록됨', kind: 'toggle', on: true },
    { label: '신뢰 기기 유지', desc: '2FA 통과한 브라우저를 30일간 기억', kind: 'toggle', on: true },
    { label: 'SSO 강제', desc: '조직 계정(SAML)으로만 로그인 허용', kind: 'toggle', on: false },
    { label: '자동 로그아웃', desc: '무활동 시 세션 종료 시간', kind: 'select', options: ['4시간', '1시간', '8시간'] },
    { label: '백업 코드', desc: '인증 앱을 쓸 수 없을 때 사용 · 10개 중 8개 남음', kind: 'action', action: '재발급' },
  ],
  org: [
    { label: '조직&사업부 이름', desc: 'ESG 전략팀 · 상위 ESG 본부', kind: 'action', action: '변경' },
    { label: '멤버 초대 권한', desc: '누가 멤버를 초대할 수 있는지', kind: 'select', options: ['마스터만', '편집 가능 이상', '전체 멤버'] },
    { label: '외부 협업자 허용', desc: '조직 외부 이메일 초대 · 기본 만료 30일', kind: 'toggle', on: true },
    { label: '기본 프로젝트 공개 범위', desc: '새 프로젝트 생성 시 적용', kind: 'select', options: ['공개 (조직&사업부 전체)', '비공개'] },
    { label: '문서 다운로드 제한', desc: '보기 전용 멤버의 원본 내려받기 차단', kind: 'toggle', on: false },
    { label: '조직&사업부 삭제', desc: '모든 프로젝트·문서가 영구 삭제됩니다', kind: 'action', action: '삭제', danger: true },
  ],
  ai: [
    { label: 'OCR 자동 실행', desc: '업로드 즉시 텍스트 추출 · 스캔 PDF·이미지 포함', kind: 'toggle', on: true },
    { label: 'RAG 색인 자동 실행', desc: 'OCR 완료 후 임베딩 · 검색·답변에 사용', kind: 'toggle', on: true },
    { label: 'OCR 기본 언어', desc: '문서 인식 정확도에 영향', kind: 'select', options: ['한국어 + 영어', '한국어', 'English'] },
    { label: '표·양식 구조 추출', desc: '표를 셀 단위로 인식해 인용 정확도 향상', kind: 'toggle', on: true },
    { label: '답변 근거 표시', desc: '챗봇 답변에 파일명·페이지 인용을 항상 표시', kind: 'toggle', on: true },
    { label: '학습 데이터 제외 폴더', desc: '인사·법무 등 민감 폴더 2개 제외 중', kind: 'action', action: '폴더 선택' },
    { label: '외부 모델 전송', desc: '사내 전용 · 데이터 외부 유출 없음', kind: 'toggle', on: false },
  ],
  noti: [
    { label: '업무 요청 알림', desc: '나에게 배정된 업무가 생기면 알림', kind: 'toggle', on: true },
    { label: '멘션 알림', desc: '@내이름 으로 호출되면 알림', kind: 'toggle', on: true },
    { label: '색인 완료 알림', desc: '업로드 문서의 OCR·RAG 색인이 끝나면 알림', kind: 'toggle', on: true },
    { label: '알림 채널', desc: '어디로 받을지 선택', kind: 'select', options: ['앱 + 이메일', '앱만', '이메일만'] },
    { label: '요약 리포트', desc: '주간 업무·색인 현황 메일', kind: 'select', options: ['매주 월요일', '매일', '받지 않음'] },
  ],
}

export function SettingsModal() {
  const { isOpen, close } = useLayer('settings')
  const [tab, setTab] = useState<string>('account')
  const [flags, setFlags] = useState<Record<string, boolean>>({})
  const cur = NAV.find((n) => n.id === tab) ?? NAV[0]

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title={cur.title}
      desc={cur.desc}
      width={780}
      footer={<><div className="flex-1" /><BtnGhost onClick={close}>닫기</BtnGhost><BtnPrimary onClick={close}>저장</BtnPrimary></>}
    >
      <div className="-mx-[18px] -my-4 flex min-h-[420px]">
        <div className="w-[186px] flex-none border-r border-ink-200 py-2">
          {NAV.map((n) => {
            const on = tab === n.id
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left hover:bg-ink-100"
                style={{ background: on ? '#eff6ff' : 'transparent', color: on ? '#1345bd' : '#334155' }}
              >
                <Icon name={n.icon} size={17} />
                <span className="text-label" style={{ fontWeight: on ? 700 : 500 }}>
                  {n.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="min-w-0 flex-1 px-[18px] py-2">
          {ROWS[tab].map((r) => (
            <div key={r.label} className="flex items-center gap-3 border-b border-ink-100 py-3.5 last:border-b-0">
              <div className="min-w-0 flex-1">
                <div className="text-label font-bold" style={r.kind === 'action' && r.danger ? { color: '#b91c1c' } : undefined}>
                  {r.label}
                </div>
                <div className="mt-1 text-sm2 leading-[1.65] text-ink-500">{r.desc}</div>
              </div>

              {r.kind === 'toggle' && (
                <button
                  onClick={() => setFlags((f) => ({ ...f, [r.label]: !(f[r.label] ?? r.on) }))}
                  className="relative h-[22px] w-[38px] flex-none rounded-full transition-colors"
                  style={{ background: (flags[r.label] ?? r.on) ? '#1750d8' : '#cbd5e1' }}
                >
                  <span
                    className="absolute top-0.5 size-[18px] rounded-full bg-white transition-all"
                    style={{ left: (flags[r.label] ?? r.on) ? 18 : 2 }}
                  />
                </button>
              )}

              {r.kind === 'select' && (
                <select className="w-[190px] flex-none rounded-md border border-ink-300 px-2.5 py-1.5 text-sm2 outline-none">
                  {r.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              )}

              {r.kind === 'action' && (
                <button
                  className="flex-none rounded-md border bg-white px-3 py-1.5 text-sm2 font-bold"
                  style={{
                    borderColor: r.danger ? '#fecaca' : '#cbd5e1',
                    color: r.danger ? '#b91c1c' : '#1750d8',
                  }}
                >
                  {r.action}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
