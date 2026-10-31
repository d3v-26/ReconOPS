import { useEffect, useState } from 'react'
import StatusBadge from '../StatusBadge.jsx'
import { photoSegments, photoSummary } from '../../data/mockData.js'
import { bus } from '../../lib/bus.js'
import { useWindows } from '../../context/WindowContext.jsx'

const STILL = `${import.meta.env.BASE_URL}imagery/s3-still.jpg`

const HEAT_OVERLAY = {
  position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
  background: `radial-gradient(circle at 49% 79%, rgba(255,90,95,0.55) 0%, rgba(245,176,65,0.3) 8%, transparent 16%),
    radial-gradient(circle at 64% 41%, rgba(245,176,65,0.45) 0%, transparent 10%),
    radial-gradient(circle at 52% 50%, rgba(76,201,240,0.25) 0%, transparent 14%),
    radial-gradient(circle at 63% 70%, rgba(245,176,65,0.4) 0%, transparent 7%),
    radial-gradient(circle at 57% 24%, rgba(255,90,95,0.45) 0%, transparent 9%)`,
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

        <div className="stage imagery photo-stage" onMouseMove={trackMouse} onMouseLeave={() => setCross(null)}>
          <img className="stage-img" src={STILL} alt="Overhead still of Warehouse S-3 and surrounding hangars" draggable={false} />
          {heatmap && <div style={HEAT_OVERLAY} />}
          {cross && (
            <>
              <div className="crosshair-h" style={{ top: `${cross.y}%` }} />
              <div className="crosshair-v" style={{ left: `${cross.x}%` }} />
              <div className="crosshair-readout" style={{ left: `${Math.min(cross.x, 72)}%`, top: `${Math.min(cross.y + 3, 88)}%` }}>
                {(35.0583 - cross.y * 0.000048).toFixed(5)}° N {(118.1595 - cross.x * 0.000096).toFixed(5)}° W · GSD 0.6M
              </div>
            </>
          )}
          <div className="stage-label"><span className="rec-dot" />KEYHOLE-9 · FRAME 2231 · WAREHOUSE S-3</div>

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
                  {seg.type}
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
