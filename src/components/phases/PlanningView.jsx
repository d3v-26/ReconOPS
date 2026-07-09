import { useEffect, useState } from 'react'
import HudCard from '../HudCard.jsx'
import StatusBadge from '../StatusBadge.jsx'
import { useOperation } from '../../context/OperationContext.jsx'
import { assets, planProposal, TASK_OPTIONS } from '../../data/mockData.js'
import { bus } from '../../lib/bus.js'

const PRIO_COLOR = { High: 'var(--red)', Medium: 'var(--amber)', Low: 'var(--green)' }

export default function PlanningView() {
  const { targets, setTargets, taskings, setTaskings, planApproved, setPlanApproved } = useOperation()
  const [proposal, setProposal] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [selected, setSelected] = useState(targets[0]?.id)

  const designate = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const id = `TGT-${String(targets.length + 1).padStart(2, '0')}`
    setTargets((t) => [...t, { id, name: `OPERATOR TARGET ${t.length + 1}`, kind: 'custom', x, y, priority: 'Medium', status: 'Designated', note: 'Operator-designated point of interest.' }])
    setSelected(id)
  }

  const requestPlan = () => {
    setThinking(true); setProposal(null)
    setTimeout(() => {
      setThinking(false)
      setProposal(planProposal)
      // AI proposal pre-fills taskings for unassigned assets
      setTaskings((t) => {
        const next = { ...t }
        assets.forEach((a, i) => { if (!next[a.id]) next[a.id] = TASK_OPTIONS[i % TASK_OPTIONS.length] })
        return next
      })
    }, 1600)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => bus.on('planning.request', requestPlan), [])

  const sel = targets.find((t) => t.id === selected)

  return (
    <HudCard
      panelId="workspace"
      className="workspace"
      title="Operation Planning · Targets & Taskings"
      right={planApproved
        ? <span className="chip chip-green pulse"><span className="dot" />PLAN APPROVED</span>
        : <span className="chip chip-amber pulse"><span className="dot" />AWAITING APPROVAL</span>}
    >
      <div className="view-layout">
        <div className="view-main">
          <div className="view-controls">
            <button className="btn-green" onClick={requestPlan}>◈ Request AI Plan</button>
            <button
              className={planApproved ? 'active btn-green' : 'btn-amber'}
              onClick={() => setPlanApproved(true)}
              disabled={planApproved}
            >
              {planApproved ? '✓ Plan Approved' : 'Approve Plan'}
            </button>
            <span style={{ fontSize: 9, color: 'var(--muted)', alignSelf: 'center' }}>CLICK MAP TO DESIGNATE TARGET</span>
          </div>

          <div className="stage" style={{ cursor: 'crosshair', minHeight: 240 }} onClick={designate}>
            <svg viewBox="0 0 100 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <rect width="100" height="80" fill="var(--bg-2)" />
              <g stroke="rgba(61,214,232,0.08)" strokeWidth="0.2">
                {Array.from({ length: 11 }).map((_, i) => <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="80" />)}
                {Array.from({ length: 9 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} />)}
              </g>
              <path d="M74,0 Q82,18 88,26 T100,42 L100,0 Z" fill="#10161a" opacity="0.9" />
              <path d="M0,62 Q20,58 38,62 T74,60 T100,64" stroke="#20282e" strokeWidth="2" fill="none" />
              <rect x="60" y="42" width="10" height="8" fill="#161d21" stroke="#28323a" strokeWidth="0.3" />
              {targets.map((t) => (
                <g key={t.id} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setSelected(t.id) }}>
                  <circle cx={t.x} cy={t.y} r="3.2" fill="none" stroke={PRIO_COLOR[t.priority]} strokeWidth="0.4"
                    style={{ transformOrigin: `${t.x}px ${t.y}px`, animation: 'ping 2s ease-out infinite' }} />
                  <circle cx={t.x} cy={t.y} r="1.6" fill="none" stroke={PRIO_COLOR[t.priority]} strokeWidth="0.4" />
                  <line x1={t.x - 2.6} y1={t.y} x2={t.x + 2.6} y2={t.y} stroke={PRIO_COLOR[t.priority]} strokeWidth="0.3" />
                  <line x1={t.x} y1={t.y - 2.6} x2={t.x} y2={t.y + 2.6} stroke={PRIO_COLOR[t.priority]} strokeWidth="0.3" />
                  <text x={t.x} y={t.y - 4} fill={PRIO_COLOR[t.priority]} fontSize="2.2" textAnchor="middle" fontFamily="monospace">
                    {t.id} · {t.name}
                  </text>
                </g>
              ))}
            </svg>
            <div className="stage-label">TARGET DESIGNATION · SECTOR 7 · {targets.length} TARGETS</div>
          </div>

          {thinking && <div className="thinking">LLM DECOMPOSING OBJECTIVE INTO TASKINGS <i /><i /><i /></div>}
          {proposal && (
            <div style={{ overflowY: 'auto' }}>
              <div className="ai-text">{proposal.summary}</div>
              <div className="mini-title" style={{ marginTop: 8 }}>PROPOSED TASKINGS</div>
              {proposal.taskings.map((t, i) => (
                <div key={i} className="rec-row"><b style={{ color: 'var(--cyan)', fontWeight: 400 }}>{t.asset}</b> — {t.task}</div>
              ))}
              <div className="mini-title" style={{ marginTop: 8 }}>CONTINGENCIES</div>
              {proposal.contingencies.map((c, i) => (
                <div key={i} className="rec-row"><span style={{ color: 'var(--amber)' }}>▸</span> {c}</div>
              ))}
              <div className="ai-text amber" style={{ marginTop: 8 }}>{proposal.risks}</div>
            </div>
          )}
        </div>

        <aside className="view-side">
          <div>
            <div className="mini-title">TARGET LIST ({targets.length})</div>
            {targets.map((t) => (
              <div key={t.id} className={`coord-row ${selected === t.id ? 'selected' : ''}`} onClick={() => setSelected(t.id)}>
                <span style={{ color: PRIO_COLOR[t.priority] }}>⊕</span>
                <span className="coord-raw" style={{ color: 'var(--text)' }}>{t.id}</span>
                <select
                  value={t.priority}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setTargets((ts) => ts.map((x) => x.id === t.id ? { ...x, priority: e.target.value } : x))}
                >
                  {['High', 'Medium', 'Low'].map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            ))}
          </div>
          {sel && (
            <div>
              <div className="mini-title">TARGET DETAIL <StatusBadge status={sel.priority} /></div>
              <div className="kv"><span className="k">ID</span><span className="v" style={{ color: 'var(--cyan)' }}>{sel.id}</span></div>
              <div className="kv"><span className="k">Name</span><span className="v">{sel.name}</span></div>
              <div className="kv"><span className="k">Status</span><span className="v">{sel.status}</span></div>
              <div className="ai-text" style={{ marginTop: 4 }}>{sel.note}</div>
            </div>
          )}
          <div>
            <div className="mini-title">ASSET TASKINGS</div>
            {assets.slice(0, 8).map((a) => (
              <div key={a.id} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 9, color: 'var(--text-dim)', minWidth: 70 }}>{a.name}</span>
                <select
                  style={{ flex: 1, fontSize: 9 }}
                  value={taskings[a.id] || ''}
                  onChange={(e) => setTaskings((t) => ({ ...t, [a.id]: e.target.value }))}
                >
                  <option value="">— unassigned —</option>
                  {TASK_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </HudCard>
  )
}
