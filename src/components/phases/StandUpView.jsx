import { Zap, CheckCircle2, Circle, Loader2 } from 'lucide-react'
import Pane from '../Pane.jsx'
import TacticalMap from '../TacticalMap.jsx'
import { TYPE_ICON } from '../AssetPanel.jsx'
import { useOperation } from '../../context/OperationContext.jsx'
import { useWindows } from '../../context/WindowContext.jsx'
import { assets, onboardingChecklist } from '../../data/mockData.js'

export default function StandUpView() {
  const { links, establishLink, linkAll, linkedCount, readiness } = useOperation()
  const { openProfile } = useWindows()

  const checkDone = (chk) => (chk.auto ? linkedCount > 0 : chk.linkGate.every((id) => links[id] === 'linked'))

  return (
    <Pane
      eyebrow="Phase 1 · Stand-up"
      title="Bring every sensor onto the command net"
      sub="Each asset authenticates, exchanges keys and calibrates. The AI only trusts data from linked assets."
      actions={
        <>
          <div className="progress">
            <div className="progress-bar"><i style={{ width: `${readiness}%` }} /></div>
            <span className="mono">{linkedCount}/12</span>
          </div>
          <button className="btn btn-accent" onClick={linkAll} disabled={readiness === 100}><Zap size={14} /> Link all</button>
        </>
      }
    >
      <div className="split">
        <div className="map-wrap">
          <TacticalMap show={{ assets: true, pois: true }} links={links} onSelect={openProfile} />
          <div className="map-caption">Asset positions · grey = offline, cyan = linked</div>
        </div>
        <div className="split-side">
          <div className="eyebrow">Checklist</div>
          <ul className="criteria compact">
            {onboardingChecklist.map((c) => {
              const done = checkDone(c)
              return (
                <li key={c.id} className={done ? 'done' : ''}>
                  {done ? <CheckCircle2 size={15} /> : <Circle size={15} />}<span>{c.label}</span>
                </li>
              )
            })}
          </ul>
          <div className="eyebrow" style={{ marginTop: 16 }}>Assets</div>
          <div className="roster">
            {assets.map((a) => {
              const Icon = TYPE_ICON[a.type]
              const st = links[a.id]
              return (
                <div key={a.id} className={`roster-row link-${st}`}>
                  <Icon size={14} />
                  <span className="roster-name">{a.name}</span>
                  {st === 'pending' && <button className="btn btn-xs" onClick={() => establishLink(a.id)}>Link</button>}
                  {st === 'handshake' && <span className="roster-st amber"><Loader2 size={12} className="spin" /> Keys</span>}
                  {st === 'linked' && <span className="roster-st green">Linked</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Pane>
  )
}
