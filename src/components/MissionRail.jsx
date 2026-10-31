import { ArrowRight, CheckCircle2, Circle, Lock } from 'lucide-react'
import { useOperation } from '../context/OperationContext.jsx'
import { getNextStep } from '../lib/nextStep.js'
import { mission, evidenceSources, EVIDENCE_REQUIRED } from '../data/mockData.js'

const CONFIRM_AT = 0.75

function verdict(phase, confidence, n) {
  if (phase === 'STANDUP' || phase === 'PLANNING') return { label: 'Not assessed', tone: 'muted' }
  if (confidence >= CONFIRM_AT && n >= EVIDENCE_REQUIRED) return { label: 'Staging confirmed', tone: 'red' }
  if (confidence >= 0.5) return { label: 'Likely — needs corroboration', tone: 'amber' }
  return { label: 'Unconfirmed', tone: 'muted' }
}

export default function MissionRail() {
  const ops = useOperation()
  const { phase, phaseIndex, evidence, confidence, criticalOpen, readiness, planApproved, reportFiled, gate } = ops
  const step = getNextStep(ops)
  const v = verdict(phase, confidence, evidence.length)
  const pct = phaseIndex >= 2 ? Math.round(confidence * 100) : 0

  const criteria = [
    { label: 'Sensor network online', meta: `${readiness}%`, done: readiness === 100 },
    { label: 'Collection plan approved', done: planApproved },
    { label: `Corroborate with ${EVIDENCE_REQUIRED}+ independent sources`, meta: `${evidence.length}/${EVIDENCE_REQUIRED}`, done: evidence.length >= EVIDENCE_REQUIRED },
    { label: 'Critical alerts resolved, no escalation', meta: phaseIndex >= 2 ? `${2 - criticalOpen.length}/2` : null, done: phaseIndex >= 2 && criticalOpen.length === 0 },
    { label: 'After-action report filed', done: reportFiled },
  ]

  return (
    <aside className="rail">
      <section className="rail-block">
        <div className="eyebrow">Mission question</div>
        <h1 className="question">{mission.question}</h1>
        <p className="objective">{mission.objective}</p>
      </section>

      <section className="rail-block">
        <div className="eyebrow-row">
          <span className="eyebrow">Assessment</span>
          <span className={`verdict tone-${v.tone}`}>{v.label}</span>
        </div>
        <div className="conf-meter" aria-label={`Confidence ${pct}%`}>
          <i style={{ width: `${pct}%` }} className={`tone-bg-${v.tone}`} />
          <span className="conf-threshold" style={{ left: `${CONFIRM_AT * 100}%` }} title="Confirmation threshold" />
        </div>
        <div className="conf-legend">
          <span>{pct}% confidence</span>
          <span>confirm at {CONFIRM_AT * 100}%</span>
        </div>
        {phaseIndex >= 2 && (
          <ul className="evidence-list">
            {evidenceSources.map((s) => {
              const got = evidence.includes(s.id)
              return (
                <li key={s.id} className={got ? 'got' : ''}>
                  <button onClick={() => phase === 'EXECUTION' && ops.setMode(s.id)} disabled={phase !== 'EXECUTION'}>
                    {got ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                    <span>{s.label}</span>
                    <em>{got ? `+${Math.round(s.weight * 100)}%` : 'review'}</em>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="next-step">
        <div className="eyebrow">Next step</div>
        <h2>{step.title}</h2>
        <p>{step.detail}</p>
        {step.cta && (
          <button className="btn-primary" onClick={step.run}>
            {step.cta} <ArrowRight size={16} />
          </button>
        )}
        {gate && !step.cta?.toLowerCase().includes('go to') && (
          <div className="gate"><Lock size={12} /> {gate}</div>
        )}
      </section>

      <section className="rail-block">
        <div className="eyebrow">Success criteria</div>
        <ul className="criteria">
          {criteria.map((c) => (
            <li key={c.label} className={c.done ? 'done' : ''}>
              {c.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              <span>{c.label}</span>
              {c.meta && <em>{c.meta}</em>}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
