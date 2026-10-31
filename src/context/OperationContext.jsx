import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { entities, byId, ASSET_IDS } from '../data/entities.js'
import { anomalies, OP_PHASES, evidenceSources, EVIDENCE_BASE, EVIDENCE_REQUIRED, commsTraffic, mission } from '../data/mockData.js'
import { distM } from '../lib/geo.js'

const OperationContext = createContext(null)

const CRITICAL_IDS = anomalies.filter((a) => a.severity === 'Critical').map((a) => a.id)
const SPEED = { air: 0.9, ground: 0.35 } // metres of AO per ms of real time — fast enough to watch, slow enough to follow

export function OperationProvider({ children }) {
  const [phase, setPhase] = useState('STANDUP')
  // comms link state per asset: 'pending' | 'handshake' | 'linked'
  const [links, setLinks] = useState(() => Object.fromEntries(ASSET_IDS.map((id) => [id, 'pending'])))
  const [pos, setPos] = useState(() => Object.fromEntries(entities.map((e) => [e.id, { x: e.x, y: e.y }])))
  const [selected, setSelected] = useState(null) // { type: 'entity', id } | { type: 'spot', x, y }
  const [controlled, setControlled] = useState(null)
  const [thermal, setThermal] = useState(false)
  const [translated, setTranslated] = useState(false)
  const [evidence, setEvidence] = useState([])
  const [alertStatus, setAlertStatus] = useState({}) // anomaly id -> 'Approved' | 'Dismissed'
  const [planProposed, setPlanProposed] = useState(false)
  const [planApproved, setPlanApproved] = useState(false)
  const [pings, setPings] = useState([])
  const [callout, setCallout] = useState(null)
  const [radio, setRadio] = useState([])
  const [reportFiled, setReportFiled] = useState(false)
  const [viewed, setViewed] = useState([])
  const [simSec, setSimSec] = useState(mission.start.h * 3600 + mission.start.m * 60)

  // ── clock ──
  useEffect(() => {
    const id = setInterval(() => setSimSec((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // ── feedback: CoD-style centre callout + radio log ──
  const flash = useCallback((title, sub, tone = 'friendly') => setCallout({ title, sub, tone, key: Date.now() }), [])
  useEffect(() => {
    if (!callout) return
    const id = setTimeout(() => setCallout(null), 2600)
    return () => clearTimeout(id)
  }, [callout])
  const say = useCallback((from, text, tone) => setRadio((r) => [...r.slice(-5), { from, text, tone, key: Date.now() + Math.random() }]), [])

  useEffect(() => {
    const lines = commsTraffic[phase] || []
    let i = 0
    const tick = () => { if (i < lines.length) { say(lines[i].from, lines[i].text); i += 1 } }
    // first line deferred so StrictMode's mount → unmount → mount doesn't post it twice
    const first = setTimeout(tick, 300)
    const id = setInterval(tick, 6500)
    return () => { clearTimeout(first); clearInterval(id) }
  }, [phase, say])

  // ── movement: every mover glides toward its waypoint ──
  const moves = useRef({}) // id -> { to, speed }
  const posRef = useRef(pos)
  const rafRef = useRef(0)
  const step = useCallback(() => {
    let last = performance.now()
    const loop = (now) => {
      const dt = Math.min(64, now - last)
      last = now
      const ids = Object.keys(moves.current)
      if (!ids.length) { rafRef.current = 0; return }
      const next = { ...posRef.current }
      ids.forEach((id) => {
        const { to, speed } = moves.current[id]
        const cur = next[id]
        const d = distM(cur, to)
        const stepM = speed * dt
        if (d <= stepM) { next[id] = to; delete moves.current[id] } else {
          const f = stepM / d
          next[id] = { x: cur.x + (to.x - cur.x) * f, y: cur.y + (to.y - cur.y) * f }
        }
      })
      posRef.current = next
      setPos(next)
      rafRef.current = requestAnimationFrame(loop)
    }
    if (!rafRef.current) rafRef.current = requestAnimationFrame(loop)
  }, [])
  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const moveEntity = useCallback((id, to, speed) => {
    const e = byId[id]
    moves.current[id] = { to: { x: Math.max(1, Math.min(99, to.x)), y: Math.max(1, Math.min(99, to.y)) }, speed: speed || SPEED[e.move] || SPEED.ground }
    step()
  }, [step])

  // ── links ──
  const linkedCount = Object.values(links).filter((s) => s === 'linked').length
  const readiness = Math.round((linkedCount / ASSET_IDS.length) * 100)
  const establishLink = useCallback((id) => {
    setLinks((l) => (l[id] === 'pending' ? { ...l, [id]: 'handshake' } : l))
    setTimeout(() => setLinks((l) => ({ ...l, [id]: 'linked' })), 700 + Math.random() * 900)
  }, [])
  const linkAll = () => ASSET_IDS.forEach((id, i) => setTimeout(() => establishLink(id), i * 200))
  const isLinked = (id) => !byId[id]?.asset || links[id] === 'linked'

  // ── evidence & alerts ──
  const logEvidence = (id) => {
    if (evidence.includes(id)) return false
    const src = evidenceSources.find((s) => s.id === id)
    setEvidence((e) => [...e, id])
    flash('INTEL LOGGED', `${src.label} · +${Math.round(src.weight * 100)}% confidence`, 'gold')
    return true
  }
  const confidence = EVIDENCE_BASE + evidence.reduce((sum, id) => sum + (evidenceSources.find((s) => s.id === id)?.weight || 0), 0)
  const alertOf = (entityId) => anomalies.find((a) => a.entity === entityId)
  const statusOf = (anId) => alertStatus[anId] || 'Open'
  const criticalOpen = CRITICAL_IDS.filter((id) => statusOf(id) === 'Open')
  const resolveAlert = (anId, verdict) => {
    const a = anomalies.find((x) => x.id === anId)
    setAlertStatus((s) => ({ ...s, [anId]: verdict }))
    say('AI', verdict === 'Approved' ? a.approveNote : a.dismissNote, verdict === 'Approved' ? 'friendly' : 'muted')
    flash(verdict === 'Approved' ? 'ACTION APPROVED' : 'ALERT DISMISSED', a.title, verdict === 'Approved' ? 'friendly' : 'muted')
    if (anId === 'AN-01' && verdict === 'Approved') setTimeout(() => moveEntity('CX', { x: 97, y: 61 }, 0.25), 1500)
  }

  // CONTACT-X keeps driving into GF-2 once the operation is live
  useEffect(() => {
    if (phase !== 'EXECUTION' || statusOf('AN-01') !== 'Open') return
    const path = byId.CX.path
    let i = path.findIndex(([x]) => x < pos.CX.x)
    if (i < 0) return
    const go = () => { if (i < path.length) { moveEntity('CX', { x: path[i][0], y: path[i][1] }, 0.06); i += 1 } }
    go()
    const id = setInterval(go, 9000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, alertStatus])

  // ── selection & control ──
  const select = useCallback((id) => {
    setSelected(id ? { type: 'entity', id } : null)
    if (id) setViewed((v) => (v.includes(id) ? v : [...v, id]))
  }, [])
  const selectSpot = useCallback((x, y) => setSelected({ type: 'spot', x, y }), [])
  const takeControl = (id) => {
    setControlled(id)
    select(id)
    flash('REMOTE CONTROL', `${byId[id].name} · click the map to drive`, 'friendly')
  }
  const releaseControl = () => { if (controlled) flash('CONTROL RELEASED', byId[controlled].name, 'muted'); setControlled(null) }
  const ping = (x, y, label = 'PING') => setPings((p) => [...p.slice(-4), { id: Date.now(), x, y, label }])

  // ── plan ──
  const proposePlan = () => { setPlanProposed(true); flash('PLAN DRAFTED', 'Taskings drawn on the map — review and approve', 'friendly') }
  const approvePlan = () => {
    if (!planProposed) setPlanProposed(true)
    setPlanApproved(true)
    flash('PLAN APPROVED', 'Taskings pushed to every asset', 'friendly')
  }

  // ── lifecycle ──
  const phaseIndex = OP_PHASES.findIndex((p) => p.id === phase)
  const gate = useMemo(() => {
    if (phase === 'STANDUP' && readiness < 100) return `${linkedCount}/${ASSET_IDS.length} assets linked — bring every sensor online first`
    if (phase === 'PLANNING' && !planApproved) return 'Approve the collection plan to start the operation'
    if (phase === 'EXECUTION' && evidence.length < EVIDENCE_REQUIRED) return `${evidence.length}/${EVIDENCE_REQUIRED} independent sources logged — corroborate before closing`
    if (phase === 'EXECUTION' && criticalOpen.length) return `${criticalOpen.length} critical alert${criticalOpen.length > 1 ? 's' : ''} still open`
    return null
  }, [phase, readiness, linkedCount, planApproved, evidence.length, criticalOpen.length])

  const SPLASH = { PLANNING: ['NETWORK ONLINE', 'Plan how the assets will watch S-3'], EXECUTION: ['OPERATION LIVE', 'Collect on Warehouse S-3'], DEBRIEF: ['OPERATION COMPLETE', 'After-action report'] }
  const goTo = (target) => {
    const ti = OP_PHASES.findIndex((p) => p.id === target)
    if (ti < 0) return { ok: false, reason: 'Unknown phase.' }
    if (ti === phaseIndex) return { ok: true }
    if (ti === phaseIndex + 1 && gate) return { ok: false, reason: gate }
    if (ti > phaseIndex + 1) return { ok: false, reason: `One step at a time — next gate: ${gate || 'clear'}.` }
    setPhase(target)
    if (target === 'DEBRIEF') { setSelected(null); setControlled(null) }
    if (ti > phaseIndex) flash(...SPLASH[target], 'gold')
    return { ok: true }
  }
  const advance = () => phaseIndex < OP_PHASES.length - 1 && goTo(OP_PHASES[phaseIndex + 1].id).ok

  const value = {
    phase, phaseIndex, advance, goTo, gate,
    links, establishLink, linkAll, linkedCount, readiness, isLinked,
    pos, moveEntity,
    selected, select, selectSpot, controlled, takeControl, releaseControl,
    thermal, setThermal, translated, setTranslated, viewed,
    evidence, logEvidence, confidence,
    alertOf, statusOf, criticalOpen, resolveAlert,
    planProposed, proposePlan, planApproved, approvePlan,
    pings, ping,
    callout, flash, radio, say,
    reportFiled, setReportFiled,
    simSec,
  }
  return <OperationContext.Provider value={value}>{children}</OperationContext.Provider>
}

export function useOperation() {
  return useContext(OperationContext)
}
