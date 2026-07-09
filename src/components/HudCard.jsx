import { useWindows } from '../context/WindowContext.jsx'

export default function HudCard({ title, right, children, className = '', noPad = false, style, panelId }) {
  const win = useWindows()
  const managed = !!(panelId && win)
  const isMin = managed && win.minimized[panelId]
  const isMax = managed && win.maximized === panelId
  const dockable = managed && (win.layout.left.includes(panelId) || win.layout.right.includes(panelId))

  const mergedStyle = isMax
    ? { ...style, flex: undefined, minHeight: undefined }
    : isMin
      ? { ...style, display: 'none' }
      : style

  return (
    <>
      {isMax && <div className="max-backdrop" onClick={() => win.toggleMax(panelId)} />}
      <section className={`hud-card ${className} ${isMax ? 'maximized' : ''}`} style={mergedStyle}>
        <header
          className={`hud-card-header ${dockable ? 'draggable' : ''}`}
          draggable={dockable && !isMax}
          onDragStart={(e) => {
            if (!dockable) return
            e.dataTransfer.setData('text/panel', panelId)
            e.dataTransfer.effectAllowed = 'move'
            win.setDragging(panelId)
          }}
          onDragEnd={() => dockable && win.setDragging(null)}
        >
          <span className="hud-card-title">
            <span className="tick" />
            {title}
          </span>
          <span className="hud-card-right">
            {right}
            {managed && (
              <span className="win-controls">
                <button className="win-btn" title="Minimize to taskbar" onClick={() => win.toggleMin(panelId)}>—</button>
                <button className="win-btn" title={isMax ? 'Restore' : 'Maximize'} onClick={() => win.toggleMax(panelId)}>{isMax ? '❐' : '□'}</button>
              </span>
            )}
          </span>
        </header>
        <div className={`hud-card-body ${noPad ? 'no-pad' : ''}`}>{children}</div>
      </section>
    </>
  )
}
