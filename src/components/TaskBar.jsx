import { useWindows, PANEL_TITLES } from '../context/WindowContext.jsx'
import { getProfile, FACTION_COLOR } from '../data/profiles.js'

// Bottom taskbar: every screen is a tab. Click toggles minimize/restore.
export default function TaskBar({ panelIds }) {
  const { minimized, toggleMin, maximized, floats, minProfile, closeProfile } = useWindows()

  return (
    <div className="taskbar">
      <span className="taskbar-label">SCREENS</span>
      {panelIds.map((id) => {
        const min = !!minimized[id]
        return (
          <button
            key={id}
            className={`task-tab ${min ? 'min' : 'open'} ${maximized === id ? 'max' : ''}`}
            title={min ? 'Restore screen' : 'Minimize screen'}
            onClick={() => toggleMin(id)}
          >
            <span className="task-dot" />{PANEL_TITLES[id] || id}
          </button>
        )
      })}
      {floats.length > 0 && <span className="taskbar-sep" />}
      {floats.map((w) => {
        const p = getProfile(w.profileId)
        return (
          <button
            key={w.key}
            className={`task-tab dossier-tab ${w.min ? 'min' : 'open'}`}
            style={{ '--accent': FACTION_COLOR[p.faction] || 'var(--cyan)' }}
            onClick={() => minProfile(w.key, !w.min)}
            title={w.min ? 'Restore dossier' : 'Minimize dossier'}
          >
            <span className="task-dot" />{p.id}
            <span
              className="task-close"
              onClick={(e) => { e.stopPropagation(); closeProfile(w.key) }}
              title="Close dossier"
            >✕</span>
          </button>
        )
      })}
    </div>
  )
}
