import { useState } from 'react'
import HudCard from './HudCard.jsx'
import StatusBadge from './StatusBadge.jsx'
import { anomalies } from '../data/mockData.js'

const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low']

export default function ThreatPanel() {
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(anomalies[0].id)

  const items = anomalies.filter((a) => filter === 'All' || a.severity === filter)
  const criticalCount = anomalies.filter((a) => a.severity === 'Critical').length

  return (
    <HudCard
      title="Threat / Anomaly Detection"
      right={<span className="chip chip-red pulse"><span className="dot" />{criticalCount} CRITICAL</span>}
      style={{ flex: 3, minHeight: 240 }}
    >
      <div className="filter-row">
        {SEVERITIES.map((s) => (
          <button key={s} className={filter === s ? 'active' : ''} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>
      {items.map((a) => (
        <div key={a.id} className={`threat-row sev-${a.severity} ${open === a.id ? 'selected' : ''}`}
          onClick={() => setOpen(open === a.id ? null : a.id)}>
          <div className="threat-title">{a.id} — {a.title}</div>
          <div className="threat-meta">
            <StatusBadge status={a.severity} />
            <span>conf {(a.confidence * 100).toFixed(0)}%</span>
            <span>{a.source}</span>
            <StatusBadge status={a.status} />
          </div>
          {open === a.id && (
            <div className="threat-detail">
              <b>SOURCE DATA:</b> {a.detail}<br />
              <b>RECOMMENDED:</b> {a.recommended}
            </div>
          )}
        </div>
      ))}
    </HudCard>
  )
}
