import { useEffect, useRef, useState } from 'react'
import { Sparkles, CornerDownLeft, Loader2 } from 'lucide-react'
import { useOperation } from '../context/OperationContext.jsx'
import { routeCommand } from '../lib/commandRouter.js'
import { suggestions } from '../data/mockData.js'

// Natural language is the second way to drive everything — the first is clicking the map.
export default function CommandBar() {
  const ops = useOperation()
  const [lines, setLines] = useState([{ who: 'ai', text: 'Click anything on the map, or tell me what to do. Try "what\'s next?"' }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const inputRef = useRef(null)
  const opsRef = useRef(ops)
  opsRef.current = ops

  // "/" focuses the bar from anywhere, like a game chat key
  useEffect(() => {
    const onKey = (e) => { if (e.key === '/' && document.activeElement !== inputRef.current) { e.preventDefault(); inputRef.current?.focus() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const run = (cmd) => {
    if (!cmd || thinking) return
    setInput('')
    setLines((l) => [...l.slice(-3), { who: 'you', text: cmd }])
    setThinking(true)
    setTimeout(() => {
      const text = routeCommand(cmd, opsRef.current)
      setLines((l) => [...l.slice(-3), { who: 'ai', text }])
      setThinking(false)
    }, 350 + Math.random() * 300)
  }

  return (
    <div className="cmdbar">
      <ol className="cmd-log">
        {lines.slice(-2).map((l, i) => <li key={i} className={l.who}><b>{l.who === 'ai' ? 'AI' : 'You'}</b>{l.text}</li>)}
        {thinking && <li className="ai"><b>AI</b><Loader2 size={12} className="spin" /></li>}
      </ol>
      <div className="cmd-row">
        <Sparkles size={16} className="cmd-ico" />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') run(input.trim()); if (e.key === 'Escape') inputRef.current.blur() }}
          placeholder='Give an order — "open the truck", "send specter 2 to the ridge", "thermal"…'
          spellCheck={false}
          aria-label="Command"
        />
        <kbd>/</kbd>
        <button className="cmd-send" onClick={() => run(input.trim())} aria-label="Send"><CornerDownLeft size={14} /></button>
      </div>
      <div className="cmd-chips">
        {(suggestions[ops.phase] || []).map((s) => <button key={s} onClick={() => run(s)}>{s}</button>)}
      </div>
    </div>
  )
}
