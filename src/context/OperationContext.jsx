import { createContext, useContext, useMemo, useState } from 'react'
import { assets, seedTargets, OP_PHASES, mission } from '../data/mockData.js'

const OperationContext = createContext(null)

export function OperationProvider({ children }) {
  const [phase, setPhase] = useState('STANDUP')
  // comms link state per asset: 'pending' | 'handshake' | 'linked'
  const [links, setLinks] = useState(() => Object.fromEntries(assets.map((a) => [a.id, 'pending'])))
  const [targets, setTargets] = useState(seedTargets)
  const [taskings, setTaskings] = useState({})
  const [planApproved, setPlanApproved] = useState(false)

  // global UI state — owned here so the LLM console can drive everything
  const [mode, setMode] = useState('map')
  const [theater, setTheater] = useState('Global')
  const [threatFilter, setThreatFilter] = useState('All')
  const [feedFilters, setFeedFilters] = useState({ prio: 'All', media: 'All' })
  const [anomalyStatus, setAnomalyStatus] = useState({}) // id -> status override
  const [decisions, setDecisions] = useState({}) // decision id -> approved

  const linkedCount = Object.values(links).filter((s) => s === 'linked').length
  const readiness = Math.round((linkedCount / assets.length) * 100)

  const establishLink = (id) => {
    setLinks((l) => (l[id] === 'pending' ? { ...l, [id]: 'handshake' } : l))
    setTimeout(() => setLinks((l) => ({ ...l, [id]: 'linked' })), 1200 + Math.random() * 1400)
  }
  const linkAll = () => assets.forEach((a, i) => setTimeout(() => establishLink(a.id), i * 350))

  const phaseIndex = OP_PHASES.findIndex((p) => p.id === phase)
  // gates: what blocks advancing out of the current phase
  const gate = useMemo(() => {
    if (phase === 'STANDUP' && readiness < 100) return `${linkedCount}/${assets.length} assets linked — establish all comms links to proceed`
    if (phase === 'PLANNING' && !planApproved) return 'Operator must approve the operation plan to proceed'
    return null
  }, [phase, readiness, linkedCount, planApproved])

  const advance = () => {
    if (gate || phaseIndex >= OP_PHASES.length - 1) return false
    setPhase(OP_PHASES[phaseIndex + 1].id)
    return true
  }
  const regress = () => phaseIndex > 0 && setPhase(OP_PHASES[phaseIndex - 1].id)

  // jump toward a phase: backward always allowed, forward only one gated step at a time
  const goTo = (target) => {
    const ti = OP_PHASES.findIndex((p) => p.id === target)
    if (ti < 0) return { ok: false, reason: 'Unknown phase.' }
    if (ti === phaseIndex) return { ok: true, reason: 'Already there.' }
    if (ti < phaseIndex) { setPhase(target); return { ok: true } }
    if (ti === phaseIndex + 1) {
      if (gate) return { ok: false, reason: gate }
      setPhase(target)
      return { ok: true }
    }
    return { ok: false, reason: `Cannot skip phases — currently at ${OP_PHASES[phaseIndex].label}, next gate: ${gate || 'clear'}.` }
  }

  const approveAllDecisions = () => {
    setDecisions(Object.fromEntries(mission.decisionQueue.map((d) => [d.id, true])))
    return mission.decisionQueue.length
  }

  const value = {
    phase, phaseIndex, advance, regress, goTo, gate,
    links, establishLink, linkAll, linkedCount, readiness,
    targets, setTargets, taskings, setTaskings,
    planApproved, setPlanApproved,
    mode, setMode, theater, setTheater,
    threatFilter, setThreatFilter, feedFilters, setFeedFilters,
    anomalyStatus, setAnomalyStatus,
    decisions, setDecisions, approveAllDecisions,
  }
  return <OperationContext.Provider value={value}>{children}</OperationContext.Provider>
}

export function useOperation() {
  return useContext(OperationContext)
}
