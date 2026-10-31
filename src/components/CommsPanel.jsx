import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { useOperation } from '../context/OperationContext.jsx'
import { useWindows } from '../context/WindowContext.jsx'
import { commsTraffic } from '../data/mockData.js'

function stamp() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

export default function CommsPanel() {
  const { phase, linkedCount } = useOperation()
  const { openProfile } = useWindows()
  const [log, setLog] = useState([])
  const [input, setInput] = useState('')
  const idxRef = useRef(0)
  const logRef = useRef(null)

  // stream phase-appropriate traffic from linked assets
  useEffect(() => {
    idxRef.current = 0
    setLog([{ t: stamp(), from: 'NET CONTROL', text: `Switched to ${phase} traffic. ${linkedCount} stations on net.`, sys: true }])
    const id = setInterval(() => {
      const pool = commsTraffic[phase] || []
      if (!pool.length) return
      const msg = pool[idxRef.current % pool.length]
      idxRef.current += 1
      setLog((l) => [...l.slice(-30), { t: stamp(), ...msg }])
    }, 5200)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [log])

  const transmit = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setLog((l) => [...l, { t: stamp(), from: 'OPERATOR → ALL', text, op: true }])
    setTimeout(() => setLog((l) => [...l, { t: stamp(), from: 'VANGUARD', text: 'Copy last, OPERATOR. Wilco.' }]), 1800)
  }

  return (
    <div className="comms">
      <div className="comms-log" ref={logRef}>
        {log.map((m, i) => (
          <div key={i} className={`comms-line ${m.sys ? 'sys' : ''} ${m.op ? 'op' : ''}`}>
            <span className="ct mono">{m.t}</span>
            {!m.sys && !m.op
              ? <button className="cf cf-link" title="Open station dossier" onClick={() => openProfile(m.from)}>{m.from}</button>
              : <span className="cf">{m.from}</span>}
            <span className="cx">{m.text}</span>
          </div>
        ))}
      </div>
      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && transmit()}
          placeholder="Transmit to all stations…"
          spellCheck={false}
        />
        <button className="btn icon-btn" onClick={transmit} aria-label="Transmit"><Send size={14} /></button>
      </div>
    </div>
  )
}
