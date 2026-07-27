#!/usr/bin/env node
/**
 * 납품 패키지 생성 — 개발 부산물을 뺀 정리 사본을 만든다.
 *
 *   node scripts/prepare-handover.mjs
 *   node scripts/prepare-handover.mjs --with-delivery      delivery/ 원본도 포함
 *   node scripts/prepare-handover.mjs --out ../납품본        출력 위치 지정
 *
 * 원본 저장소는 건드리지 않는다. 제외 규칙은 docs/정리-제거-대상.md 와 같다.
 */

import { cp, mkdir, rm, stat, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const args = process.argv.slice(2)
const withDelivery = args.includes('--with-delivery')
const outIdx = args.indexOf('--out')
const OUT = path.resolve(ROOT, outIdx >= 0 ? args[outIdx + 1] : '../amber-front-mockup')

/** 통째로 제외할 최상위 항목 */
const EXCLUDE_DIRS = new Set([
  'node_modules', // npm install 로 복원
  'dist', // npm run build 로 재생성
  '.git', // 저장소 이력
  '.playwright-mcp', // 검수 중 생성된 스크린샷·로그
  '.claude', // AI 코딩 도구 설정
  '.agents',
  '.vscode', // 개인 에디터 설정
  'myDev', // ⚠️ 개발자 개인 노트 서브모듈
  ...(withDelivery ? [] : ['delivery']), // 클라이언트가 준 원본 자료
])

/** 제외할 최상위 파일 */
const EXCLUDE_FILES = new Set([
  'userdd.png',
  'skills-lock.json',
  '.gitmodules',
  'README.md', // 내부 계획·이력이 섞여 있어 고객용 표지로 새로 만든다
])

/** 확장자 기준 제외 (임시 스크린샷·로그) */
const EXCLUDE_EXT = new Set(['.log'])

/**
 * 고객에게 전달할 문서만 화이트리스트로 지정한다.
 * 나머지(작업 이력·QA 원본·납품 준비 메모·일정 추정)는 내부 문서라 패키지에서 뺀다.
 */
const DOCS_ALLOW = new Set([
  '산출물-명세서.md',
  '품질검증-보고서.md',
  '개발자-가이드.md',
  '용어집.md',
])

const human = (n) => (n > 1 << 20 ? `${(n / (1 << 20)).toFixed(1)}MB` : `${Math.round(n / 1024)}KB`)

/** 디렉터리 총 용량 */
async function dirSize(p) {
  let total = 0
  for (const e of await readdir(p, { withFileTypes: true })) {
    const full = path.join(p, e.name)
    if (e.isDirectory()) total += await dirSize(full)
    else total += (await stat(full)).size
  }
  return total
}

async function main() {
  // 출력 폴더가 저장소 안이면 자기 자신을 복사하게 되므로 막는다
  const rel = path.relative(ROOT, OUT)
  if (rel && !rel.startsWith('..') && !path.isAbsolute(rel)) {
    console.error(`출력 위치는 저장소 바깥이어야 합니다: ${OUT}`)
    console.error('예) node scripts/prepare-handover.mjs --out ../amber-front-mockup')
    process.exit(1)
  }

  if (existsSync(OUT)) {
    console.log(`기존 출력 폴더를 비웁니다: ${OUT}`)
    await rm(OUT, { recursive: true, force: true })
  }
  await mkdir(OUT, { recursive: true })

  const entries = await readdir(ROOT, { withFileTypes: true })
  const copied = []
  const skipped = []

  for (const e of entries) {
    const name = e.name
    if (e.isDirectory() ? EXCLUDE_DIRS.has(name) : EXCLUDE_FILES.has(name) || EXCLUDE_EXT.has(path.extname(name))) {
      skipped.push(name)
      continue
    }
    // scripts 는 고객에게 필요한 것만 (납품 패키지 스크립트는 내부용)
    if (name === 'scripts') {
      await mkdir(path.join(OUT, 'scripts'), { recursive: true })
      for (const f of await readdir(path.join(ROOT, 'scripts'))) {
        if (f === 'prepare-handover.mjs') skipped.push('scripts/prepare-handover.mjs') // 납품 준비용(내부)
        else await cp(path.join(ROOT, 'scripts', f), path.join(OUT, 'scripts', f))
      }
      copied.push('scripts (샘플 문서 생성)')
      continue
    }

    // docs 는 고객 전달 문서만 골라 복사한다
    if (name === 'docs') {
      await mkdir(path.join(OUT, 'docs'), { recursive: true })
      for (const f of await readdir(path.join(ROOT, 'docs'))) {
        if (DOCS_ALLOW.has(f)) await cp(path.join(ROOT, 'docs', f), path.join(OUT, 'docs', f))
        else skipped.push(`docs/${f}`)
      }
      copied.push('docs (고객 전달 4종)')
      continue
    }

    await cp(path.join(ROOT, name), path.join(OUT, name), { recursive: true })
    copied.push(name)
  }

  // 설계서 구버전은 최신본만 남긴다 (delivery 를 포함한 경우)
  const uploads = path.join(OUT, 'delivery', 'uploads')
  if (withDelivery && existsSync(uploads)) {
    for (const f of await readdir(uploads)) {
      if (f.endsWith('.pdf') && !f.includes('2026.07.19')) {
        await rm(path.join(uploads, f))
        skipped.push(`delivery/uploads/${f}`)
      }
    }
  }

  // 고객용 표지 README (저장소 README 는 내부 계획이 섞여 있어 쓰지 않는다)
  const cover = [
    '# Amber Document Intelligence — 프론트엔드 목업',
    '',
    '「Amber UIX 설계서 V0.1 (2026.07.19)」 기준으로 제작한 프론트 오피스 화면 일체입니다.',
    '백엔드·데이터베이스·실제 AI 연동은 범위에 포함되지 않는 **목업**입니다.',
    '',
    '---',
    '',
    '## 실행',
    '',
    '```bash',
    'npm install      # 최초 1회',
    'npm run dev      # 개발 서버 → http://localhost:5373',
    'npm run build    # 정적 배포본 → dist/',
    '```',
    '',
    'Node 20 이상 권장. 별도 환경변수·API 키가 필요 없습니다.',
    '',
    '## 검수 방법',
    '',
    '1. `http://localhost:5373/` 접속 → 로그인 화면 (아무 값이나 입력해도 통과)',
    '2. 로그인하면 **작업 목록**(설계서 대비 제작 현황 116항목)이 열립니다',
    '3. 각 행의 **[열기]** 를 누르면 해당 화면·모달·시트가 그 상태 그대로 열립니다',
    '4. 우하단 **검수 바** `‹ ›` 로 항목을 순서대로 넘겨볼 수 있습니다',
    '5. 헤더 우측 **[작업 목록]** 으로 언제든 목록으로 돌아옵니다',
    '',
    '## 문서',
    '',
    '| 문서 | 내용 |',
    '|---|---|',
    '| [docs/산출물-명세서.md](docs/산출물-명세서.md) | 산출물 목록 · **폴더 구조 전체** · 화면/레이어 목록 · 동작 범위 |',
    '| [docs/품질검증-보고서.md](docs/품질검증-보고서.md) | 검증 방법·결과 · 설계서 63쪽 대조 · **잔여 협의 항목** |',
    '| [docs/개발자-가이드.md](docs/개발자-가이드.md) | 소스 구조 · 개발 관례 · 확장 방법 (개발팀용) |',
    '| [docs/용어집.md](docs/용어집.md) | 영문 시안 → 한글 표기 확정 |',
    '',
    '## 검수가 끝나면',
    '',
    '작업 목록과 우하단 검수 바는 **검수용 임시 도구**입니다. 아래 한 줄로 관련 코드가 모두 제거됩니다.',
    '',
    '```bash',
    'npm run remove-qa -- --dry   # 무엇이 바뀌는지 미리보기',
    'npm run remove-qa            # 실제 제거',
    'npm run build                # 확인',
    '```',
    '',
    '제거 후에는 로그인하면 대시보드로 바로 들어갑니다. 자세한 범위는 산출물 명세서 9장을 참고하세요.',
    '',
    '## 알아두실 점',
    '',
    '- 로그인은 화면만 갖춘 형태로, 실제 인증은 수행하지 않습니다',
    '- AI 응답과 OCR·RAG 처리는 **연출**이며 실제 모델을 호출하지 않습니다',
    '- 화면에서 추가·수정한 데이터는 브라우저 메모리에만 반영되어 **새로고침 시 초기화**됩니다',
    '- 문서 보기는 예외적으로 **실제 파일**(PDF·XLSX·DOCX 12종)을 렌더링합니다',
    '',
  ].join('\n')
  await writeFile(path.join(OUT, 'README.md'), cover, 'utf8')

  const size = await dirSize(OUT)
  console.log('\n납품 패키지 생성 완료')
  console.log(`  위치: ${OUT}`)
  console.log(`  용량: ${human(size)} (node_modules 제외)`)
  console.log(`  포함: ${copied.sort().join(', ')}`)
  console.log(`  제외: ${skipped.sort().join(', ')}`)
  console.log('\n다음 단계 — 사본에서 npm install && npm run build 통과 확인 후 전달\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
