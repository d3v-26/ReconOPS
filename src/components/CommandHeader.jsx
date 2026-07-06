import { useEffect, useState } from 'react'
import StatusBadge from './StatusBadge.jsx'
import { ENVIRONMENTS } from '../data/mockData.js'

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

export default function CommandHeader({ environment, onEnvironmentChange }) {
  const clock = useMissionClock()
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

      <div className="header-right">
        <div className="env-select">
          <label htmlFor="env">THEATER</label>
          <select id="env" value={environment} onChange={(e) => onEnvironmentChange(e.target.value)}>
            {ENVIRONMENTS.map((env) => (
              <option key={env} value={env}>{env}</option>
            ))}
          </select>
        </div>
        <div className="mission-clock">
          <div className="clock-time">{clock}</div>
          <div className="clock-label">MISSION CLOCK</div>
        </div>
      </div>
    </header>
  )
}
