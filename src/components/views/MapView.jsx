import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import TacticalMap from '../TacticalMap.jsx'
import { useOperation } from '../../context/OperationContext.jsx'
import { useWindows } from '../../context/WindowContext.jsx'
import { areaSummary } from '../../data/mockData.js'

const LEGEND = [
  ['cyan', 'Friendly asset'], ['red', 'Unregistered contact'], ['red', 'Geofence GF-2', 'ring'],
  ['amber', 'Threat ring THR-2', 'ring'], ['green', 'Safe corridor / patrol', 'ring'],
]

export default function MapView() {
  const { targets } = useOperation()
  const { openProfile } = useWindows()
  const [summary, setSummary] = useState(null)
  const [thinking, setThinking] = useState(false)

  const synth = () => {
    setThinking(true)
    setTimeout(() => { setThinking(false); setSummary(areaSummary) }, 1100)
  }

  return (
    <div className="map-wrap full">
      <TacticalMap
        show={{ assets: true, zones: true, paths: true, contact: true, pois: true, targets: true }}
        targets={targets.slice(1)}
        onSelect={openProfile}
      />
      <div className="map-legend">
        {LEGEND.map(([tone, label, kind]) => (
          <span key={label}><i className={`lg lg-${tone} ${kind || ''}`} />{label}</span>
        ))}
      </div>
      <div className="map-card">
        {!summary && !thinking && (
          <button className="btn" onClick={synth}><Sparkles size={14} /> Summarize this area</button>
        )}
        {thinking && <span className="dim"><Loader2 size={14} className="spin" /> Fusing tracks, zones and sensor health…</span>}
        {summary && <p className="ai-note">{summary}</p>}
      </div>
    </div>
  )
}
