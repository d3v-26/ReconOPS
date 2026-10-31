import { Drone, Cctv, Mic, Truck, Satellite, Users, Layers, FileText, ScanLine } from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'
import { assets } from '../data/mockData.js'
import { useOperation } from '../context/OperationContext.jsx'
import { useWindows } from '../context/WindowContext.jsx'

export const TYPE_ICON = {
  Drone, Camera: Cctv, 'Audio Sensor': Mic, Vehicle: Truck, Satellite, 'Human Team': Users,
  'Map Layer': Layers, 'Document Feed': FileText, '3D Scanner': ScanLine,
}

const LINK_STATUS = { pending: 'No link', handshake: 'Linking', linked: null }

export default function AssetPanel() {
  const { links } = useOperation()
  const { openProfile } = useWindows()

  return (
    <div className="list-panel">
      {assets.map((a) => {
        const Icon = TYPE_ICON[a.type] || Layers
        const st = links[a.id]
        const status = LINK_STATUS[st] || a.status
        return (
          <button key={a.id} className={`asset-row link-${st}`} onClick={() => openProfile(a.id)} title="Open dossier">
            <span className="asset-ico"><Icon size={16} /></span>
            <span className="asset-main">
              <span className="asset-name">{a.name} <span className="mono dim">{a.id}</span></span>
              <span className="asset-task">{a.task}</span>
              {st === 'linked' && (
                <span className="asset-bars">
                  <span className="bar"><i style={{ width: `${a.health}%` }} className={a.health < 60 ? 'low' : ''} /></span>
                  <span className="bar"><i style={{ width: `${a.signal}%` }} className={a.signal < 60 ? 'low' : ''} /></span>
                </span>
              )}
            </span>
            <StatusBadge status={status} tone={st === 'pending' ? 'muted' : st === 'handshake' ? 'amber' : undefined} />
          </button>
        )
      })}
    </div>
  )
}
