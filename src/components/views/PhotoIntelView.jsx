import { useState } from 'react'
import StatusBadge from '../StatusBadge.jsx'
import { photoSegments, photoSummary } from '../../data/mockData.js'

// Stylized mock "aerial photo" rendered as SVG — no real imagery.
function AerialScene({ heatmap }) {
  return (
    <svg viewBox="0 0 100 70" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="terrain" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#141a14" />
          <stop offset="55%" stopColor="#10150f" />
          <stop offset="100%" stopColor="#0c1110" />
        </linearGradient>
        <radialGradient id="heat" cx="0.35" cy="0.65" r="0.6">
          <stop offset="0%" stopColor="rgba(255,77,94,0.5)" />
          <stop offset="35%" stopColor="rgba(255,180,84,0.35)" />
          <stop offset="70%" stopColor="rgba(61,214,232,0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100" height="70" fill="url(#terrain)" />
      {/* ridge line */}
      <path d="M78,0 Q84,20 90,28 T100,44 L100,0 Z" fill="#181f16" opacity="0.9" />
      <path d="M80,0 Q86,18 92,30" stroke="#232d1e" strokeWidth="0.4" fill="none" />
      {/* roads */}
      <path d="M0,50 Q30,46 55,50 T100,46" stroke="#242c30" strokeWidth="2.2" fill="none" />
      <path d="M0,50 Q30,46 55,50 T100,46" stroke="#39454a" strokeWidth="0.25" strokeDasharray="1.5 1.5" fill="none" />
      <path d="M30,70 Q32,55 30,42 Q29,30 34,18" stroke="#242c30" strokeWidth="1.6" fill="none" />
      {/* warehouse + buildings */}
      <rect x="56" y="19" width="22" height="18" fill="#1c2226" stroke="#2c3840" strokeWidth="0.3" />
      <rect x="58" y="21" width="8" height="6" fill="#222a2f" />
      <rect x="68" y="27" width="8" height="8" fill="#20272c" />
      <rect x="14" y="20" width="7" height="6" fill="#1c2226" stroke="#2c3840" strokeWidth="0.25" />
      <rect x="23" y="24" width="5" height="5" fill="#1a2024" />
      {/* vehicles */}
      <rect x="14" y="58" width="9" height="4.5" rx="0.6" fill="#2a3136" stroke="#3d474d" strokeWidth="0.3" />
      <rect x="71" y="59" width="7" height="5" rx="0.4" fill="#252c31" stroke="#39454a" strokeWidth="0.3" />
      {/* personnel dots */}
      <circle cx="38" cy="65" r="0.9" fill="#3a4449" />
      <circle cx="40.5" cy="66.5" r="0.9" fill="#3a4449" />
      <circle cx="42" cy="64" r="0.9" fill="#3a4449" />
      {/* scrub texture */}
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={(i * 37) % 100} cy={(i * 23 + 7) % 70} r={0.5 + (i % 3) * 0.3} fill="#151c14" opacity="0.8" />
      ))}
      {heatmap && <rect width="100" height="70" fill="url(#heat)" />}
    </svg>
  )
}

export default function PhotoIntelView() {
  const [selected, setSelected] = useState(photoSegments[0])
  const [showMasks, setShowMasks] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [heatmap, setHeatmap] = useState(false)
  const [summary, setSummary] = useState(null)
  const [thinking, setThinking] = useState(false)

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

        <div className="stage scanlines">
          <AerialScene heatmap={heatmap} />
          <div className="scan-sweep" />
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
