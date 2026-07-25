import { useState } from 'react'
import { Icon } from '@/components/common/icon'
import { members } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'

/** 멤버 / 시스템 (p19~22) — 관리 항목 196px | 목록 테이블 */

const TABS = [
  { id: 'member', label: '멤버 관리', icon: 'group', count: 6, title: '멤버 관리', desc: '프로젝트 참여자와 권한을 관리합니다' },
  { id: 'channel', label: '채널 관리', icon: 'forum', count: 8, title: '채널 관리', desc: '협업공간 채널과 참여자를 관리합니다' },
  { id: 'guest', label: '외부 협업자', icon: 'person_add', count: 2, title: '외부 협업자', desc: '외부 이메일 초대와 만료를 관리합니다' },
  { id: 'log', label: '감사 로그', icon: 'receipt_long', count: 128, title: '감사 로그', desc: '멤버·권한 변경 이력을 확인합니다' },
] as const

const PERM_SUMMARY = [
  { label: '편집 가능', count: 2, color: '#2563eb' },
  { label: '댓글 가능', count: 1, color: '#f59e0b' },
  { label: '보기 전용', count: 1, color: '#94a3b8' },
]

const CHANNELS = [
  { name: 'ESG 전략 TF', type: '그룹', members: 5, msgs: 142, last: '10:42' },
  { name: '법무 검토 채널', type: '그룹', members: 4, msgs: 88, last: '07.22' },
  { name: '공급망 실사', type: '그룹', members: 3, msgs: 51, last: '07.20' },
]

const GUESTS = [
  { name: '정하늘', org: '메가존 · 개발 파트너', email: 'sky.jung@partner.kr', expire: '7일 후 만료', color: '#b45309' },
  { name: '오세훈', org: '외부 심사원', email: 'sh.oh@auditor.kr', expire: '30일 후 만료', color: '#64748b' },
]

const LOGS = [
  { who: '홍길동', time: '07.24 10:20', action: '권한 변경', text: '박지원 · 보기 전용 → 댓글 가능' },
  { who: '시스템', time: '07.22 09:00', action: '초대', text: '최민호 초대 메일 발송 (구매팀)' },
  { who: '홍길동', time: '07.20 14:02', action: '채널 생성', text: '공급망 실사 채널 생성' },
]

export function MembersView() {
  const { sysTab, setSysTab } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>(sysTab === 'channel' ? 'channel' : 'member')

  const cur = TABS.find((t) => t.id === tab) ?? TABS[0]
  const shownMembers = members.filter(
    (m) => !query.trim() || m.name.includes(query.trim()) || m.email.includes(query.trim()),
  )

  const th = 'px-[18px] py-[11px] text-xs2 font-extrabold text-ink-400 whitespace-nowrap'
  const td = 'px-[18px] py-3 text-label'

  return (
    <div className="flex min-h-0 min-w-[900px] flex-1">
      <div className="flex w-[196px] flex-none flex-col border-r border-ink-200 bg-white">
        <div className="flex-none border-b border-ink-200 px-3 py-2">
          <div className="whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">관리 항목</div>
        </div>
        <div className="flex-1 overflow-auto py-[5px]">
          {TABS.map((t) => {
            const on = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); if (t.id === 'channel' || t.id === 'member') setSysTab(t.id) }}
                className="flex w-full items-center gap-2 border-l-2 px-3 py-2 text-left hover:bg-ink-100"
                style={{
                  background: on ? '#eff6ff' : 'transparent',
                  borderLeftColor: on ? '#2563eb' : 'transparent',
                  color: on ? '#1d4ed8' : '#334155',
                }}
              >
                <Icon name={t.icon} size={17} className="opacity-90" />
                <span className="min-w-0 flex-1 truncate text-label" style={{ fontWeight: on ? 700 : 500 }}>
                  {t.label}
                </span>
                <span className="flex-none whitespace-nowrap text-xs2 text-ink-400">{t.count}</span>
              </button>
            )
          })}
        </div>
        <div className="flex-none border-t border-ink-200 px-3.5 py-3">
          <div className="mb-2 whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">권한 요약</div>
          <div className="flex flex-col gap-2">
            {PERM_SUMMARY.map((p) => (
              <div key={p.label} className="flex items-center gap-2">
                <span className="size-[7px] flex-none rounded-sm" style={{ background: p.color }} />
                <span className="flex-1 whitespace-nowrap text-cap text-ink-500">{p.label}</span>
                <span className="whitespace-nowrap text-cap font-extrabold">{p.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-auto bg-white">
        <div className="flex items-center gap-2 px-[18px] pb-[13px] pt-4">
          <div className="min-w-0">
            <div className="whitespace-nowrap text-lg2 font-extrabold tracking-[-.01em]">{cur.title}</div>
            <div className="mt-1 truncate text-sm2 text-ink-500">{cur.desc}</div>
          </div>
          <div className="flex-1" />
          <div className="flex w-[190px] items-center gap-1.5 rounded-md border border-ink-300 bg-white px-2.5 py-1.5">
            <Icon name="search" size={16} className="text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름 · 이메일 검색"
              className="min-w-0 flex-1 border-none bg-transparent p-0 text-sm2 outline-none"
            />
          </div>
          <button
            onClick={() => openLayer('member-invite')}
            className="flex items-center gap-1 whitespace-nowrap rounded-md bg-brand px-3 py-2 text-label font-bold text-white hover:bg-brand-dark"
          >
            <Icon name="person_add" size={17} />
            멤버 추가
          </button>
        </div>

        {tab === 'member' && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-y border-ink-200 bg-ink-50 text-left">
                <th className={th}>이름</th>
                <th className={th}>소속 · 직함</th>
                <th className={th}>이메일</th>
                <th className={th}>권한</th>
                <th className={th}>상태</th>
                <th className={th}>최근 접속</th>
                <th className={th} />
              </tr>
            </thead>
            <tbody>
              {shownMembers.map((m) => (
                <tr key={m.id} className="border-b border-ink-100 hover:bg-ink-50">
                  <td className={td}>
                    <span className="flex items-center gap-2">
                      <span className="flex size-7 flex-none items-center justify-center rounded-full border border-ink-200 bg-ink-100 text-xs2 font-extrabold text-ink-600">
                        {m.name[0]}
                      </span>
                      <span className="font-bold">{m.name}</span>
                      <span
                        className="size-1.5 rounded-full"
                        style={{ background: m.on ? '#16a34a' : '#cbd5e1' }}
                        title={m.on ? '온라인' : '오프라인'}
                      />
                    </span>
                  </td>
                  <td className={`${td} text-ink-600`}>{m.role}</td>
                  <td className={`${td} text-ink-600`}>{m.email}</td>
                  <td className={td}>
                    <span className="rounded-full border border-ink-200 bg-white px-2 py-0.5 text-tiny font-bold text-ink-600">
                      {m.perm}
                    </span>
                  </td>
                  <td className={td}>
                    <span
                      className="rounded-full px-2 py-0.5 text-mini font-extrabold"
                      style={
                        m.state === '활성'
                          ? { background: '#f0fdf4', color: '#15803d' }
                          : { background: '#fffbeb', color: '#b45309' }
                      }
                    >
                      {m.state}
                    </span>
                  </td>
                  <td className={`${td} text-ink-500`}>{m.last}</td>
                  <td className={td}>
                    <button className="rounded-[5px] border border-ink-300 bg-white px-2 py-1 text-xs2 font-bold text-ink-700 hover:bg-ink-100">
                      권한 변경
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'channel' && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-y border-ink-200 bg-ink-50 text-left">
                <th className={th}>채널명</th>
                <th className={th}>유형</th>
                <th className={th}>참여자</th>
                <th className={th}>메시지</th>
                <th className={th}>최근 활동</th>
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((c) => (
                <tr key={c.name} className="border-b border-ink-100 hover:bg-ink-50">
                  <td className={`${td} font-bold`}>{c.name}</td>
                  <td className={`${td} text-ink-600`}>{c.type}</td>
                  <td className={`${td} text-ink-600`}>{c.members}명</td>
                  <td className={`${td} text-ink-600`}>{c.msgs}건</td>
                  <td className={`${td} text-ink-500`}>{c.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'guest' && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-y border-ink-200 bg-ink-50 text-left">
                <th className={th}>이름</th>
                <th className={th}>소속</th>
                <th className={th}>이메일</th>
                <th className={th}>만료</th>
              </tr>
            </thead>
            <tbody>
              {GUESTS.map((g) => (
                <tr key={g.name} className="border-b border-ink-100 hover:bg-ink-50">
                  <td className={`${td} font-bold`}>{g.name}</td>
                  <td className={`${td} text-ink-600`}>{g.org}</td>
                  <td className={`${td} text-ink-600`}>{g.email}</td>
                  <td className={td}>
                    <span className="text-cap font-bold" style={{ color: g.color }}>
                      {g.expire}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'log' && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-y border-ink-200 bg-ink-50 text-left">
                <th className={th}>일시</th>
                <th className={th}>작업자</th>
                <th className={th}>구분</th>
                <th className={th}>내용</th>
              </tr>
            </thead>
            <tbody>
              {LOGS.map((l, i) => (
                <tr key={i} className="border-b border-ink-100 hover:bg-ink-50">
                  <td className={`${td} font-mono text-sm2 text-ink-500`}>{l.time}</td>
                  <td className={`${td} font-bold`}>{l.who}</td>
                  <td className={td}>
                    <span className="rounded-full bg-ink-200 px-2 py-0.5 text-mini font-bold text-ink-700">
                      {l.action}
                    </span>
                  </td>
                  <td className={`${td} text-ink-600`}>{l.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
