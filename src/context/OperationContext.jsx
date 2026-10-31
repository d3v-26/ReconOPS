import { createContext, useContext, useMemo, useState } from 'react'
import { assets, anomalies, seedTargets, OP_PHASES, mission, evidenceSources, EVIDENCE_BASE, EVIDENCE_REQUIRED } from '../data/mockData.js'

const OperationContext = createContext(null)

const CRITICAL_IDS = anomalies.filter((a) => a.severity === 'Critical').map((a) => a.id)
const RESOLVED = ['Approved', 'Dismissed']

export function OperationProvider({ children }) {
  const [phase, setPhase] = useState('STANDUP')
  // comms link state per asset: 'pending' | 'handshake' | 'linked'
  const [links, setLinks] = useState(() => Object.fromEntries(assets.map((a) => [a.id, 'pending'])))
  const [targets, setTargets] = useState(seedTargets)
  const [taskings, setTaskings] = useState({})
  const [planProposed, setPlanProposed] = useState(false)
  const [planApproved, setPlanApproved] = useState(false)
  const [evidence, setEvidence] = useState([]) // evidence source ids logged by the operator
  const [reportFiled, setReportFiled] = useState(false)

  // global UI state — owned here so the LLM console and the next-step guide can drive everything
  const [mode, setMode] = useState('map')
  const [sideTab, setSideTab] = useState('alerts')
  const [openAlert, setOpenAlert] = useState(null)
  const [threatFilter, setThreatFilter] = useState('All')
  const [feedFilters, setFeedFilters] = useState({ prio: 'All', media: 'All' })
  const [anomalyStatus, setAnomalyStatus] = useState({}) // id -> status override
  const [decisions, setDecisions] = useState({}) // decision id -> approved

  const linkedCount = Object.values(links).filter((s) => s === 'linked').length
  const readiness = Math.round((linkedCount / assets.length) * 100)

  const establishLink = (id) => {
    setLinks((l) => (l[id] === 'pending' ? { ...l, [id]: 'handshake' } : l))
    setTimeout(() => setLinks((l) => ({ ...l, [id]: 'linked' })), 900 + Math.random() * 1100)
  }
  const linkAll = () => assets.forEach((a, i) => setTimeout(() => establishLink(a.id), i * 220))

  const logEvidence = (id) => setEvidence((e) => (e.includes(id) ? e : [...e, id]))
  const confidence = EVIDENCE_BASE + evidence.reduce((sum, id) => sum + (evidenceSources.find((s) => s.id === id)?.weight || 0), 0)

  const statusOf = (a) => anomalyStatus[a.id] || a.status
  const criticalOpen = CRITICAL_IDS.filter((id) => !RESOLVED.includes(anomalyStatus[id] || anomalies.find((a) => a.id === id).status))

  const focusAlert = (id) => { setSideTab('alerts'); setThreatFilter('All'); setOpenAlert(id) }

  const phaseIndex = OP_PHASES.findIndex((p) => p.id === phase)
  // gates: what blocks advancing out of the current phase
  const gate = useMemo(() => {
    if (phase === 'STANDUP' && readiness < 100) return `${linkedCount}/${assets.length} assets linked — bring every sensor online first`
    if (phase === 'PLANNING' && !planApproved) return 'Approve the collection plan to start the operation'
    if (phase === 'EXECUTION' && evidence.length < EVIDENCE_REQUIRED) return `${evidence.length}/${EVIDENCE_REQUIRED} independent sources logged — corroborate before closing`
    if (phase === 'EXECUTION' && criticalOpen.length) return `${criticalOpen.length} critical alert${criticalOpen.length > 1 ? 's' : ''} still open`
    return null
  }, [phase, readiness, linkedCount, planApproved, evidence.length, criticalOpen.length])

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
    planProposed, setPlanProposed, planApproved, setPlanApproved,
    evidence, logEvidence, confidence,
    criticalOpen, statusOf, focusAlert, openAlert, setOpenAlert,
    reportFiled, setReportFiled,
    mode, setMode, sideTab, setSideTab,
    threatFilter, setThreatFilter, feedFilters, setFeedFilters,
    anomalyStatus, setAnomalyStatus,
    decisions, setDecisions, approveAllDecisions,
  }
  return <OperationContext.Provider value={value}>{children}</OperationContext.Provider>
}

export function useOperation() {
  return useContext(OperationContext)
}
