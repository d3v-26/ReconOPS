import { Siren, Rss, Boxes, Radio } from 'lucide-react'
import { useOperation } from '../context/OperationContext.jsx'
import ThreatPanel from './ThreatPanel.jsx'
import IntelligenceFeed from './IntelligenceFeed.jsx'
import AssetPanel from './AssetPanel.jsx'
import CommsPanel from './CommsPanel.jsx'

const TABS = [
  { id: 'alerts', label: 'Alerts', Icon: Siren },
  { id: 'intel', label: 'Intel', Icon: Rss },
  { id: 'assets', label: 'Assets', Icon: Boxes },
  { id: 'comms', label: 'Comms', Icon: Radio },
]

function Standby({ children }) {
  return <div className="empty">{children}</div>
}

export default function SidePanel() {
  const { sideTab, setSideTab, phase, criticalOpen, linkedCount } = useOperation()
  const live = phase === 'EXECUTION' || phase === 'DEBRIEF'
  const badge = { alerts: live ? criticalOpen.length : 0, comms: linkedCount }

  return (
    <aside className="side">
      <nav className="tabs" role="tablist">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} role="tab" aria-selected={sideTab === id} className={`tab ${sideTab === id ? 'active' : ''}`} onClick={() => setSideTab(id)}>
            <Icon size={14} /> {label}
            {badge[id] > 0 && <span className={`tab-badge ${id === 'alerts' ? 'red' : ''}`}>{badge[id]}</span>}
          </button>
        ))}
      </nav>
      <div className="side-body">
        {sideTab === 'alerts' && (live ? <ThreatPanel /> : (
          <Standby>
            <Siren size={22} />
            <b>Alerting is armed at execution</b>
            <span>{phase === 'STANDUP' ? 'Sensors are still onboarding — no trusted feeds yet.' : 'Thresholds are being derived from the plan.'}</span>
          </Standby>
        ))}
        {sideTab === 'intel' && (live ? <IntelligenceFeed /> : (
          <Standby>
            <Rss size={22} />
            <b>No live intel yet</b>
            <span>The AI feed starts streaming once collection begins.</span>
          </Standby>
        ))}
        {sideTab === 'assets' && <AssetPanel />}
        {sideTab === 'comms' && <CommsPanel />}
      </div>
    </aside>
  )
}
