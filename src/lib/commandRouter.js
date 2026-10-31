import { consoleResponses, consoleFallback, evidenceSources, anomalies } from '../data/mockData.js'
import { findEntity, findEntities, byId } from '../data/entities.js'
import { getNextStep } from './nextStep.js'
import { exportReport } from './report.js'

// Maps a natural-language order to a real UI action + a spoken-style reply.
// In a live deployment this router is replaced by an LLM with tool use
// (each branch below becomes a tool the model can call).
export function routeCommand(raw, ops) {
  const cmd = raw.toLowerCase().trim()
  const any = (...words) => words.some((w) => cmd.includes(w))
  const sel = ops.selected?.type === 'entity' ? byId[ops.selected.id] : null
  const named = findEntity(cmd)
  const target = named || sel

  // ── guidance ──
  if (any("what's next", 'what next', 'next step', 'what should i do', 'help')) {
    const s = getNextStep(ops)
    return `${s.title}. ${s.detail}`
  }
  if (any('do it', 'go ahead', 'proceed', 'carry on')) {
    const s = getNextStep(ops)
    if (!s.run) return 'Nothing left to do — operation complete.'
    s.run()
    return `On it — ${s.title.toLowerCase()}.`
  }

  // ── lifecycle ──
  if (any('link all', 'bring assets online', 'bring everything online', 'link everything')) {
    ops.linkAll()
    return 'Linking all 11 assets. Watch them light up on the map.'
  }
  if (cmd.startsWith('link') && target) {
    if (!target.asset) return `${target.name} isn't one of ours — nothing to link.`
    ops.establishLink(target.id); ops.select(target.id)
    return `Linking ${target.name}.`
  }
  if (any('generate plan', 'draft plan', 'make a plan', 'plan it', 'propose plan')) {
    if (ops.phase !== 'PLANNING') return ops.phase === 'STANDUP' ? 'Link the network first — then we plan.' : 'The plan is already locked.'
    ops.select('S-3'); ops.proposePlan()
    return 'Plan drafted. Tasking lines are on the map — say "approve plan" to lock them in.'
  }
  if (any('approve plan', 'approve the plan', 'lock the plan')) {
    if (ops.phase !== 'PLANNING') return 'Plan approval happens during planning.'
    ops.approvePlan()
    return 'Plan approved. Say "do it" to start the operation.'
  }
  if (any('start operation', 'start the operation', 'go live', 'begin')) {
    const r = ops.goTo('EXECUTION')
    return r.ok ? 'Operation live. Collection on Warehouse S-3 has started.' : `Not yet — ${r.reason}`
  }
  if (any('end operation', 'end the operation', 'wrap up', 'debrief', 'close out')) {
    const r = ops.goTo('DEBRIEF')
    return r.ok ? 'Closing the operation. After-action report is up.' : `Not yet — ${r.reason}`
  }
  if (any('generate report', 'file report', 'write the report', 'file the report')) {
    if (ops.phase !== 'DEBRIEF') return 'The report is filed at debrief.'
    ops.setReportFiled(true)
    return 'After-action report generated.'
  }
  if (any('export', 'download report')) {
    if (!ops.reportFiled) return 'Generate the report first.'
    exportReport(ops)
    return 'Report exported as Markdown.'
  }

  // ── sensor controls ──
  if (any('thermal off', 'normal view', 'visible', 'daylight')) { ops.setThermal(false); return 'Feeds back to visible spectrum.' }
  if (any('thermal', 'infrared', 'flir', 'heat')) {
    ops.setThermal(true)
    if (named) ops.select(named.id)
    return `Thermal on${named ? ` — ${named.name}` : ''}. Hot engines and people stand out.`
  }
  if (any('translate')) {
    ops.setTranslated(true); ops.select('AS-02')
    return 'EARSHOT-A transcript translated from Foreign Language A (0.86).'
  }
  if (any('original', 'untranslate')) { ops.setTranslated(false); return 'Transcript back in the original language.' }

  // ── evidence & alerts ──
  if (any('log evidence', 'log it', 'log this', 'mark as evidence', 'add evidence')) {
    if (ops.phase !== 'EXECUTION') return 'Evidence is logged once the operation is live.'
    const ev = target?.evidence && evidenceSources.find((s) => s.id === target.evidence)
    if (!ev) return `${target ? target.name : 'Nothing selected'} doesn't carry evidence. Sources: KEYHOLE-9, SPECTER-1, EARSHOT-A, SSG REYES.`
    if (!ops.isLinked(target.id)) return `${target.name} isn't linked.`
    ops.select(target.id)
    return ops.logEvidence(ev.id) ? `Logged — ${ev.finding}` : `${ev.label} is already logged.`
  }
  if (any('show alerts', 'alerts', 'threats', 'what is open')) {
    const open = anomalies.filter((a) => ops.statusOf(a.id) === 'Open')
    if (ops.phase !== 'EXECUTION' || !open.length) return 'No open alerts.'
    ops.select(open[0].entity)
    return `${open.length} open: ${open.map((a) => `${byId[a.entity].name} (${a.severity})`).join(', ')}. Showing ${byId[open[0].entity].name}.`
  }
  if (cmd.startsWith('approve') || cmd.startsWith('dismiss')) {
    const a = target && ops.alertOf(target.id)
    if (!a || ops.phase !== 'EXECUTION') return 'Select an alerted contact first — try "show alerts".'
    if (ops.statusOf(a.id) !== 'Open') return `${a.id} is already ${ops.statusOf(a.id).toLowerCase()}.`
    const verdict = cmd.startsWith('approve') ? 'Approved' : 'Dismissed'
    ops.resolveAlert(a.id, verdict)
    return verdict === 'Approved' ? a.approveNote : a.dismissNote
  }

  // ── movement & control ──
  if (any('release', 'let go', 'stop driving')) {
    if (!ops.controlled) return 'Not controlling anything.'
    ops.releaseControl()
    return 'Control released.'
  }
  if (any('take control', 'control', 'drive') && target?.vehicle && !any(' to ')) {
    if (!target.vehicle.remote) return `${target.name} is a ${target.vehicle.make} ${target.vehicle.model} — not remote-controllable.`
    if (!ops.isLinked(target.id)) return `${target.name} isn't linked.`
    ops.takeControl(target.id)
    return `You have ${target.name} via ${byId[target.vehicle.remote.by].name}'s tablet. Click the map to drive.`
  }
  if (any('send', 'move', 'drive', 'fly', 'go to', 'reposition')) {
    const [who, where] = findEntities(cmd)
    const mover = who && who.move ? who : sel?.move ? sel : null
    if (!mover) return 'Who should move? Try "send specter 2 to the ridge".'
    if (mover.side !== 'friendly') return `${mover.name} isn't ours to move.`
    if (!ops.isLinked(mover.id)) return `${mover.name} isn't linked.`
    const spot = ops.selected?.type === 'spot' ? ops.selected : null
    const dest = where && where.id !== mover.id ? ops.pos[where.id] : any('here', 'there') && spot ? spot : null
    if (!dest) return `Where to? Name a place ("…to the checkpoint") or click a spot and say "send ${mover.name.toLowerCase()} here".`
    if (mover.vehicle?.remote) ops.takeControl(mover.id)
    ops.moveEntity(mover.id, dest)
    ops.say(mover.name, `Moving to ${where ? where.name : 'marked spot'}.`)
    return `${mover.name} moving to ${where ? where.name : 'the marked spot'}.`
  }

  // ── selection ──
  if (any('close', 'deselect', 'clear')) { ops.select(null); return 'Cleared.' }
  if (named) {
    ops.select(named.id)
    const a = ops.alertOf(named.id)
    return `${named.name} — ${named.status}.${a && ops.statusOf(a.id) === 'Open' && ops.phase === 'EXECUTION' ? ` ${a.severity} alert: ${a.recommended}` : ''}`
  }

  const hit = consoleResponses.find((r) => r.match.some((m) => cmd.includes(m)))
  return hit ? hit.response : consoleFallback
}
