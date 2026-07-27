#!/usr/bin/env node
/**
 * 검수 도구 일괄 제거 — 클라이언트 검수가 끝난 뒤 한 번만 실행한다.
 *
 *   npm run remove-qa            실제로 제거
 *   npm run remove-qa -- --dry   무엇이 바뀌는지만 출력 (파일은 그대로)
 *
 * 제거 대상
 *   · 작업 목록 화면 (검수 인덱스 116항목)   src/views/index/
 *   · 검수 플로팅 바                        src/components/common/QaBar.tsx
 *   · 검수 프리셋 배선                      src/lib/qa-state.ts · qa-open.ts · app-store 의 preset
 *   · useQaState → useState 환원            전 화면
 *   · 경로 영역의 "작업 목록" 진입 버튼
 *   · 사용자 메뉴의 개발용 바로가기 3종
 *
 * 남기는 것
 *   · 해시 딥링크(#screen=&modal=) — 실서비스에서도 쓰이는 기능
 *   · 로그인 진입 게이트 — 실제 인증으로 교체할 자리
 *
 * 실행 후 반드시 `npm run build` 로 확인하세요.
 */

import { readFile, writeFile, rm, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DRY = process.argv.includes('--dry')

const changed = []
const removed = []
const warned = []

const rel = (p) => path.relative(ROOT, p).replaceAll('\\', '/')

/**
 * 파일을 LF 로 정규화해서 편집한다.
 * (저장소에 CRLF·LF 가 섞여 있어 줄 단위 정규식이 어긋나는 것을 막는다)
 */
async function edit(file, fn) {
  const full = path.join(ROOT, file)
  if (!existsSync(full)) {
    warned.push(`없음: ${file}`)
    return
  }
  const raw = await readFile(full, 'utf8')
  const before = raw.replace(/\r\n/g, '\n')
  const after = fn(before)
  if (before === after) return
  if (!DRY) await writeFile(full, after, 'utf8')
  changed.push(file)
}

async function drop(target) {
  const full = path.join(ROOT, target)
  if (!existsSync(full)) {
    warned.push(`없음: ${target}`)
    return
  }
  if (!DRY) await rm(full, { recursive: true, force: true })
  removed.push(target)
}

/** useQaState('key', 초기값) → useState(초기값). 제네릭 형태도 처리 */
function toUseState(src) {
  let out = src.replace(
    // 제네릭에 Record<string, boolean> 처럼 > 가 중첩될 수 있어 ( 직전까지를 제네릭으로 본다
    /useQaState(<[^(]*>)?\(\s*(['"`])(?:[^'"`\\]|\\.)*?\2\s*,\s*/g,
    (_m, generic) => `useState${generic ?? ''}(`,
  )
  out = out.replace(/^import \{ useQaState \} from '@\/lib\/qa-state'\n/m, '')
  out = out.replace(/^[ \t]*\/\/ useQaState = useState \+ 검수 프리셋 연동.*\n/gm, '')

  // useState 를 쓰게 됐는데 import 가 없으면 채워 넣는다
  const usesState = /\buseState\s*[<(]/.test(out)
  const hasImport = /import \{[^}]*\buseState\b[^}]*\} from 'react'/.test(out)
  if (usesState && !hasImport) {
    if (/^import \{[^}]*\} from 'react'$/m.test(out)) {
      out = out.replace(/^import \{([^}]*)\} from 'react'$/m, (_m, names) => `import {${names.replace(/\s+$/, '')}, useState } from 'react'`)
    } else {
      out = `import { useState } from 'react'\n${out}`
    }
  }
  return out
}

async function walk(dir, hit) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) await walk(full, hit)
    else if (/\.tsx?$/.test(e.name)) await hit(full)
  }
}

async function main() {
  console.log(DRY ? '\n[미리보기] 실제 파일은 바꾸지 않습니다\n' : '\n검수 도구 제거를 시작합니다\n')

  // ── 1. 검수 전용 파일 삭제 ──
  await drop('src/views/index')
  await drop('src/components/common/QaBar.tsx')
  await drop('src/lib/qa-open.ts')
  await drop('src/lib/qa-state.ts')

  // ── 2. useQaState → useState ──
  const targets = []
  await walk(path.join(ROOT, 'src'), async (full) => {
    const src = await readFile(full, 'utf8')
    if (src.includes('useQaState')) targets.push(rel(full))
  })
  for (const f of targets) {
    if (f.startsWith('src/views/index') || f === 'src/lib/qa-state.ts') continue
    await edit(f, toUseState)
  }

  // ── 3. 앱 셸에서 검수 바 제거 ──
  await edit('src/pages/AppShell.tsx', (s) =>
    s.replace(/^import \{ QaBar \} from '@\/components\/common\/QaBar'\n/m, '').replace(/^[ \t]*<QaBar \/>\n/m, ''),
  )

  // ── 4. 화면 목록에서 작업 목록 제거 ──
  await edit('src/views/ScreenRouter.tsx', (s) =>
    s
      .replace(/^import \{ IndexView \} from '\.\/index\/IndexView'\n/m, '')
      .replace(/[ \t]*case 'index':\n[ \t]*return <IndexView \/>\n/, ''),
  )
  await edit('src/stores/app-store.ts', (s) =>
    s
      .replace(/^[ \t]*\| 'index'.*\n/m, '')
      .replace(/^[ \t]*\/\/ 로그인 직후 착지 화면.*\n/m, '')
      .replace(/^([ \t]*)screen: 'index',$/m, "$1screen: 'dash',"),
  )
  await edit('src/components/layout/Breadcrumb.tsx', (s) =>
    s
      .replace(/^[ \t]*index: '작업 목록',\n/m, '')
      .replace(/^[ \t]*\{ label: '작업 목록', onClick: \(\) => setScreen\('index'\) \},\n/m, ''),
  )
  await edit('src/lib/hash-sync.ts', (s) =>
    s
      .replace(/'index', /, '')
      .replace(/^[ \t]*const applyPreset = useAppStore\(\(s\) => s\.applyPreset\)\n/m, '')
      .replace(/^[ \t]*applyPreset\(\{ screen: sc \}\)\n/m, ''),
  )
  await edit('src/components/layout/MegaMenu.tsx', (s) =>
    s.replace(/^[ \t]*\{ label: '작업 목록 \(스토리보드 대비\)'[^\n]*\n/m, ''),
  )
  await edit('src/pages/auth/LoginPage.tsx', (s) => s.replace(/#screen=index/g, '#screen=dash'))
  await edit('src/pages/setup/SetupPage.tsx', (s) => s.replace(/#screen=index/g, '#screen=dash'))

  // ── 5. 스토어의 프리셋 배선 제거 ──
  await edit('src/stores/app-store.ts', (s) => {
    let out = s
    // preset 앞의 JSDoc 블록과 presetSeq 한 줄 주석을 함께 걷어낸다
    out = out.replace(/^[ \t]*\/\*\*\n(?:[ \t]*\*[^\n]*\n)*?[ \t]*\*\/\n(?=[ \t]*preset)/gm, '')
    out = out.replace(/^[ \t]*\/\*\* 프리셋이 새로 적용될 때마다[^\n]*\n/m, '')
    out = out.replace(/^[ \t]*preset: Record<string, unknown>\n/m, '')
    out = out.replace(/^[ \t]*presetSeq: number\n/m, '')
    out = out.replace(/^[ \t]*applyPreset: \(st: Record<string, unknown>\) => void\n/m, '')
    out = out.replace(/^[ \t]*preset: \{\},\n/m, '')
    out = out.replace(/^[ \t]*presetSeq: 0,\n/m, '')
    // applyPreset 구현 블록 전체 (마지막 줄은 `    }),` 로 끝난다)
    out = out.replace(/\n[ \t]*applyPreset: \(st\) =>[\s\S]*?\n[ \t]*\}\),\n/m, '\n')
    // 프리셋 전용 매핑 테이블(주석 포함)도 함께 제거
    out = out.replace(/^\/\*\* dc\.html 상태 키[^\n]*\n/m, '')
    out = out.replace(/^const CORE_KEYS[\s\S]*?^\}\n\n/m, '')
    return out
  })
  await edit('src/components/layout/SideMenu.tsx', (s) =>
    s.replace(/,\s*applyPreset \}/, ' }').replace(/^[ \t]*if \(tab\) applyPreset\(\{ settingTab: tab \}\)\n/m, ''),
  )

  // ── 6-0. 위 제거로 쓰이지 않게 된 변수 정리 ──
  await edit('src/components/layout/Breadcrumb.tsx', (s) =>
    s.replace('setDropdown, setScreen, setOverlay', 'setDropdown, setOverlay'),
  )
  await edit('src/components/layout/SideMenu.tsx', (s) =>
    s
      .replace('const go = (t: Target, tab?: string) => {', 'const go = (t: Target) => {')
      .replace(
        /^[ \t]*if \(t === 'settings'\) \{\n[ \t]*return openLayer\('settings'\)\n[ \t]*\}\n/m,
        "    if (t === 'settings') return openLayer('settings')\n",
      ),
  )

  // ── 6. 사용자 메뉴의 개발용 바로가기 제거 ──
  await edit('src/components/layout/dropdowns/UserDropdown.tsx', (s) =>
    s
      .replace(/\n[ \t]*const devItems[\s\S]*?\n[ \t]*\]\n/, '\n')
      .replace(/\n[ \t]*<div className="my-\[5px\] h-px bg-ink-100" \/>\n[ \t]*\{devItems\.map[\s\S]*?\n[ \t]*\)\)\}\n/, '\n'),
  )
  // 개발용 항목이 사라지면 setScreen 도 쓰이지 않는다
  await edit('src/components/layout/dropdowns/UserDropdown.tsx', (s) =>
    /setScreen\(/.test(s) ? s : s.replace('const { setScreen, closeDropdowns }', 'const { closeDropdowns }'),
  )

  // ── 결과 ──
  const say = (label, list) => {
    if (list.length) console.log(`${label} (${list.length})\n${list.map((x) => `  - ${x}`).join('\n')}`)
  }
  say('삭제한 파일', removed)
  say('수정한 파일', changed)
  say('⚠️ 확인 필요', warned)

  if (!DRY) {
    const leftovers = []
    await walk(path.join(ROOT, 'src'), async (full) => {
      const src = await readFile(full, 'utf8')
      for (const kw of ['useQaState', 'QaBar', 'applyPreset', '__qaOpen']) {
        if (src.includes(kw)) leftovers.push(`${rel(full)} → ${kw}`)
      }
    })
    console.log(
      leftovers.length
        ? `\n⚠️ 남은 참조 — 직접 확인하세요\n${leftovers.map((x) => `  - ${x}`).join('\n')}`
        : '\n남은 참조 없음',
    )
  }

  console.log(DRY ? '\n적용하려면 --dry 없이 다시 실행하세요\n' : '\n완료. `npm run build` 로 확인하세요\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
