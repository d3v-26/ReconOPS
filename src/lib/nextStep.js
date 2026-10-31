import { bus } from './bus.js'
import { evidenceSources, anomalies, EVIDENCE_REQUIRED } from '../data/mockData.js'

// The single answer to "what should I do now?" — derived from operation state.
// Shown as the primary call-to-action in the mission rail and answered by the
// console's "what's next?" command, so the operator never has to guess.
export function getNextStep(ops) {
  const { phase } = ops

  if (phase === 'STANDUP') {
    if (ops.readiness < 100) {
      return {
        title: 'Bring the sensor network online',
        detail: `${ops.linkedCount} of 12 assets are on the command net. Data from unlinked assets is quarantined, so the operation can't start until every link is up.`,
        cta: 'Link all assets',
        run: () => ops.linkAll(),
      }
    }
    return {
      title: 'Network ready — move to planning',
      detail: 'All 12 assets are linked and calibrated. Next, decide how they will be tasked against Warehouse S-3.',
      cta: 'Go to planning',
      run: () => ops.advance(),
    }
  }

  if (phase === 'PLANNING') {
    if (!ops.planProposed) {
      return {
        title: 'Draft a collection plan',
        detail: 'Have the AI decompose the objective into taskings for each asset. Click the map to add your own targets first if needed.',
        cta: 'Generate AI plan',
        run: () => bus.emit('planning.request'),
      }
    }
    if (!ops.planApproved) {
      return {
        title: 'Review and approve the plan',
        detail: 'Check the proposed taskings and contingencies. Approval locks taskings and pushes them to every asset.',
        cta: 'Approve plan',
        run: () => ops.setPlanApproved(true),
      }
    }
    return {
      title: 'Plan locked — start the operation',
      detail: 'Assets have their taskings. Starting the operation opens live collection on Warehouse S-3.',
      cta: 'Start operation',
      run: () => ops.advance(),
    }
  }

  if (phase === 'EXECUTION') {
    const missing = evidenceSources.filter((s) => !ops.evidence.includes(s.id))
    if (ops.evidence.length < EVIDENCE_REQUIRED) {
      const src = missing[0]
      return {
        title: `Corroborate with ${src.label.toLowerCase()}`,
        detail: `${ops.evidence.length}/${EVIDENCE_REQUIRED} independent sources logged. Review this source and log it if it shows staging at S-3.`,
        cta: `Open ${src.label.toLowerCase()}`,
        run: () => ops.setMode(src.id),
      }
    }
    if (ops.criticalOpen.length) {
      const a = anomalies.find((x) => x.id === ops.criticalOpen[0])
      return {
        title: `Resolve critical alert ${a.id}`,
        detail: `${a.title}. Approve the recommended action or dismiss it — escalation stays off the table.`,
        cta: 'Review alert',
        run: () => ops.focusAlert(a.id),
      }
    }
    return {
      title: 'Objective answered — close the operation',
      detail: `Confidence ${Math.round(ops.confidence * 100)}% from ${ops.evidence.length} independent sources, no open critical alerts.`,
      cta: 'End operation & debrief',
      run: () => ops.advance(),
    }
  }

  if (!ops.reportFiled) {
    return {
      title: 'File the after-action report',
      detail: 'Generate the AAR and export it. It becomes the template for the next operation.',
      cta: 'Generate report',
      run: () => bus.emit('debrief.generate'),
    }
  }
  return {
    title: 'Operation complete',
    detail: 'Report filed. Every success criterion has been met.',
    cta: null,
    run: null,
  }
}
