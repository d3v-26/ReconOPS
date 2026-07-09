import { useRef, useState } from 'react'
import HudCard from './HudCard.jsx'
import { useOperation } from '../context/OperationContext.jsx'
import { routeCommand } from '../lib/commandRouter.js'
import { consoleSuggestions } from '../data/mockData.js'

const BOOT = [
  { type: 'sys', text: 'GHOST COMMAND LLM CONSOLE v0.2 — PREVIEW MODE. Natural-language control enabled: workspace modes, theater, phases, filters, media actions, briefings.' },
]

export default function CommandConsole() {
  const ops = useOperation()
  const [lines, setLines] = useState(BOOT)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const logRef = useRef(null)

  const scrollDown = () => requestAnimationFrame(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  })

  const run = (cmd) => {
    if (!cmd || thinking) return
    setInput('')
    setLines((l) => [...l, { type: 'cmd', text: cmd }])
    setThinking(true)
    scrollDown()
    setTimeout(() => {
      const { text } = routeCommand(cmd, ops)
      setLines((l) => [...l, { type: 'resp', text }])
      setThinking(false)
      scrollDown()
    }, 700 + Math.random() * 600)
  }

  const suggestions = consoleSuggestions[ops.phase] || []

  return (
    <HudCard
      panelId="console"
      title="LLM Command Console"
      right={thinking
        ? <span className="thinking">REASONING <i /><i /><i /></span>
        : <span className="chip chip-green"><span className="dot" />CONTROL LINK ACTIVE</span>}
      noPad
      style={{ flexShrink: 0 }}
    >
      <div className="console-log" ref={logRef}>
        {lines.map((l, i) => (
          <div key={i} className={`console-line ${l.type}`}>{l.text}</div>
        ))}
        {thinking && <div className="console-line sys">LLM parsing command… resolving intent → tool call…</div>}
      </div>
      <div className="console-suggest">
        {suggestions.map((s) => (
          <button key={s} onClick={() => run(s)}>▸ {s}</button>
        ))}
      </div>
      <div className="console-input-row">
        <span className="console-prompt">▸</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run(input.trim())}
          placeholder="Command the system in natural language — modes, theaters, phases, filters, actions…"
          spellCheck={false}
        />
        <button className="btn-green" onClick={() => run(input.trim())}>Execute</button>
      </div>
    </HudCard>
  )
}
