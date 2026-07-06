import { useState } from 'react'
import HudCard from './HudCard.jsx'
import StatusBadge from './StatusBadge.jsx'
import { assets } from '../data/mockData.js'

function meterColor(v) {
  if (v > 75) return 'var(--green)'
  if (v > 45) return 'var(--amber)'
  return 'var(--red)'
}

export default function AssetPanel() {
  const [selected, setSelected] = useState(null)

  return (
    <HudCard
      title={`Asset Coordination · ${assets.length}`}
      right={<span className="chip chip-green"><span className="dot" />{assets.filter((a) => a.status === 'Active').length} ACTIVE</span>}
      style={{ flex: 3, minHeight: 240 }}
    >
      {assets.map((a) => (
        <div key={a.id} className={`asset-row ${selected === a.id ? 'selected' : ''}`}
          onClick={() => setSelected(selected === a.id ? null : a.id)}>
          <div>
            <div className="asset-name">{a.id} · {a.name}</div>
            <div className="asset-type">{a.type} → {a.dataType}</div>
          </div>
          <StatusBadge status={a.status} pulse={a.status === 'Active'} />
          <div className="asset-meters">
            <span className="lbl">HP</span>
            <div className="meter"><i style={{ width: `${a.health}%`, background: meterColor(a.health) }} /></div>
            <span className="lbl">SIG</span>
            <div className="meter"><i style={{ width: `${a.signal}%`, background: meterColor(a.signal) }} /></div>
          </div>
          {selected === a.id && (
            <div className="threat-detail" style={{ gridColumn: '1 / -1' }}>
              <b>TASK:</b> {a.task}<br />
              <b>LAST UPDATE:</b> T-{a.lastUpdate} · <b>HEALTH:</b> {a.health}% · <b>SIGNAL:</b> {a.signal}%
            </div>
          )}
        </div>
      ))}
    </HudCard>
  )
}
