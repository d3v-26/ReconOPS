// ─── Ghost Command: ReconOPS — mock intelligence data ───
// All data fictional. Preview mode only. Entities (assets, contacts, places) live in entities.js.

// Area of operations — real USGS public-domain orthoimagery used as a stand-in
// backdrop. Positions across the app are % of this box (x: west→east, y: north→south).
export const AO = {
  name: 'SECTOR 7',
  bounds: { north: 35.07496, south: 35.03899, west: -118.19092, east: -118.13599 },
  imageryCredit: 'Imagery: USDA / USGS The National Map (public domain)',
}

// ─── The question the whole operation exists to answer ───
export const mission = {
  title: 'OPERATION QUIET HORIZON',
  question: 'Is Warehouse S-3 being used to stage supplies?',
  objective: 'Confirm or rule out supply staging at Warehouse S-3 before the 15:00Z movement window closes — without escalating.',
  deadline: { h: 15, m: 0 },
  start: { h: 13, m: 52 },
}

// Each source the operator logs as evidence moves confidence toward a verdict.
// `from` is the entity whose feed carries that evidence.
export const evidenceSources = [
  { id: 'photo', from: 'SAT-9', label: 'Satellite frame', weight: 0.16, finding: 'Truck, 3-person group and a new container at the S-3 loading bay — container absent from baseline.' },
  { id: 'video', from: 'DR-01', label: 'Drone video', weight: 0.16, finding: 'SPECTER-1 shows a vehicle shuttle into S-3 and personnel holding a loading posture.' },
  { id: 'audio', from: 'AS-02', label: 'Intercepted audio', weight: 0.15, finding: '"Moving the first load now… we are on a window" — speakers coordinating a timed movement.' },
  { id: 'docs', from: 'HT-01', label: 'Field report', weight: 0.13, finding: 'FR-118 cites two trucks and a container at the S-3 bay and a 14:00–15:00Z movement window.' },
]
export const EVIDENCE_BASE = 0.3
export const EVIDENCE_REQUIRED = 3

// ─── Alerts — attached to entities on the map ───
export const anomalies = [
  { id: 'AN-01', entity: 'CX', title: 'Zone breach — geofence GF-2', severity: 'Critical', confidence: 0.96, recommended: 'Task SPECTER-1 for visual confirm and warn VANGUARD. Do not intercept.', approveNote: 'SPECTER-1 holds visual; VANGUARD warned. Contact turned back east at 14:09Z.', dismissNote: 'Breach logged as civilian traffic. Watch continues.' },
  { id: 'AN-02', entity: 'EV-042', title: 'Acoustic impact spike, bearing 042', severity: 'Critical', confidence: 0.87, recommended: 'Hold VANGUARD in place and correlate on the 14:20Z KEYHOLE-9 pass.', approveNote: 'Correlated: cargo dropped from T-03 tailgate. No impact, no casualties.', dismissNote: 'Spike dismissed as a one-off. VANGUARD released.' },
  { id: 'AN-04', entity: 'RIDGE', title: 'Unknown object — ridge line', severity: 'High', confidence: 0.55, recommended: 'Send SPECTER-2 for a closer pass before anyone reacts to it.', approveNote: 'Closer pass: abandoned survey equipment. Reflection explained.', dismissNote: 'Left unresolved — low priority.' },
]

// ─── Satellite frame 2231 segmentation (boxes are % of s3-still.jpg) ───
export const photoSegments = [
  { id: 'SEG-01', label: 'TRUCK', confidence: 0.94, box: { x: 46.5, y: 76, w: 5, h: 6 }, tone: 'amber' },
  { id: 'SEG-02', label: 'WAREHOUSE S-3', confidence: 0.97, box: { x: 45.5, y: 42.5, w: 13, h: 14.5 }, tone: 'gold' },
  { id: 'SEG-03', label: 'PERSONNEL ×3', confidence: 0.81, box: { x: 61, y: 38, w: 7.5, h: 7 }, tone: 'amber' },
  { id: 'SEG-04', label: 'CONTAINER · NEW', confidence: 0.76, box: { x: 61.5, y: 67.5, w: 4.5, h: 5 }, tone: 'amber' },
  { id: 'SEG-05', label: 'UNKNOWN', confidence: 0.55, box: { x: 53.5, y: 20, w: 6.5, h: 9 }, tone: 'red' },
]

// ─── EARSHOT-A intercept ───
export const transcript = [
  { t: '00:02', speaker: 'A', text: 'Checkpoint is clear, moving the first load now.', translated: 'Checkpoint clear — first load in motion.' },
  { t: '00:06', speaker: 'A', text: 'Keep the engine running, we are on a window.', translated: 'Engine stays on — operating window active.' },
  { t: '00:11', speaker: 'B', text: 'Copy. Second vehicle is four minutes out.', translated: 'Acknowledged. Second vehicle ETA four minutes.' },
  { t: '00:16', speaker: 'B', text: 'Watch the ridge, something reflected up there.', translated: 'Observe ridge line — reflection sighted.' },
  { t: '00:21', speaker: 'A', text: 'Probably nothing. Stay on schedule.', translated: 'Likely nothing — maintain schedule.' },
  { t: '00:34', speaker: '—', text: '[alert tone — 2 bursts]', translated: '[alert tone — 2 bursts]' },
]

// ─── Field reports carried by people ───
export const documents = {
  'FR-118': {
    title: 'FIELD REPORT FR-118',
    body: 'Patrol observed increased vehicle traffic near grid QT 4412 8867 between 13:20Z and 13:50Z. Two trucks and one container noted at the warehouse loading bay. Local source mentions a movement window between 14:00Z and 15:00Z. Ridge line reflection reported but unconfirmed.',
  },
}

// ─── Map overlays ───
export const mapZones = [
  { id: 'GF-2', name: 'GEOFENCE GF-2', kind: 'geofence', x: 66.3, y: 53, r: 11, tone: 'red' },
  { id: 'THR-2', name: 'THREAT RING THR-2', kind: 'threat', x: 26, y: 45.5, r: 7, tone: 'amber' },
  { id: 'SZ-1', name: 'SAFE CORRIDOR', kind: 'safe', x: 46, y: 80, r: 5, tone: 'green' },
]

export const mapPaths = [
  { id: 'P-3', points: [[35, 75], [45, 75], [60, 83], [80, 89], [100, 94]], tone: 'green', label: 'Route Bravo' },
]

// ─── Collection plan: who watches what ───
export const plan = {
  summary: 'Objective decomposed into 7 taskings. Every target gets at least two independent sensor types; SPECTER-2 stays as mobile reserve for the ridge and sector 5.',
  taskings: [
    { asset: 'DR-01', target: 'S-3', task: 'Orbit overwatch on S-3' },
    { asset: 'SAT-9', target: 'S-3', task: '14:20Z pass over S-3 + ridge' },
    { asset: 'AS-02', target: 'S-3', task: 'Intercept toward the bay' },
    { asset: 'CAM-04', target: 'S-3', task: 'East gate + bay approach' },
    { asset: 'DR-02', target: 'RIDGE', task: 'Reserve · ridge pass on demand' },
    { asset: 'HT-01', target: 'S-3', task: 'Ground verification hold' },
    { asset: 'VH-03', target: 'CKP-N', task: 'Route Bravo loop → checkpoint' },
  ],
}

// ─── Lifecycle (shown as objectives) ───
export const OP_PHASES = [
  { id: 'STANDUP', label: 'Bring the network online' },
  { id: 'PLANNING', label: 'Approve a collection plan' },
  { id: 'EXECUTION', label: 'Answer the question' },
  { id: 'DEBRIEF', label: 'File the after-action report' },
]

// ─── Radio traffic per phase ───
export const commsTraffic = {
  STANDUP: [
    { from: 'SPECTER-1', text: 'Checking in on command net. Holding at rally point.' },
    { from: 'ARGUS-NE', text: 'Link up. Calibration frame uploaded.' },
    { from: 'EARSHOT-A', text: 'On net. Noise floor −62 dB.' },
    { from: 'VANGUARD-6', text: 'Team up on encrypted net. NOMAD tablet paired.' },
    { from: 'KEYHOLE-9', text: 'Downlink window confirmed. Next pass 14:20Z.' },
  ],
  PLANNING: [
    { from: 'VANGUARD-6', text: 'Copy draft taskings. Confirm hold position south of S-3.' },
    { from: 'SPECTER-1', text: 'Orbit profile received. 19 hours on station.' },
    { from: 'NOMAD-3', text: 'Route Bravo extension acknowledged.' },
  ],
  EXECUTION: [
    { from: 'SPECTER-1', text: 'On station over S-3. Feed is live.' },
    { from: 'VANGUARD-6', text: 'Holding. Eyes on the bay, light traffic.' },
    { from: 'EARSHOT-A', text: 'Acoustic event bearing 042 — pushed to fusion.' },
    { from: 'ARGUS-SW', text: 'Signal degrading, wind on the mast. Still up.' },
    { from: 'VANGUARD-2', text: 'Route Bravo quiet. One civilian sedan westbound.' },
    { from: 'SPECTER-2', text: 'Holding reserve orbit north of the ridge.' },
  ],
  DEBRIEF: [
    { from: 'VANGUARD-6', text: 'RTB complete. Field notes uploaded.' },
    { from: 'SPECTER-1', text: 'Feed archive closed. 4.1 h tagged for review.' },
  ],
}

// ─── After-action ───
export const aarReport = {
  timeline: [
    { t: '11:02Z', label: 'Stand-up — sensor network linked', sev: 'Low' },
    { t: '11:38Z', label: 'Collection plan approved, taskings pushed', sev: 'Low' },
    { t: '13:21Z', label: 'LIDAR-RIG fault mid-scan', sev: 'Medium' },
    { t: '14:00Z', label: 'CONTACT-X breaches GF-2', sev: 'Critical' },
    { t: '14:02Z', label: 'Acoustic spike bearing 042', sev: 'Critical' },
    { t: '14:20Z', label: 'KEYHOLE-9 pass — impact correlated to dropped cargo', sev: 'Medium' },
    { t: '14:55Z', label: 'Window closed — staging documented, no escalation', sev: 'Low' },
  ],
  findings: 'Multimodal fusion confirmed staging at Warehouse S-3 inside the predicted window. CONTACT-X was tracked and turned back without escalation; the acoustic spike was dropped cargo, not an impact.',
  lessons: 'Sector 5 needs N+1 camera coverage — ARGUS-SW nearly opened a blind spot during the window. LIDAR is a single point of failure for structure checks. Low-confidence objects (the ridge) were the slowest loop: pre-assign a reviewer.',
  recommendation: 'Archive as a template. Re-mast ARGUS-SW, pair the LIDAR, and keep SPECTER-1 on S-3 for 48 h.',
}

// ─── Command bar ───
export const consoleResponses = [
  { match: ['risk'], response: 'RISK — ELEVATED. Drivers: CONTACT-X inside GF-2, an uncorrelated acoustic spike, and an unclassified ridge object. None justify escalation yet; all three resolve with existing sensors.' },
  { match: ['brief', 'summary', 'sitrep', 'situation'], response: 'SITREP — Loading activity at S-3 (truck, crew of 3, new container). Window 14:00–15:00Z. CONTACT-X westbound inside GF-2. ARGUS-SW degrading. Recommend: confirm with 3 sources, resolve both critical alerts, no intercept.' },
  { match: ['compare', 'fuse', 'correlat'], response: 'FUSION — Drone track T-07 and map contact CONTACT-X are the same vehicle (0.88). Audio "second vehicle four minutes out" matches its arrival time.' },
]

export const consoleFallback = 'I didn\'t catch that. Try naming something on the map ("open specter 1", "show the truck"), or say "what\'s next?", "do it", "thermal", "log evidence", "send nomad to the checkpoint", "take control of nomad".'

export const suggestions = {
  STANDUP: ["what's next?", 'link all assets', 'open specter 1'],
  PLANNING: ["what's next?", 'generate plan', 'approve plan'],
  EXECUTION: ["what's next?", 'do it', 'thermal', 'log evidence', 'show alerts'],
  DEBRIEF: ['generate report', 'export report'],
}
