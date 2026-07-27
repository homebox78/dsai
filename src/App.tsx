import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from '@/pages/AppShell'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SetupPage } from '@/pages/setup/SetupPage'
import { hasEntered, setReturnHash } from '@/lib/session'

/**
 * 앱 진입점.
 *
 * 📖 소스 구조·관례는 `docs/개발자-가이드.md` 를 먼저 읽으면 빠르다.
 *
 * 라우트는 최소로 유지한다.
 * 앱 진입 후의 모든 이동은 페이지 전환이 아니라 셸 내부 뷰 교체 + 레이어(모달/시트)로 처리한다.
 * (사용자 지시 2026-07-25 — 화면 운영 원칙)
 *
 * 진입 동선: 처음 접속 → /login?tab=login → 로그인 → 작업목록(검수 인덱스) → 각 화면.
 */

/** 로그인 화면을 지나오지 않았으면 셸 대신 로그인으로 보낸다 */
function EntryGate() {
  if (!hasEntered()) {
    // 딥링크(#screen=...)로 바로 들어온 경우 로그인 후 그 화면으로 돌려보낸다
    setReturnHash(window.location.hash)
    return <Navigate to="/login?tab=login" replace />
  }
  return <AppShell />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/" element={<EntryGate />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
