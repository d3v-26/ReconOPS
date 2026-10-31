// Center-stage container shared by every phase: a title row with optional actions, then the body.
export default function Pane({ eyebrow, title, sub, actions, children, className = '' }) {
  return (
    <section className={`pane ${className}`}>
      <header className="pane-head">
        <div className="pane-titles">
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h2 className="pane-title">{title}</h2>
          {sub && <p className="pane-sub">{sub}</p>}
        </div>
        {actions && <div className="pane-actions">{actions}</div>}
      </header>
      <div className="pane-body">{children}</div>
    </section>
  )
}
