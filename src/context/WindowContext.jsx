import { createContext, useContext, useRef, useState } from 'react'

// Floating dossier windows — any clickable entity (asset, track, contact) opens one.

const WindowContext = createContext(null)

export function WindowProvider({ children }) {
  const [floats, setFloats] = useState([]) // [{ key, profileId, x, y, z }]
  const zRef = useRef(10)

  const openProfile = (profileId) => {
    if (!profileId) return
    setFloats((f) => {
      const hit = f.find((w) => w.profileId === profileId)
      if (hit) return f.map((w) => (w === hit ? { ...w, z: ++zRef.current } : w))
      const n = f.length
      return [...f, {
        key: `${profileId}-${Date.now()}`,
        profileId,
        x: Math.max(16, window.innerWidth / 2 - 220 + (n % 5) * 28),
        y: 110 + (n % 5) * 26,
        z: ++zRef.current,
      }]
    })
  }
  const closeProfile = (key) => setFloats((f) => f.filter((w) => w.key !== key))
  const focusProfile = (key) => setFloats((f) => f.map((w) => (w.key === key ? { ...w, z: ++zRef.current } : w)))
  const moveProfile = (key, x, y) => setFloats((f) => f.map((w) => (w.key === key ? { ...w, x, y } : w)))

  const value = { floats, openProfile, closeProfile, focusProfile, moveProfile }
  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
}

export function useWindows() {
  return useContext(WindowContext)
}
