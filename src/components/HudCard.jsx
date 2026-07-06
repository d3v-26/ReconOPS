export default function HudCard({ title, right, children, className = '', noPad = false, style }) {
  return (
    <section className={`hud-card ${className}`} style={style}>
      <header className="hud-card-header">
        <span className="hud-card-title">
          <span className="tick" />
          {title}
        </span>
        {right}
      </header>
      <div className={`hud-card-body ${noPad ? 'no-pad' : ''}`}>{children}</div>
    </section>
  )
}
