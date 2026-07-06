// ─── Ghost Command: ReconOPS — mock intelligence data ───
// All data fictional. Preview mode only.

export const ENVIRONMENTS = [
  'Global', 'Urban', 'Maritime', 'Border', 'Airspace', 'Cyber', 'Disaster Response', 'Research Lab',
]

export const DATA_MODES = [
  { id: 'map', label: 'MAP', icon: '◈' },
  { id: 'photo', label: 'PHOTO', icon: '▣' },
  { id: 'audio', label: 'AUDIO', icon: '≋' },
  { id: 'video', label: 'VIDEO', icon: '▶' },
  { id: '3d', label: '3D', icon: '◮' },
  { id: 'coords', label: 'COORDS', icon: '⌖' },
  { id: 'docs', label: 'DOCS', icon: '≡' },
]

// ─── Assets ───
export const assets = [
  { id: 'DR-01', name: 'SPECTER-1', type: 'Drone', status: 'Active', health: 96, signal: 88, lastUpdate: '00:00:04', task: 'Sector 7 overwatch', dataType: 'Video / Photo' },
  { id: 'DR-02', name: 'SPECTER-2', type: 'Drone', status: 'Rerouting', health: 84, signal: 71, lastUpdate: '00:00:11', task: 'Convoy shadow', dataType: 'Video' },
  { id: 'CAM-04', name: 'ARGUS-NE', type: 'Camera', status: 'Active', health: 99, signal: 94, lastUpdate: '00:00:02', task: 'Perimeter watch NE', dataType: 'Video' },
  { id: 'CAM-07', name: 'ARGUS-SW', type: 'Camera', status: 'Degraded', health: 61, signal: 43, lastUpdate: '00:02:38', task: 'Gate coverage SW', dataType: 'Video' },
  { id: 'AS-02', name: 'EARSHOT-A', type: 'Audio Sensor', status: 'Active', health: 92, signal: 81, lastUpdate: '00:00:06', task: 'Acoustic sweep — ridge', dataType: 'Audio' },
  { id: 'AS-05', name: 'EARSHOT-B', type: 'Audio Sensor', status: 'Processing', health: 88, signal: 77, lastUpdate: '00:00:19', task: 'Signal triage', dataType: 'Audio' },
  { id: 'VH-03', name: 'NOMAD-3', type: 'Vehicle', status: 'Active', health: 78, signal: 66, lastUpdate: '00:00:31', task: 'Route Bravo patrol', dataType: 'Telemetry' },
  { id: 'SAT-9', name: 'KEYHOLE-9', type: 'Satellite', status: 'Awaiting Command', health: 100, signal: 97, lastUpdate: '00:01:12', task: 'Pass window 14:20Z', dataType: 'Photo / Map' },
  { id: 'HT-01', name: 'VANGUARD', type: 'Human Team', status: 'Active', health: 100, signal: 89, lastUpdate: '00:00:44', task: 'Ground verification', dataType: 'Document / Audio' },
  { id: 'ML-02', name: 'ATLAS-LAYER', type: 'Map Layer', status: 'Active', health: 100, signal: 100, lastUpdate: '00:00:01', task: 'Terrain sync', dataType: 'Map' },
  { id: 'DF-01', name: 'LEDGER-FEED', type: 'Document Feed', status: 'Processing', health: 95, signal: 100, lastUpdate: '00:00:09', task: 'Report ingestion', dataType: 'Document' },
  { id: '3D-01', name: 'LIDAR-RIG', type: '3D Scanner', status: 'Offline', health: 12, signal: 0, lastUpdate: '00:41:07', task: 'Structure scan — paused', dataType: '3D Point Cloud' },
]

// ─── Intelligence feed events ───
export const feedEvents = [
  { id: 'EV-1041', source: 'Photo', sourceName: 'KEYHOLE-9 frame 2231', tag: 'SAM-H Segment', confidence: 0.94, priority: 'High', time: '14:02:11Z', summary: 'Three vehicle-class objects segmented near northern checkpoint. Formation suggests staging.' },
  { id: 'EV-1042', source: 'Audio', sourceName: 'EARSHOT-A ch.2', tag: 'Audio Event', confidence: 0.87, priority: 'Critical', time: '14:01:54Z', summary: 'High-energy acoustic spike consistent with impact event, bearing 042.' },
  { id: 'EV-1043', source: 'Video', sourceName: 'SPECTER-1 stream', tag: 'Video Track', confidence: 0.91, priority: 'High', time: '14:01:30Z', summary: 'Track T-07 changed direction abruptly; now moving toward geofence GF-2.' },
  { id: 'EV-1044', source: 'Document', sourceName: 'Field report FR-118', tag: 'Document Entity', confidence: 0.82, priority: 'Medium', time: '14:00:47Z', summary: 'Report references grid QT 4412 8867 — matches active threat ring THR-2.' },
  { id: 'EV-1045', source: 'Map', sourceName: 'ATLAS-LAYER', tag: 'Map Alert', confidence: 0.96, priority: 'Critical', time: '14:00:12Z', summary: 'Zone breach detected: unregistered contact entered geofence GF-2 from the east.' },
  { id: 'EV-1046', source: 'Sensor', sourceName: 'NOMAD-3 telemetry', tag: 'LLM Synthesis', confidence: 0.78, priority: 'Low', time: '13:59:58Z', summary: 'Vibration signature nominal; route Bravo surface quality degrading slowly.' },
  { id: 'EV-1047', source: 'Audio', sourceName: 'EARSHOT-B ch.1', tag: 'Audio Event', confidence: 0.73, priority: 'Medium', time: '13:59:21Z', summary: 'Intermittent radio chatter detected on non-allocated band; language pending.' },
  { id: 'EV-1048', source: '3D', sourceName: 'LIDAR-RIG scan 09', tag: 'SAM-H Segment', confidence: 0.69, priority: 'Medium', time: '13:58:40Z', summary: 'Point-cloud deviation on structure S-3 east wall vs. baseline scan (Δ 0.4m).' },
  { id: 'EV-1049', source: 'Photo', sourceName: 'SPECTER-2 still', tag: 'Human Review Needed', confidence: 0.55, priority: 'High', time: '13:58:02Z', summary: 'Unknown object class near ridge line; SAM-H mask unstable across frames.' },
  { id: 'EV-1050', source: 'Video', sourceName: 'ARGUS-NE', tag: 'Video Track', confidence: 0.89, priority: 'Low', time: '13:57:33Z', summary: 'Crowd density at east gate steady; no anomalous motion vectors.' },
  { id: 'EV-1051', source: 'Document', sourceName: 'Briefing B-77', tag: 'LLM Synthesis', confidence: 0.92, priority: 'Medium', time: '13:56:50Z', summary: 'Cross-referenced three reports: consistent mention of supply movement window 14:00–15:00Z.' },
  { id: 'EV-1052', source: 'Map', sourceName: 'Sensor mesh', tag: 'Map Alert', confidence: 0.84, priority: 'Medium', time: '13:56:12Z', summary: 'Coverage gap forming in sector 5 as CAM-07 signal degrades.' },
  { id: 'EV-1053', source: 'Audio', sourceName: 'EARSHOT-A ch.4', tag: 'Audio Event', confidence: 0.66, priority: 'Low', time: '13:55:39Z', summary: 'Background engine noise trending louder over 6 min; single source, diesel profile.' },
  { id: 'EV-1054', source: 'Sensor', sourceName: 'Ingestion gateway', tag: 'LLM Synthesis', confidence: 0.97, priority: 'Low', time: '13:55:01Z', summary: 'All ingestion lanes nominal; queue depth stable at 14 items.' },
]

// ─── Anomalies / threats ───
export const anomalies = [
  { id: 'AN-01', title: 'Zone breach — geofence GF-2', severity: 'Critical', confidence: 0.96, source: 'Map / ATLAS-LAYER', recommended: 'Task SPECTER-1 for visual confirm; alert VANGUARD.', status: 'Unreviewed', detail: 'Unregistered ground contact crossed the eastern boundary of GF-2 at 14:00:12Z moving west at ~14 km/h.' },
  { id: 'AN-02', title: 'Acoustic impact spike, bearing 042', severity: 'Critical', confidence: 0.87, source: 'Audio / EARSHOT-A', recommended: 'Correlate with KEYHOLE-9 next pass; hold VANGUARD position.', status: 'In Review', detail: 'Single high-energy transient, 1.8s decay, spectral profile matches impact class events.' },
  { id: 'AN-03', title: 'Video track T-07 direction change', severity: 'High', confidence: 0.91, source: 'Video / SPECTER-1', recommended: 'Maintain track lock; pre-arm geofence alert.', status: 'Unreviewed', detail: 'Track T-07 (vehicle) turned 110° off prior heading and accelerated toward GF-2.' },
  { id: 'AN-04', title: 'Unknown object — ridge line', severity: 'High', confidence: 0.55, source: 'Photo / SPECTER-2', recommended: 'Human review required; request closer pass.', status: 'Human Review', detail: 'SAM-H mask unstable across 4 consecutive stills; object class oscillates between equipment and terrain.' },
  { id: 'AN-05', title: 'Coordinate cluster anomaly QT 44', severity: 'Medium', confidence: 0.74, source: 'Coordinates / parser', recommended: 'Expand cluster radius; cross-check document mentions.', status: 'Unreviewed', detail: '5 independent coordinate references within 400m radius across 3 source types in 20 minutes.' },
  { id: 'AN-06', title: 'Structure S-3 deformation Δ0.4m', severity: 'Medium', confidence: 0.69, source: '3D / LIDAR-RIG', recommended: 'Schedule rescan when LIDAR-RIG restored.', status: 'Deferred', detail: 'East wall point cloud deviates from baseline; could be scan artifact — rig went offline mid-pass.' },
  { id: 'AN-07', title: 'Document flags high-risk location', severity: 'High', confidence: 0.82, source: 'Document / FR-118', recommended: 'Fuse with map layer; raise zone THR-2 watch level.', status: 'In Review', detail: 'Field report FR-118 references grid inside active threat ring THR-2 with a 14:00–15:00Z window.' },
  { id: 'AN-08', title: 'Sensor coverage gap — sector 5', severity: 'Medium', confidence: 0.84, source: 'Map / sensor mesh', recommended: 'Reroute SPECTER-2 to cover gap.', status: 'Approved', detail: 'CAM-07 signal at 43% and falling; projected blind spot of 120m arc within 15 minutes.' },
  { id: 'AN-09', title: 'Unallocated band radio chatter', severity: 'Low', confidence: 0.73, source: 'Audio / EARSHOT-B', recommended: 'Continue monitoring; queue for language ID.', status: 'Monitoring', detail: 'Short burst transmissions, 2–4s, irregular interval. Language detection pending.' },
  { id: 'AN-10', title: 'Diesel signature trending louder', severity: 'Low', confidence: 0.66, source: 'Audio / EARSHOT-A', recommended: 'Tag and watch; correlate with route Bravo traffic.', status: 'Monitoring', detail: 'Single-source engine noise rising ~2dB per minute over 6 minutes, consistent approach vector.' },
]

// ─── Mission ───
export const mission = {
  title: 'OPERATION QUIET HORIZON',
  objective: 'Establish persistent multimodal surveillance over Sector 7 and verify reported supply movement without escalation.',
  phases: [
    { name: 'Phase 1 — Sensor Emplacement', status: 'Complete' },
    { name: 'Phase 2 — Baseline Collection', status: 'Complete' },
    { name: 'Phase 3 — Active Surveillance', status: 'Active' },
    { name: 'Phase 4 — Verification & Fusion', status: 'Pending' },
    { name: 'Phase 5 — Debrief & Handover', status: 'Pending' },
  ],
  progress: 58,
  riskLevel: 'Elevated',
  recommendations: [
    { id: 'R-1', text: 'Reroute SPECTER-2 to cover sector 5 gap before CAM-07 fails.', sources: ['Map', 'Sensor'], confidence: 0.89 },
    { id: 'R-2', text: 'Hold VANGUARD at current position until impact event AN-02 is correlated.', sources: ['Audio', 'Map'], confidence: 0.84 },
    { id: 'R-3', text: 'Prioritize KEYHOLE-9 14:20Z pass over grid QT 4412 8867.', sources: ['Document', 'Coordinates', 'Map'], confidence: 0.91 },
    { id: 'R-4', text: 'Escalate GF-2 breach to operator decision — contact reaches zone core in ~9 min.', sources: ['Map', 'Video'], confidence: 0.96 },
    { id: 'R-5', text: 'Queue SPECTER-2 ridge stills for human review (unstable SAM-H mask).', sources: ['Photo'], confidence: 0.55 },
    { id: 'R-6', text: 'Fuse FR-118 entities with threat ring THR-2 and raise watch level.', sources: ['Document', 'Map'], confidence: 0.82 },
  ],
  decisionQueue: [
    { id: 'D-1', text: 'Approve SPECTER-2 reroute to sector 5', urgency: 'High' },
    { id: 'D-2', text: 'Authorize closer pass on ridge object AN-04', urgency: 'Medium' },
    { id: 'D-3', text: 'Raise THR-2 watch level to AMBER', urgency: 'Medium' },
  ],
}

// ─── Photo intel ───
export const photoSegments = [
  { id: 'SEG-01', type: 'Vehicle', label: 'VEHICLE · TRUCK CLASS', confidence: 0.94, risk: 'High', box: { x: 12, y: 55, w: 14, h: 11 }, color: 'var(--amber)', summary: 'Heavy truck stationary near checkpoint access road. Thermal shadow suggests recent engine activity.', action: 'Maintain track; flag for next satellite pass.' },
  { id: 'SEG-02', type: 'Structure', label: 'STRUCTURE · WAREHOUSE', confidence: 0.97, risk: 'Low', box: { x: 55, y: 18, w: 24, h: 20 }, color: 'var(--cyan)', summary: 'Known warehouse footprint matches baseline imagery. No structural change detected.', action: 'No action. Baseline confirmed.' },
  { id: 'SEG-03', type: 'Personnel', label: 'PERSONNEL · GROUP (3)', confidence: 0.81, risk: 'Medium', box: { x: 36, y: 62, w: 8, h: 9 }, color: 'var(--green)', summary: 'Three individuals near vehicle SEG-01. Movement pattern consistent with loading activity.', action: 'Correlate with audio feed EARSHOT-A.' },
  { id: 'SEG-04', type: 'Equipment', label: 'EQUIPMENT · CONTAINER', confidence: 0.76, risk: 'Medium', box: { x: 70, y: 58, w: 10, h: 8 }, color: 'var(--amber)', summary: 'Container-class object not present in baseline. Appeared within last 6 hours.', action: 'Add to change-detection watchlist.' },
  { id: 'SEG-05', type: 'Unknown', label: 'UNKNOWN · UNSTABLE MASK', confidence: 0.55, risk: 'High', box: { x: 84, y: 34, w: 9, h: 10 }, color: 'var(--red)', summary: 'SAM-H mask unstable across frames. Object class oscillates between equipment and terrain feature.', action: 'Human review required.' },
]

export const photoSummary = 'SAM-H segmented 5 regions across frame 2231. Scene shows probable loading activity: one truck-class vehicle (0.94), a 3-person group (0.81), and a new container-class object (0.76) absent from baseline. One unknown object near ridge requires human review. Recommend correlating with EARSHOT-A acoustic feed and prioritizing the 14:20Z satellite pass.'

// ─── Audio intel ───
export const audioSegments = [
  { id: 'AU-01', label: 'Speaker A', kind: 'speech', start: 0, end: 14, confidence: 0.92, color: 'var(--cyan)' },
  { id: 'AU-02', label: 'Speaker B', kind: 'speech', start: 15, end: 26, confidence: 0.88, color: 'var(--green)' },
  { id: 'AU-03', label: 'Engine Noise', kind: 'event', start: 8, end: 40, confidence: 0.79, color: 'var(--amber)' },
  { id: 'AU-04', label: 'Silence', kind: 'silence', start: 27, end: 33, confidence: 0.97, color: 'var(--muted)' },
  { id: 'AU-05', label: 'Alert Tone', kind: 'event', start: 34, end: 36, confidence: 0.85, color: 'var(--red)' },
  { id: 'AU-06', label: 'Unknown Signal', kind: 'event', start: 41, end: 52, confidence: 0.61, color: 'var(--red)' },
]

export const transcript = [
  { t: '00:02', speaker: 'Speaker A', text: 'Checkpoint is clear, moving the first load now.', translated: '[TL] Checkpoint clear — first load in motion.', conf: 0.93 },
  { t: '00:06', speaker: 'Speaker A', text: 'Keep the engine running, we are on a window.', translated: '[TL] Engine stays on — operating window active.', conf: 0.91 },
  { t: '00:11', speaker: 'Speaker B', text: 'Copy. Second vehicle is four minutes out.', translated: '[TL] Acknowledged. Second vehicle ETA four minutes.', conf: 0.89 },
  { t: '00:16', speaker: 'Speaker B', text: 'Watch the ridge, something reflected up there.', translated: '[TL] Observe ridge line — reflection sighted.', conf: 0.84 },
  { t: '00:21', speaker: 'Speaker A', text: 'Probably nothing. Stay on schedule.', translated: '[TL] Likely nothing — maintain schedule.', conf: 0.90 },
  { t: '00:27', speaker: '—', text: '[silence — 6s]', translated: '[silence — 6s]', conf: 0.97 },
  { t: '00:34', speaker: 'Background Channel', text: '[alert tone — 2 bursts]', translated: '[alert tone — 2 bursts]', conf: 0.85 },
  { t: '00:41', speaker: 'Unknown Signal', text: '[unresolved transmission — language pending]', translated: '[unresolved transmission — language pending]', conf: 0.61 },
]

export const audioMeta = {
  language: 'Detected: Foreign Language A (confidence 0.86)',
  duration: 52,
  summary: 'Two speakers coordinate a timed loading operation with a second vehicle inbound (~4 min). Speaker B reports a possible reflection on the ridge — correlates with photo anomaly SEG-05. An alert tone and an unresolved transmission follow a 6-second silence. Recommend language ID on the unknown signal and cross-checking ridge imagery.',
  anomalies: 'Anomaly scan: alert tone at 00:34 (0.85) and unresolved transmission at 00:41 (0.61) flagged. Diesel engine signature persists through 77% of the clip.',
}

// ─── Video intel ───
export const videoTracks = [
  { id: 'T-03', type: 'Vehicle', direction: 'NE → E', confidence: 0.93, lastSeen: '14:01:58Z', color: 'var(--amber)', box: { x: 18, y: 58, w: 15, h: 12 } },
  { id: 'T-07', type: 'Vehicle', direction: 'E → SW (changed)', confidence: 0.91, lastSeen: '14:01:30Z', color: 'var(--red)', box: { x: 58, y: 40, w: 14, h: 11 } },
  { id: 'T-09', type: 'Person', direction: 'Static', confidence: 0.84, lastSeen: '14:01:55Z', color: 'var(--green)', box: { x: 40, y: 66, w: 6, h: 12 } },
  { id: 'T-11', type: 'Person', direction: 'W → NW', confidence: 0.78, lastSeen: '14:01:12Z', color: 'var(--green)', box: { x: 74, y: 62, w: 6, h: 11 } },
  { id: 'T-12', type: 'Unknown', direction: 'Erratic', confidence: 0.58, lastSeen: '14:00:49Z', color: 'var(--red)', box: { x: 84, y: 24, w: 8, h: 8 } },
  { id: 'T-14', type: 'Animal', direction: 'S → SE', confidence: 0.71, lastSeen: '13:59:37Z', color: 'var(--cyan)', box: { x: 8, y: 30, w: 7, h: 6 } },
]

export const videoTimeline = [
  { t: 8, label: 'T-03 enters frame', sev: 'Low' },
  { t: 22, label: 'T-09 static — loading posture', sev: 'Medium' },
  { t: 35, label: 'T-07 direction change 110°', sev: 'Critical' },
  { t: 47, label: 'T-12 unstable classification', sev: 'High' },
  { t: 61, label: 'T-07 accelerates toward GF-2', sev: 'Critical' },
  { t: 74, label: 'T-14 exits frame south', sev: 'Low' },
]

export const videoSummary = 'Frame synthesis: 6 active tracks. Critical: T-07 (vehicle, 0.91) executed a 110° turn at t+35s and is accelerating toward geofence GF-2 — intercept in ~9 min at current speed. T-09 holds loading posture near T-03. T-12 classification unstable (0.58), flagged for human review. Recommend pre-arming GF-2 alert and holding SPECTER-1 track lock on T-07.'

export const videoBriefing = 'MISSION BRIEFING (video-derived) — SPECTER-1 stream, sector 7: Surveillance confirms coordinated ground activity around the checkpoint. One vehicle (T-07) broke pattern at 14:01:30Z, turning toward protected zone GF-2. Ground personnel (T-09, T-11) remain near the loading site. Threat posture: ELEVATED. Recommended: maintain aerial track, pre-arm geofence response, hold VANGUARD until acoustic event AN-02 is correlated.'

// ─── Map intel ───
export const mapMarkers = [
  { id: 'M-01', name: 'SPECTER-1', kind: 'drone', x: 34, y: 26, status: 'Active' },
  { id: 'M-02', name: 'SPECTER-2', kind: 'drone', x: 68, y: 18, status: 'Rerouting' },
  { id: 'M-03', name: 'ARGUS-NE', kind: 'camera', x: 78, y: 34, status: 'Active' },
  { id: 'M-04', name: 'ARGUS-SW', kind: 'camera', x: 22, y: 70, status: 'Degraded' },
  { id: 'M-05', name: 'EARSHOT-A', kind: 'sensor', x: 52, y: 44, status: 'Active' },
  { id: 'M-06', name: 'NOMAD-3', kind: 'vehicle', x: 42, y: 58, status: 'Active' },
  { id: 'M-07', name: 'VANGUARD', kind: 'team', x: 58, y: 66, status: 'Holding' },
  { id: 'M-08', name: 'CONTACT-X', kind: 'threat', x: 82, y: 52, status: 'Unregistered' },
  { id: 'M-09', name: 'CHECKPOINT N', kind: 'poi', x: 30, y: 40, status: 'Watched' },
  { id: 'M-10', name: 'WAREHOUSE S-3', kind: 'poi', x: 64, y: 48, status: 'Baseline' },
]

export const mapZones = [
  { id: 'GF-2', name: 'GEOFENCE GF-2', kind: 'geofence', x: 66, y: 56, r: 14, color: 'var(--red)' },
  { id: 'THR-2', name: 'THREAT RING THR-2', kind: 'threat', x: 30, y: 42, r: 11, color: 'var(--amber)' },
  { id: 'SZ-1', name: 'SAFE CORRIDOR', kind: 'safe', x: 46, y: 74, r: 9, color: 'var(--green)' },
]

export const mapPaths = [
  { id: 'P-1', points: '82,52 76,53 70,55 66,56', color: 'var(--red)', label: 'CONTACT-X ingress' },
  { id: 'P-2', points: '68,18 62,24 56,30 52,36', color: 'var(--cyan)', label: 'SPECTER-2 reroute' },
  { id: 'P-3', points: '42,58 44,64 46,70 46,74', color: 'var(--green)', label: 'NOMAD-3 patrol' },
]

export const areaSummary = 'AREA SYNTHESIS — Sector 7: 10 tracked entities, 3 active zones. Primary concern: unregistered contact CONTACT-X breached GF-2 eastern boundary and is moving toward zone core (~9 min). Sensor mesh degrading in sector 5 (CAM-07 at 43%). SPECTER-2 reroute in progress will restore coverage in ~6 min. Safe corridor remains clear. Recommend operator decision on GF-2 escalation before 14:12Z.'

// ─── Coordinates intel ───
export const coordSamples = [
  { id: 'C-1', raw: '34.0522° N, 118.2437° W', format: 'Decimal Degrees', place: 'Checkpoint North approach', terrain: 'Urban / paved', risk: 'Medium', nearest: 'NOMAD-3 (1.2 km)', action: 'Monitor via ARGUS-NE.' },
  { id: 'C-2', raw: '34°03\'08" N 118°14\'37" W', format: 'DMS', place: 'Warehouse S-3 loading bay', terrain: 'Industrial flat', risk: 'High', nearest: 'EARSHOT-A (0.4 km)', action: 'Correlate with photo SEG-01.' },
  { id: 'C-3', raw: 'QT 4412 8867', format: 'Grid (MGRS-style)', place: 'Ridge line east', terrain: 'Elevated rock / scrub', risk: 'High', nearest: 'SPECTER-2 (2.1 km)', action: 'Request closer pass — ties to AN-04.' },
  { id: 'C-4', raw: 'REL BRAVO +400m @042°', format: 'Relative', place: 'Route Bravo offset', terrain: 'Unpaved track', risk: 'Low', nearest: 'VANGUARD (0.8 km)', action: 'Tag for patrol sweep.' },
  { id: 'C-5', raw: '34.0489° N, 118.2401° W', format: 'Decimal Degrees', place: 'GF-2 eastern boundary', terrain: 'Open field', risk: 'Critical', nearest: 'CONTACT-X (0.1 km)', action: 'Active breach — see AN-01.' },
]

export const coordClusters = [
  { id: 'CL-1', label: 'QT 44 cluster', count: 5, x: 72, y: 38, r: 9, risk: 'High' },
  { id: 'CL-2', label: 'Checkpoint refs', count: 3, x: 28, y: 44, r: 7, risk: 'Medium' },
  { id: 'CL-3', label: 'Route Bravo refs', count: 4, x: 44, y: 66, r: 8, risk: 'Low' },
  { id: 'CL-4', label: 'GF-2 boundary', count: 6, x: 66, y: 58, r: 10, risk: 'Critical' },
  { id: 'CL-5', label: 'Warehouse refs', count: 2, x: 58, y: 46, r: 6, risk: 'Medium' },
]

// ─── 3D intel ───
export const threeDObjects = [
  { id: '3D-A', name: 'TERRAIN MESH — SECTOR 7', kind: 'terrain', desc: 'Elevation model from last LIDAR pass. 240k points decimated to preview mesh.' },
  { id: '3D-B', name: 'STRUCTURE S-3', kind: 'structure', desc: 'Warehouse scan. East wall deviates 0.4m from baseline — see AN-06.' },
  { id: '3D-C', name: 'DRONE PATH — SPECTER-1', kind: 'path', desc: 'Orbit pattern over checkpoint, 120m AGL, 4 waypoints.' },
]

export const threeDSummary = '3D SCENE SYNTHESIS: Terrain mesh covers 2.4 km² of sector 7 at 0.5m resolution. Structure S-3 shows a 0.4m east-wall deviation from the baseline scan — confidence limited because LIDAR-RIG went offline mid-pass (12% health). SPECTER-1 orbit path maintains full line-of-sight to checkpoint and warehouse. Recommend rescan of S-3 east face when the rig is restored.'

// ─── Documents intel ───
export const documents = [
  {
    id: 'FR-118', title: 'FIELD REPORT FR-118', type: 'Field Report', classification: 'PREVIEW // MOCK',
    body: 'Patrol observed increased vehicle traffic near grid QT 4412 8867 between 13:20Z and 13:50Z. Two trucks and one container noted at the warehouse loading bay. Local source mentions a movement window between 14:00Z and 15:00Z. Ridge line reflection reported but unconfirmed.',
    summary: 'Ground patrol corroborates loading activity at warehouse S-3 and gives a 14:00–15:00Z movement window. Ridge reflection matches photo anomaly SEG-05.',
    entities: [
      { kind: 'Location', value: 'Grid QT 4412 8867' },
      { kind: 'Time', value: '13:20Z–13:50Z' },
      { kind: 'Time', value: '14:00Z–15:00Z window' },
      { kind: 'Equipment', value: '2× truck, 1× container' },
      { kind: 'Reference', value: 'Warehouse S-3' },
    ],
    risks: 'Movement window overlaps KEYHOLE-9 pass — collection opportunity, but also peak activity risk.',
    actions: ['Prioritize 14:20Z satellite pass', 'Fuse grid reference with THR-2', 'Cross-check ridge reflection with SEG-05'],
    translated: '[TL] Patrol report (translated): elevated vehicle movement near grid QT 4412 8867, 13:20–13:50Z. Two trucks, one container at warehouse bay. Source cites 14:00–15:00Z window. Unconfirmed ridge reflection.',
  },
  {
    id: 'B-77', title: 'BRIEFING B-77', type: 'Intel Briefing', classification: 'PREVIEW // MOCK',
    body: 'Synthesis of prior 24h: supply staging pattern forming around warehouse S-3. Three independent sources reference the same movement window. Sensor mesh integrity declining in sector 5. Recommend persistent overwatch through 15:30Z.',
    summary: 'Three-source consensus on a 14:00–15:00Z supply movement window centered on warehouse S-3; sensor coverage risk in sector 5.',
    entities: [
      { kind: 'Location', value: 'Warehouse S-3' },
      { kind: 'Time', value: '14:00Z–15:00Z' },
      { kind: 'Asset', value: 'Sector 5 sensor mesh' },
      { kind: 'Mission', value: 'QUIET HORIZON' },
    ],
    risks: 'Coverage gap in sector 5 could blind the mesh during the movement window.',
    actions: ['Approve SPECTER-2 reroute', 'Extend overwatch to 15:30Z'],
    translated: '[TL] Briefing (translated): staging pattern at warehouse S-3 confirmed by three sources. Same time window. Sector 5 sensors weakening. Keep watch until 15:30Z.',
  },
  {
    id: 'TL-09', title: 'TECH LOG TL-09', type: 'Technical Log', classification: 'PREVIEW // MOCK',
    body: 'LIDAR-RIG fault at 13:21Z during structure scan 09. Power module degradation suspected. Last valid frame captured 61% of S-3 east face. Point cloud uploaded to fusion layer before shutdown.',
    summary: 'LIDAR-RIG failed mid-scan; S-3 east face only 61% covered, so the 0.4m deviation reading carries reduced confidence.',
    entities: [
      { kind: 'Asset', value: 'LIDAR-RIG' },
      { kind: 'Time', value: '13:21Z fault' },
      { kind: 'Equipment', value: 'Power module' },
      { kind: 'Reference', value: 'Structure scan 09' },
    ],
    risks: 'Deformation finding AN-06 rests on partial data.',
    actions: ['Dispatch maintenance', 'Rescan S-3 on restore'],
    translated: '[TL] Tech log (translated): scanner failure 13:21Z. Power module suspect. East wall 61% scanned. Data uploaded before shutdown.',
  },
]

// ─── Diagnostics ───
export const diagnostics = [
  { name: 'SAM-H Segmentation Pipeline', status: 'Online', value: '32 req/min' },
  { name: 'LLM Reasoning Layer', status: 'Online', value: '14 ctx active' },
  { name: 'Audio Transcription', status: 'Online', value: '2 streams' },
  { name: 'Translation Layer', status: 'Online', value: '3 langs loaded' },
  { name: 'Video Tracking', status: 'Online', value: '6 tracks' },
  { name: 'Map Renderer', status: 'Online', value: '60 fps' },
  { name: '3D Visualization Engine', status: 'Degraded', value: 'partial scan' },
  { name: 'Data Ingestion', status: 'Online', value: '9 lanes' },
]

export const diagStats = {
  latency: '38 ms',
  uptime: '99.97%',
  activeFeeds: 11,
  modelConfidence: '0.87 avg',
  queueDepth: 14,
}

// ─── Command console ───
export const consoleResponses = [
  { match: ['risk', 'mission risk'], response: 'MISSION RISK SYNTHESIS — Current level: ELEVATED (0.72). Drivers: GF-2 breach (critical, 0.96), acoustic impact event (0.87), ridge unknown (0.55, unverified). Mitigations in queue: SPECTER-2 reroute, VANGUARD hold. Risk trend: rising until 14:20Z satellite pass resolves ridge ambiguity.' },
  { match: ['segment', 'audio feed'], response: 'SAM-H AUDIO SEGMENTATION — EARSHOT-A ch.2: 6 segments resolved. 2 speakers (0.92 / 0.88), engine bed 77% of clip (0.79), alert tone 00:34 (0.85), unknown signal 00:41 (0.61). Segment map pushed to Audio workspace.' },
  { match: ['translate'], response: 'TRANSLATION LAYER — Transcript translated from Foreign Language A (detection 0.86). 8 lines processed, mean confidence 0.87. Toggle available in Audio workspace. Unknown signal at 00:41 excluded — language unresolved.' },
  { match: ['anomal', 'high-confidence'], response: 'HIGH-CONFIDENCE ANOMALIES (≥0.80) — AN-01 zone breach (0.96), AN-03 track direction change (0.91), AN-02 acoustic impact (0.87), AN-08 coverage gap (0.84), AN-07 document location flag (0.82). 2 of 5 unreviewed. Threat panel filtered.' },
  { match: ['briefing', 'operator briefing'], response: 'OPERATOR BRIEFING GENERATED — Situation: coordinated loading activity at warehouse S-3 with a verified 14:00–15:00Z movement window; unregistered contact breaching GF-2. Key risks: geofence breach, sensor gap sector 5. Recommended: approve SPECTER-2 reroute, hold VANGUARD, prioritize 14:20Z pass. Full text in Briefing panel.' },
  { match: ['compare', 'video and map'], response: 'CROSS-MODAL COMPARISON — Video track T-07 heading/velocity projects intersection with map contact CONTACT-X ingress path at 14:11Z ±40s. Assessment: same entity, confidence 0.88. Track fused; map marker updated.' },
  { match: ['coordinates', 'documents'], response: 'DOCUMENT COORDINATE EXTRACTION — 3 documents scanned. Found: QT 4412 8867 (FR-118, ties to THR-2), warehouse S-3 references (B-77), no coordinates in TL-09. 1 new cluster formed: CL-1 "QT 44" (5 refs, HIGH). Pushed to Coordinates workspace.' },
  { match: ['redeploy', 'asset'], response: 'ASSET REDEPLOYMENT PLAN — 1) SPECTER-2 → sector 5 gap (ETA 6 min, restores mesh). 2) KEYHOLE-9 → confirm 14:20Z tasking on QT 44 grid. 3) NOMAD-3 → hold route Bravo, extend loop +400m east. 4) VANGUARD → hold. Net coverage +18%. Awaiting operator approval D-1.' },
  { match: ['3d', 'scene'], response: '3D SCENE SUMMARY — Sector 7 mesh (2.4 km², 0.5m res). Structure S-3: east wall Δ0.4m vs baseline, confidence LIMITED (61% scan coverage before rig fault). Drone orbit path clear of obstructions. Recommend rescan on LIDAR-RIG restore.' },
]

export const consoleFallback = 'COMMAND PARSED — No direct handler in preview mode. LLM interpretation: request logged to reasoning queue. Try: "summarize current mission risk", "show all high-confidence anomalies", "generate operator briefing", "recommend asset redeployment", "compare video and map activity".'

// ─── Briefings ───
export const briefings = [
  {
    situation: 'Coordinated loading activity confirmed at warehouse S-3. Movement window 14:00–15:00Z corroborated by three independent sources. Unregistered ground contact has breached geofence GF-2 and is converging with video track T-07.',
    sources: 'KEYHOLE-9 imagery · SPECTER-1 video · EARSHOT-A/B audio · FR-118, B-77 documents · ATLAS map layer · LIDAR partial scan',
    findings: '• Photo + audio + document fusion confirms staging activity (agreement 0.91).\n• Video track T-07 and map contact CONTACT-X assessed as same entity (0.88).\n• Ridge anomaly remains unresolved — photo mask unstable, audio mentions reflection.',
    risks: 'GF-2 breach reaches zone core ~14:12Z. Sector 5 sensor gap opens within 15 min if SPECTER-2 reroute is not approved.',
    action: 'Approve decision D-1 (SPECTER-2 reroute). Hold VANGUARD. Prioritize 14:20Z satellite pass over grid QT 44.',
    next: 'Operator decision required on GF-2 escalation before 14:12Z.',
  },
  {
    situation: 'Surveillance posture stable but time-sensitive. Two critical items open: GF-2 breach and unverified ridge object. All AI layers nominal except 3D engine (partial scan).',
    sources: 'All active feeds (11) · fusion layer · decision queue',
    findings: '• Acoustic impact AN-02 not yet correlated with imagery — next pass will resolve.\n• Diesel signature approaching on bearing 042 for 6+ minutes.\n• Document entities fused with map layer; THR-2 watch level raise pending approval.',
    risks: 'Simultaneous events (breach + movement window + sensor gap) compress operator decision time.',
    action: 'Sequence decisions: D-1 now, D-3 within 10 min, D-2 after 14:20Z pass.',
    next: 'Re-brief automatically after satellite pass ingestion.',
  },
  {
    situation: 'Preview synthesis cycle 3. Multimodal agreement remains high (0.87 avg model confidence). No new critical anomalies since last cycle.',
    sources: 'Rolling 30-min window across all modalities',
    findings: '• CONTACT-X velocity steady; intercept estimate unchanged.\n• Radio chatter on unallocated band recurring at ~90s intervals.\n• Structure S-3 deformation still unverified pending rescan.',
    risks: 'Confidence on ridge object stuck at 0.55 — human review is the bottleneck.',
    action: 'Queue human review for AN-04 imagery. Maintain current tasking.',
    next: 'Next automated synthesis at +5 min or on critical event.',
  },
]
