import HudCard from './HudCard.jsx'
import StatusBadge from './StatusBadge.jsx'
import { mission } from '../data/mockData.js'
import { useOperation } from '../context/OperationContext.jsx'

// mission phase index that is "active" for each operation lifecycle stage
const ACTIVE_IDX = { STANDUP: 0, PLANNING: 1, EXECUTION: 2, DEBRIEF: 4 }
const PROGRESS = { STANDUP: 0, PLANNING: 34, EXECUTION: 62, DEBRIEF: 100 }

export default function MissionOverview() {
  const { phase, readiness, decisions: approved, setDecisions: setApproved } = useOperation()

  const activeIdx = ACTIVE_IDX[phase]
  const progress = phase === 'STANDUP' ? Math.round(readiness * 0.3) : PROGRESS[phase]
  const risk = phase === 'EXECUTION' ? mission.riskLevel : phase === 'DEBRIEF' ? 'Low' : 'Baseline'

  return (
    <HudCard panelId="mission" title="Mission Overview" right={<StatusBadge status={risk} pulse tone={risk === 'Low' || risk === 'Baseline' ? 'green' : undefined} />} style={{ flex: 2, minHeight: 260 }}>
      <div style={{ fontSize: 12, letterSpacing: '0.12em', color: 'var(--green)', marginBottom: 3 }}>{mission.title}</div>
      <div style={{ fontSize: 10, lineHeight: 1.5, color: 'var(--text-dim)', marginBottom: 8 }}>{mission.objective}</div>

      <div className="progress-block" style={{ marginBottom: 10 }}>
        <div className="meter"><i style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--green), var(--cyan))' }} /></div>
        <span className="progress-label">{progress}%</span>
      </div>

      <div className="mini-title">PHASES</div>
      {mission.phases.map((p, i) => {
        const status = i < activeIdx ? 'Complete' : i === activeIdx ? 'Active' : 'Pending'
        return (
          <div key={p.name} className={`phase-row st-${status}`}>
            <span className="ph-dot" />
            <span style={{ flex: 1 }}>{p.name}</span>
            <span style={{ fontSize: 8, letterSpacing: '0.1em' }}>{status.toUpperCase()}</span>
          </div>
        )
      })}

      <div className="mini-title" style={{ marginTop: 10 }}>AI RECOMMENDATIONS</div>
      {mission.recommendations.slice(0, 4).map((r) => (
        <div key={r.id} className="rec-row">
          {r.text}
          <div className="rec-sources">
            {r.sources.map((s) => <span key={s} className="chip chip-muted" style={{ fontSize: 8 }}>{s}</span>)}
            <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 9 }}>{(r.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      ))}

      <div className="mini-title" style={{ marginTop: 10 }}>DECISION QUEUE</div>
      {mission.decisionQueue.map((d) => (
        <div key={d.id} className={`decision-row ${approved[d.id] ? 'approved' : ''}`}>
          <span className="dc-text">{d.text}</span>
          {approved[d.id]
            ? <span className="chip chip-green"><span className="dot" />APPROVED</span>
            : <button onClick={() => setApproved((a) => ({ ...a, [d.id]: true }))}>Approve</button>}
        </div>
      ))}
    </HudCard>
  )
}
