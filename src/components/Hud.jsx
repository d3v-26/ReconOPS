import { Check, AlertTriangle, Gamepad2 } from 'lucide-react'
import { useOperation } from '../context/OperationContext.jsx'
import { OP_PHASES, mission, EVIDENCE_REQUIRED, anomalies } from '../data/mockData.js'
import { byId } from '../data/entities.js'
import { getNextStep } from '../lib/nextStep.js'

const hhmm = (s) => `${String(Math.floor(s / 3600) % 24).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

function Objectives() {
  const ops = useOperation()
  const step = getNextStep(ops)
  const progress = {
    STANDUP: `${ops.linkedCount}/11`,
    PLANNING: ops.planApproved ? '1/1' : '0/1',
    EXECUTION: `${ops.evidence.length}/${EVIDENCE_REQUIRED} · ${2 - ops.criticalOpen.length}/2`,
    DEBRIEF: ops.reportFiled ? '1/1' : '0/1',
  }
  return (
    <div className="hud-obj">
      <div className="op-name">{mission.title}</div>
      <h1>{mission.question}</h1>
      <ol>
        {OP_PHASES.map((p, i) => {
          const state = i < ops.phaseIndex ? 'done' : i === ops.phaseIndex ? 'now' : 'todo'
          return (
            <li key={p.id} className={state}>
              <span className="tick">{state === 'done' ? <Check size={11} strokeWidth={3} /> : null}</span>
              <span className="lbl">{p.label}</span>
              {state === 'now' && <span className="mono prog">{progress[p.id]}</span>}
            </li>
          )
        })}
      </ol>
      <div className="next">
        <span className="eyebrow"><i>◆</i> Next</span>
        <b>{step.title}</b>
        <p>{step.detail}</p>
        {step.say && <span className="say">Say <code>{step.say}</code>{step.run && step.say !== 'do it' ? <> or <code>do it</code></> : null}</span>}
      </div>
    </div>
  )
}

function Status() {
  const ops = useOperation()
  const end = mission.deadline.h * 3600 + mission.deadline.m * 60
  const left = Math.max(0, end - ops.simSec)
  const pct = Math.round(ops.confidence * 100)
  return (
    <div className="hud-status">
      <div className="clock">
        <b className="mono">{hhmm(ops.simSec)}Z</b>
        <span>Window closes <b className="mono">{String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}</b></span>
      </div>
      <div className="conf">
        <div className="conf-top"><span>Staging confidence</span><b className="mono">{pct}%</b></div>
        <div className="conf-bar"><i style={{ width: `${pct}%` }} className={pct >= 75 ? 'ok' : ''} /><em style={{ left: '75%' }} /></div>
        <span className="conf-foot">{pct >= 75 ? 'Confirmed' : 'Confirm at 75%'}</span>
      </div>
      <div className="preview-badge">Preview · simulated data</div>
    </div>
  )
}

function AlertStrip() {
  const ops = useOperation()
  if (ops.phase !== 'EXECUTION') return null
  const open = anomalies.filter((a) => ops.statusOf(a.id) === 'Open')
  if (!open.length) return null
  return (
    <div className="hud-alerts">
      <AlertTriangle size={14} />
      {open.map((a) => (
        <button key={a.id} className={`sev-${a.severity}`} onClick={() => ops.select(a.entity)}>{byId[a.entity].name}<span>{a.severity}</span></button>
      ))}
    </div>
  )
}

function Driving() {
  const ops = useOperation()
  if (!ops.controlled) return null
  return (
    <div className="hud-driving">
      <Gamepad2 size={15} />
      <b>REMOTE · {byId[ops.controlled].name}</b>
      <span>Click the map to set a waypoint</span>
      <button onClick={ops.releaseControl}>Release</button>
    </div>
  )
}

function Callout() {
  const { callout } = useOperation()
  if (!callout) return null
  return (
    <div className={`callout tone-${callout.tone}`} key={callout.key}>
      <b>{callout.title}</b>
      {callout.sub && <span>{callout.sub}</span>}
    </div>
  )
}

function RadioLog() {
  const { radio } = useOperation()
  return (
    <ol className="hud-radio">
      {radio.map((r) => (
        <li key={r.key} className={r.tone ? `tone-${r.tone}` : ''}><b>{r.from}</b>{r.text}</li>
      ))}
    </ol>
  )
}

export default function Hud() {
  return (
    <>
      <Objectives />
      <Status />
      <AlertStrip />
      <Driving />
      <Callout />
      <RadioLog />
    </>
  )
}
