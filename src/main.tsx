import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* shadcn Tooltip은 Provider를 내장하지 않는다 — 루트에서 반드시 감싼다 */}
      <TooltipProvider delayDuration={200}>
        <App />
        <Toaster position="top-center" richColors />
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>,
)
