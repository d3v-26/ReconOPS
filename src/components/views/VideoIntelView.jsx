import { useEffect, useState } from 'react'
import StatusBadge from '../StatusBadge.jsx'
import TerrainCanvas from '../TerrainCanvas.jsx'
import { videoTracks, videoTimeline, videoSummary, videoBriefing } from '../../data/mockData.js'
import { bus } from '../../lib/bus.js'
import { useWindows } from '../../context/WindowContext.jsx'

// Ground truth for the drone frame — matches SAM-H track boxes.
const FRAME_FEATURES = [
  { type: 'warehouse', x: 54, y: 16, w: 20, h: 15 },
  { type: 'vehicle', x: 18, y: 58, w: 15, h: 12 },
  { type: 'vehicle', x: 58, y: 40, w: 14, h: 11 },
  { type: 'person', x: 40, y: 66, w: 6, h: 12 },
  { type: 'person', x: 74, y: 62, w: 6, h: 11 },
  { type: 'blob', x: 84, y: 24, w: 8, h: 8 },
  { type: 'animal', x: 8, y: 30, w: 7, h: 6 },
]

export default function VideoIntelView() {
  const { openProfile } = useWindows()
  const [selected, setSelected] = useState(videoTracks[1])
  const [showSeg, setShowSeg] = useState(true)
  const [showTracking, setShowTracking] = useState(true)
  const [aiOutput, setAiOutput] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [playT, setPlayT] = useState(0)
  const [thermal, setThermal] = useState(false)
  const DUR = 80

  useEffect(() => {
    const id = setInterval(() => setPlayT((t) => (t + 0.5) % DUR), 400)
    return () => clearInterval(id)
  }, [])

  useEffect(() => bus.on('video.thermal', (v) => setThermal(v)), [])

  const runAI = (text) => {
    setThinking(true)
    setAiOutput(null)
    setTimeout(() => { setThinking(false); setAiOutput(text) }, 1300)
  }

  const keyEvents = () => runAI(videoTimeline.map((e) => `[t+${e.t}s] ${e.sev.toUpperCase()} — ${e.label}`).join('\n'))

  return (
    <div className="view-layout">
      <div className="view-main">
        <div className="view-controls">
          <button className={showSeg ? 'active' : ''} onClick={() => setShowSeg(!showSeg)}>Segmentation</button>
          <button className={showTracking ? 'active' : ''} onClick={() => setShowTracking(!showTracking)}>Tracking</button>
          <button className={thermal ? 'active btn-amber' : 'btn-amber'} onClick={() => setThermal(!thermal)}>Thermal</button>
          <button onClick={() => runAI(videoSummary)}>Frame Summary</button>
          <button onClick={keyEvents}>Extract Key Events</button>
          <button className="btn-amber" onClick={() => runAI(videoBriefing)}>Mission Briefing</button>
        </div>

        <div className={`stage scanlines ${thermal ? 'thermal' : ''}`}>
          <TerrainCanvas seed={41} variant="video" features={FRAME_FEATURES} />
          {thermal && <div className="thermal-tint" />}
          <div className="scan-sweep" />
          <div className="stage-label"><span className="rec-dot" />SPECTER-1 · LIVE FEED · 30 FPS · {thermal ? 'THERMAL / WHITE-HOT' : 'EO / VISIBLE'} · SAM-H TRACKING</div>
          <div style={{ position: 'absolute', top: 8, right: 12, fontSize: 9, color: 'var(--green)', zIndex: 6, fontVariantNumeric: 'tabular-nums' }}>
            T+{String(Math.floor(playT)).padStart(2, '0')}s
          </div>

          {showTracking && videoTracks.map((tr, i) => (
            <div
              key={tr.id}
              className={`seg-box active-seg drift-${i % 3} ${selected?.id === tr.id ? 'selected' : ''}`}
              style={{ left: `${tr.box.x}%`, top: `${tr.box.y}%`, width: `${tr.box.w}%`, height: `${tr.box.h}%`, color: tr.color }}
              onClick={() => setSelected(tr)}
              onDoubleClick={() => openProfile(tr.id)}
              title="Click: inspect · Double-click: open dossier"
            >
              <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
              {showSeg && <span className="seg-mask" style={{ background: tr.color }} />}
              <span className="seg-label" style={tr.box.x + tr.box.w > 80 ? { left: 'auto', right: -1 } : undefined}>
                {tr.id} · {tr.type.toUpperCase()}
              </span>
              <span className="seg-conf">{(tr.confidence * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>

        <div>
          <div className="mini-title">EVENT TIMELINE · T+0 → T+{DUR}s</div>
          <div className="vid-timeline">
            <div className="playhead" style={{ left: `${(playT / DUR) * 100}%` }} />
            {videoTimeline.map((e, i) => (
              <div key={i} style={{ position: 'absolute', left: `${(e.t / DUR) * 100}%`, top: 0, bottom: 0 }} title={e.label}>
                <div className={`vid-marker sev-${e.sev}`} />
                {i % 2 === 0 && <div className="vid-marker-label">{e.label.length > 22 ? e.label.slice(0, 22) + '…' : e.label}</div>}
              </div>
            ))}
          </div>
        </div>

        {thinking && <div className="thinking">LLM SYNTHESIZING VIDEO INTEL <i /><i /><i /></div>}
        {aiOutput && <div className="ai-text">{aiOutput}</div>}
      </div>

      <aside className="view-side">
        <div>
          <div className="mini-title">TRACK DETAIL <StatusBadge status={selected.confidence > 0.8 ? 'Active' : 'Human Review'} /></div>
          <div className="kv"><span className="k">Object ID</span><span className="v" style={{ color: selected.color }}>{selected.id}</span></div>
          <div className="kv"><span className="k">Type</span><span className="v">{selected.type}</span></div>
          <div className="kv"><span className="k">Direction</span><span className="v">{selected.direction}</span></div>
          <div className="kv"><span className="k">Confidence</span><span className="v">{(selected.confidence * 100).toFixed(1)}%</span></div>
          <div className="kv"><span className="k">Last Seen</span><span className="v">{selected.lastSeen}</span></div>
          <button className="btn-green" style={{ marginTop: 5, width: '100%' }} onClick={() => openProfile(selected.id)}>
            ◈ Open Dossier
          </button>
        </div>
        <div>
          <div className="mini-title">ACTIVE TRACKS ({videoTracks.length})</div>
          {videoTracks.map((tr) => (
            <div
              key={tr.id}
              className={`track-card ${selected.id === tr.id ? 'selected' : ''}`}
              style={{ borderLeftColor: tr.color }}
              onClick={() => setSelected(tr)}
              onDoubleClick={() => openProfile(tr.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: tr.color }}>{tr.id} · {tr.type}</span>
                <span style={{ color: 'var(--muted)' }}>{(tr.confidence * 100).toFixed(0)}%</span>
              </div>
              <div style={{ color: 'var(--text-dim)', marginTop: 2 }}>{tr.direction} · {tr.lastSeen}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
