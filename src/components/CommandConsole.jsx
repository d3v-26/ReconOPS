import { useRef, useState } from 'react'
import HudCard from './HudCard.jsx'
import { consoleResponses, consoleFallback } from '../data/mockData.js'

const BOOT = [
  { type: 'sys', text: 'GHOST COMMAND LLM CONSOLE v0.1 — PREVIEW MODE. Natural-language tasking enabled.' },
  { type: 'sys', text: 'Try: "summarize current mission risk" · "generate operator briefing" · "show all high-confidence anomalies"' },
]

export default function CommandConsole() {
  const [lines, setLines] = useState(BOOT)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const logRef = useRef(null)

  const scrollDown = () => requestAnimationFrame(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  })

  const submit = () => {
    const cmd = input.trim()
    if (!cmd || thinking) return
    setInput('')
    setLines((l) => [...l, { type: 'cmd', text: cmd }])
    setThinking(true)
    scrollDown()
    const lower = cmd.toLowerCase()
    const hit = consoleResponses.find((r) => r.match.some((m) => lower.includes(m)))
    setTimeout(() => {
      setLines((l) => [...l, { type: 'resp', text: hit ? hit.response : consoleFallback }])
      setThinking(false)
      scrollDown()
    }, 900 + Math.random() * 700)
  }

  return (
    <HudCard
      title="LLM Command Console"
      right={thinking
        ? <span className="thinking">REASONING <i /><i /><i /></span>
        : <span className="chip chip-green"><span className="dot" />READY</span>}
      noPad
      style={{ flexShrink: 0 }}
    >
      <div className="console-log" ref={logRef}>
        {lines.map((l, i) => (
          <div key={i} className={`console-line ${l.type}`}>{l.text}</div>
        ))}
        {thinking && <div className="console-line sys">LLM parsing command… fusing multimodal context…</div>}
      </div>
      <div className="console-input-row">
        <span className="console-prompt">▸</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Enter natural-language command…"
          spellCheck={false}
        />
        <button className="btn-green" onClick={submit}>Execute</button>
      </div>
    </HudCard>
  )
}
