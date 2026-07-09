import FloatingWindow from './FloatingWindow.jsx'
import AssetIcon from './AssetIcon.jsx'
import StatusBadge from './StatusBadge.jsx'
import { getProfile, FACTION_COLOR } from '../data/profiles.js'
import { assets, feedEvents, anomalies } from '../data/mockData.js'
import { useOperation } from '../context/OperationContext.jsx'
import { useWindows } from '../context/WindowContext.jsx'

// Dossier window for any clickable entity (asset, contact, person, POI).
export default function ProfileWindow({ win }) {
  const p = getProfile(win.profileId)
  const accent = FACTION_COLOR[p.faction] || 'var(--cyan)'
  const asset = assets.find((a) => a.id === p.id || a.name === p.name)
  const { setMode, phase } = useOperation()
  const { closeProfile } = useWindows()

  const needle = (p.name.split(' ')[0] || p.id).replace(/[^A-Z0-9-]/gi, '')
  const related = [
    ...anomalies.filter((a) => (a.title + a.detail + a.source).toUpperCase().includes(p.id.toUpperCase())
      || (a.title + a.detail).toUpperCase().includes(needle.toUpperCase())),
    ...feedEvents.filter((e) => (e.sourceName + e.summary).toUpperCase().includes(needle.toUpperCase())),
  ].slice(0, 3)

  const locate = () => { if (phase === 'EXECUTION') setMode('map') }

  return (
    <FloatingWindow win={win} title={`DOSSIER · ${p.id}`} accent={accent}>
      <div className="dossier">
        <div className="dossier-top">
          <div className="portrait" style={{ '--accent': accent }}>
            <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
            <AssetIcon kind={p.icon} size={86} color={accent} />
            <div className="portrait-tag">{p.faction === 'UNKNOWN' || p.icon === 'person' || p.icon === 'voice' ? 'NO PHOTO ON FILE — SILHOUETTE' : 'REFERENCE SILHOUETTE'}</div>
          </div>
          <div className="dossier-id">
            <div className="dossier-name">{p.name}</div>
            <div className="dossier-cls">{p.cls}</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 6 }}>
              <span className="chip" style={{ color: accent, borderColor: accent, background: 'transparent' }}>
                <span className="dot" />{p.faction}
              </span>
              {asset && <StatusBadge status={asset.status} pulse={asset.status === 'Active'} />}
            </div>
            {asset && (
              <div className="asset-meters" style={{ marginTop: 8 }}>
                <span className="lbl">HP</span>
                <div className="meter"><i style={{ width: `${asset.health}%`, background: asset.health > 60 ? 'var(--green)' : 'var(--red)' }} /></div>
                <span className="lbl">SIG</span>
                <div className="meter"><i style={{ width: `${asset.signal}%`, background: asset.signal > 60 ? 'var(--green)' : 'var(--red)' }} /></div>
              </div>
            )}
          </div>
        </div>

        <div className="ai-text" style={{ borderLeftColor: accent, marginBottom: 8 }}>{p.desc}</div>

        <div className="mini-title">SPECIFICATIONS</div>
        <div className="dossier-specs">
          {p.specs.map(([k, v]) => (
            <div className="kv" key={k}><span className="k">{k}</span><span className="v">{v}</span></div>
          ))}
        </div>

        {p.record.length > 0 && (
          <>
            <div className="mini-title" style={{ marginTop: 8 }}>ACTIVITY LOG</div>
            {p.record.map((r, i) => (
              <div key={i} className="dossier-log">{r}</div>
            ))}
          </>
        )}

        {related.length > 0 && (
          <>
            <div className="mini-title" style={{ marginTop: 8 }}>LINKED INTEL</div>
            {related.map((r, i) => (
              <div key={i} className="dossier-log" style={{ color: 'var(--text)' }}>
                <span style={{ color: 'var(--amber)' }}>{r.id}</span> — {r.title || r.summary}
              </div>
            ))}
          </>
        )}

        <div className="dossier-ops">{p.ops}</div>

        <div className="threat-actions" style={{ marginTop: 8 }}>
          <button className="btn-green" onClick={locate}>⌖ Locate on Map</button>
          <button onClick={() => closeProfile(win.key)}>Close Dossier</button>
        </div>
      </div>
    </FloatingWindow>
  )
}
