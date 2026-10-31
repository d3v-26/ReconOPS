import { useEffect, useState } from 'react'
import { Sparkles, Check, Loader2, MousePointerClick } from 'lucide-react'
import Pane from '../Pane.jsx'
import TacticalMap from '../TacticalMap.jsx'
import { useOperation } from '../../context/OperationContext.jsx'
import { assets, planProposal, TASK_OPTIONS } from '../../data/mockData.js'
import { bus } from '../../lib/bus.js'

export default function PlanningView() {
  const { targets, setTargets, setTaskings, planProposed, setPlanProposed, planApproved, setPlanApproved } = useOperation()
  const [thinking, setThinking] = useState(false)
  const [selected, setSelected] = useState(targets[0]?.id)

  const designate = (x, y) => {
    if (planApproved) return
    const id = `TGT-${String(targets.length + 1).padStart(2, '0')}`
    setTargets((t) => [...t, { id, name: `OPERATOR POI ${t.length + 1}`, kind: 'custom', x, y, priority: 'Medium', status: 'Designated', note: 'Operator-designated point of interest.' }])
    setSelected(id)
  }

  const requestPlan = () => {
    setThinking(true)
    setTimeout(() => {
      setThinking(false)
      setPlanProposed(true)
      // AI proposal pre-fills taskings for unassigned assets
      setTaskings((t) => {
        const next = { ...t }
        assets.forEach((a, i) => { if (!next[a.id]) next[a.id] = TASK_OPTIONS[i % TASK_OPTIONS.length] })
        return next
      })
    }, 1400)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => bus.on('planning.request', requestPlan), [])

  return (
    <Pane
      eyebrow="Phase 2 · Planning"
      title="Decide how to watch Warehouse S-3"
      sub="Targets are on the map. Click anywhere to add your own, then have the AI draft taskings for all 12 assets."
      actions={
        <>
          <button className="btn" onClick={requestPlan} disabled={thinking || planApproved}>
            {thinking ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />} {planProposed ? 'Regenerate' : 'Generate AI plan'}
          </button>
          <button className="btn btn-accent" onClick={() => setPlanApproved(true)} disabled={!planProposed || planApproved}>
            <Check size={14} /> {planApproved ? 'Plan approved' : 'Approve plan'}
          </button>
        </>
      }
    >
      <div className="split">
        <div className="map-wrap">
          <TacticalMap
            show={{ targets: true, zones: true, assets: true }}
            targets={targets}
            selectedTarget={selected}
            onPick={designate}
            onSelect={setSelected}
          />
          <div className="map-caption"><MousePointerClick size={12} /> Click the map to designate a target</div>
        </div>
        <div className="split-side">
          <div className="eyebrow">Targets ({targets.length})</div>
          <div className="target-list">
            {targets.map((t) => (
              <div key={t.id} className={`target-row ${selected === t.id ? 'sel' : ''}`} onClick={() => setSelected(t.id)}>
                <span className={`prio-dot prio-${t.priority}`} />
                <span className="target-main">
                  <b>{t.name}</b>
                  <small>{t.note}</small>
                </span>
                <select
                  value={t.priority}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setTargets((ts) => ts.map((x) => (x.id === t.id ? { ...x, priority: e.target.value } : x)))}
                  aria-label="Priority"
                >
                  {['High', 'Medium', 'Low'].map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="eyebrow" style={{ marginTop: 16 }}>AI collection plan</div>
          {!planProposed && !thinking && <div className="placeholder">No plan yet. Generate one to see proposed taskings, coverage and contingencies.</div>}
          {thinking && <div className="placeholder"><Loader2 size={14} className="spin" /> Decomposing objective into taskings…</div>}
          {planProposed && !thinking && (
            <div className="plan">
              <p className="ai-note">{planProposal.summary}</p>
              <ul className="tasking">
                {planProposal.taskings.map((t) => (
                  <li key={t.asset}><b>{t.asset}</b><span>{t.task}</span></li>
                ))}
              </ul>
              <div className="eyebrow" style={{ marginTop: 12 }}>Contingencies</div>
              <ul className="bullets">
                {planProposal.contingencies.map((c) => <li key={c}>{c}</li>)}
              </ul>
              <p className="ai-note warn">{planProposal.risks}</p>
            </div>
          )}
        </div>
      </div>
    </Pane>
  )
}
