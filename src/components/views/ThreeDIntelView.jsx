import { useEffect, useRef, useState } from 'react'
import StatusBadge from '../StatusBadge.jsx'
import { threeDObjects, threeDSummary } from '../../data/mockData.js'

// ── Minimal software 3D renderer (no deps, GH Pages friendly) ──

function buildScene() {
  // terrain: grid of vertices with procedural height
  const N = 15
  const terrain = []
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const x = (i / (N - 1) - 0.5) * 220
      const z = (j / (N - 1) - 0.5) * 220
      const y = Math.sin(i * 0.55) * Math.cos(j * 0.45) * 14 + Math.sin(i * 0.2 + j * 0.3) * 9
      terrain.push({ x, y: y + 30, z })
    }
  }
  const terrainEdges = []
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const idx = i * N + j
      if (j < N - 1) terrainEdges.push([idx, idx + 1])
      if (i < N - 1) terrainEdges.push([idx, idx + N])
    }
  }
  // structure: box (warehouse S-3) with deformed east wall vertex
  const b = [
    [-25, 30, -18], [25, 30, -18], [25, 30, 18], [-25, 30, 18],
    [-25, -8, -18], [29, -8, -18], [25, -8, 18], [-25, -8, 18], // one pushed vertex = deformation
  ].map(([x, y, z]) => ({ x: x + 40, y, z: z - 30 }))
  const boxEdges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]
  // drone path: orbit waypoints
  const path = []
  for (let a = 0; a <= 20; a++) {
    const t = (a / 20) * Math.PI * 2
    path.push({ x: Math.cos(t) * 80, y: -55 + Math.sin(t * 2) * 6, z: Math.sin(t) * 80 })
  }
  const pathEdges = path.slice(0, -1).map((_, i) => [i, i + 1])
  // point cloud scatter
  const cloud = Array.from({ length: 130 }, (_, i) => ({
    x: Math.sin(i * 12.9898) * 100, y: 20 - Math.abs(Math.sin(i * 78.233)) * 26, z: Math.cos(i * 4.1414) * 100,
  }))
  return { terrain, terrainEdges, box: b, boxEdges, path, pathEdges, cloud, N }
}

const SCENE = buildScene()

function ThreeCanvas({ wireframe, heatmap, highlight, autoRotate }) {
  const ref = useRef(null)
  const state = useRef({ rx: 0.45, ry: 0.6, zoom: 1, dragging: false, lx: 0, ly: 0 })

  useEffect(() => { state.current.auto = autoRotate }, [autoRotate])

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf

    const project = (p, w, h) => {
      const s = state.current
      const cy = Math.cos(s.ry), sy = Math.sin(s.ry)
      const cx = Math.cos(s.rx), sx = Math.sin(s.rx)
      let x = p.x * cy - p.z * sy
      let z = p.x * sy + p.z * cy
      let y = p.y * cx - z * sx
      z = p.y * sx + z * cx
      const d = 420
      const f = (d / (d + z)) * s.zoom
      return { x: w / 2 + x * f, y: h / 2 + y * f, f, z }
    }

    const drawEdges = (verts, edges, color, lw = 0.7, glow = false) => {
      const { width: w, height: h } = canvas
      ctx.strokeStyle = color
      ctx.lineWidth = lw
      if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 6 }
      ctx.beginPath()
      for (const [a, b] of edges) {
        const p1 = project(verts[a], w, h)
        const p2 = project(verts[b], w, h)
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      if (canvas.width !== rect.width) { canvas.width = rect.width; canvas.height = rect.height }
      const { width: w, height: h } = canvas
      const s = state.current
      if (s.auto && !s.dragging) s.ry += 0.003
      ctx.clearRect(0, 0, w, h)

      // terrain
      if (heatmap) {
        // color edges by height
        ctx.lineWidth = 0.8
        for (const [a, b] of SCENE.terrainEdges) {
          const va = SCENE.terrain[a], vb = SCENE.terrain[b]
          const p1 = project(va, w, h), p2 = project(vb, w, h)
          const hgt = Math.max(0, Math.min(1, 1 - ((va.y + vb.y) / 2 - 8) / 44))
          ctx.strokeStyle = `rgba(${Math.round(60 + hgt * 195)},${Math.round(200 - hgt * 120)},${Math.round(120 - hgt * 40)},0.75)`
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke()
        }
      } else {
        drawEdges(SCENE.terrain, SCENE.terrainEdges, wireframe ? 'rgba(52,209,123,0.5)' : 'rgba(52,209,123,0.28)', 0.7)
      }

      // point cloud
      ctx.fillStyle = 'rgba(61,214,232,0.5)'
      for (const p of SCENE.cloud) {
        const q = project(p, w, h)
        ctx.fillRect(q.x, q.y, 1.4, 1.4)
      }

      // structure
      drawEdges(SCENE.box, SCENE.boxEdges, highlight ? 'rgba(255,180,84,1)' : 'rgba(200,212,216,0.7)', 1.1, highlight)
      if (highlight) {
        // flag deformed vertex
        const q = project(SCENE.box[5], w, h)
        ctx.strokeStyle = 'rgba(255,77,94,0.95)'
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.arc(q.x, q.y, 9 + Math.sin(Date.now() / 250) * 2.5, 0, Math.PI * 2); ctx.stroke()
        ctx.fillStyle = 'rgba(255,77,94,0.95)'
        ctx.font = '9px monospace'
        ctx.fillText('Δ0.4m DEVIATION', q.x + 13, q.y + 3)
      }

      // drone path
      drawEdges(SCENE.path, SCENE.pathEdges, 'rgba(61,214,232,0.85)', 1, true)
      // moving drone dot
      const dt = (Date.now() / 6000) % 1
      const di = Math.floor(dt * (SCENE.path.length - 1))
      const dq = project(SCENE.path[di], w, h)
      ctx.fillStyle = '#3dd6e8'
      ctx.shadowColor = '#3dd6e8'; ctx.shadowBlur = 8
      ctx.beginPath(); ctx.arc(dq.x, dq.y, 3, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur = 0

      // sensor cone from drone toward structure
      const bq = project(SCENE.box[0], w, h)
      ctx.strokeStyle = 'rgba(255,180,84,0.25)'
      ctx.beginPath(); ctx.moveTo(dq.x, dq.y); ctx.lineTo(bq.x, bq.y); ctx.stroke()

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    const down = (e) => { const s = state.current; s.dragging = true; s.lx = e.clientX; s.ly = e.clientY }
    const move = (e) => {
      const s = state.current
      if (!s.dragging) return
      s.ry += (e.clientX - s.lx) * 0.008
      s.rx += (e.clientY - s.ly) * 0.008
      s.rx = Math.max(-1.4, Math.min(1.4, s.rx))
      s.lx = e.clientX; s.ly = e.clientY
    }
    const up = () => { state.current.dragging = false }
    const wheel = (e) => {
      e.preventDefault()
      const s = state.current
      s.zoom = Math.max(0.4, Math.min(2.6, s.zoom * (e.deltaY > 0 ? 0.93 : 1.07)))
    }
    canvas.addEventListener('mousedown', down)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    canvas.addEventListener('wheel', wheel, { passive: false })
    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousedown', down)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      canvas.removeEventListener('wheel', wheel)
    }
  }, [wireframe, heatmap, highlight])

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}

export default function ThreeDIntelView() {
  const [wireframe, setWireframe] = useState(true)
  const [heatmap, setHeatmap] = useState(false)
  const [highlight, setHighlight] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)
  const [selected, setSelected] = useState(threeDObjects[1])
  const [summary, setSummary] = useState(null)
  const [thinking, setThinking] = useState(false)

  const generate = () => {
    setThinking(true); setSummary(null)
    setTimeout(() => { setThinking(false); setSummary(threeDSummary) }, 1300)
  }

  return (
    <div className="view-layout">
      <div className="view-main">
        <div className="view-controls">
          <button className={autoRotate ? 'active' : ''} onClick={() => setAutoRotate(!autoRotate)}>Auto Rotate</button>
          <button className={wireframe ? 'active' : ''} onClick={() => setWireframe(!wireframe)}>Wireframe</button>
          <button className={heatmap ? 'active btn-amber' : 'btn-amber'} onClick={() => setHeatmap(!heatmap)}>Elevation Heatmap</button>
          <button className={highlight ? 'active' : ''} onClick={() => setHighlight(!highlight)}>Detected Segments</button>
          <button className="btn-green" onClick={generate}>Generate Scene Summary</button>
        </div>

        <div className="stage three-stage">
          <ThreeCanvas wireframe={wireframe} heatmap={heatmap} highlight={highlight} autoRotate={autoRotate} />
          <div className="stage-label">FUSION VIEWER · SECTOR 7 MESH + S-3 SCAN + SPECTER-1 PATH</div>
          <div className="three-hint">DRAG TO ROTATE · SCROLL TO ZOOM</div>
        </div>

        {thinking && <div className="thinking">LLM ANALYZING 3D SCENE <i /><i /><i /></div>}
        {summary && <div className="ai-text">{summary}</div>}
      </div>

      <aside className="view-side">
        <div>
          <div className="mini-title">SCENE OBJECTS</div>
          {threeDObjects.map((o) => (
            <div key={o.id} className={`track-card ${selected.id === o.id ? 'selected' : ''}`}
              style={{ borderLeftColor: o.kind === 'structure' ? 'var(--amber)' : o.kind === 'path' ? 'var(--cyan)' : 'var(--green)' }}
              onClick={() => setSelected(o)}>
              <div style={{ color: 'var(--text)' }}>{o.name}</div>
              <div style={{ color: 'var(--text-dim)', marginTop: 2 }}>{o.desc}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="mini-title">SELECTED <StatusBadge status={selected.kind === 'structure' ? 'Medium' : 'Active'} /></div>
          <div className="kv"><span className="k">Object</span><span className="v">{selected.id}</span></div>
          <div className="kv"><span className="k">Kind</span><span className="v">{selected.kind}</span></div>
          <div className="kv"><span className="k">Source</span><span className="v">{selected.kind === 'path' ? 'Telemetry' : 'LIDAR-RIG'}</span></div>
          <div className="kv"><span className="k">Points</span><span className="v">{selected.kind === 'terrain' ? '240k' : selected.kind === 'structure' ? '18k' : '21 wpts'}</span></div>
        </div>
        <div>
          <div className="mini-title">SAM-H 3D SEGMENTS</div>
          <div className="ai-text amber">Structure S-3 east wall flagged: Δ0.4m from baseline. Coverage 61% — LIDAR-RIG offline before scan complete. Confidence LIMITED.</div>
        </div>
      </aside>
    </div>
  )
}
