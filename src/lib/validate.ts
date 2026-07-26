/**
 * 폼 검증 규칙 — 모든 입력에 공통 적용.
 * 목업이라 서버 검증은 없지만, 필수·형식·길이는 화면에서 즉시 알려준다.
 */

export type Validator = (value: string) => string | null

export const required =
  (label: string): Validator =>
  (v) =>
    v.trim() ? null : `${label}을(를) 입력해주세요`

export const minLen =
  (n: number, label = '값'): Validator =>
  (v) =>
    !v.trim() || v.trim().length >= n ? null : `${label}은(는) ${n}자 이상 입력해주세요`

export const maxLen =
  (n: number, label = '값'): Validator =>
  (v) =>
    v.trim().length <= n ? null : `${label}은(는) ${n}자까지 입력할 수 있습니다`

export const email: Validator = (v) =>
  !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : '이메일 형식이 올바르지 않습니다'

/** 여러 이메일을 쉼표로 구분해 입력하는 필드 */
export const emailList: Validator = (v) => {
  if (!v.trim()) return null
  const bad = v
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .find((x) => !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x))
  return bad ? `이메일 형식이 올바르지 않습니다: ${bad}` : null
}

export const bizNo: Validator = (v) =>
  !v.trim() || /^\d{3}-?\d{2}-?\d{5}$/.test(v.trim()) ? null : '사업자등록번호는 000-00-00000 형식입니다'

/** 파일·폴더 이름에서 금지하는 문자 */
export const safeName: Validator = (v) =>
  !v.trim() || !/[\\/:*?"<>|]/.test(v) ? null : '이름에 \\ / : * ? " < > | 는 쓸 수 없습니다'

export const runRules = (value: string, rules: Validator[]) => {
  for (const rule of rules) {
    const msg = rule(value)
    if (msg) return msg
  }
  return null
}
