import { useEffect } from 'react'
import { ChevronDown, Check, Eye, X, UserCheck } from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'
import { anomalies } from '../data/mockData.js'
import { useOperation } from '../context/OperationContext.jsx'
import { bus } from '../lib/bus.js'

const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low']
// which workspace mode shows an anomaly's source data
const SOURCE_MODE = { Map: 'map', Audio: 'audio', Video: 'video', Photo: 'photo', '3D': '3d', Coordinates: 'coords', Document: 'docs' }

export default function ThreatPanel() {
  const { threatFilter, setThreatFilter, setAnomalyStatus, statusOf, setMode, phase, openAlert, setOpenAlert } = useOperation()

  useEffect(() => bus.on('threats.reviewAll', () => {
    setAnomalyStatus((s) => {
      const next = { ...s }
      anomalies.forEach((a) => { if (!next[a.id] && a.status !== 'Approved') next[a.id] = 'In Review' })
      return next
    })
  }), [setAnomalyStatus])

  const items = anomalies.filter((a) => (threatFilter === 'All' || a.severity === threatFilter) && statusOf(a) !== 'Dismissed')
  const setStatus = (a, st) => setAnomalyStatus((s) => ({ ...s, [a.id]: st }))

  const viewSource = (a) => {
    const key = Object.keys(SOURCE_MODE).find((k) => a.source.startsWith(k))
    if (key && phase === 'EXECUTION') setMode(SOURCE_MODE[key])
  }

  return (
    <div className="list-panel">
      <div className="segmented">
        {SEVERITIES.map((s) => (
          <button key={s} className={threatFilter === s ? 'on' : ''} onClick={() => setThreatFilter(s)}>{s}</button>
        ))}
      </div>
      {items.map((a) => {
        const open = openAlert === a.id
        const st = statusOf(a)
        return (
          <article key={a.id} className={`alert sev-${a.severity} ${open ? 'open' : ''}`}>
            <button className="alert-head" onClick={() => setOpenAlert(open ? null : a.id)}>
              <span className="sev-bar" />
              <span className="alert-main">
                <span className="alert-title">{a.title}</span>
                <span className="alert-meta">
                  <span className="mono">{a.id}</span> · {a.source} · {Math.round(a.confidence * 100)}%
                </span>
              </span>
              <StatusBadge status={st} />
              <ChevronDown size={14} className="chev" />
            </button>
            {open && (
              <div className="alert-body">
                <p>{a.detail}</p>
                <p className="rec"><b>Recommended</b> {a.recommended}</p>
                <div className="btn-row">
                  <button className="btn btn-ok" onClick={() => setStatus(a, 'Approved')}><Check size={13} /> Approve action</button>
                  <button className="btn" onClick={() => setStatus(a, 'In Review')}><UserCheck size={13} /> Assign</button>
                  <button className="btn" onClick={() => viewSource(a)}><Eye size={13} /> Source</button>
                  <button className="btn btn-ghost" onClick={() => setStatus(a, 'Dismissed')}><X size={13} /> Dismiss</button>
                </div>
              </div>
            )}
          </article>
        )
      })}
      {items.length === 0 && <div className="empty"><span>No alerts match this filter.</span></div>}
    </div>
  )
}
