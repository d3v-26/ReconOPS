// ─── Entity dossiers — asset / personnel / contact profiles ───
// All fictional. Keyed by asset id, marker name, or track id.

import { assets } from './mockData.js'

const P = {}

function reg(keys, profile) {
  keys.forEach((k) => { P[k.toUpperCase()] = profile })
}

// ── Friendly platforms ──
reg(['DR-01', 'SPECTER-1'], {
  id: 'DR-01', name: 'SPECTER-1', icon: 'uav', faction: 'FRIENDLY', cls: 'RQ-19A GHOSTHAWK — MALE RECON UAV',
  desc: 'Medium-altitude long-endurance reconnaissance drone. Primary overwatch platform for Sector 7. EO/IR gimbal with SAM-H onboard segmentation.',
  specs: [
    ['Wingspan', '16.8 m'], ['Ceiling', '7,600 m AGL'], ['Endurance', '27 h'], ['Cruise', '167 km/h'],
    ['Sensor', 'MX-20 EO/IR + SAR'], ['Datalink', 'Ku-band SATCOM / C2 LOS'], ['Payload', 'ISR only — unarmed'],
  ],
  record: [
    '14:01:30Z — Acquired track T-07, maintaining lock.',
    '13:42:07Z — On station over TGT-01, orbit 120m AGL.',
    '11:02:44Z — Launched from FOB HALCYON, checked onto command net.',
    'Airframe hours: 3,214 · Last maintenance: 6 days ago.',
  ],
  ops: 'Operator: GCS-2 crew "TALON" · Remote split ops',
})

reg(['DR-02', 'SPECTER-2'], {
  id: 'DR-02', name: 'SPECTER-2', icon: 'uav', faction: 'FRIENDLY', cls: 'RQ-19A GHOSTHAWK — MALE RECON UAV',
  desc: 'Sister airframe to SPECTER-1. Held as mobile reserve; currently rerouting to cover the sector 5 sensor gap.',
  specs: [
    ['Wingspan', '16.8 m'], ['Ceiling', '7,600 m AGL'], ['Endurance', '27 h (19.4 h remaining)'], ['Cruise', '167 km/h'],
    ['Sensor', 'MX-20 EO/IR'], ['Tasking', 'Gap-fill sector 5 · ridge pass on demand'],
  ],
  record: [
    '14:03:12Z — Rerouting to sector 5, ETA 6 min.',
    '13:58:02Z — Ridge stills flagged: SAM-H mask unstable (SEG-05).',
    '11:03:19Z — Airborne, mobile reserve posture.',
  ],
  ops: 'Operator: GCS-2 crew "TALON" · Remote split ops',
})

reg(['CAM-04', 'ARGUS-NE'], {
  id: 'CAM-04', name: 'ARGUS-NE', icon: 'camera', faction: 'FRIENDLY', cls: 'FIXED PTZ SURVEILLANCE NODE',
  desc: 'Mast-mounted pan-tilt-zoom camera covering the northeast perimeter and east gate approach. Hardened enclosure, mesh-networked.',
  specs: [
    ['Optics', '30× optical zoom · 4K'], ['IR', 'Yes — 940nm illuminator'], ['FOV', '2.3°–63° adjustable'],
    ['Power', 'Solar + 72h battery'], ['Mount', '9 m mast, NE ridge'], ['Uptime', '99.2% / 30 days'],
  ],
  record: [
    '13:57:33Z — Crowd density east gate: steady, no anomalous vectors.',
    '11:02:51Z — Calibration frame uploaded, link established.',
  ],
  ops: 'Unmanned node · maintained by VANGUARD det.',
})

reg(['CAM-07', 'ARGUS-SW'], {
  id: 'CAM-07', name: 'ARGUS-SW', icon: 'camera', faction: 'FRIENDLY', cls: 'FIXED PTZ SURVEILLANCE NODE',
  desc: 'Southwest gate coverage node. Signal degrading — wind loading on mast suspected. Projected blind spot in sector 5 if signal drops below 30%.',
  specs: [
    ['Optics', '30× optical zoom · 4K'], ['Signal', '43% and falling'], ['FOV', 'Gate coverage SW'],
    ['Power', 'Solar + 72h battery'], ['Fault', 'Mast oscillation — mechanical'],
  ],
  record: [
    '14:02:40Z — Signal degradation accelerating; SPECTER-2 gap-fill requested.',
    '13:44:16Z — Intermittent frame drops began.',
  ],
  ops: 'Unmanned node · maintenance queued',
})

reg(['AS-02', 'EARSHOT-A'], {
  id: 'AS-02', name: 'EARSHOT-A', icon: 'sensor', faction: 'FRIENDLY', cls: 'ACOUSTIC ARRAY — 6-MIC DIRECTIONAL',
  desc: 'Ridge-emplaced acoustic sensor. Detected the 14:01:54Z impact-class transient on bearing 042 and carries the primary voice intercept.',
  specs: [
    ['Array', '6-element directional'], ['Bearing acc.', '±3°'], ['Detection', 'Impact / engine / speech'],
    ['Noise floor', '-62 dB baseline'], ['Emplacement', 'Ridge line, camouflaged'],
  ],
  record: [
    '14:01:54Z — High-energy acoustic spike, bearing 042 — pushed to fusion.',
    '13:55:39Z — Diesel signature rising ~2dB/min, single source.',
    '13:20:10Z — Voice intercept: 2 speakers, loading coordination.',
  ],
  ops: 'Unmanned sensor · EARSHOT net',
})

reg(['AS-05', 'EARSHOT-B'], {
  id: 'AS-05', name: 'EARSHOT-B', icon: 'sensor', faction: 'FRIENDLY', cls: 'ACOUSTIC ARRAY — 6-MIC DIRECTIONAL',
  desc: 'Second acoustic node, tasked with signal triage and unallocated-band radio chatter watch.',
  specs: [
    ['Array', '6-element directional'], ['Tasking', 'Signal triage · band scan'],
    ['Watch', 'Unallocated band bursts ~90s interval'], ['Language ID', 'Pending'],
  ],
  record: [
    '13:59:21Z — Intermittent radio chatter, non-allocated band.',
    '11:04:02Z — On net, baseline captured.',
  ],
  ops: 'Unmanned sensor · EARSHOT net',
})

reg(['VH-03', 'NOMAD-3'], {
  id: 'VH-03', name: 'NOMAD-3', icon: 'vehicle', faction: 'FRIENDLY', cls: 'M1288 GMV — LIGHT PATROL VEHICLE',
  desc: 'Ground mobility vehicle running the Route Bravo patrol loop. Telemetry package reports vibration, position, and surface quality.',
  specs: [
    ['Crew', '2 — driver + sensor op'], ['Speed', '105 km/h max'], ['Range', '480 km'],
    ['Comms', 'L-band tactical mesh'], ['Route', 'Bravo loop +400m east ext.'], ['Armor', 'B6 kit'],
  ],
  record: [
    '14:02:31Z — Passing checkpoint north, nothing unusual.',
    '13:59:58Z — Surface quality on Bravo degrading slowly.',
  ],
  ops: 'Crew callsign NOMAD · rotation 2 of 3',
})

reg(['SAT-9', 'KEYHOLE-9'], {
  id: 'SAT-9', name: 'KEYHOLE-9', icon: 'satellite', faction: 'FRIENDLY', cls: 'LEO IMAGING SATELLITE — EO/IR',
  desc: 'Low-earth-orbit imaging bird. Next pass 14:20Z tasked over grid QT 4412 8867 — ridge object and warehouse stills.',
  specs: [
    ['Orbit', 'LEO 510 km SSO'], ['GSD', '0.31 m pan'], ['Revisit', '~92 min'],
    ['Next pass', '14:20Z — window 74s'], ['Downlink', 'X-band, FOB relay'],
  ],
  record: [
    '14:02:11Z — Frame 2231 delivered: 3 vehicle-class objects segmented.',
    '12:48:33Z — Pass tasking updated: QT 44 grid priority.',
  ],
  ops: 'National asset · tasking via J2 cell',
})

reg(['HT-01', 'VANGUARD'], {
  id: 'HT-01', name: 'VANGUARD', icon: 'team', faction: 'FRIENDLY', cls: '4-MAN GROUND RECON TEAM',
  desc: 'Forward ground verification element holding south of the safe corridor. Eyes-on capability for route Bravo and the warehouse approach.',
  specs: [
    ['Strength', '4 operators'], ['Lead', 'CPO ██████ "REAPER-6"'], ['Loadout', 'Recon — suppressed, LTLM, UGS kit'],
    ['Posture', 'HOLD — south of safe corridor'], ['Medevac', 'DUSTOFF-2, 18 min'], ['Comms', 'Encrypted MANET + HF backup'],
  ],
  record: [
    '14:01:11Z — Holding. Visual on route Bravo, light traffic.',
    '13:12:40Z — Field report FR-118 filed.',
    '11:05:12Z — Team up on encrypted net, all green.',
  ],
  ops: 'Det: TF SABLE · ROE: observe/report only',
})

reg(['ML-02', 'ATLAS-LAYER'], {
  id: 'ML-02', name: 'ATLAS-LAYER', icon: 'maplayer', faction: 'FRIENDLY', cls: 'FUSION MAP LAYER — GEOSPATIAL SERVICE',
  desc: 'Continuous terrain sync and track fusion layer. Owns geofence logic — raised the GF-2 breach alert.',
  specs: [
    ['Tiles', 'Sector 7 @ 0.5 m'], ['Fusion', '10 tracked entities'], ['Geofences', 'GF-2 active, 2 dormant'],
    ['Refresh', '1 Hz track / 6 h terrain'],
  ],
  record: [
    '14:00:12Z — Zone breach: unregistered contact entered GF-2 east.',
    '13:30:00Z — Terrain tile refresh complete.',
  ],
  ops: 'Software asset · fusion cell',
})

reg(['DF-01', 'LEDGER-FEED'], {
  id: 'DF-01', name: 'LEDGER-FEED', icon: 'docfeed', faction: 'FRIENDLY', cls: 'DOCUMENT INGESTION PIPELINE',
  desc: 'Report ingestion and entity-extraction pipeline. Processes field reports, briefings, and technical logs into the fusion layer.',
  specs: [
    ['Queue', '14 items'], ['Docs (24h)', '61 processed'], ['Extraction', 'Entities · coords · times'],
    ['Languages', '3 loaded'],
  ],
  record: [
    '14:00:47Z — FR-118 entities fused: grid QT 4412 8867 → THR-2.',
    '13:56:50Z — B-77 cross-reference complete: 3-source consensus.',
  ],
  ops: 'Software asset · ingestion cell',
})

reg(['3D-01', 'LIDAR-RIG'], {
  id: '3D-01', name: 'LIDAR-RIG', icon: 'lidar', faction: 'FRIENDLY', cls: 'TRIPOD LIDAR SCANNER — OFFLINE',
  desc: 'Terrestrial laser scanner for structure verification. Went down mid-scan at 13:21Z — power module degradation suspected. S-3 east face only 61% covered.',
  specs: [
    ['Range', '350 m'], ['Rate', '500k pts/s'], ['Status', 'OFFLINE — fault 13:21Z'],
    ['Coverage', 'S-3 east face 61%'], ['Maintenance', 'Dispatch queued'],
  ],
  record: [
    '13:21:00Z — Power fault during structure scan 09.',
    '13:20:41Z — Last valid frame uploaded to fusion layer.',
  ],
  ops: 'Unmanned sensor · maintenance pending',
})

// ── Hostile / unknown contacts ──
reg(['CONTACT-X', 'T-07'], {
  id: 'CONTACT-X', name: 'CONTACT-X / TRACK T-07', icon: 'threat', faction: 'HOSTILE', cls: 'UNREGISTERED GROUND VEHICLE',
  desc: 'Unregistered vehicle-class contact. Breached geofence GF-2 eastern boundary at 14:00:12Z; video track T-07 assessed as same entity (fusion confidence 0.88). Executed a 110° turn and is accelerating toward the zone core.',
  specs: [
    ['Class', 'Vehicle — light truck (est.)'], ['Speed', '~14 km/h, accelerating'], ['Heading', 'West → zone core'],
    ['Intercept', '~14:12Z at current speed'], ['ID', 'No transponder · no registry match'], ['Assess', 'HOSTILE UNTIL IDENTIFIED'],
  ],
  record: [
    '14:01:30Z — 110° direction change, acceleration toward GF-2 core.',
    '14:00:12Z — Crossed GF-2 eastern boundary.',
    '13:58:50Z — First detection, eastern approach road.',
  ],
  ops: 'Operator decision pending — escalation before 14:12Z',
})

reg(['T-09', 'PERS-09'], {
  id: 'T-09', name: 'UNKNOWN MALE — TRACK T-09', icon: 'person', faction: 'UNKNOWN', cls: 'GROUND PERSONNEL — LOADING CREW',
  desc: 'Static individual near vehicle T-03 at the warehouse loading bay. Posture consistent with loading supervision. No facial capture — silhouette classification only.',
  specs: [
    ['Height', '~178 cm (est.)'], ['Build', 'Medium'], ['Attire', 'Dark work clothing'],
    ['Activity', 'Loading supervision'], ['Armed', 'Not observed'], ['Face ID', 'NO CAPTURE — range/angle'],
  ],
  record: [
    '14:01:55Z — Static, loading posture near T-03.',
    '13:48:20Z — First acquired at warehouse bay.',
    'Correlates: photo SEG-03 group · Speaker A/B voice intercept (unconfirmed).',
  ],
  ops: 'Continue passive track · no interaction authorized',
})

reg(['T-11', 'PERS-11'], {
  id: 'T-11', name: 'UNKNOWN MALE — TRACK T-11', icon: 'person', faction: 'UNKNOWN', cls: 'GROUND PERSONNEL — MOBILE',
  desc: 'Individual moving W → NW away from the loading site. Intermittent track — terrain masking. Possibly a spotter or courier.',
  specs: [
    ['Height', '~171 cm (est.)'], ['Build', 'Slight'], ['Movement', 'W → NW, 4–6 km/h'],
    ['Armed', 'Undetermined'], ['Face ID', 'NO CAPTURE'],
  ],
  record: [
    '14:01:12Z — Track intermittent, terrain masking NW draw.',
    '13:52:07Z — Separated from SEG-03 group.',
  ],
  ops: 'Track priority: MEDIUM · re-acquire on next pass',
})

reg(['T-12'], {
  id: 'T-12', name: 'UNRESOLVED OBJECT — TRACK T-12', icon: 'unknown', faction: 'UNKNOWN', cls: 'UNSTABLE CLASSIFICATION',
  desc: 'Object with erratic motion near the ridge. Classifier oscillates between equipment and terrain artifact (0.58). Human review queued.',
  specs: [
    ['Class', 'UNSTABLE — 0.58'], ['Motion', 'Erratic / possible parallax'], ['Review', 'Human review queued'],
  ],
  record: ['14:00:49Z — Classification flip ×4 in 90 s.', 'Correlates: photo SEG-05 ridge anomaly.'],
  ops: 'Resolve via 14:20Z KEYHOLE-9 pass',
})

reg(['T-03'], {
  id: 'T-03', name: 'TRUCK — TRACK T-03', icon: 'vehicle', faction: 'UNKNOWN', cls: 'HEAVY TRUCK — STATIONARY',
  desc: 'Heavy truck at the warehouse loading bay. Thermal shadow indicates recent engine activity. Matches photo segment SEG-01.',
  specs: [
    ['Class', 'Truck — 6t class (est.)'], ['State', 'Stationary, engine warm'], ['Location', 'Warehouse S-3 bay'],
    ['Registry', 'No match'],
  ],
  record: ['14:01:58Z — Stationary at bay.', '13:40:12Z — Arrived via north access road.'],
  ops: 'Flag for 14:20Z satellite pass',
})

reg(['T-14'], {
  id: 'T-14', name: 'ANIMAL — TRACK T-14', icon: 'animal', faction: 'CIVILIAN', cls: 'QUADRUPED — NON-THREAT',
  desc: 'Large quadruped (likely feral dog) transiting south. Classified non-threat; retained to suppress false alarms.',
  specs: [['Class', 'Animal — 0.71'], ['Motion', 'S → SE, steady'], ['Threat', 'NONE']],
  record: ['13:59:37Z — Exited frame south.'],
  ops: 'Auto-suppressed from alerting',
})

// ── Photo segments ──
reg(['SEG-01'], P['T-03'])
reg(['SEG-03', 'PERSONNEL GROUP'], {
  id: 'SEG-03', name: 'PERSONNEL GROUP (3) — SEG-03', icon: 'team', faction: 'UNKNOWN', cls: 'GROUND PERSONNEL ×3',
  desc: 'Three individuals adjacent to truck SEG-01/T-03. Movement pattern consistent with loading activity. Voice intercept from EARSHOT-A likely originates from this group.',
  specs: [
    ['Count', '3 confirmed'], ['Activity', 'Loading — coordinated'], ['Armed', 'Not observed'],
    ['Voice link', 'Speaker A/B intercept (0.86)'], ['Face ID', 'NO CAPTURE'],
  ],
  record: [
    '14:02:11Z — Segmented in frame 2231 (0.81).',
    '13:20–13:50Z — Ground patrol corroboration (FR-118).',
  ],
  ops: 'Correlate with next EARSHOT-A intercept window',
})
reg(['SEG-05', 'RIDGE OBJECT', 'TGT-02'], {
  id: 'SEG-05', name: 'RIDGE OBJECT — SEG-05', icon: 'unknown', faction: 'UNKNOWN', cls: 'UNSTABLE MASK — HUMAN REVIEW',
  desc: 'Object near the ridge line with unstable SAM-H mask across 4 consecutive stills. Class oscillates between equipment and terrain. Speaker B mentioned a "reflection" on the ridge — possible optics.',
  specs: [
    ['Confidence', '0.55 — below threshold'], ['Hypotheses', 'Equipment / optics / terrain'],
    ['Cross-modal', 'Audio mention @00:16'], ['Resolution', '14:20Z pass or SPECTER-2 low pass'],
  ],
  record: ['13:58:02Z — Flagged for human review.', '13:20:00Z — Audio: "watch the ridge, something reflected".'],
  ops: 'Authorization D-2 pending for closer pass',
})

reg(['SEG-04'], {
  id: 'SEG-04', name: 'CONTAINER — SEG-04', icon: 'structure', faction: 'UNKNOWN', cls: 'CONTAINER-CLASS OBJECT — NEW',
  desc: 'Container-class object absent from baseline imagery. Appeared within the last 6 hours at the warehouse apron. Contents unknown.',
  specs: [
    ['Class', 'ISO container 20ft (est.)'], ['First seen', 'Within last 6 h'], ['Baseline', 'ABSENT — new object'],
    ['Watch', 'Change-detection list'],
  ],
  record: ['14:02:11Z — Segmented in frame 2231 (0.76).'],
  ops: 'Verify contents via 14:20Z pass + FR follow-up',
})

// ── Voice intercepts ──
reg(['SPEAKER A'], {
  id: 'SPK-A', name: 'SPEAKER A — VOICE PROFILE', icon: 'voice', faction: 'UNKNOWN', cls: 'INTERCEPTED VOICE — UNIDENTIFIED',
  desc: 'Dominant voice on the EARSHOT-A intercept. Issues instructions — assessed as crew lead for the loading operation. Language: Foreign Language A (0.86).',
  specs: [
    ['Sex', 'Male (est.)'], ['Age', '35–50 (est.)'], ['Role', 'Crew lead — directive speech'],
    ['Language', 'Foreign Language A'], ['Voiceprint', 'Enrolled — no DB match'],
  ],
  record: ['00:21 — "Probably nothing. Stay on schedule."', '00:02 — "Checkpoint is clear, moving the first load now."'],
  ops: 'Voiceprint watch — re-alert on reacquisition',
})
reg(['SPEAKER B'], {
  id: 'SPK-B', name: 'SPEAKER B — VOICE PROFILE', icon: 'voice', faction: 'UNKNOWN', cls: 'INTERCEPTED VOICE — UNIDENTIFIED',
  desc: 'Second voice on intercept. Reports vehicle ETA and flagged the ridge reflection. Assessed as lookout/driver.',
  specs: [
    ['Sex', 'Male (est.)'], ['Age', '20–35 (est.)'], ['Role', 'Lookout / driver'],
    ['Language', 'Foreign Language A'], ['Voiceprint', 'Enrolled — no DB match'],
  ],
  record: ['00:16 — "Watch the ridge, something reflected up there."', '00:11 — "Second vehicle is four minutes out."'],
  ops: 'Voiceprint watch — re-alert on reacquisition',
})

// ── POIs ──
reg(['WAREHOUSE S-3', 'TGT-01', 'SEG-02'], {
  id: 'S-3', name: 'WAREHOUSE S-3', icon: 'structure', faction: 'CIVILIAN', cls: 'INDUSTRIAL STRUCTURE — WATCHED',
  desc: 'Suspected staging site. Three-source corroboration of loading activity within the 14:00–15:00Z window. East wall shows a 0.4m deviation vs baseline scan (low confidence — partial LIDAR coverage).',
  specs: [
    ['Footprint', '~2,400 m²'], ['Baseline', 'Confirmed vs archive'], ['Deviation', 'E wall Δ0.4m (61% scan)'],
    ['Activity', 'Loading — 2 trucks, 1 container'], ['Watch', 'TGT-01 · priority HIGH'],
  ],
  record: ['14:02:11Z — Vehicle staging on access road.', '13:20–13:50Z — Patrol observation window.'],
  ops: 'Persistent overwatch through 15:30Z',
})
reg(['CHECKPOINT N'], {
  id: 'CP-N', name: 'CHECKPOINT NORTH', icon: 'structure', faction: 'FRIENDLY', cls: 'CONTROLLED ACCESS POINT',
  desc: 'Northern access checkpoint. Watched approach for vehicle staging pattern; inside threat ring THR-2.',
  specs: [['Coverage', 'ARGUS-NE + NOMAD-3 loop'], ['Status', 'Watched'], ['Ring', 'THR-2 — watch level pending']],
  record: ['14:02:11Z — 3 vehicle-class objects staged nearby.'],
  ops: 'Raise watch level pending D-3',
})

export function getProfile(key) {
  if (!key) return null
  const hit = P[String(key).toUpperCase()]
  if (hit) return hit
  // fallback: derive from asset table
  const a = assets.find((x) => x.id === key || x.name === key)
  if (a) {
    return {
      id: a.id, name: a.name, icon: 'structure', faction: 'FRIENDLY', cls: a.type.toUpperCase(),
      desc: `${a.type} asset. Current task: ${a.task}.`,
      specs: [['Type', a.type], ['Data', a.dataType], ['Status', a.status], ['Health', `${a.health}%`], ['Signal', `${a.signal}%`]],
      record: [`Last update T-${a.lastUpdate}.`], ops: 'No extended dossier on file',
    }
  }
  return {
    id: key, name: String(key).toUpperCase(), icon: 'unknown', faction: 'UNKNOWN', cls: 'NO DOSSIER',
    desc: 'No dossier on file for this entity. Intelligence collection ongoing.',
    specs: [['Registry', 'No match']], record: [], ops: '—',
  }
}

export const FACTION_COLOR = {
  FRIENDLY: 'var(--cyan)',
  HOSTILE: 'var(--red)',
  UNKNOWN: 'var(--amber)',
  CIVILIAN: 'var(--green)',
}
