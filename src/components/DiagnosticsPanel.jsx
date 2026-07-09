import HudCard from './HudCard.jsx'
import StatusBadge from './StatusBadge.jsx'
import { diagnostics, diagStats } from '../data/mockData.js'

export default function DiagnosticsPanel() {
  return (
    <HudCard panelId="diagnostics" title="System Diagnostics" right={<span className="chip chip-green pulse"><span className="dot" />NOMINAL</span>} style={{ flex: 2, minHeight: 200 }}>
      {diagnostics.map((d) => (
        <div key={d.name} className="diag-row">
          <span className="name">{d.name}</span>
          <span style={{ color: 'var(--muted)', fontSize: 9 }}>{d.value}</span>
          <StatusBadge status={d.status} />
        </div>
      ))}
      <div className="diag-stats">
        <div className="diag-stat"><div className="val">{diagStats.latency}</div><div className="lbl">Latency</div></div>
        <div className="diag-stat"><div className="val">{diagStats.uptime}</div><div className="lbl">Uptime</div></div>
        <div className="diag-stat"><div className="val">{diagStats.activeFeeds}</div><div className="lbl">Active Feeds</div></div>
        <div className="diag-stat"><div className="val">{diagStats.modelConfidence}</div><div className="lbl">Model Conf</div></div>
        <div className="diag-stat"><div className="val">{diagStats.queueDepth}</div><div className="lbl">Queue Depth</div></div>
        <div className="diag-stat"><div className="val" style={{ color: 'var(--green)' }}>PREVIEW</div><div className="lbl">Build Mode</div></div>
      </div>
    </HudCard>
  )
}
