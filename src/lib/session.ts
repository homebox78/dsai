/**
 * 진입 게이트 — 처음 접속하면 항상 로그인 화면부터 보여준다.
 *
 * 실제 인증은 없다(DB 미연결). 브라우저 탭 단위(sessionStorage)로
 * "로그인 화면을 한 번 지나왔는지"만 기억해, 클라이언트 검수 동선을
 * 로그인 → 작업목록 → 각 화면 순서로 고정한다.
 * 탭을 새로 열거나 로그아웃하면 다시 로그인 화면부터 시작한다.
 */

const ENTERED = 'amber.entered'
const RETURN = 'amber.returnHash'

export const hasEntered = () => {
  try {
    return sessionStorage.getItem(ENTERED) === '1'
  } catch {
    // 시크릿 모드 등 sessionStorage 차단 환경에서는 게이트를 열어둔다
    return true
  }
}

export const markEntered = () => {
  try {
    sessionStorage.setItem(ENTERED, '1')
  } catch {
    /* 무시 */
  }
}

export const clearEntered = () => {
  try {
    sessionStorage.removeItem(ENTERED)
    sessionStorage.removeItem(RETURN)
  } catch {
    /* 무시 */
  }
}

/** 로그인 전에 열려던 딥링크 해시를 기억해 뒀다가 로그인 후 그대로 복원한다 */
export const setReturnHash = (hash: string) => {
  try {
    if (hash && hash !== '#') sessionStorage.setItem(RETURN, hash)
  } catch {
    /* 무시 */
  }
}

export const takeReturnHash = () => {
  try {
    const v = sessionStorage.getItem(RETURN)
    sessionStorage.removeItem(RETURN)
    return v ?? ''
  } catch {
    return ''
  }
}
