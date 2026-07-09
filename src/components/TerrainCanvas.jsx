import { useEffect, useRef } from 'react'

// Procedural "satellite / drone imagery" renderer. Seeded, deterministic —
// mottled earth, fields, scrub, ridge, roads, structures, vehicles, people —
// so photo/video stages read like real overhead footage without shipping any
// real imagery.

const W = 1024
const H = 720

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const PALETTES = {
  photo: {
    base: '#3d3a2c',
    mottle: ['#4a4632', '#35342a', '#514a33', '#2e2f26', '#463f2b', '#3a3d2b'],
    field: ['#43412c', '#393b28', '#4a442e'],
    scrub: '#232a1c',
    scrubHi: '#314024',
    ridge: '#2c2a22',
    ridgeHi: '#4d473a',
    road: '#33322c',
    roadEdge: '#3e3c34',
    building: ['#4a4a46', '#54524a', '#403f3a'],
    shadow: 'rgba(12,12,8,0.55)',
    tint: 'rgba(20,28,16,0.30)',
  },
  video: {
    base: '#33372b',
    mottle: ['#3c412f', '#2b3026', '#434631', '#272c22', '#394030', '#303827'],
    field: ['#3a402c', '#31382a', '#404430'],
    scrub: '#1e2618',
    scrubHi: '#2c3a22',
    ridge: '#262920',
    ridgeHi: '#414435',
    road: '#2e2f29',
    roadEdge: '#3a3b33',
    building: ['#43453f', '#4c4c44', '#393a34'],
    shadow: 'rgba(8,10,6,0.6)',
    tint: 'rgba(14,24,18,0.34)',
  },
}

function drawRoad(ctx, pal, pts, width) {
  const path = () => {
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < pts.length - 1; i++) {
      const xc = (pts[i][0] + pts[i + 1][0]) / 2
      const yc = (pts[i][1] + pts[i + 1][1]) / 2
      ctx.quadraticCurveTo(pts[i][0], pts[i][1], xc, yc)
    }
    ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1])
  }
  ctx.lineCap = 'round'
  path(); ctx.strokeStyle = pal.roadEdge; ctx.lineWidth = width + 5; ctx.globalAlpha = 0.5; ctx.stroke()
  path(); ctx.strokeStyle = pal.road; ctx.lineWidth = width; ctx.globalAlpha = 1; ctx.stroke()
  path(); ctx.strokeStyle = 'rgba(200,195,170,0.16)'; ctx.lineWidth = 1.2; ctx.setLineDash([12, 14]); ctx.stroke()
  ctx.setLineDash([])
}

function drawBuilding(ctx, pal, rnd, x, y, w, h, big) {
  // ground shadow offset SE, then roof with panel seams + vents
  ctx.fillStyle = pal.shadow
  ctx.fillRect(x + w * 0.06, y + h * 0.1, w, h)
  ctx.fillStyle = pal.building[Math.floor(rnd() * pal.building.length)]
  ctx.fillRect(x, y, w, h)
  ctx.strokeStyle = 'rgba(255,250,230,0.10)'
  ctx.lineWidth = 1
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1)
  ctx.strokeStyle = 'rgba(0,0,0,0.22)'
  const seams = big ? 5 : 2
  for (let i = 1; i <= seams; i++) {
    ctx.beginPath(); ctx.moveTo(x + (w / (seams + 1)) * i, y); ctx.lineTo(x + (w / (seams + 1)) * i, y + h); ctx.stroke()
  }
  for (let i = 0; i < (big ? 8 : 2); i++) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fillRect(x + 4 + rnd() * (w - 10), y + 4 + rnd() * (h - 10), 3, 3)
  }
  // sun-lit north-west edge
  ctx.fillStyle = 'rgba(255,245,210,0.12)'
  ctx.fillRect(x, y, w, 2)
  ctx.fillRect(x, y, 2, h)
}

function drawVehicle(ctx, pal, x, y, w, h, tone = '#565248') {
  ctx.save()
  ctx.fillStyle = pal.shadow
  ctx.fillRect(x + 3, y + 3, w, h)
  ctx.fillStyle = tone
  roundRect(ctx, x, y, w, h, 2)
  ctx.fill()
  // cab / windshield
  ctx.fillStyle = 'rgba(10,14,18,0.6)'
  ctx.fillRect(x + w * 0.72, y + 1.5, w * 0.16, h - 3)
  ctx.fillStyle = 'rgba(255,250,230,0.14)'
  ctx.fillRect(x, y, w, 1.5)
  ctx.restore()
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawPerson(ctx, x, y) {
  ctx.fillStyle = 'rgba(8,8,6,0.5)'
  ctx.beginPath(); ctx.ellipse(x + 2.5, y + 2, 3.4, 1.6, 0.6, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#1c1c18'
  ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#33322a'
  ctx.beginPath(); ctx.arc(x - 0.5, y - 0.5, 1.1, 0, Math.PI * 2); ctx.fill()
}

export default function TerrainCanvas({ seed = 7, variant = 'photo', features = [], style }) {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const rnd = mulberry32(seed * 7919 + (variant === 'video' ? 101 : 0))
    const pal = PALETTES[variant] || PALETTES.photo

    // base earth
    ctx.fillStyle = pal.base
    ctx.fillRect(0, 0, W, H)

    // large-scale mottling (two octaves of soft blobs)
    for (let i = 0; i < 300; i++) {
      const r = 24 + rnd() * 90
      const x = rnd() * W
      const y = rnd() * H
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      const c = pal.mottle[Math.floor(rnd() * pal.mottle.length)]
      g.addColorStop(0, c + '')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.globalAlpha = 0.05 + rnd() * 0.06
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalAlpha = 1

    // cultivated field patches with furrows
    for (let i = 0; i < 4; i++) {
      const fx = rnd() * W * 0.7
      const fy = rnd() * H * 0.7
      const fw = 120 + rnd() * 200
      const fh = 80 + rnd() * 150
      const ang = (rnd() - 0.5) * 0.5
      ctx.save()
      ctx.translate(fx + fw / 2, fy + fh / 2)
      ctx.rotate(ang)
      ctx.fillStyle = pal.field[i % pal.field.length]
      ctx.globalAlpha = 0.55
      ctx.fillRect(-fw / 2, -fh / 2, fw, fh)
      ctx.globalAlpha = 0.25
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'
      ctx.lineWidth = 1
      for (let f = -fh / 2 + 4; f < fh / 2; f += 6) {
        ctx.beginPath(); ctx.moveTo(-fw / 2, f); ctx.lineTo(fw / 2, f); ctx.stroke()
      }
      ctx.restore()
    }
    ctx.globalAlpha = 1

    // ridge along the right edge — rocky band with striations
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(W * 0.78, 0)
    ctx.quadraticCurveTo(W * 0.84, H * 0.22, W * 0.92, H * 0.38)
    ctx.quadraticCurveTo(W * 0.97, H * 0.48, W, H * 0.55)
    ctx.lineTo(W, 0)
    ctx.closePath()
    ctx.fillStyle = pal.ridge
    ctx.fill()
    ctx.clip()
    for (let i = 0; i < 26; i++) {
      const sx = W * 0.78 + rnd() * W * 0.22
      const sy = rnd() * H * 0.5
      ctx.strokeStyle = i % 3 ? 'rgba(0,0,0,0.35)' : pal.ridgeHi
      ctx.globalAlpha = 0.4
      ctx.lineWidth = 1 + rnd() * 2
      ctx.beginPath()
      ctx.moveTo(sx, sy)
      ctx.quadraticCurveTo(sx + 30 + rnd() * 40, sy + 10, sx + 60 + rnd() * 60, sy + 20 + rnd() * 24)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
    ctx.restore()
    // ridge sunlit rim
    ctx.strokeStyle = 'rgba(230,220,180,0.14)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(W * 0.78, 0)
    ctx.quadraticCurveTo(W * 0.84, H * 0.22, W * 0.92, H * 0.38)
    ctx.stroke()

    // roads
    drawRoad(ctx, pal, [[0, H * 0.72], [W * 0.3, H * 0.66], [W * 0.55, H * 0.72], [W * 0.8, H * 0.66], [W, H * 0.7]], 14)
    drawRoad(ctx, pal, [[W * 0.3, H], [W * 0.32, H * 0.6], [W * 0.3, H * 0.4], [W * 0.34, H * 0.18]], 9)

    // scrub / trees with shadows
    for (let i = 0; i < 240; i++) {
      const x = rnd() * W
      const y = rnd() * H
      if (x > W * 0.78 && y < H * 0.4) continue
      const r = 2 + rnd() * 5
      ctx.fillStyle = 'rgba(10,12,6,0.4)'
      ctx.beginPath(); ctx.arc(x + r * 0.5, y + r * 0.5, r, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = pal.scrub
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = pal.scrubHi
      ctx.globalAlpha = 0.5
      ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.5, 0, Math.PI * 2); ctx.fill()
      ctx.globalAlpha = 1
    }

    // dry wash
    ctx.strokeStyle = 'rgba(90,84,60,0.35)'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(W * 0.05, 0)
    ctx.quadraticCurveTo(W * 0.16, H * 0.3, W * 0.1, H * 0.55)
    ctx.quadraticCurveTo(W * 0.06, H * 0.75, W * 0.14, H)
    ctx.stroke()

    // scene features (aligned with segmentation boxes)
    features.forEach((f) => {
      const x = (f.x / 100) * W
      const y = (f.y / 100) * H
      const w = ((f.w || 6) / 100) * W
      const h = ((f.h || 6) / 100) * H
      switch (f.type) {
        case 'warehouse':
          drawBuilding(ctx, pal, rnd, x, y, w, h, true)
          // loading apron
          ctx.fillStyle = 'rgba(120,115,100,0.18)'
          ctx.fillRect(x - w * 0.25, y + h, w * 1.4, h * 0.5)
          break
        case 'building':
          drawBuilding(ctx, pal, rnd, x, y, w, h, false)
          break
        case 'truck':
          drawVehicle(ctx, pal, x + w * 0.15, y + h * 0.25, w * 0.7, h * 0.45, '#5a564a')
          break
        case 'vehicle':
          drawVehicle(ctx, pal, x + w * 0.15, y + h * 0.3, w * 0.65, h * 0.4, '#4e4c42')
          break
        case 'container':
          ctx.fillStyle = pal.shadow
          ctx.fillRect(x + w * 0.2 + 3, y + h * 0.3 + 3, w * 0.6, h * 0.42)
          ctx.fillStyle = '#5c5344'
          ctx.fillRect(x + w * 0.2, y + h * 0.3, w * 0.6, h * 0.42)
          ctx.strokeStyle = 'rgba(0,0,0,0.3)'
          for (let i = 1; i < 5; i++) {
            ctx.beginPath()
            ctx.moveTo(x + w * 0.2 + (w * 0.6 * i) / 5, y + h * 0.3)
            ctx.lineTo(x + w * 0.2 + (w * 0.6 * i) / 5, y + h * 0.72)
            ctx.stroke()
          }
          break
        case 'persons':
          drawPerson(ctx, x + w * 0.3, y + h * 0.35)
          drawPerson(ctx, x + w * 0.6, y + h * 0.6)
          drawPerson(ctx, x + w * 0.75, y + h * 0.3)
          break
        case 'person':
          drawPerson(ctx, x + w * 0.5, y + h * 0.5)
          break
        case 'animal':
          ctx.fillStyle = '#2a2620'
          ctx.beginPath(); ctx.ellipse(x + w * 0.5, y + h * 0.5, 4, 2, 0.4, 0, Math.PI * 2); ctx.fill()
          break
        case 'blob': {
          // ambiguous ridge object — half-buried angular glint
          ctx.fillStyle = 'rgba(20,20,16,0.7)'
          ctx.beginPath()
          ctx.moveTo(x + w * 0.3, y + h * 0.7)
          ctx.lineTo(x + w * 0.55, y + h * 0.3)
          ctx.lineTo(x + w * 0.75, y + h * 0.55)
          ctx.lineTo(x + w * 0.6, y + h * 0.8)
          ctx.closePath(); ctx.fill()
          ctx.fillStyle = 'rgba(235,230,200,0.5)'
          ctx.fillRect(x + w * 0.52, y + h * 0.38, 3, 2)
          break
        }
        default:
          break
      }
    })

    // fine grain
    for (let i = 0; i < 2600; i++) {
      const v = rnd()
      ctx.fillStyle = v > 0.5 ? 'rgba(255,250,230,0.03)' : 'rgba(0,0,0,0.05)'
      ctx.fillRect(rnd() * W, rnd() * H, 1.4, 1.4)
    }

    // atmosphere: theme tint + vignette
    ctx.fillStyle = pal.tint
    ctx.fillRect(0, 0, W, H)
    const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.85)
    vg.addColorStop(0, 'rgba(0,0,0,0)')
    vg.addColorStop(1, 'rgba(0,0,0,0.38)')
    ctx.fillStyle = vg
    ctx.fillRect(0, 0, W, H)
  }, [seed, variant, features])

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }}
    />
  )
}
