import { useEffect, useState } from 'react'
import StatusBadge from '../StatusBadge.jsx'
import TerrainCanvas from '../TerrainCanvas.jsx'
import { photoSegments, photoSummary } from '../../data/mockData.js'
import { bus } from '../../lib/bus.js'
import { useWindows } from '../../context/WindowContext.jsx'

// Scene features aligned with the SAM-H segmentation boxes.
const SCENE_FEATURES = [
  { type: 'warehouse', x: 55, y: 18, w: 24, h: 20 },
  { type: 'building', x: 14, y: 20, w: 8, h: 8 },
  { type: 'building', x: 24, y: 26, w: 5, h: 6 },
  { type: 'truck', x: 12, y: 55, w: 14, h: 11 },
  { type: 'persons', x: 36, y: 62, w: 8, h: 9 },
  { type: 'container', x: 70, y: 58, w: 10, h: 8 },
  { type: 'blob', x: 84, y: 34, w: 9, h: 10 },
]

const HEAT_OVERLAY = {
  position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
  background: `radial-gradient(circle at 19% 60%, rgba(255,77,94,0.45) 0%, rgba(255,180,84,0.3) 12%, transparent 26%),
    radial-gradient(circle at 40% 66%, rgba(255,180,84,0.4) 0%, transparent 14%),
    radial-gradient(circle at 67% 28%, rgba(61,214,232,0.22) 0%, transparent 22%),
    radial-gradient(circle at 88% 39%, rgba(255,77,94,0.35) 0%, transparent 12%)`,
  mixBlendMode: 'screen',
}

export default function PhotoIntelView() {
  const { openProfile } = useWindows()
  const [selected, setSelected] = useState(photoSegments[0])
  const [showMasks, setShowMasks] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [heatmap, setHeatmap] = useState(false)
  const [summary, setSummary] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [cross, setCross] = useState(null) // {x, y} in % — analyst crosshair

  useEffect(() => bus.on('photo.heatmap', (v) => setHeatmap(v)), [])

  const trackMouse = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setCross({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  const generateSummary = () => {
    setThinking(true)
    setSummary(null)
    setTimeout(() => { setThinking(false); setSummary(photoSummary) }, 1200)
  }

  return (
    <div className="view-layout">
      <div className="view-main">
        <div className="view-controls">
          <button className={showMasks ? 'active' : ''} onClick={() => setShowMasks(!showMasks)}>Seg Masks</button>
          <button className={showLabels ? 'active' : ''} onClick={() => setShowLabels(!showLabels)}>Labels</button>
          <button className={heatmap ? 'active btn-amber' : 'btn-amber'} onClick={() => setHeatmap(!heatmap)}>Confidence Heatmap</button>
          <button className="btn-green" onClick={generateSummary}>Generate Image Summary</button>
        </div>

        <div className="stage scanlines" onMouseMove={trackMouse} onMouseLeave={() => setCross(null)}>
          <TerrainCanvas seed={23} variant="photo" features={SCENE_FEATURES} />
          {heatmap && <div style={HEAT_OVERLAY} />}
          <div className="scan-sweep" />
          {cross && (
            <>
              <div className="crosshair-h" style={{ top: `${cross.y}%` }} />
              <div className="crosshair-v" style={{ left: `${cross.x}%` }} />
              <div className="crosshair-readout" style={{ left: `${Math.min(cross.x, 72)}%`, top: `${Math.min(cross.y + 3, 88)}%` }}>
                QT {Math.round(4400 + cross.x * 1.2)} {Math.round(8800 + cross.y * 1.2)} · GSD 0.31M · EL 412M
              </div>
            </>
          )}
          <div className="stage-label"><span className="rec-dot" />KEYHOLE-9 · FRAME 2231 · SAM-H ACTIVE</div>
          <div className="radar">
            <div className="sweep" />
            <div className="blip" style={{ top: '30%', left: '60%' }} />
            <div className="blip" style={{ top: '55%', left: '35%', animationDelay: '0.7s' }} />
          </div>

          {photoSegments.map((seg) => (
            <div
              key={seg.id}
              className={`seg-box active-seg ${selected?.id === seg.id ? 'selected' : ''}`}
              style={{
                left: `${seg.box.x}%`, top: `${seg.box.y}%`,
                width: `${seg.box.w}%`, height: `${seg.box.h}%`,
                color: seg.color,
              }}
              onClick={() => setSelected(seg)}
              onDoubleClick={() => openProfile(seg.id)}
              title="Click: inspect · Double-click: open dossier"
            >
              <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
              {showMasks && <span className="seg-mask" style={{ background: seg.color }} />}
              {showLabels && (
                <span className="seg-label" style={seg.box.x + seg.box.w > 80 ? { left: 'auto', right: -1 } : undefined}>
                  {seg.id} · {seg.label}
                </span>
              )}
              <span className="seg-conf">{(seg.confidence * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>

        {thinking && <div className="thinking">SAM-H + LLM SYNTHESIZING <i /><i /><i /></div>}
        {summary && <div className="ai-text">{summary}</div>}
      </div>

      <aside className="view-side">
        <div>
          <div className="mini-title">SEGMENT DETAIL <StatusBadge status={selected.risk} /></div>
          <div className="kv"><span className="k">Segment ID</span><span className="v" style={{ color: 'var(--cyan)' }}>{selected.id}</span></div>
          <div className="kv"><span className="k">Object Type</span><span className="v">{selected.type}</span></div>
          <div className="kv"><span className="k">Confidence</span><span className="v">{(selected.confidence * 100).toFixed(1)}%</span></div>
          <div className="kv"><span className="k">Risk Level</span><span className="v">{selected.risk}</span></div>
          <button className="btn-green" style={{ marginTop: 5, width: '100%' }} onClick={() => openProfile(selected.id)}>
            ◈ Open Dossier
          </button>
        </div>
        <div>
          <div className="mini-title">AI SUMMARY</div>
          <div className="ai-text">{selected.summary}</div>
        </div>
        <div>
          <div className="mini-title">RECOMMENDED ACTION</div>
          <div className="ai-text amber">{selected.action}</div>
        </div>
        <div>
          <div className="mini-title">DETECTED REGIONS</div>
          {photoSegments.map((seg) => (
            <div
              key={seg.id}
              className={`coord-row ${selected.id === seg.id ? 'selected' : ''}`}
              onClick={() => setSelected(seg)}
            >
              <span style={{ color: seg.color }}>■</span>
              <span className="coord-raw" style={{ color: 'var(--text)' }}>{seg.type}</span>
              <span className="coord-fmt">{(seg.confidence * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
