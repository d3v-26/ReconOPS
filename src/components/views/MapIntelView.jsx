import { useState } from 'react'
import StatusBadge from '../StatusBadge.jsx'
import { mapMarkers, mapZones, mapPaths, areaSummary } from '../../data/mockData.js'

const VIEWS = ['2D', '3D TERRAIN', 'TOPO', 'SATELLITE', 'GRID']
const TOOLS = ['Drop Marker', 'Measure', 'Draw Zone', 'Track Asset', 'Area Summary']

const KIND_GLYPH = {
  drone: '✈', camera: '◉', sensor: '≋', vehicle: '▣', team: '⬟', threat: '✖', poi: '◈',
}
const KIND_COLOR = {
  drone: 'var(--cyan)', camera: 'var(--green)', sensor: 'var(--olive)', vehicle: 'var(--green)',
  team: 'var(--green)', threat: 'var(--red)', poi: 'var(--amber)',
}

function terrainFill(view) {
  switch (view) {
    case 'SATELLITE': return '#10150f'
    case '3D TERRAIN': return '#0d1213'
    case 'TOPO': return '#0b0f11'
    case 'GRID': return '#07090a'
    default: return '#0b0e10'
  }
}

export default function MapIntelView() {
  const [view, setView] = useState('2D')
  const [tool, setTool] = useState(null)
  const [hover, setHover] = useState(null)
  const [selected, setSelected] = useState(null)
  const [dropped, setDropped] = useState([])
  const [summary, setSummary] = useState(null)
  const [thinking, setThinking] = useState(false)

  const handleStageClick = (e) => {
    if (tool !== 'Drop Marker') return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setDropped((d) => [...d, { id: `OP-${d.length + 1}`, x, y }])
  }

  const handleTool = (t) => {
    if (t === 'Area Summary') {
      setThinking(true)
      setSummary(null)
      setTimeout(() => { setThinking(false); setSummary(areaSummary) }, 1200)
      return
    }
    setTool(tool === t ? null : t)
  }

  const showTopo = view === 'TOPO' || view === '3D TERRAIN'
  const isGrid = view === 'GRID'
  const skew = view === '3D TERRAIN'

  return (
    <div className="view-layout">
      <div className="view-main">
        <div className="view-controls">
          {VIEWS.map((v) => (
            <button key={v} className={view === v ? 'active' : ''} onClick={() => setView(v)}>{v}</button>
          ))}
          <span style={{ width: 10 }} />
          {TOOLS.map((t) => (
            <button key={t} className={`btn-amber ${tool === t ? 'active' : ''}`} onClick={() => handleTool(t)}>{t}</button>
          ))}
        </div>

        <div className="stage map-stage" onClick={handleStageClick} style={{ cursor: tool === 'Drop Marker' ? 'crosshair' : 'default' }}>
          <svg
            viewBox="0 0 100 80"
            preserveAspectRatio="none"
            style={{ transform: skew ? 'perspective(600px) rotateX(38deg) scale(1.25)' : 'none', transformOrigin: '50% 60%', transition: 'transform 0.6s ease' }}
          >
            <rect width="100" height="80" fill={terrainFill(view)} />

            {/* terrain features (not in GRID view) */}
            {!isGrid && (
              <g>
                <path d="M74,0 Q82,18 88,26 T100,42 L100,0 Z" fill={view === 'SATELLITE' ? '#161d12' : '#10161a'} opacity="0.9" />
                <path d="M0,62 Q20,58 38,62 T74,60 T100,64" stroke="#20282e" strokeWidth="2.4" fill="none" />
                <path d="M0,62 Q20,58 38,62 T74,60 T100,64" stroke="#323e46" strokeWidth="0.3" strokeDasharray="2 2" fill="none" />
                <path d="M30,80 Q32,60 30,46 Q29,32 34,18" stroke="#1c242a" strokeWidth="1.7" fill="none" />
                <rect x="60" y="42" width="10" height="8" fill="#161d21" stroke="#28323a" strokeWidth="0.3" />
                <rect x="26" y="36" width="6" height="5" fill="#141a1e" stroke="#242e34" strokeWidth="0.25" />
                {view === 'SATELLITE' && Array.from({ length: 60 }).map((_, i) => (
                  <circle key={i} cx={(i * 29 + 11) % 100} cy={(i * 19 + 3) % 80} r={0.45 + (i % 4) * 0.2} fill="#151c12" opacity="0.9" />
                ))}
              </g>
            )}

            {/* topo contours */}
            {showTopo && (
              <g stroke="rgba(138,154,91,0.4)" fill="none" strokeWidth="0.3">
                {[6, 11, 16, 21, 26].map((r) => <ellipse key={r} cx="84" cy="22" rx={r} ry={r * 0.7} />)}
                {[5, 9, 13].map((r) => <ellipse key={r} cx="20" cy="60" rx={r} ry={r * 0.6} />)}
                {[4, 8].map((r) => <ellipse key={r} cx="50" cy="14" rx={r} ry={r * 0.65} />)}
              </g>
            )}

            {/* grid */}
            <g stroke={isGrid ? 'rgba(52,209,123,0.22)' : 'rgba(61,214,232,0.08)'} strokeWidth="0.2">
              {Array.from({ length: 11 }).map((_, i) => <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="80" />)}
              {Array.from({ length: 9 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} />)}
            </g>
            <g fill="rgba(74,86,92,0.8)" fontSize="2" fontFamily="monospace">
              {Array.from({ length: 10 }).map((_, i) => <text key={i} x={i * 10 + 0.7} y="79">{`QT-${44 + i}`}</text>)}
            </g>

            {/* zones */}
            {mapZones.map((z) => (
              <g key={z.id}>
                <circle cx={z.x} cy={z.y} r={z.r} fill={z.color} opacity="0.07" />
                <circle cx={z.x} cy={z.y} r={z.r} fill="none" stroke={z.color} strokeWidth="0.35" strokeDasharray="1.6 1.2" opacity="0.8">
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${z.x} ${z.y}`} to={`360 ${z.x} ${z.y}`} dur="30s" repeatCount="indefinite" />
                </circle>
                <text x={z.x} y={z.y - z.r - 1.4} fill={z.color} fontSize="2.2" textAnchor="middle" fontFamily="monospace" letterSpacing="0.3">{z.name}</text>
              </g>
            ))}

            {/* sensor coverage cones */}
            <g opacity="0.35">
              <path d="M78,34 L94,22 A20,20 0 0 1 96,40 Z" fill="rgba(52,209,123,0.25)" />
              <path d="M22,70 L8,60 A18,18 0 0 0 10,78 Z" fill="rgba(255,180,84,0.2)" />
            </g>

            {/* movement paths */}
            {mapPaths.map((p) => (
              <polyline
                key={p.id} points={p.points} fill="none" stroke={p.color} strokeWidth="0.45"
                strokeDasharray="2 1.4" style={{ animation: 'dash-flow 1.4s linear infinite' }} opacity="0.9"
              />
            ))}

            {/* radar sweep */}
            <g style={{ transformOrigin: '52px 44px', animation: 'radar-sweep 5s linear infinite' }}>
              <path d="M52,44 L52,8 A36,36 0 0 1 70,12 Z" fill="rgba(52,209,123,0.08)" />
              <line x1="52" y1="44" x2="52" y2="8" stroke="rgba(52,209,123,0.5)" strokeWidth="0.3" />
            </g>

            {/* markers */}
            {[...mapMarkers, ...dropped.map((d) => ({ ...d, name: d.id, kind: 'poi', status: 'Operator Marker' }))].map((m) => (
              <g
                key={m.id}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHover(m)}
                onMouseLeave={() => setHover(null)}
                onClick={(e) => { e.stopPropagation(); setSelected(m) }}
              >
                {(m.kind === 'threat' || selected?.id === m.id) && (
                  <circle cx={m.x} cy={m.y} r="3" fill="none" stroke={KIND_COLOR[m.kind]} strokeWidth="0.4"
                    style={{ transformOrigin: `${m.x}px ${m.y}px`, animation: 'ping 1.8s ease-out infinite' }} />
                )}
                <circle cx={m.x} cy={m.y} r="1.1" fill={KIND_COLOR[m.kind] || 'var(--cyan)'} />
                <text x={m.x} y={m.y - 2} fill={KIND_COLOR[m.kind] || 'var(--cyan)'} fontSize="2.4" textAnchor="middle" fontFamily="monospace">
                  {KIND_GLYPH[m.kind] || '◈'}
                </text>
                <text x={m.x} y={m.y + 3.6} fill="rgba(200,212,216,0.75)" fontSize="1.8" textAnchor="middle" fontFamily="monospace" letterSpacing="0.2">
                  {m.name}
                </text>
              </g>
            ))}
          </svg>

          <div className="stage-label">ATLAS-LAYER · SECTOR 7 · {view} VIEW{tool ? ` · TOOL: ${tool.toUpperCase()}` : ''}</div>

          {hover && (
            <div className="map-tooltip" style={{ left: `${hover.x}%`, top: `${hover.y}%`, transform: 'translate(12px, -50%)' }}>
              <div className="tt-name">{hover.name}</div>
              <div className="tt-row">TYPE: {hover.kind?.toUpperCase()}</div>
              <div className="tt-row">STATUS: {hover.status}</div>
              <div className="tt-row">GRID: QT {Math.round(44 + hover.x / 10)}{Math.round(hover.x * 10)} {Math.round(88 + hover.y / 10)}{Math.round(hover.y * 10) % 100}</div>
            </div>
          )}
        </div>

        {thinking && <div className="thinking">LLM SYNTHESIZING AREA INTEL <i /><i /><i /></div>}
        {summary && <div className="ai-text">{summary}</div>}
      </div>

      <aside className="view-side">
        <div>
          <div className="mini-title">SELECTION</div>
          {selected ? (
            <>
              <div className="kv"><span className="k">Entity</span><span className="v" style={{ color: 'var(--cyan)' }}>{selected.name}</span></div>
              <div className="kv"><span className="k">Type</span><span className="v">{selected.kind?.toUpperCase()}</span></div>
              <div className="kv"><span className="k">Status</span><span className="v">{selected.status}</span></div>
              <div className="kv"><span className="k">Position</span><span className="v">{selected.x.toFixed(1)}, {selected.y.toFixed(1)}</span></div>
            </>
          ) : (
            <div style={{ color: 'var(--muted)', fontSize: 10 }}>Click a map entity to inspect.</div>
          )}
        </div>
        <div>
          <div className="mini-title">ACTIVE ZONES</div>
          {mapZones.map((z) => (
            <div key={z.id} className="rec-row">
              <span style={{ color: z.color }}>◎ {z.name}</span>
              <div style={{ color: 'var(--muted)', marginTop: 2 }}>radius {z.r * 100}m · {z.kind}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="mini-title">ALERT <StatusBadge status="Critical" pulse /></div>
          <div className="ai-text" style={{ borderLeftColor: 'var(--red)' }}>
            CONTACT-X breached GF-2 eastern boundary. Intercepts zone core ~14:12Z. Operator decision pending.
          </div>
        </div>
        <div>
          <div className="mini-title">TRACKED ENTITIES ({mapMarkers.length + dropped.length})</div>
          {mapMarkers.map((m) => (
            <div key={m.id} className={`coord-row ${selected?.id === m.id ? 'selected' : ''}`} onClick={() => setSelected(m)}>
              <span style={{ color: KIND_COLOR[m.kind] }}>{KIND_GLYPH[m.kind]}</span>
              <span className="coord-raw" style={{ color: 'var(--text)' }}>{m.name}</span>
              <span className="coord-fmt">{m.status}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
