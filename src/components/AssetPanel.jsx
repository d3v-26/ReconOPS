import HudCard from './HudCard.jsx'
import StatusBadge from './StatusBadge.jsx'
import AssetIcon, { TYPE_ICON } from './AssetIcon.jsx'
import { assets } from '../data/mockData.js'
import { useWindows } from '../context/WindowContext.jsx'

function meterColor(v) {
  if (v > 75) return 'var(--green)'
  if (v > 45) return 'var(--amber)'
  return 'var(--red)'
}

export default function AssetPanel() {
  const { openProfile, floats } = useWindows()
  const openIds = new Set(floats.map((f) => f.profileId))

  return (
    <HudCard
      panelId="assets"
      title={`Asset Coordination · ${assets.length}`}
      right={<span className="chip chip-green"><span className="dot" />{assets.filter((a) => a.status === 'Active').length} ACTIVE</span>}
      style={{ flex: 3, minHeight: 220 }}
    >
      {assets.map((a) => (
        <div key={a.id} className={`asset-row with-icon ${openIds.has(a.id) ? 'selected' : ''}`}
          title="Open dossier"
          onClick={() => openProfile(a.id)}>
          <div className="asset-ico">
            <AssetIcon kind={TYPE_ICON[a.type] || 'structure'} size={22} color={a.status === 'Offline' ? 'var(--muted)' : 'var(--cyan)'} />
          </div>
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
        </div>
      ))}
    </HudCard>
  )
}
