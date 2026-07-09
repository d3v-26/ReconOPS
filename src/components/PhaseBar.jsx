import { useOperation } from '../context/OperationContext.jsx'
import { OP_PHASES } from '../data/mockData.js'

export default function PhaseBar() {
  const { phase, phaseIndex, advance, regress, gate } = useOperation()
  const current = OP_PHASES[phaseIndex]
  const atEnd = phaseIndex === OP_PHASES.length - 1

  return (
    <div className="phase-bar">
      <div className="phase-steps">
        {OP_PHASES.map((p, i) => (
          <div key={p.id} className={`phase-step ${i < phaseIndex ? 'done' : ''} ${p.id === phase ? 'current' : ''}`}>
            <span className="ps-num">{i < phaseIndex ? '✓' : p.num}</span>
            <span className="ps-label">{p.label}</span>
            {i < OP_PHASES.length - 1 && <span className="ps-line" />}
          </div>
        ))}
      </div>
      <div className="phase-desc">{current.desc}</div>
      <div className="phase-actions">
        {phaseIndex > 0 && <button onClick={regress}>◂ {OP_PHASES[phaseIndex - 1].label}</button>}
        {!atEnd && (
          <button
            className={gate ? '' : 'active btn-green'}
            disabled={!!gate}
            title={gate || ''}
            onClick={advance}
            style={gate ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
          >
            {phase === 'EXECUTION' ? 'End Operation ▸ Debrief' : `Advance ▸ ${OP_PHASES[phaseIndex + 1].label}`}
          </button>
        )}
      </div>
      {gate && <div className="phase-gate">⚠ GATE: {gate}</div>}
    </div>
  )
}
