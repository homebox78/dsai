import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from '@/pages/AppShell'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SetupPage } from '@/pages/setup/SetupPage'

/**
 * 라우트는 최소로 유지한다.
 * 앱 진입 후의 모든 이동은 페이지 전환이 아니라 셸 내부 뷰 교체 + 레이어(모달/시트)로 처리한다.
 * (사용자 지시 2026-07-25 — 화면 운영 원칙)
 */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/" element={<AppShell />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
