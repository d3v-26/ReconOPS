// ─── Every thing in the AO is an entity ───
// Friendly sensors, people, vehicles, hostile contacts, structures and events all share
// one shape so the map, the entity card and the AI command bar treat them the same way.
// Positions are % of the AO box (x: west→east, y: north→south). All data fictional.
//
// feed.type:
//   aerial  — straight-down gimbal view (drones)
//   oblique — tilted view toward feed.look (mast cameras, vehicle cameras)
//   helmet  — tilted, swaying first-person view (people)
//   still   — single satellite frame with segmentation
//   audio   — waveform / spectrogram / transcript
// Entities without a feed are shown through the nearest friendly sensor that can see them.

export const entities = [
  // ── Friendly air ──
  {
    id: 'DR-01', name: 'SPECTER-1', kind: 'drone', side: 'friendly', asset: true, move: 'air', x: 60, y: 46,
    cls: 'RQ-19A Ghosthawk · MALE recon UAV', status: 'On station',
    desc: 'Primary overwatch for Warehouse S-3. EO/IR gimbal with onboard segmentation. Unarmed.',
    specs: [['Altitude', '1,200 ft AGL'], ['Endurance', '19.4 h left'], ['Sensor', 'MX-20 EO/IR'], ['Datalink', 'Ku SATCOM + LOS'], ['Crew', 'GCS-2 “TALON”']],
    feed: { type: 'aerial', look: { x: 66.3, y: 53 }, zoom: 17, sensor: 'EO/IR GIMBAL', heading: 0 },
    evidence: 'video',
  },
  {
    id: 'DR-02', name: 'SPECTER-2', kind: 'drone', side: 'friendly', asset: true, move: 'air', x: 80, y: 14,
    cls: 'RQ-19A Ghosthawk · MALE recon UAV', status: 'Mobile reserve',
    desc: 'Sister airframe held as mobile reserve. Covers the ridge and gap-fills sector 5 on demand.',
    specs: [['Altitude', '1,500 ft AGL'], ['Endurance', '22.1 h left'], ['Sensor', 'MX-20 EO/IR'], ['Crew', 'GCS-2 “TALON”']],
    feed: { type: 'aerial', look: { x: 92, y: 14 }, zoom: 17, sensor: 'EO/IR GIMBAL', heading: 0 },
  },
  {
    id: 'SAT-9', name: 'KEYHOLE-9', kind: 'satellite', side: 'friendly', asset: true, move: null, x: 6, y: 7,
    cls: 'LEO electro-optical imaging satellite', status: 'Pass 14:20Z',
    desc: 'Orbital imager. Its last pass produced frame 2231 over S-3, segmented into five regions.',
    specs: [['Orbit', 'LEO · 512 km'], ['GSD', '0.3 m'], ['Revisit', '~96 min'], ['Last frame', '2231 · 13:58Z']],
    feed: { type: 'still', sensor: 'FRAME 2231 · PAN 0.3M' },
    evidence: 'photo',
  },

  // ── Friendly fixed sensors ──
  {
    id: 'CAM-04', name: 'ARGUS-NE', kind: 'camera', side: 'friendly', asset: true, move: null, x: 76, y: 45,
    cls: 'Fixed PTZ surveillance node', status: 'Watching east gate',
    desc: 'Mast-mounted pan-tilt-zoom camera looking west across the east gate toward S-3.',
    specs: [['Optics', '30× zoom · 4K'], ['IR', '940 nm illuminator'], ['Mast', '9 m'], ['Power', 'Solar + 72 h battery']],
    feed: { type: 'oblique', look: { x: 69, y: 51 }, zoom: 16, sensor: 'PTZ 30×', heading: 248 },
  },
  {
    id: 'CAM-07', name: 'ARGUS-SW', kind: 'camera', side: 'friendly', asset: true, move: null, x: 30, y: 68,
    cls: 'Fixed PTZ surveillance node', status: 'Degraded · 43% signal', degraded: true,
    desc: 'Southwest gate node. Wind loading on the mast is degrading the link — sector 5 goes blind if it drops.',
    specs: [['Optics', '30× zoom · 4K'], ['Signal', '43% and falling'], ['Mast', '9 m'], ['Fault', 'Wind loading']],
    feed: { type: 'oblique', look: { x: 34, y: 62 }, zoom: 16, sensor: 'PTZ 30×', heading: 30 },
  },
  {
    id: 'AS-02', name: 'EARSHOT-A', kind: 'audio', side: 'friendly', asset: true, move: null, x: 58, y: 59,
    cls: 'Ground acoustic / RF sensor', status: 'Intercept ch.2',
    desc: 'Buried acoustic array with RF intercept. Picked up two speakers coordinating a timed movement near S-3.',
    specs: [['Array', '4-mic tetrahedral'], ['Range', '~1.2 km'], ['RF', 'VHF/UHF scan'], ['Noise floor', '−62 dB']],
    feed: { type: 'audio', transcript: true, sensor: 'CH.2 · VHF' },
    evidence: 'audio',
  },
  {
    id: 'AS-05', name: 'EARSHOT-B', kind: 'audio', side: 'friendly', asset: true, move: null, x: 75, y: 63,
    cls: 'Ground acoustic / RF sensor', status: 'Band scan',
    desc: 'Watches an unallocated band. Short bursts every ~90 s; language ID pending.',
    specs: [['Array', '4-mic tetrahedral'], ['RF', 'Wideband scan'], ['Bursts', '2–4 s, ~90 s apart']],
    feed: { type: 'audio', transcript: false, sensor: 'BAND SCAN' },
  },
  {
    id: '3D-01', name: 'LIDAR-RIG', kind: 'scanner', side: 'friendly', asset: true, move: null, x: 70, y: 48.5,
    cls: 'Tripod structure LIDAR', status: 'Offline · power fault', offline: true,
    desc: 'Failed at 13:21Z mid-scan of the S-3 east face (61% covered). The 0.4 m wall deviation it reported is unreliable.',
    specs: [['Points', '240k / pass'], ['Coverage', '61% of east face'], ['Fault', 'Power module']],
    feed: { type: 'none' },
  },

  // ── Friendly ground ──
  {
    id: 'HT-01', name: 'SSG REYES', kind: 'person', side: 'friendly', asset: true, move: 'ground', x: 52, y: 67,
    cls: 'VANGUARD team lead', status: 'Holding south of S-3',
    desc: 'Leads the two-person ground verification team. Carries the NOMAD-3 control tablet. Filed field report FR-118.',
    specs: [['Callsign', 'VANGUARD-6'], ['Kit', 'Helmet cam · NV · tablet'], ['Radio', 'Encrypted net · green'], ['Controls', 'NOMAD-3 (UGV)']],
    feed: { type: 'helmet', look: { x: 60, y: 59 }, zoom: 16, sensor: 'HELMET CAM', heading: 50 },
    evidence: 'docs',
    report: 'FR-118',
  },
  {
    id: 'HT-02', name: 'SPC OKAFOR', kind: 'person', side: 'friendly', asset: true, move: 'ground', x: 49.5, y: 69.5,
    cls: 'VANGUARD rifleman / observer', status: 'Overwatch, route Bravo',
    desc: 'Second member of the ground team. Watching route Bravo traffic from the south.',
    specs: [['Callsign', 'VANGUARD-2'], ['Kit', 'Helmet cam · laser rangefinder'], ['Radio', 'Encrypted net · green']],
    feed: { type: 'helmet', look: { x: 46, y: 77 }, zoom: 16, sensor: 'HELMET CAM', heading: 200 },
  },
  {
    id: 'VH-03', name: 'NOMAD-3', kind: 'vehicle', side: 'friendly', asset: true, move: 'ground', x: 45, y: 75,
    cls: 'Unmanned ground vehicle', status: 'Route Bravo patrol',
    desc: 'Four-wheel UGV running the route Bravo loop. Drive-by-wire — can be steered remotely by the ground team.',
    vehicle: { make: 'Halberd Robotics', model: 'MULE-4 UGV', color: 'Desert tan', plate: 'None (military)', remote: { by: 'HT-01', via: 'SSG REYES — handheld control tablet, 2.4 km LOS' } },
    specs: [['Top speed', '38 km/h'], ['Range', '140 km'], ['Payload', '450 kg'], ['Sensors', 'Forward EO + LIDAR bumper']],
    feed: { type: 'oblique', look: { x: 51, y: 74 }, zoom: 16, sensor: 'FWD CAM', heading: 90 },
  },

  // ── Objective structure ──
  {
    id: 'S-3', name: 'WAREHOUSE S-3', kind: 'structure', side: 'neutral', objective: true, x: 66.3, y: 53,
    cls: 'Light-industrial warehouse · TGT-01', status: 'Suspected staging site',
    desc: 'The objective. Baseline shows an idle unit; today’s imagery shows a truck, a new container and a crew at the loading bay.',
    specs: [['Footprint', '~2,400 m²'], ['Registered to', 'Sable Freight LLC (shell)'], ['Doors', '2 roll-up, south bay'], ['Baseline', 'Idle 30 days']],
  },
  {
    id: 'CKP-N', name: 'CHECKPOINT N', kind: 'poi', side: 'neutral', x: 26, y: 45.5,
    cls: 'Road checkpoint', status: 'Watched',
    desc: 'Northern road checkpoint inside threat ring THR-2. Field reports cite vehicle traffic here before the window.',
    specs: [['Grid', 'QT 4412 8867'], ['Traffic', 'Elevated 13:20–13:50Z']],
  },

  // ── Things being watched ──
  {
    id: 'CX', name: 'CONTACT-X', kind: 'vehicle', side: 'hostile', x: 88, y: 58,
    cls: 'Unregistered ground contact · track T-07', status: 'Inside GF-2, westbound',
    desc: 'Entered geofence GF-2 from the east at 14:00Z, ~14 km/h. Fused with drone video track T-07 (same vehicle, 0.88).',
    vehicle: { make: 'Toyota', model: 'Land Cruiser 79 pickup', color: 'Tan, mud-covered', plate: 'Removed', remote: false },
    specs: [['Speed', '~14 km/h'], ['Heading', '262°'], ['Occupants', '2 (thermal)'], ['Track', 'T-07 · conf 0.91']],
    alert: 'AN-01',
    path: [[97, 61], [92, 59.5], [88, 58], [80, 56], [74, 54.6]],
  },
  {
    id: 'T-03', name: 'TRUCK T-03', kind: 'vehicle', side: 'unknown', x: 64.6, y: 55.4,
    cls: 'Box truck at S-3 loading bay', status: 'Engine running',
    desc: 'Parked nose-out at the south bay with the engine warm on thermal. Matches the “keep the engine running” intercept.',
    vehicle: { make: 'Isuzu', model: 'NPR box truck (≈2018)', color: 'White, unmarked', plate: 'Obscured', remote: false },
    specs: [['Thermal', 'Engine warm'], ['Cargo door', 'Open'], ['Track', 'T-03 · conf 0.93']],
  },
  {
    id: 'GRP', name: 'GROUP (3)', kind: 'group', side: 'unknown', x: 67.4, y: 51.4,
    cls: 'Three unidentified personnel', status: 'Loading posture',
    desc: 'Three people moving between the truck and the bay door in a loading pattern. No weapons visible.',
    specs: [['Count', '3'], ['Activity', 'Carrying crates'], ['Tracks', 'T-09, T-11 · conf 0.81']],
  },
  {
    id: 'CTR', name: 'CONTAINER', kind: 'object', side: 'unknown', x: 68.6, y: 55.8,
    cls: '20 ft ISO container', status: 'New since baseline',
    desc: 'Not present in baseline imagery 6 h ago. Doors facing the bay.',
    specs: [['Size', '20 ft ISO'], ['First seen', 'Frame 2231'], ['Conf', '0.76']],
  },
  {
    id: 'RIDGE', name: 'RIDGE OBJECT', kind: 'object', side: 'unknown', x: 92, y: 13,
    cls: 'Unclassified object on the ridge', status: 'Needs human review',
    desc: 'Segmentation flips between equipment and terrain across frames. EARSHOT-A speakers mention “a reflection on the ridge”.',
    specs: [['Class', 'Unstable (0.55)'], ['Seen by', 'SPECTER-2 stills'], ['Linked', 'Audio 00:16']],
    alert: 'AN-04',
  },
  {
    id: 'EV-042', name: 'ACOUSTIC EVENT', kind: 'event', side: 'hostile', x: 71, y: 44,
    cls: 'Impact-class transient, bearing 042 from EARSHOT-A', status: 'Uncorrelated',
    desc: 'Single high-energy spike, 1.8 s decay, 14:01:54Z. Could be dropped cargo or an impact — needs correlation before anyone moves.',
    specs: [['Bearing', '042° from EARSHOT-A'], ['Energy', 'High · 1.8 s decay'], ['Conf', '0.87']],
    alert: 'AN-02',
  },
]

export const byId = Object.fromEntries(entities.map((e) => [e.id, e]))
export const ASSET_IDS = entities.filter((e) => e.asset).map((e) => e.id)

// Name lookup for the command bar: "specter 1", "reyes", "the truck", "s3"…
const ALIASES = {
  'DR-01': ['specter-1', 'specter 1', 'specter1', 'drone 1', 'drone one'],
  'DR-02': ['specter-2', 'specter 2', 'specter2', 'drone 2', 'drone two'],
  'SAT-9': ['keyhole', 'satellite', 'sat'],
  'CAM-04': ['argus-ne', 'argus ne', 'ne camera', 'east camera', 'gate camera'],
  'CAM-07': ['argus-sw', 'argus sw', 'sw camera', 'southwest camera'],
  'AS-02': ['earshot-a', 'earshot a', 'audio', 'intercept', 'mic'],
  'AS-05': ['earshot-b', 'earshot b', 'band scan', 'chatter'],
  '3D-01': ['lidar', 'scanner'],
  'HT-01': ['reyes', 'vanguard', 'team lead', 'helmet cam'],
  'HT-02': ['okafor'],
  'VH-03': ['nomad', 'ugv', 'robot'],
  'S-3': ['warehouse', 's-3', 's3', 'objective'],
  'CKP-N': ['checkpoint'],
  CX: ['contact-x', 'contact x', 'contact', 'land cruiser', 'pickup', 't-07', 'intruder'],
  'T-03': ['truck', 'box truck', 'isuzu', 't-03'],
  GRP: ['group', 'people', 'personnel', 'crew'],
  CTR: ['container'],
  RIDGE: ['ridge'],
  'EV-042': ['acoustic event', 'impact', 'bearing 042', 'spike', 'event'],
}

// Longest alias first so "specter 2" wins over "specter".
const ALIAS_LIST = Object.entries(ALIASES)
  .flatMap(([id, words]) => words.map((w) => [w, id]))
  .sort((a, b) => b[0].length - a[0].length)

export function findEntity(text) {
  const t = text.toLowerCase()
  const hit = ALIAS_LIST.find(([w]) => t.includes(w))
  return hit ? byId[hit[1]] : null
}

// All entities a phrase mentions, in the order they appear ("send nomad to the checkpoint").
export function findEntities(text) {
  const t = text.toLowerCase()
  const found = []
  ALIAS_LIST.forEach(([w, id]) => {
    const i = t.indexOf(w)
    if (i >= 0 && !found.some((f) => f.id === id || (i >= f.i && i < f.end))) found.push({ id, i, end: i + w.length })
  })
  return found.sort((a, b) => a.i - b.i).map((f) => byId[f.id])
}
