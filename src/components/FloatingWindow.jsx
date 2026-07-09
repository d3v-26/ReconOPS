import { useRef } from 'react'
import { useWindows } from '../context/WindowContext.jsx'

// Draggable floating window (dossier viewer). Drag by header, pointer-based.
export default function FloatingWindow({ win, title, accent = 'var(--cyan)', children }) {
  const { closeProfile, focusProfile, minProfile, moveProfile } = useWindows()
  const dragRef = useRef(null)

  const onPointerDown = (e) => {
    if (e.target.closest('button')) return
    const start = { px: e.clientX, py: e.clientY, x: win.x, y: win.y }
    dragRef.current = start
    e.currentTarget.setPointerCapture(e.pointerId)
    focusProfile(win.key)
  }
  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    const x = Math.max(-260, Math.min(window.innerWidth - 120, d.x + e.clientX - d.px))
    const y = Math.max(0, Math.min(window.innerHeight - 60, d.y + e.clientY - d.py))
    moveProfile(win.key, x, y)
  }
  const onPointerUp = () => { dragRef.current = null }

  if (win.min) return null

  return (
    <div
      className="float-win"
      style={{ left: win.x, top: win.y, zIndex: 400 + win.z, '--accent': accent }}
      onMouseDown={() => focusProfile(win.key)}
    >
      <header
        className="float-head"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <span className="float-title"><span className="tick" style={{ background: accent, boxShadow: `0 0 6px ${accent}` }} />{title}</span>
        <span className="win-controls">
          <button className="win-btn" title="Minimize to taskbar" onClick={() => minProfile(win.key)}>—</button>
          <button className="win-btn" title="Close" onClick={() => closeProfile(win.key)}>✕</button>
        </span>
      </header>
      <div className="float-body">{children}</div>
    </div>
  )
}
