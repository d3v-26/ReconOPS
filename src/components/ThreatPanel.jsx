import { useEffect, useState } from 'react'
import HudCard from './HudCard.jsx'
import StatusBadge from './StatusBadge.jsx'
import { anomalies } from '../data/mockData.js'
import { useOperation } from '../context/OperationContext.jsx'
import { bus } from '../lib/bus.js'

const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low']
// which workspace mode shows an anomaly's source data
const SOURCE_MODE = { Map: 'map', Audio: 'audio', Video: 'video', Photo: 'photo', '3D': '3d', Coordinates: 'coords', Document: 'docs' }

export default function ThreatPanel() {
  const { threatFilter, setThreatFilter, anomalyStatus, setAnomalyStatus, setMode, phase } = useOperation()
  const [open, setOpen] = useState(anomalies[0].id)

  useEffect(() => bus.on('threats.reviewAll', () => {
    setAnomalyStatus((s) => {
      const next = { ...s }
      anomalies.forEach((a) => { if (!next[a.id] && a.status !== 'Approved') next[a.id] = 'In Review' })
      return next
    })
  }), [setAnomalyStatus])

  const statusOf = (a) => anomalyStatus[a.id] || a.status
  const items = anomalies.filter((a) => (threatFilter === 'All' || a.severity === threatFilter) && statusOf(a) !== 'Dismissed')
  const criticalCount = anomalies.filter((a) => a.severity === 'Critical' && statusOf(a) !== 'Dismissed').length

  const viewSource = (a) => {
    const key = Object.keys(SOURCE_MODE).find((k) => a.source.startsWith(k))
    if (key && phase === 'EXECUTION') setMode(SOURCE_MODE[key])
  }

  return (
    <HudCard
      panelId="threats"
      title="Threat / Anomaly Detection"
      right={<span className="chip chip-red pulse"><span className="dot" />{criticalCount} CRITICAL</span>}
      style={{ flex: 3, minHeight: 240 }}
    >
      <div className="filter-row">
        {SEVERITIES.map((s) => (
          <button key={s} className={threatFilter === s ? 'active' : ''} onClick={() => setThreatFilter(s)}>{s}</button>
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
            <StatusBadge status={statusOf(a)} />
          </div>
          {open === a.id && (
            <div className="threat-detail">
              <b>SOURCE DATA:</b> {a.detail}<br />
              <b>RECOMMENDED:</b> {a.recommended}
              <div className="threat-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn-green" onClick={() => setAnomalyStatus((s) => ({ ...s, [a.id]: 'Approved' }))}>✓ Approve Action</button>
                <button onClick={() => setAnomalyStatus((s) => ({ ...s, [a.id]: 'In Review' }))}>Assign Review</button>
                <button onClick={() => viewSource(a)}>◈ View Source</button>
                <button className="btn-amber" onClick={() => setAnomalyStatus((s) => ({ ...s, [a.id]: 'Dismissed' }))}>✕ Dismiss</button>
              </div>
            </div>
          )}
        </div>
      ))}
      {items.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 10 }}>No anomalies match filter.</div>}
    </HudCard>
  )
}
