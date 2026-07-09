import { bus } from './bus.js'
import { consoleResponses, consoleFallback, THEATERS, DATA_MODES, mission } from '../data/mockData.js'

// Maps a natural-language command to a real UI action + operator-facing response.
// In a live deployment this router is replaced by an LLM with tool use
// (each handler below becomes a tool the model can call).

const MODE_WORDS = {
  map: 'map', photo: 'photo', image: 'photo', audio: 'audio', sound: 'audio',
  video: 'video', feed: 'video', '3d': '3d', 'three-d': '3d', scene: '3d',
  coordinates: 'coords', coords: 'coords', coordinate: 'coords',
  docs: 'docs', documents: 'docs', document: 'docs', reports: 'docs',
}

// Deferred emit: mode switches unmount/remount views, so give the target view
// a beat to mount and register its bus listeners before the event fires.
const emitSoon = (event, payload) => setTimeout(() => bus.emit(event, payload), 180)

export function routeCommand(raw, ops) {
  const cmd = raw.toLowerCase()
  const has = (...words) => words.every((w) => cmd.includes(w))
  const any = (...words) => words.some((w) => cmd.includes(w))

  // ── lifecycle control ──
  if (any('link all', 'establish all', 'bring assets online')) {
    if (ops.phase !== 'STANDUP') return { text: 'Assets already linked — link procedure only runs during STAND-UP.' }
    ops.linkAll()
    return { text: 'EXECUTING — Establishing comms links to all 12 assets. Handshakes cascading; readiness meter live in the workspace.' }
  }
  if (any('advance', 'next phase', 'proceed to')) {
    const before = ops.phase
    if (ops.gate) return { text: `BLOCKED BY GATE — ${ops.gate}` }
    ops.advance()
    return { text: `PHASE TRANSITION — Advancing from ${before}. Workspace reconfiguring.` }
  }
  if (any('end operation', 'end the operation', 'wrap up', 'go to debrief')) {
    const r = ops.goTo('DEBRIEF')
    return { text: r.ok ? 'OPERATION ENDING — Transitioning to DEBRIEF. Archives sealing, AAR synthesis available.' : `BLOCKED — ${r.reason}` }
  }
  for (const [names, id] of [
    [['stand-up', 'standup', 'stand up'], 'STANDUP'],
    [['planning phase', 'go to planning', 'back to planning', 'to planning'], 'PLANNING'],
    [['execution phase', 'go to execution', 'return to execution', 'to execution', 'resume operation'], 'EXECUTION'],
  ]) {
    if (names.some((n) => cmd.includes(n))) {
      const r = ops.goTo(id)
      return { text: r.ok ? `PHASE TRANSITION — Moving to ${id}.` : `BLOCKED — ${r.reason}` }
    }
  }
  if (any('approve plan', 'approve the plan', 'confirm plan')) {
    if (ops.phase !== 'PLANNING') return { text: 'Plan approval only available during PLANNING phase.' }
    ops.setPlanApproved(true)
    return { text: 'PLAN APPROVED — Taskings locked and pushed to all assets. EXECUTION gate is now open.' }
  }
  if (any('request ai plan', 'generate plan', 'propose plan', 'draft plan')) {
    if (ops.phase !== 'PLANNING') return { text: 'Plan synthesis runs in the PLANNING workspace. Say "go to planning" first.' }
    bus.emit('planning.request')
    return { text: 'PLAN SYNTHESIS — LLM decomposing objective into taskings. Proposal rendering in the planning workspace.' }
  }
  if (any('approve all decision', 'approve decisions', 'clear decision queue')) {
    const n = ops.approveAllDecisions()
    return { text: `DECISIONS APPROVED — ${n} pending operator decisions approved: ${mission.decisionQueue.map((d) => d.id).join(', ')}. Taskings dispatched.` }
  }

  // ── theater ──
  for (const t of Object.keys(THEATERS)) {
    if (cmd.includes(t.toLowerCase())) {
      ops.setTheater(t)
      if (ops.phase === 'EXECUTION') ops.setMode('map')
      return { text: `THEATER SWITCH — Environment set to ${t.toUpperCase()}: ${THEATERS[t].desc}. Map layers re-rendering.` }
    }
  }

  // ── workspace mode ──
  if (any('switch', 'open', 'show', 'go to', 'view')) {
    for (const [word, modeId] of Object.entries(MODE_WORDS)) {
      if (cmd.includes(word)) {
        if (ops.phase !== 'EXECUTION') {
          return { text: `Workspace modes are live during EXECUTION. Currently in ${ops.phase}.` }
        }
        ops.setMode(modeId)
        const label = DATA_MODES.find((m) => m.id === modeId)?.label
        // mode-specific extras
        if (modeId === 'video' && any('thermal', 'flir', 'ir')) emitSoon('video.thermal', true)
        if (modeId === 'photo' && cmd.includes('heatmap')) emitSoon('photo.heatmap', true)
        return { text: `WORKSPACE — ${label} intelligence mode active.` }
      }
    }
  }

  // ── media actions ──
  if (any('translate')) {
    ops.setMode('audio')
    emitSoon('audio.translate', true)
    return { text: 'TRANSLATION LAYER — Transcript translated from Foreign Language A (detection 0.86), 8 lines, mean confidence 0.87. Audio workspace showing translated text.' }
  }
  if (any('original transcript', 'untranslate')) {
    bus.emit('audio.translate', false)
    return { text: 'Transcript reverted to original language.' }
  }
  if (has('play') && any('audio', 'clip', 'recording')) {
    ops.setMode('audio'); emitSoon('audio.play', true)
    return { text: 'AUDIO — Playback resumed on EARSHOT-A ch.2. Waveform live.' }
  }
  if (has('pause') || has('stop', 'audio')) {
    bus.emit('audio.play', false)
    return { text: 'AUDIO — Playback paused.' }
  }
  if (any('thermal', 'flir', 'infrared')) {
    ops.setMode('video'); emitSoon('video.thermal', true)
    return { text: 'VIDEO — Thermal rendering enabled on SPECTER-1 feed. Hot signatures amplified.' }
  }
  if (any('normal video', 'visible spectrum', 'thermal off')) {
    bus.emit('video.thermal', false)
    return { text: 'VIDEO — Reverted to visible-spectrum rendering.' }
  }
  if (any('heatmap')) {
    ops.setMode('photo'); emitSoon('photo.heatmap', true)
    return { text: 'PHOTO — Confidence heatmap overlay enabled on frame 2231.' }
  }
  if (any('generate briefing', 'operator briefing', 'brief me')) {
    bus.emit('briefing.generate')
    return { text: 'BRIEFING — LLM synthesizing all active intelligence streams. Operator Briefing panel updating.' }
  }

  // ── filters ──
  if (any('filter', 'only show', 'show only', 'show all')) {
    for (const sev of ['Critical', 'High', 'Medium', 'Low']) {
      if (cmd.includes(sev.toLowerCase()) && any('anomal', 'threat')) {
        ops.setThreatFilter(sev)
        return { text: `THREAT PANEL — Filtered to ${sev.toUpperCase()} severity.` }
      }
    }
    if (any('anomal', 'threat') && cmd.includes('all')) {
      ops.setThreatFilter('All')
      return { text: 'THREAT PANEL — Filter cleared, showing all severities.' }
    }
    for (const media of ['Photo', 'Audio', 'Video', 'Map', '3D', 'Document', 'Sensor']) {
      if (cmd.includes(media.toLowerCase()) && any('feed', 'events', 'intel')) {
        ops.setFeedFilters({ prio: 'All', media })
        return { text: `INTEL FEED — Filtered to ${media.toUpperCase()} events.` }
      }
    }
  }
  if (any('review all anomalies', 'mark anomalies reviewed')) {
    bus.emit('threats.reviewAll')
    return { text: 'THREAT PANEL — All open anomalies marked IN REVIEW and assigned to operator queue.' }
  }

  // ── status queries ──
  if (any('comms status', 'who is on net', 'net status')) {
    return { text: `COMMS NET — ${ops.linkedCount}/12 stations linked. Readiness ${ops.readiness}%. ${ops.readiness === 100 ? 'All nets green.' : 'Link procedure incomplete.'}` }
  }
  if (any('readiness', 'stand-up status', 'onboarding status')) {
    return { text: `READINESS ${ops.readiness}% — ${ops.linkedCount}/12 assets on encrypted net. ${ops.gate ? `Gate: ${ops.gate}` : 'All gates clear.'}` }
  }

  // ── canned intel responses (kept from v1) ──
  const hit = consoleResponses.find((r) => r.match.some((m) => cmd.includes(m)))
  if (hit) return { text: hit.response }

  return { text: consoleFallback }
}
