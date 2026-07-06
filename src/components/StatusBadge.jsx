const TONE = {
  // system / asset statuses
  Online: 'green', Active: 'green', Complete: 'green', Approved: 'green', Baseline: 'green', Holding: 'green',
  Degraded: 'amber', Rerouting: 'amber', 'Awaiting Command': 'amber', Processing: 'cyan', Pending: 'muted',
  Offline: 'red', Unregistered: 'red', Watched: 'amber',
  // severities / priorities
  Critical: 'red', High: 'amber', Medium: 'cyan', Low: 'muted', Elevated: 'amber',
  // review statuses
  Unreviewed: 'red', 'In Review': 'amber', 'Human Review': 'amber', Deferred: 'muted', Monitoring: 'cyan',
}

export default function StatusBadge({ status, pulse = false, tone }) {
  const t = tone || TONE[status] || 'muted'
  return (
    <span className={`chip chip-${t} ${pulse ? 'pulse' : ''}`}>
      <span className="dot" />
      {status}
    </span>
  )
}
