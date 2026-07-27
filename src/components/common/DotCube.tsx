import { useEffect, useRef } from 'react'

/**
 * 점 격자로 만든 입체 큐브 — 인증 화면 좌측 브랜드 패널 배경.
 * 3차원 격자의 겉면(6면) 점을 원근 투영해 천천히 회전시킨다.
 * 라이브러리 없이 canvas 2D 로만 그린다 (three.js 등 의존성 추가 없음).
 */

/** 한 변의 점 개수 — 겉면만 쓰므로 실제 점 수는 N³ - (N-2)³ */
const N = 20
/** 원근 초점 거리 (클수록 왜곡이 약해진다) */
const FOCAL = 5.2
/** 마우스 밀어내기 반경(px)과 최대 밀림 거리(px) */
const PUSH_R = 120
const PUSH_R2 = PUSH_R * PUSH_R
const PUSH_MAX = 56

interface Point {
  x: number
  y: number
  z: number
}

/** 겉면(shell) 격자점만 생성 — 속을 비워야 반대편 면이 비쳐 보인다 */
function buildShell(): Point[] {
  const pts: Point[] = []
  const step = 2 / (N - 1)
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      for (let k = 0; k < N; k++) {
        const onShell = i === 0 || i === N - 1 || j === 0 || j === N - 1 || k === 0 || k === N - 1
        if (!onShell) continue
        pts.push({ x: -1 + i * step, y: -1 + j * step, z: -1 + k * step })
      }
    }
  }
  return pts
}

export function DotCube({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pts = buildShell()
    const COUNT = pts.length

    // 원본 좌표는 타입 배열로 펴 둔다 — 핫 루프에서 객체 프로퍼티 접근을 없앤다
    const bx = new Float32Array(COUNT)
    const by = new Float32Array(COUNT)
    const bz = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      bx[i] = pts[i].x
      by[i] = pts[i].y
      bz[i] = pts[i].z
    }

    /** 깊이 정렬용 인덱스 — 뒤→앞 순서로 그려야 겹침이 자연스럽다 */
    const order = new Uint16Array(COUNT)
    for (let i = 0; i < COUNT; i++) order[i] = i
    const pz = new Float32Array(COUNT)
    const sxArr = new Float32Array(COUNT)
    const syArr = new Float32Array(COUNT)
    /** 회전이 느려서 매 프레임 정렬할 필요가 없다 — 몇 프레임에 한 번만 */
    const SORT_EVERY = 3
    let frame = 0

    let w = 0
    let h = 0
    // 리사이즈 때만 갱신되는 배치 상수 — 매 프레임 다시 구하지 않는다
    let size = 0
    let ox = 0
    let oy = 0
    let fadeFrom = 0
    let fadeTo = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      size = Math.min(w, h) * 0.18
      ox = w * 0.72
      oy = h * 0.24
      // 아래쪽은 헤드라인에 닿기 전에 서서히 사라지게 한다
      fadeFrom = h * 0.38
      fadeTo = h * 0.58
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let t = 0

    // 포인터 추적 — 평소엔 스스로 돌다가, 마우스가 움직이면 그 방향으로 기울어 따라본다.
    // 캔버스는 pointer-events:none 이라 좌표는 window 에서 받는다.
    let targetTiltY = 0
    let targetTiltX = 0
    let tiltY = 0
    let tiltX = 0
    /** 마우스가 멈추면 서서히 원래 자전으로 돌아간다 */
    let lastMove = -Infinity
    /** 캔버스 좌표계의 포인터 위치 — 도트를 밀어내는 데 쓴다 */
    let mx = -9999
    let my = -9999
    /** 밀어내기 세기 0~1 (마우스가 멈추면 서서히 0) */
    let push = 0
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      if (!r.width || !r.height) return
      mx = e.clientX - r.left
      my = e.clientY - r.top
      // 큐브 중심(ox, oy) 기준 -1 ~ 1
      const nx = (mx - ox) / (r.width * 0.5)
      const ny = (my - oy) / (r.height * 0.5)
      targetTiltY = Math.max(-1, Math.min(1, nx)) * 0.95
      targetTiltX = Math.max(-1, Math.min(1, ny)) * 0.55
      lastMove = performance.now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const draw = () => {
      // 마우스가 1.2초 이상 멈춰 있으면 기울기를 0으로 풀어 자전만 남긴다
      const idle = performance.now() - lastMove > 1200
      const wantY = idle ? 0 : targetTiltY
      const wantX = idle ? 0 : targetTiltX
      // 지수 감쇠로 부드럽게 따라간다
      tiltY += (wantY - tiltY) * 0.06
      tiltX += (wantX - tiltX) * 0.06
      push += ((idle ? 0 : 1) - push) * 0.08

      // 회전: Y축 등속 자전 + 마우스 방향 기울기, X축 완만한 왕복
      const ay = t * 0.00022 + tiltY
      const ax = -0.42 + Math.sin(t * 0.00013) * 0.13 + tiltX
      const cy = Math.cos(ay)
      const sy = Math.sin(ay)
      const cx = Math.cos(ax)
      const sx = Math.sin(ax)
      const fadeSpan = fadeTo - fadeFrom

      // 회전 → 투영 → 화면 좌표까지 한 번에 (배열 순회를 늘리지 않는다)
      for (let i = 0; i < COUNT; i++) {
        // Y축 회전
        const x1 = bx[i] * cy - bz[i] * sy
        const z1 = bx[i] * sy + bz[i] * cy
        // X축 회전
        const y2 = by[i] * cx - z1 * sx
        const z2 = by[i] * sx + z1 * cx
        const scale = FOCAL / (FOCAL + z2)
        pz[i] = z2
        let px = ox + x1 * size * scale
        let py = oy + y2 * size * scale

        // 포인터 주변의 점은 바깥으로 밀려난다 (반경 안에서 거리에 반비례)
        if (push > 0.01) {
          const dx = px - mx
          const dy = py - my
          const d2 = dx * dx + dy * dy
          if (d2 < PUSH_R2 && d2 > 0.0001) {
            const d = Math.sqrt(d2)
            // 중심에 가까울수록 강하게 — 가장자리에서는 0으로 부드럽게 수렴
            const f = (1 - d / PUSH_R) ** 2 * PUSH_MAX * push
            px += (dx / d) * f
            py += (dy / d) * f
          }
        }
        sxArr[i] = px
        syArr[i] = py
      }

      // 정렬은 몇 프레임에 한 번 — 회전이 느려 중간 프레임은 이전 순서로 그려도 표가 안 난다
      if (frame % SORT_EVERY === 0) order.sort((a, b) => pz[b] - pz[a])
      frame++

      ctx.clearRect(0, 0, w, h)
      // ⚠️ canvas.width 를 쓰면 컨텍스트 상태가 초기화된다(fillStyle 이 검정으로 돌아감) → 매 프레임 지정
      ctx.fillStyle = '#dbeafe'
      // 어두운 테두리·헤일로가 생기지 않게: 그림자 끄고, 배경을 어둡게 만들 수 없는 가산 합성으로 그린다
      ctx.shadowBlur = 0
      ctx.shadowColor = 'transparent'
      ctx.globalCompositeOperation = 'lighter'

      for (let n = 0; n < COUNT; n++) {
        const i = order[n]
        const sxp = sxArr[i]
        const syp = syArr[i]
        if (sxp < -12 || sxp > w + 12 || syp < -12 || syp > h + 12) continue
        if (syp >= fadeTo) continue
        const fade = syp <= fadeFrom ? 1 : (fadeTo - syp) / fadeSpan

        const scale = FOCAL / (FOCAL + pz[i])
        // 깊이(-1 뒤 ~ 1 앞)를 0~1 로 정규화해 크기·투명도에 반영
        const d = (1 - pz[i]) * 0.5
        ctx.globalAlpha = (0.14 + d * 0.72) * fade
        // 경로 없이 fillRect — 1px 안팎 크기에서는 원과 구분되지 않으면서 훨씬 저렴하다
        const s2 = (0.34 + d * 0.58) * scale
        ctx.fillRect(sxp - s2, syp - s2, s2 * 2, s2 * 2)
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    if (reduced) {
      t = 3200
      draw()
    } else {
      let prev = performance.now()
      const loop = (now: number) => {
        t += now - prev
        prev = now
        draw()
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden />
}
