import { useEffect, useState } from 'react'

/**
 * 반응형 규칙 — 시안 실측값 그대로.
 * 데스크톱 기준(1240px 이상 권장). 1240/1040px 미만에서는 보조 패널이 자동으로 접힌다.
 */
export function useWinW() {
  const [w, setW] = useState(() => (typeof window === 'undefined' ? 1600 : window.innerWidth))
  useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener('resize', on)
    on()
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}

export function useLayoutMetrics() {
  const w = useWinW()
  const narrow = w < 1240
  const veryNarrow = w < 1040
  return {
    w,
    narrow,
    veryNarrow,
    /** 헤더 검색: 1150 미만이면 아이콘만 */
    searchWide: w >= 1150,
    searchW: w >= 1150 ? 250 : 34,
    /** 헤더 프로필: 1050 미만이면 아바타만 */
    profileWide: w >= 1050,
    /** 화면별 최소 폭 */
    storeRowMin: narrow ? 'auto' : '1176px',
    chatRowMin: narrow ? 'auto' : '1010px',
    taskRowMin: narrow ? 'auto' : '1010px',
    contentMin: veryNarrow ? '280px' : '370px',
    /** 보조 패널 자동 접힘 */
    autoHideList: veryNarrow,
    autoHideZone: veryNarrow,
    autoHideBot: narrow,
  }
}
