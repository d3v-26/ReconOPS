import { useEffect, useState } from 'react'
import StatusBadge from '../StatusBadge.jsx'
import { videoTracks, videoTimeline, videoSummary, videoBriefing } from '../../data/mockData.js'

// Animated mock "video frame" — drifting gradient + noise pattern, no real footage.
function VideoFrame() {
  return (
    <svg viewBox="0 0 100 62" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="vf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1416" />
          <stop offset="60%" stopColor="#121a14" />
          <stop offset="100%" stopColor="#0c110e" />
        </linearGradient>
      </defs>
      <rect width="100" height="62" fill="url(#vf)" />
      <path d="M0,44 Q25,40 50,44 T100,41" stroke="#20282c" strokeWidth="3" fill="none" />
      <rect x="54" y="16" width="20" height="15" fill="#181f23" stroke="#28323a" strokeWidth="0.3" />
      <path d="M80,0 Q86,14 92,22 T100,34 L100,0 Z" fill="#151b13" />
      <rect x="19" y="53" width="10" height="5" rx="0.6" fill="#262e33" />
      <rect x="59" y="37" width="9" height="4.5" rx="0.6" fill="#2a3238" />
      <circle cx="42.5" cy="70" r="1" fill="#39434a" />
      {Array.from({ length: 30 }).map((_, i) => (
        <circle key={i} cx={(i * 41 + 13) % 100} cy={(i * 17 + 5) % 62} r={0.4 + (i % 3) * 0.25} fill="#141a16" />
      ))}
      {/* drifting cloud shadow */}
      <ellipse cx="30" cy="14" rx="22" ry="7" fill="#0a0e0c" opacity="0.5">
        <animate attributeName="cx" values="20;80;20" dur="40s" repeatCount="indefinite" />
      </ellipse>
    </svg>
  )
}

export default function VideoIntelView() {
  const [selected, setSelected] = useState(videoTracks[1])
  const [showSeg, setShowSeg] = useState(true)
  const [showTracking, setShowTracking] = useState(true)
  const [aiOutput, setAiOutput] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [playT, setPlayT] = useState(0)
  const DUR = 80

  useEffect(() => {
    const id = setInterval(() => setPlayT((t) => (t + 0.5) % DUR), 400)
    return () => clearInterval(id)
  }, [])

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
          <button onClick={() => runAI(videoSummary)}>Frame Summary</button>
          <button onClick={keyEvents}>Extract Key Events</button>
          <button className="btn-amber" onClick={() => runAI(videoBriefing)}>Mission Briefing</button>
        </div>

        <div className="stage scanlines">
          <VideoFrame />
          <div className="scan-sweep" />
          <div className="stage-label"><span className="rec-dot" />SPECTER-1 · LIVE FEED · 30 FPS · SAM-H TRACKING</div>
          <div style={{ position: 'absolute', top: 8, right: 12, fontSize: 9, color: 'var(--green)', zIndex: 6, fontVariantNumeric: 'tabular-nums' }}>
            T+{String(Math.floor(playT)).padStart(2, '0')}s
          </div>

          {showTracking && videoTracks.map((tr) => (
            <div
              key={tr.id}
              className={`seg-box active-seg ${selected?.id === tr.id ? 'selected' : ''}`}
              style={{ left: `${tr.box.x}%`, top: `${tr.box.y}%`, width: `${tr.box.w}%`, height: `${tr.box.h}%`, color: tr.color }}
              onClick={() => setSelected(tr)}
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
        </div>
        <div>
          <div className="mini-title">ACTIVE TRACKS ({videoTracks.length})</div>
          {videoTracks.map((tr) => (
            <div
              key={tr.id}
              className={`track-card ${selected.id === tr.id ? 'selected' : ''}`}
              style={{ borderLeftColor: tr.color }}
              onClick={() => setSelected(tr)}
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
