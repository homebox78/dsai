/**
 * ⚠️ 검수 전용 — 클라이언트 검수가 끝나면 삭제합니다.
 *    제거 명령: npm run remove-qa   (미리보기: npm run remove-qa -- --dry)
 */
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/stores/app-store'

/**
 * useState + 검수 프리셋 연동.
 * 검수 인덱스에서 항목을 열면 해당 키의 값으로 초기화되고,
 * 프리셋에 없는 키는 기본값으로 되돌아간다(항목 간 상태가 섞이지 않게).
 * ⚠️ 검수 전용 배선 — 납품 시 useState로 되돌리면 된다.
 */
export function useQaState<T>(key: string, initial: T) {
  const seq = useAppStore((s) => s.presetSeq)
  const pick = () => {
    const v = useAppStore.getState().preset[key]
    return v === undefined ? initial : (v as T)
  }
  const [value, setValue] = useState<T>(pick)
  const seen = useRef(seq)

  useEffect(() => {
    if (seen.current === seq) return
    seen.current = seq
    setValue(pick())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq])

  return [value, setValue] as const
}
