/**
 * 목업 파일 실물 생성기 — mocks/data.ts의 메타데이터(확장자·페이지 수·요약)에 맞는
 * 실제 PDF / XLSX / DOCX를 만들어 public/files/ 에 저장한다.
 * 문서 보기 탭이 이 실물 파일을 그대로 렌더한다.
 *
 * 실행: node scripts/gen-sample-files.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import * as XLSX from 'xlsx'
import { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'files')
fs.mkdirSync(outDir, { recursive: true })

const FONT_DIR = path.join(root, 'node_modules/pretendard/dist/public/static/alternative')
const regular = fs.readFileSync(path.join(FONT_DIR, 'Pretendard-Regular.ttf'))
const bold = fs.readFileSync(path.join(FONT_DIR, 'Pretendard-Bold.ttf'))

/* ── PDF ───────────────────────────────────────────── */

const A4 = [595.28, 841.89]

/**
 * @param {string} file 출력 파일명
 * @param {{title:string, subtitle:string, pages:number, sections:string[], body:(i:number)=>string[]}} spec
 */
async function makePdf(file, spec) {
  const pdf = await PDFDocument.create()
  pdf.registerFontkit(fontkit)
  const fR = await pdf.embedFont(regular)
  const fB = await pdf.embedFont(bold)

  pdf.setTitle(spec.title)
  pdf.setAuthor(spec.author ?? 'Amber Document Intelligence')
  pdf.setSubject(spec.subtitle)

  const ink = rgb(0.06, 0.09, 0.16)
  const muted = rgb(0.39, 0.45, 0.55)
  const brand = rgb(0.09, 0.31, 0.85)
  const line = rgb(0.886, 0.91, 0.941)

  for (let i = 0; i < spec.pages; i++) {
    const page = pdf.addPage(A4)
    const { width, height } = page.getSize()
    const M = 56
    let y = height - M

    if (i === 0) {
      // 표지
      page.drawRectangle({ x: 0, y: height - 210, width, height: 210, color: rgb(0.09, 0.31, 0.85) })
      page.drawText(spec.title, { x: M, y: height - 118, size: 22, font: fB, color: rgb(1, 1, 1) })
      page.drawText(spec.subtitle, { x: M, y: height - 148, size: 11, font: fR, color: rgb(0.85, 0.9, 1) })
      page.drawText('Amber Document Intelligence · 목업 샘플 문서', {
        x: M, y: height - 176, size: 9, font: fR, color: rgb(0.75, 0.83, 1),
      })
      y = height - 260

      page.drawText('목차', { x: M, y, size: 13, font: fB, color: ink })
      y -= 22
      spec.sections.forEach((s, si) => {
        page.drawText(`${si + 1}. ${s}`, { x: M + 6, y, size: 10.5, font: fR, color: ink })
        page.drawText(`${Math.min(spec.pages, si * 3 + 2)}`, { x: width - M - 20, y, size: 10.5, font: fR, color: muted })
        page.drawLine({
          start: { x: M, y: y - 8 }, end: { x: width - M, y: y - 8 }, thickness: 0.6, color: line,
        })
        y -= 24
      })
    } else {
      const section = spec.sections[(i - 1) % spec.sections.length]
      page.drawText(`${((i - 1) % spec.sections.length) + 1}. ${section}`, { x: M, y, size: 14, font: fB, color: ink })
      y -= 10
      page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 1.2, color: brand })
      y -= 26

      for (const paragraph of spec.body(i)) {
        const lines = wrap(paragraph, fR, 10.5, width - M * 2)
        for (const l of lines) {
          if (y < M + 40) break
          page.drawText(l, { x: M, y, size: 10.5, font: fR, color: ink })
          y -= 17
        }
        y -= 9
      }
    }

    // 머리말 · 꼬리말
    page.drawText(spec.title, { x: M, y: height - 26, size: 8, font: fR, color: rgb(0.72, 0.76, 0.83) })
    page.drawText(`${i + 1} / ${spec.pages}`, { x: width - M - 34, y: 28, size: 8.5, font: fR, color: muted })
    page.drawLine({ start: { x: M, y: 44 }, end: { x: width - M, y: 44 }, thickness: 0.6, color: line })
  }

  const bytes = await pdf.save()
  fs.writeFileSync(path.join(outDir, file), bytes)
  return bytes.length
}

/** 폰트 폭 기준 줄바꿈 (한글 포함) */
function wrap(text, font, size, maxWidth) {
  const words = text.split(' ')
  const out = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (font.widthOfTextAtSize(next, size) > maxWidth && cur) {
      out.push(cur)
      cur = w
    } else {
      cur = next
    }
  }
  if (cur) out.push(cur)
  return out
}

/* ── XLSX ──────────────────────────────────────────── */

function makeXlsx(file, sheets) {
  const wb = XLSX.utils.book_new()
  for (const [name, rows, colWidths] of sheets) {
    const ws = XLSX.utils.aoa_to_sheet(rows)
    if (colWidths) ws['!cols'] = colWidths.map((w) => ({ wch: w }))
    XLSX.utils.book_append_sheet(wb, ws, name)
  }
  XLSX.writeFile(wb, path.join(outDir, file))
}

/* ── DOCX ──────────────────────────────────────────── */

async function makeDocx(file, spec) {
  const children = [
    new Paragraph({ text: spec.title, heading: HeadingLevel.TITLE }),
    new Paragraph({ text: spec.subtitle, alignment: AlignmentType.LEFT }),
    new Paragraph({ text: '' }),
  ]
  for (const sec of spec.sections) {
    children.push(new Paragraph({ text: sec.title, heading: HeadingLevel.HEADING_1 }))
    for (const p of sec.paragraphs) children.push(new Paragraph({ text: p }))
    if (sec.table) {
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: sec.table.map(
            (row) =>
              new TableRow({
                children: row.map((cell) => new TableCell({ children: [new Paragraph(String(cell))] })),
              }),
          ),
        }),
      )
    }
    children.push(new Paragraph({ text: '' }))
  }
  const doc = new Document({ sections: [{ children }] })
  const buf = await Packer.toBuffer(doc)
  fs.writeFileSync(path.join(outDir, file), buf)
}

/* ── 파일별 콘텐츠 정의 (메타데이터와 1:1) ───────────── */

const lorem = (topic) => [
  `${topic}에 대한 당사의 관리 체계는 전사 환경경영 방침에 따라 수립되었으며, 매년 내부심사와 경영검토를 통해 유효성을 점검하고 있습니다.`,
  `측정 데이터는 사업장별로 월 단위 집계되며, 산정 방식은 온실가스 배출권 거래제 지침 및 ISO 14064 기준을 준용합니다. 산정 결과는 제3자 검증기관의 검증을 거쳐 확정됩니다.`,
  `본 항목과 관련하여 최근 3개년간 법규 위반 및 행정처분 사례는 없으며, 관련 인허가는 모두 유효 기간 내에 있습니다.`,
  `개선 계획: 향후 3년간 고효율 설비 교체와 재생에너지 조달 확대를 통해 원단위 배출량을 기준연도 대비 18% 감축하는 것을 목표로 합니다.`,
]

async function main() {
  const written = []

  // a1 · ISO 14001 인증서_2026.pdf · 12p
  written.push(['a1.pdf', await makePdf('a1.pdf', {
    title: 'ISO 14001 환경경영시스템 인증서',
    subtitle: '인증번호 KR-EMS-2026-0417 · 유효기간 2026.01.01 ~ 2029.12.31',
    author: '박지원',
    pages: 12,
    sections: ['인증 개요', '적용 범위', '심사 결과', '부적합 및 시정조치', '사후관리 계획', '부속 서류'],
    body: (i) => lorem('환경경영시스템 인증').concat([
      `인증 범위: 본사 및 3개 생산 사업장(화성·구미·울산)의 제품 설계, 제조, 출하 활동 전반. (본문 ${i}쪽)`,
    ]),
  })])

  // a2 · 온실가스 배출량 보고서_2025.pdf · 218p
  written.push(['a2.pdf', await makePdf('a2.pdf', {
    title: '2025 온실가스 배출량 보고서',
    subtitle: 'Scope 1·2·3 산정 결과 및 제3자 검증 의견 · 검증기관 한국품질재단',
    author: '이수진',
    pages: 218,
    sections: ['보고 개요', '조직 경계 및 산정 방법', 'Scope 1 직접 배출', 'Scope 2 간접 배출', 'Scope 3 기타 간접 배출', '배출 원단위 분석', '검증 의견', '부속 명세서'],
    body: (i) => lorem('온실가스 배출량 산정').concat([
      `총 배출량 128,450 tCO2eq (Scope 1 42,180 / Scope 2 61,240 / Scope 3 25,030). 전년 대비 4.2% 감소. (명세 ${i}쪽)`,
    ]),
  })])

  // a4 · 환경정책 선언문_국문영문.pdf · 6p
  written.push(['a4.pdf', await makePdf('a4.pdf', {
    title: '환경경영 방침 선언문',
    subtitle: '대표이사 서명 · 국문/영문 병기 · 2026.01.02 제정',
    author: '이수진',
    pages: 6,
    sections: ['선언문 (국문)', 'Declaration (English)', '실행 원칙', '이해관계자 소통'],
    body: () => [
      '당사는 사업 활동 전 과정에서 환경 영향을 최소화하고, 기후변화 대응을 경영의 핵심 과제로 삼는다.',
      '우리는 관련 법규 및 국제 기준을 준수하며, 자원 순환과 오염 예방을 위한 지속적 개선을 추진한다.',
      'We minimize environmental impacts across our value chain and treat climate action as a core management agenda.',
      '본 방침은 전 임직원과 협력사에 공표하며, 매년 이행 실적을 검토하여 필요 시 개정한다.',
    ],
  })])

  // a5 · 폐기물 처리 위탁계약_2026.pdf · 41p
  written.push(['a5.pdf', await makePdf('a5.pdf', {
    title: '지정폐기물 처리 위탁계약서',
    subtitle: '수탁자: (주)그린사이클 · 계약기간 2026.01.01 ~ 2026.12.31',
    author: '최민호',
    pages: 41,
    sections: ['계약 총칙', '위탁 대상 및 수량', '처리 방법 및 절차', '대금 및 지급 조건', '책임과 면책', '허가증 사본'],
    body: (i) => [
      '제3조(위탁 대상) 수탁자는 위탁자가 배출하는 지정폐기물(폐유, 폐산, 폐알칼리)을 관계 법령에 따라 적정 처리한다.',
      '제7조(처리 확인) 수탁자는 매월 처리 실적을 올바로시스템에 입력하고, 위탁자에게 처리확인서를 제출한다.',
      `첨부: 폐기물처리업 허가증 사본(허가번호 제2024-0139호), 보험 가입 증명서. (${i}쪽)`,
    ],
  })])

  // b1 · 윤리경영 행동강령_v2.pdf · 34p
  written.push(['b1.pdf', await makePdf('b1.pdf', {
    title: '윤리경영 행동강령 v2',
    subtitle: '아동·강제노동 금지, 차별 금지, 부패 방지 조항 포함 · 2026 개정',
    author: '김대성',
    pages: 34,
    sections: ['총칙', '인권 및 노동', '아동노동·강제노동 금지', '차별 및 괴롭힘 금지', '부패 방지', '신고 및 보호'],
    body: () => [
      '제5조(아동노동 금지) 회사와 협력사는 만 15세 미만 아동의 고용을 어떠한 경우에도 허용하지 않는다.',
      '제6조(강제노동 금지) 신분증 압수, 강제 예치금, 이동의 자유 제한 등 일체의 강제노동을 금지한다.',
      '제11조(부패 방지) 임직원은 직무와 관련하여 부당한 금품·향응을 주고받지 아니한다.',
      '제18조(신고자 보호) 신고자의 신원은 비밀로 보호되며, 신고를 이유로 불이익을 주지 아니한다.',
    ],
  })])

  // c2 · 공급업체 행동강령_서명본.pdf · 28p
  written.push(['c2.pdf', await makePdf('c2.pdf', {
    title: '공급업체 행동강령 서명본',
    subtitle: '주요 협력사 128개사 서명 완료 · 서명 확보율 92.8%',
    author: '우덕성',
    pages: 28,
    sections: ['적용 대상', '준수 항목', '점검 및 실사', '위반 시 조치', '서명 현황'],
    body: () => [
      '본 행동강령은 당사와 거래하는 모든 1차 협력사에 적용되며, 협력사는 자사의 하위 공급망에도 동일 수준을 요구한다.',
      '당사는 연 1회 서면 자가진단과 위험도 기반 현장 실사를 실시한다.',
      '중대한 위반이 확인된 경우 시정 요구 후 개선되지 않으면 거래를 제한할 수 있다.',
      '서명 현황: 대상 138개사 중 128개사 서명 완료(92.8%), 미서명 10개사는 2026년 3분기 내 확보 예정.',
    ],
  })])

  // c3 · NDA 표준양식_2026.pdf · 8p
  written.push(['c3.pdf', await makePdf('c3.pdf', {
    title: '비밀유지계약서(NDA) 표준양식',
    subtitle: '3자 비밀유지계약 표준 양식 · 법무팀 2026 개정',
    author: '김대성',
    pages: 8,
    sections: ['정의', '비밀유지 의무', '예외 사유', '기간 및 반환', '위반 시 책임'],
    body: () => [
      '제1조(정의) "비밀정보"란 일방이 상대방에게 서면·구두·전자적 형태로 제공하는 일체의 기술·영업 정보를 말한다.',
      '제2조(의무) 수령 당사자는 비밀정보를 목적 외로 사용하지 아니하며, 사전 서면 동의 없이 제3자에게 공개하지 아니한다.',
      '제4조(기간) 본 계약의 비밀유지 의무는 계약 종료일로부터 3년간 존속한다.',
    ],
  })])

  // a3 · 에너지 사용 실적_월별.xlsx
  const months = Array.from({ length: 12 }, (_, i) => `2026-${String(i + 1).padStart(2, '0')}`)
  const sites = ['화성사업장', '구미사업장', '울산사업장']
  const energyRows = [['월', '사업장', '전력(MWh)', '도시가스(㎥)', '경유(L)', 'tCO2eq']]
  months.forEach((m, mi) => {
    sites.forEach((s, si) => {
      const power = 1200 + si * 380 + mi * 12
      const gas = 42000 + si * 9000 - mi * 210
      const oil = 3100 + si * 640
      energyRows.push([m, s, power, gas, oil, +(power * 0.4594 + gas * 0.002 + oil * 0.0027).toFixed(1)])
    })
  })
  const summaryRows = [
    ['구분', '2024', '2025', '2026(누적)'],
    ['전력(MWh)', 52400, 50120, 48960],
    ['도시가스(㎥)', 1512000, 1488000, 1451000],
    ['원단위(tCO2eq/억원)', 3.42, 3.18, 2.96],
  ]
  makeXlsx('a3.xlsx', [
    ['월별 실적', energyRows, [10, 14, 12, 14, 10, 10]],
    ['연간 요약', summaryRows, [22, 12, 12, 14]],
  ])
  written.push(['a3.xlsx', fs.statSync(path.join(outDir, 'a3.xlsx')).size])

  // b2 · 안전보건 교육 이수 내역_2025.xlsx
  const eduRows = [['사번', '성명', '사업장', '과정명', '교육일', '이수시간', '이수여부']]
  const courses = ['정기 안전보건교육', '관리감독자 교육', '특별안전교육(화학물질)', '신규채용자 교육']
  for (let i = 1; i <= 60; i++) {
    eduRows.push([
      `2025${String(i).padStart(4, '0')}`,
      `직원${i}`,
      sites[i % 3],
      courses[i % 4],
      `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
      i % 4 === 2 ? 16 : 6,
      i % 53 === 0 ? '미이수' : '이수',
    ])
  }
  makeXlsx('b2.xlsx', [
    ['이수 내역', eduRows, [12, 10, 14, 24, 12, 10, 10]],
    ['이수율 요약', [
      ['사업장', '대상 인원', '이수 인원', '이수율'],
      ['화성사업장', 420, 414, '98.6%'],
      ['구미사업장', 268, 262, '97.8%'],
      ['울산사업장', 196, 193, '98.5%'],
      ['전사', 884, 869, '98.2%'],
    ], [16, 12, 12, 10]],
  ])
  written.push(['b2.xlsx', fs.statSync(path.join(outDir, 'b2.xlsx')).size])

  // a6 · 용수 사용 및 재이용 실적.docx
  await makeDocx('a6.docx', {
    title: '용수 사용 및 재이용 실적',
    subtitle: '취수량·방류량·재이용률 3개년 추이 (2024~2026) · 작성 박지원',
    sections: [
      {
        title: '1. 개요',
        paragraphs: [
          '본 보고서는 전 사업장의 용수 사용량과 폐수 재이용 실적을 집계한 것으로, 에코바디스 평가의 환경 영역 증빙으로 활용된다.',
          '집계 범위는 화성·구미·울산 3개 사업장이며, 상수·지하수·재이용수를 구분하여 산정하였다.',
        ],
      },
      {
        title: '2. 3개년 실적',
        paragraphs: ['단위: 천 톤(千 t), 재이용률 = 재이용수 / 총 취수량'],
        table: [
          ['구분', '2024', '2025', '2026'],
          ['총 취수량', '1,842', '1,761', '1,694'],
          ['방류량', '1,236', '1,148', '1,079'],
          ['재이용수', '406', '452', '498'],
          ['재이용률', '22.0%', '25.7%', '29.4%'],
        ],
      },
      {
        title: '3. 개선 활동',
        paragraphs: [
          '2025년 구미사업장에 RO 농축수 회수 설비를 도입하여 연간 46천 톤의 용수를 절감하였다.',
          '2026년에는 울산사업장 냉각수 순환 계통 개선을 통해 재이용률 32% 달성을 목표로 한다.',
        ],
      },
    ],
  })
  written.push(['a6.docx', fs.statSync(path.join(outDir, 'a6.docx')).size])

  // b3 · 고충처리 및 신고채널 운영보고.docx
  await makeDocx('b3.docx', {
    title: '고충처리 및 신고채널 운영보고',
    subtitle: '2026 상반기 · 접수 12건 처리 결과 · 작성 이수진',
    sections: [
      {
        title: '1. 운영 개요',
        paragraphs: [
          '당사는 임직원과 협력사가 익명으로 신고할 수 있는 온라인 채널과 외부 위탁 핫라인을 함께 운영한다.',
          '접수된 사안은 감사팀이 접수 후 3영업일 이내 조사에 착수하며, 신고자 보호 원칙을 준수한다.',
        ],
      },
      {
        title: '2. 접수 및 처리 현황',
        paragraphs: ['처리 기간 평균 14.2일, 종결률 100%'],
        table: [
          ['유형', '접수', '조치 완료', '평균 처리일'],
          ['직장 내 괴롭힘', '4', '4', '17'],
          ['부정·비리', '3', '3', '12'],
          ['안전보건', '3', '3', '9'],
          ['기타', '2', '2', '11'],
        ],
      },
      {
        title: '3. 후속 조치',
        paragraphs: [
          '확인된 사안에 대해 징계 2건, 제도 개선 3건을 시행하였다.',
          '하반기에는 협력사 대상 신고채널 안내를 확대하고, 접수 채널 접근성을 개선할 계획이다.',
        ],
      },
    ],
  })
  written.push(['b3.docx', fs.statSync(path.join(outDir, 'b3.docx')).size])

  // c1 · 표준 공급계약서_v3.docx (218p 분량 → 조항 다수)
  const clauses = [
    ['제1조 (목적)', '본 계약은 갑이 을에게 물품의 제조·납품을 위탁하고, 이에 관한 권리·의무를 정함을 목적으로 한다.'],
    ['제2조 (계약 물품)', '계약 물품의 규격·수량·단가는 별지 1의 발주서에 따른다.'],
    ['제3조 (납품 및 검수)', '을은 발주서에 명시된 납기까지 납품하며, 갑은 도착 후 7일 이내 검수한다.'],
    ['제4조 (대금 지급)', '갑은 검수 완료 후 익월 말일까지 대금을 지급한다. 지연 시 연 6%의 지연이자를 가산한다.'],
    ['제5조 (품질 보증)', '을은 납품일로부터 24개월간 품질을 보증하며, 하자 발생 시 무상으로 교체·수리한다.'],
    ['제6조 (비밀유지)', '양 당사자는 본 계약과 관련하여 알게 된 상대방의 영업비밀을 제3자에게 누설하지 아니한다.'],
    ['제7조 (지식재산권)', '본 계약의 이행 과정에서 발생한 지식재산권의 귀속은 별도 서면 합의에 따른다.'],
    ['제8조 (준법 및 윤리)', '을은 갑의 공급업체 행동강령을 준수하며, 아동노동·강제노동을 사용하지 아니한다.'],
    ['제9조 (안전보건)', '을은 작업 현장에서 관계 법령이 정한 안전보건 기준을 준수한다.'],
    ['제10조 (권리·의무의 양도 금지)', '당사자는 상대방의 사전 서면 동의 없이 계약상 지위를 제3자에게 양도할 수 없다.'],
    ['제11조 (불가항력)', '천재지변 등 불가항력으로 인한 이행 지연에 대하여는 책임을 지지 아니한다.'],
    ['제12조 (계약의 해지)', '일방 당사자가 본 계약상 의무를 중대하게 위반하고 시정 요구 후 30일 내 시정하지 아니하는 경우, 상대방은 서면 통지로써 본 계약을 해지할 수 있다.'],
    ['제13조 (손해배상)', '계약 위반으로 손해가 발생한 경우 귀책 당사자는 그 손해를 배상한다. 배상액 산정은 별표 3에 따른다.'],
    ['제14조 (분쟁 해결)', '본 계약에 관한 분쟁은 갑의 본점 소재지 관할 법원을 제1심 관할로 한다.'],
  ]
  await makeDocx('c1.docx', {
    title: '표준 공급계약서 v3',
    subtitle: '법무 검토 완료 · 해지(제12조)·손해배상(제13조) 조항 개정본 · 작성 김대성',
    sections: [
      {
        title: '개정 요약',
        paragraphs: [
          'v3 개정 사항: 해지 사유의 시정 기간을 15일에서 30일로 연장하고, 손해배상 예정액 산정 기준을 별표 3으로 명문화하였다.',
        ],
        table: [
          ['조항', 'v2', 'v3'],
          ['제12조 해지', '시정 기간 15일', '시정 기간 30일'],
          ['제13조 배상', '실손해 배상', '별표 3 산정 기준 적용'],
        ],
      },
      ...clauses.map(([t, p]) => ({ title: t, paragraphs: [p, '본 조항의 해석에 관하여 다툼이 있는 경우 당사자는 신의성실의 원칙에 따라 협의한다.'] })),
      {
        title: '[별표 3] 손해배상 예정액 산정 기준',
        paragraphs: ['지연배상금 = 계약금액 × 지연일수 × 1.5/1000'],
        table: [
          ['구분', '기준', '상한'],
          ['납기 지연', '1일당 계약금액의 1.5/1000', '계약금액의 10%'],
          ['품질 불량', '교체 비용 실비', '계약금액의 20%'],
          ['비밀유지 위반', '실손해 배상', '제한 없음'],
        ],
      },
    ],
  })
  written.push(['c1.docx', fs.statSync(path.join(outDir, 'c1.docx')).size])

  console.log('생성 완료:')
  for (const [f, size] of written) {
    console.log(`  ${f.padEnd(12)} ${(Number(size) / 1024).toFixed(0)}KB`)
  }
}

main()
