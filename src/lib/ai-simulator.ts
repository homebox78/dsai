import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 목업용 AI 연출 유틸.
 * 실제 모델 호출 없이 "생각하고 → 흘려쓰는" 느낌만 재현한다.
 */

/** 문자열을 한 글자씩 흘려쓰는 훅. */
export function useTypewriter(speedMs = 18) {
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const timer = useRef<number | null>(null)

  const stop = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current)
      timer.current = null
    }
    setTyping(false)
  }, [])

  const start = useCallback(
    (full: string, onDone?: () => void) => {
      stop()
      setText('')
      setTyping(true)
      let i = 0
      timer.current = window.setInterval(() => {
        i += 1
        setText(full.slice(0, i))
        if (i >= full.length) {
          stop()
          onDone?.()
        }
      }, speedMs)
    },
    [speedMs, stop],
  )

  useEffect(() => stop, [stop])

  return { text, typing, start, stop }
}

export interface ProcessStep {
  label: string
  /** 0~100 */
  value: number
  done: boolean
  detail?: string
}

/**
 * 파일 처리(OCR → 메타 → 청킹 → RAG 색인) 같은 다단계 진행률 시뮬레이터.
 * 스토리보드 p61 "AI 데이터 처리시 상태" 카드에 사용.
 */
export function useStepProgress(labels: string[], tickMs = 260) {
  const [steps, setSteps] = useState<ProcessStep[]>(() =>
    labels.map((label) => ({ label, value: 0, done: false })),
  )
  const [running, setRunning] = useState(false)
  const timer = useRef<number | null>(null)

  const stop = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current)
      timer.current = null
    }
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    stop()
    setSteps(labels.map((label) => ({ label, value: 0, done: false })))
  }, [labels, stop])

  const start = useCallback(
    (onDone?: () => void) => {
      stop()
      setSteps(labels.map((label) => ({ label, value: 0, done: false })))
      setRunning(true)
      let idx = 0
      timer.current = window.setInterval(() => {
        setSteps((prev) => {
          if (idx >= prev.length) return prev
          const next = prev.map((s, i) => ({ ...s, ...(i === idx ? { value: Math.min(100, s.value + 12 + Math.round(Math.random() * 16)) } : null) }))
          if (next[idx].value >= 100) {
            next[idx].done = true
            idx += 1
            if (idx >= next.length) {
              stop()
              onDone?.()
            }
          }
          return next
        })
      }, tickMs)
    },
    [labels, stop, tickMs],
  )

  useEffect(() => stop, [stop])

  const overall = Math.round(steps.reduce((a, s) => a + s.value, 0) / Math.max(1, steps.length))

  return { steps, overall, running, start, stop, reset }
}

/** 목업 AI 답변 사전 — 질문 키워드로 고른다. */
const cannedAnswers: { match: RegExp; body: string; sources?: { fileName: string; page: number }[] }[] = [
  {
    match: /온실가스|탄소|배출/,
    body: '온실가스 관련 근거는 「3분기_환경성과_보고서_v2.pdf」 7페이지에 있습니다. 월별 스코프 1·2 배출량 집계표가 정리되어 있고, 2030년 30% 감축 목표는 4페이지에 명시되어 있습니다.',
    sources: [
      { fileName: '3분기_환경성과_보고서_v2.pdf', page: 7 },
      { fileName: '3분기_환경성과_보고서_v2.pdf', page: 4 },
    ],
  },
  {
    match: /인권|아동|강제노동/,
    body: '「인권정책_전문.pdf」 3페이지에 아동노동·강제노동 전면 금지 조항이 있습니다. 협력사에도 동일 기준을 요구한다는 내용이 5페이지에 이어집니다.',
    sources: [{ fileName: '인권정책_전문.pdf', page: 3 }],
  },
  {
    match: /안전|교육/,
    body: '「안전보건교육_실시기록_2025.pdf」에 2025년 전 임직원 교육 이수 기록이 있습니다. 다만 이 파일은 아직 OCR 처리 중이라 본문 검색 정확도가 낮을 수 있습니다.',
    sources: [{ fileName: '안전보건교육_실시기록_2025.pdf', page: 1 }],
  },
  {
    match: /인증|ISO/,
    body: 'ISO 14001 환경경영시스템 인증서를 보유하고 있으며 유효기간은 2027년 5월 21일까지입니다.',
    sources: [{ fileName: 'ISO14001_인증서.pdf', page: 1 }],
  },
  {
    match: /협력사|공급망|실사/,
    body: '「협력사_실사결과.xlsx」에 1차 협력사 120곳의 ESG 실사 결과가 정리되어 있습니다. 등급별 분포와 미완료 업체 목록을 확인할 수 있습니다.',
    sources: [{ fileName: '협력사_실사결과.xlsx', page: 1 }],
  },
]

export function answerFor(question: string) {
  const hit = cannedAnswers.find((c) => c.match.test(question))
  if (hit) return { body: hit.body, sources: hit.sources ?? [] }
  return {
    body: '이 프로젝트에 색인된 문서 1,284건에서 관련 내용을 찾았습니다. 「2026 ESG 성과보고서.pdf」 12페이지의 환경 성과 및 지속가능경영 활동 항목이 가장 근접합니다. 더 구체적인 키워드를 주시면 범위를 좁혀 찾아드릴게요.',
    sources: [{ fileName: '2026 ESG 성과보고서.pdf', page: 12 }],
  }
}
