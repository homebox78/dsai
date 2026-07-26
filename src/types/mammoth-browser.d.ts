/** mammoth 브라우저 번들 타입 선언 — docx → HTML 변환에 사용 */
declare module 'mammoth/mammoth.browser' {
  export function convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<{
    value: string
    messages: unknown[]
  }>
}
