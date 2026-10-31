import { useRef, useState } from 'react'
import { Sparkles, ChevronUp, ChevronDown, CornerDownLeft, Loader2 } from 'lucide-react'
import { useOperation } from '../context/OperationContext.jsx'
import { routeCommand } from '../lib/commandRouter.js'
import { consoleSuggestions } from '../data/mockData.js'

const BOOT = [{ type: 'sys', text: 'Ask anything or give an order in plain language — e.g. "what\'s next?", "open video thermal", "approve plan".' }]

// AI assistant bar: natural language drives the whole app (modes, phases, filters, media actions).
export default function CommandConsole() {
  const ops = useOperation()
  const [lines, setLines] = useState(BOOT)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [expanded, setExpanded] = useState(false)
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
    }, 500 + Math.random() * 400)
  }

  const suggestions = consoleSuggestions[ops.phase] || []
  const shown = expanded ? lines : lines.slice(-2)

  return (
    <section className={`assistant ${expanded ? 'expanded' : ''}`}>
      <div className="assistant-log" ref={logRef}>
        {shown.map((l, i) => (
          <div key={i} className={`a-line ${l.type}`}>{l.type === 'cmd' ? <b>You</b> : l.type === 'resp' ? <b>AI</b> : null}{l.text}</div>
        ))}
        {thinking && <div className="a-line sys"><Loader2 size={12} className="spin" /> Resolving intent…</div>}
      </div>
      <div className="assistant-row">
        <Sparkles size={16} className="assistant-ico" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run(input.trim())}
          placeholder="Ask the AI or give an order…"
          spellCheck={false}
          aria-label="Command"
        />
        <div className="chips">
          {suggestions.slice(0, 4).map((s) => <button key={s} className="chip-btn" onClick={() => run(s)}>{s}</button>)}
        </div>
        <button className="btn icon-btn" onClick={() => run(input.trim())} aria-label="Send"><CornerDownLeft size={14} /></button>
        <button className="btn icon-btn" onClick={() => { setExpanded(!expanded); scrollDown() }} aria-label={expanded ? 'Collapse log' : 'Expand log'}>
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>
    </section>
  )
}
