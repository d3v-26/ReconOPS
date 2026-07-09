import { useEffect, useState } from 'react'
import StatusBadge from './StatusBadge.jsx'
import { ENVIRONMENTS } from '../data/mockData.js'
import { useOperation } from '../context/OperationContext.jsx'

function useMissionClock() {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const h = String(Math.floor(elapsed / 3600) + 2).padStart(2, '0')
  const m = String(Math.floor((elapsed % 3600) / 60) + 41).padStart(2, '0')
  const s = String(elapsed % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

// Isolated so the 1s tick doesn't re-render the whole header — a re-render of the
// controlled THEATER <select> while its native popup is open closes the popup.
function MissionClock() {
  const clock = useMissionClock()
  return (
    <div className="mission-clock">
      <div className="clock-time">{clock}</div>
      <div className="clock-label">MISSION CLOCK</div>
    </div>
  )
}

// CoD-style compass tape — decorative heading strip with drift.
function CompassTape() {
  const marks = []
  const LABELS = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' }
  for (let d = 0; d < 360; d += 15) {
    marks.push({ d, label: LABELS[d] })
  }
  return (
    <div className="compass" title="HDG 042 — SPECTER-1 sensor heading">
      <div className="compass-tape">
        {[...marks, ...marks].map((m, i) => (
          <span key={i} className={`compass-mark ${m.label ? 'cardinal' : ''}`}>
            {m.label || String(m.d).padStart(3, '0')}
          </span>
        ))}
      </div>
      <div className="compass-needle">▼</div>
      <div className="compass-hdg">HDG 042</div>
    </div>
  )
}

export default function CommandHeader() {
  const { theater, setTheater } = useOperation()
  return (
    <header className="cmd-header">
      <div className="brand">
        <span className="brand-name">
          <span className="ghost">GHOST COMMAND</span> :: RECONOPS
        </span>
        <span className="brand-sub">TACMAP · Multimodal Intelligence Layer</span>
      </div>

      <span className="preview-badge">◈ PREVIEW MODE — MOCK DATA</span>

      <div className="header-status">
        <StatusBadge status="Online" tone="green" pulse />
        <span className="chip chip-cyan pulse"><span className="dot" />SAM-H SEG LAYER</span>
        <span className="chip chip-green pulse"><span className="dot" />LLM REASONING</span>
        <span className="chip chip-cyan"><span className="dot" />INGESTION ×9</span>
      </div>

      <CompassTape />

      <div className="header-right">
        <div className="env-select">
          <label htmlFor="env">THEATER</label>
          <select id="env" value={theater} onChange={(e) => setTheater(e.target.value)}>
            {ENVIRONMENTS.map((env) => (
              <option key={env} value={env}>{env}</option>
            ))}
          </select>
        </div>
        <MissionClock />
      </div>
    </header>
  )
}
