import { createContext, useContext, useRef, useState } from 'react'

// Window manager: dockable side panels (minimize / maximize / drag between
// columns) + floating dossier windows + bottom taskbar.

const WindowContext = createContext(null)

const DEFAULT_LAYOUT = {
  left: ['mission', 'assets', 'diagnostics'],
  right: ['feed', 'comms', 'threats', 'briefing'],
}

export const PANEL_TITLES = {
  mission: 'Mission Overview',
  assets: 'Asset Coordination',
  diagnostics: 'System Diagnostics',
  feed: 'Intel Feed',
  comms: 'Comms Net',
  threats: 'Threat Detection',
  briefing: 'Operator Briefing',
  workspace: 'Workspace',
  console: 'LLM Console',
}

export function WindowProvider({ children }) {
  const [layout, setLayout] = useState(DEFAULT_LAYOUT)
  const [minimized, setMinimized] = useState({})
  const [maximized, setMaximized] = useState(null)
  const [dragging, setDragging] = useState(null) // panel id being dragged
  const [floats, setFloats] = useState([]) // [{ key, profileId, x, y, z, min }]
  const zRef = useRef(10)

  const toggleMin = (id) => {
    setMinimized((m) => ({ ...m, [id]: !m[id] }))
    setMaximized((mx) => (mx === id ? null : mx))
  }
  const toggleMax = (id) => setMaximized((mx) => (mx === id ? null : id))

  const movePanel = (id, col, index) => {
    setLayout((l) => {
      if (!l.left.includes(id) && !l.right.includes(id)) return l
      const next = { left: l.left.filter((p) => p !== id), right: l.right.filter((p) => p !== id) }
      const list = [...next[col]]
      const i = index == null ? list.length : Math.max(0, Math.min(index, list.length))
      list.splice(i, 0, id)
      next[col] = list
      return next
    })
  }

  const openProfile = (profileId) => {
    if (!profileId) return
    setFloats((f) => {
      const hit = f.find((w) => w.profileId === profileId)
      if (hit) return f.map((w) => (w === hit ? { ...w, min: false, z: ++zRef.current } : w))
      const n = f.length
      return [...f, {
        key: `${profileId}-${Date.now()}`,
        profileId,
        x: 90 + (n % 6) * 36,
        y: 70 + (n % 6) * 30,
        z: ++zRef.current,
        min: false,
      }]
    })
  }
  const closeProfile = (key) => setFloats((f) => f.filter((w) => w.key !== key))
  const focusProfile = (key) => setFloats((f) => f.map((w) => (w.key === key ? { ...w, z: ++zRef.current } : w)))
  const minProfile = (key, min = true) => setFloats((f) => f.map((w) => (w.key === key ? { ...w, min, z: min ? w.z : ++zRef.current } : w)))
  const moveProfile = (key, x, y) => setFloats((f) => f.map((w) => (w.key === key ? { ...w, x, y } : w)))

  const value = {
    layout, movePanel,
    minimized, toggleMin,
    maximized, toggleMax,
    dragging, setDragging,
    floats, openProfile, closeProfile, focusProfile, minProfile, moveProfile,
  }
  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
}

export function useWindows() {
  return useContext(WindowContext)
}
