import { useEffect, useState } from 'react'
import { Check, Radar } from 'lucide-react'
import { useOperation } from '../context/OperationContext.jsx'
import { OP_PHASES, mission, AO } from '../data/mockData.js'

// Simulated mission clock — starts at 13:52Z, the operation's H-hour.
function MissionClock() {
  const [t, setT] = useState(13 * 3600 + 52 * 60)
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const p = (n) => String(n).padStart(2, '0')
  return (
    <div className="clock">
      <span className="clock-time">{p(Math.floor(t / 3600) % 24)}:{p(Math.floor(t / 60) % 60)}:{p(t % 60)}Z</span>
      <span className="clock-label">Window closes {mission.deadline}</span>
    </div>
  )
}

export default function TopBar() {
  const { phaseIndex, goTo } = useOperation()
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark"><Radar size={18} /></span>
        <span className="brand-text">
          <b>ReconOps</b>
          <small>Ghost Command</small>
        </span>
      </div>

      <div className="op-title">
        <span className="op-name">{mission.title.replace('OPERATION ', 'Op. ')}</span>
        <span className="op-ao">{AO.name} · AI-assisted ISR</span>
      </div>

      <ol className="stepper" aria-label="Operation phases">
        {OP_PHASES.map((p, i) => {
          const state = i < phaseIndex ? 'done' : i === phaseIndex ? 'current' : 'todo'
          return (
            <li key={p.id} className={`step step-${state}`}>
              <button disabled={i > phaseIndex} onClick={() => goTo(p.id)} title={p.desc}>
                <span className="step-num">{state === 'done' ? <Check size={12} strokeWidth={3} /> : i + 1}</span>
                <span className="step-label">{p.label.charAt(0) + p.label.slice(1).toLowerCase()}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <MissionClock />
      <span className="preview-pill" title="Every feed, alert and asset in this build is simulated.">Preview · simulated data</span>
    </header>
  )
}
