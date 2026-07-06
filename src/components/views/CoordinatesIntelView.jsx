import { useState } from 'react'
import StatusBadge from '../StatusBadge.jsx'
import { coordSamples, coordClusters } from '../../data/mockData.js'

const RISK_COLOR = { Critical: 'var(--red)', High: 'var(--amber)', Medium: 'var(--cyan)', Low: 'var(--green)' }

export default function CoordinatesIntelView() {
  const [selected, setSelected] = useState(coordSamples[2])
  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState(null)

  const parseInput = () => {
    if (!input.trim()) return
    // preview-mode parser: echo the input into a mock tactical card
    setParsed({
      id: 'C-NEW', raw: input.trim(),
      format: /[°'"]/u.test(input) ? (input.includes('"') ? 'DMS' : 'Decimal Degrees') : /^[A-Z]{2}\s?\d/.test(input.trim().toUpperCase()) ? 'Grid (MGRS-style)' : 'Relative / freeform',
      place: 'Unmapped reference — nearest known feature: Route Bravo', terrain: 'Mixed scrub', risk: 'Medium',
      nearest: 'NOMAD-3 (est. 1.9 km)', action: 'Added to coordinate watchlist. Cluster assignment pending.',
    })
    setInput('')
  }

  const active = parsed || selected

  return (
    <div className="view-layout">
      <div className="view-main">
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            placeholder='Parse coordinates… e.g. 34.0522 N, 118.2437 W · QT 4412 8867 · REL BRAVO +400m @042'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && parseInput()}
            style={{ flex: 1 }}
          />
          <button className="btn-green" onClick={parseInput}>Parse</button>
        </div>

        <div>
          <div className="mini-title">INGESTED COORDINATES ({coordSamples.length})</div>
          {coordSamples.map((c) => (
            <div key={c.id} className={`coord-row ${!parsed && selected.id === c.id ? 'selected' : ''}`}
              onClick={() => { setParsed(null); setSelected(c) }}>
              <span style={{ color: RISK_COLOR[c.risk] }}>⌖</span>
              <span className="coord-raw">{c.raw}</span>
              <span className="coord-fmt">{c.format}</span>
              <StatusBadge status={c.risk} />
            </div>
          ))}
        </div>

        <div className="stage" style={{ minHeight: 220 }}>
          <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <rect width="100" height="60" fill="var(--bg)" />
            <g stroke="rgba(61,214,232,0.07)" strokeWidth="0.2">
              {Array.from({ length: 11 }).map((_, i) => <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="60" />)}
              {Array.from({ length: 7 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} />)}
            </g>
            {coordClusters.map((cl) => (
              <g key={cl.id}>
                <circle cx={cl.x} cy={cl.y} r={cl.r} fill={RISK_COLOR[cl.risk]} opacity="0.08" />
                <circle cx={cl.x} cy={cl.y} r={cl.r} fill="none" stroke={RISK_COLOR[cl.risk]} strokeWidth="0.3" strokeDasharray="1.4 1" />
                <circle cx={cl.x} cy={cl.y} r="2.4" fill="none" stroke={RISK_COLOR[cl.risk]} strokeWidth="0.35"
                  style={{ transformOrigin: `${cl.x}px ${cl.y}px`, animation: 'ping 2.4s ease-out infinite' }} />
                {Array.from({ length: cl.count }).map((_, i) => {
                  const a = (i / cl.count) * Math.PI * 2
                  return <circle key={i} cx={cl.x + Math.cos(a) * cl.r * 0.5} cy={cl.y + Math.sin(a) * cl.r * 0.5} r="0.7" fill={RISK_COLOR[cl.risk]} />
                })}
                <text x={cl.x} y={cl.y - cl.r - 1.6} fill={RISK_COLOR[cl.risk]} fontSize="2.4" textAnchor="middle" fontFamily="monospace">
                  {cl.label} ({cl.count})
                </text>
              </g>
            ))}
          </svg>
          <div className="stage-label">COORDINATE CLUSTERING · 5 CLUSTERS · 20 REFERENCES</div>
        </div>
      </div>

      <aside className="view-side">
        <div>
          <div className="mini-title">TACTICAL LOCATION CARD <StatusBadge status={active.risk} /></div>
          <div className="kv"><span className="k">Raw Input</span><span className="v" style={{ color: 'var(--green)' }}>{active.raw}</span></div>
          <div className="kv"><span className="k">Format</span><span className="v">{active.format}</span></div>
          <div className="kv"><span className="k">Resolved</span><span className="v">{active.place}</span></div>
          <div className="kv"><span className="k">Terrain</span><span className="v">{active.terrain}</span></div>
          <div className="kv"><span className="k">Risk</span><span className="v">{active.risk}</span></div>
          <div className="kv"><span className="k">Nearest Asset</span><span className="v">{active.nearest}</span></div>
        </div>
        <div>
          <div className="mini-title">RECOMMENDED ACTION</div>
          <div className="ai-text amber">{active.action}</div>
        </div>
        <div>
          <div className="mini-title">CLUSTER ANALYSIS</div>
          {coordClusters.map((cl) => (
            <div key={cl.id} className="rec-row">
              <span style={{ color: RISK_COLOR[cl.risk] }}>◎ {cl.label}</span>
              <div style={{ color: 'var(--muted)', marginTop: 2 }}>{cl.count} refs · risk {cl.risk}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
