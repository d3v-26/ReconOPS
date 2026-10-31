import { useEffect, useState } from 'react'
import StatusBadge from '../StatusBadge.jsx'
import { videoTracks, videoTimeline, videoSummary, videoBriefing } from '../../data/mockData.js'
import { bus } from '../../lib/bus.js'
import { useWindows } from '../../context/WindowContext.jsx'

const FRAME = `${import.meta.env.BASE_URL}imagery/s3-wide.jpg`
// Warehouse S-3 footprint in the frame (% of image) — zoom origin + target outline.
const S3 = { x: 47, y: 45.3, w: 5.5, h: 6.5 }

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

        <div className={`stage imagery video-stage ${thermal ? 'thermal' : ''}`}>
          {/* image + boxes share one transformed layer so tracks stay pinned while the drone orbits */}
          <div className="video-frame" style={{ transformOrigin: `${S3.x + S3.w / 2}% ${S3.y + S3.h / 2}%` }}>
            <img className="stage-img" src={FRAME} alt="SPECTER-1 drone view over Warehouse S-3" draggable={false} />
            <div className="tgt-outline" style={{ left: `${S3.x}%`, top: `${S3.y}%`, width: `${S3.w}%`, height: `${S3.h}%` }}>
              <span>TGT-01 · S-3</span>
            </div>
            {showTracking && videoTracks.map((tr, i) => (
              <div
                key={tr.id}
                className={`seg-box small drift-${i % 3} ${selected?.id === tr.id ? 'selected' : ''}`}
                style={{ left: `${tr.box.x}%`, top: `${tr.box.y}%`, width: `${tr.box.w}%`, height: `${tr.box.h}%`, color: tr.color }}
                onClick={() => setSelected(tr)}
                onDoubleClick={() => openProfile(tr.id)}
                title="Click: inspect · Double-click: open dossier"
              >
                {showSeg && <span className="seg-mask" style={{ background: tr.color }} />}
                <span className="seg-label">{tr.id}</span>
              </div>
            ))}
          </div>
          <div className="stage-label"><span className="rec-dot" />SPECTER-1 · LIVE · {thermal ? 'IR WHITE-HOT' : 'EO VISIBLE'} · 120M AGL</div>
          <div className="stage-clock mono">T+{String(Math.floor(playT)).padStart(2, '0')}s</div>
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
