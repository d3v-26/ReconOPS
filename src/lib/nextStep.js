import { evidenceSources, anomalies, EVIDENCE_REQUIRED } from '../data/mockData.js'
import { byId } from '../data/entities.js'

// The single answer to "what should I do now?" — derived from operation state.
// `focus` is the entity that gets the objective marker on the map; `run` is what
// "do it" in the command bar executes. Nothing else in the UI decides the next move.
export function getNextStep(ops) {
  const { phase } = ops

  if (phase === 'STANDUP') {
    if (ops.readiness < 100) {
      return {
        title: 'Bring the sensor network online',
        detail: `${ops.linkedCount} of 11 assets linked. Click a dimmed asset to link it, or say "link all".`,
        run: () => ops.linkAll(), say: 'link all assets',
      }
    }
    return { title: 'Network ready', detail: 'Every asset is on the net. Move to planning.', run: () => ops.advance(), say: 'do it' }
  }

  if (phase === 'PLANNING') {
    if (!ops.planProposed) {
      return {
        title: 'Draft a collection plan',
        detail: 'Click Warehouse S-3 (or say "generate plan") to have the AI task each asset.',
        focus: 'S-3', run: () => { ops.select('S-3'); ops.proposePlan() }, say: 'generate plan',
      }
    }
    if (!ops.planApproved) {
      return { title: 'Approve the plan', detail: 'Tasking lines are on the map. Approve to lock them in.', focus: 'S-3', run: () => ops.approvePlan(), say: 'approve plan' }
    }
    return { title: 'Start the operation', detail: 'Assets have their taskings.', run: () => ops.advance(), say: 'do it' }
  }

  if (phase === 'EXECUTION') {
    if (ops.evidence.length < EVIDENCE_REQUIRED) {
      const src = evidenceSources.find((s) => !ops.evidence.includes(s.id))
      const e = byId[src.from]
      return {
        title: `Check ${e.name}`,
        detail: `${ops.evidence.length}/${EVIDENCE_REQUIRED} sources logged. Open its feed and log what it shows about S-3.`,
        focus: e.id, run: () => ops.select(e.id), say: `open ${e.name.toLowerCase()}`,
      }
    }
    if (ops.criticalOpen.length) {
      const a = anomalies.find((x) => x.id === ops.criticalOpen[0])
      const e = byId[a.entity]
      return {
        title: `Resolve ${e.name}`,
        detail: `${a.title}. Approve the recommended action or dismiss it — no escalation.`,
        focus: e.id, run: () => ops.select(e.id), say: `open ${e.name.toLowerCase()}`,
      }
    }
    return {
      title: 'Question answered — close out',
      detail: `${Math.round(ops.confidence * 100)}% confidence from ${ops.evidence.length} sources, no open critical alerts.`,
      run: () => ops.advance(), say: 'end operation',
    }
  }

  if (!ops.reportFiled) return { title: 'File the report', detail: 'Generate the after-action report.', run: () => ops.setReportFiled(true), say: 'generate report' }
  return { title: 'Operation complete', detail: 'Every objective met.', say: null }
}
