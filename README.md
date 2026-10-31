# ReconOps — Ghost Command

An AI-assisted ISR (intelligence, surveillance, reconnaissance) console built around **one clear question**:

> **Is Warehouse S-3 being used to stage supplies?** Confirm or rule it out before the 15:00Z movement window closes — without escalating.

**v5 — the map is the interface.** There are no tabs, side panels or windows. Everything in the area of operations — drones, cameras, sensors, people, vehicles, hostile contacts, the warehouse itself — is an **entity** on a full-screen satellite map. You interact in exactly two ways:

1. **Click** — an entity opens its card (live feed, details, actions); empty ground opens a spot report (view from the nearest sensor, send an asset there, ping, designate a target).
2. **Talk** — the AI command bar (press <kbd>/</kbd>) takes plain-language orders: `open the truck`, `thermal`, `send specter 2 to the ridge`, `take control of nomad`, `log evidence`, `what's next?`, `do it`.

> **Preview build.** Runs fully client-side on mock data. No backend, no real AI calls, fictional scenario. A **Preview · simulated data** badge is always shown.

![status](https://img.shields.io/badge/status-preview-orange) ![stack](https://img.shields.io/badge/stack-React%20%2B%20Vite-blue) ![deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-green)

## How it works

| # | Objective | What you do | Done when |
|---|-----------|-------------|-----------|
| 1 | **Bring the network online** | Click dimmed assets to link them, or say `link all`. | 11/11 linked |
| 2 | **Approve a collection plan** | Click Warehouse S-3 → *Generate plan*; tasking lines are drawn from each asset to its target. Approve. | Plan approved |
| 3 | **Answer the question** | Open sensor feeds (satellite frame, drone video, intercepted audio, the team lead's field report) and log what they show. Resolve the critical contacts on the map. | ≥3 sources + both critical alerts resolved |
| 4 | **File the report** | End-of-operation screen: verdict, stats, timeline, AAR, Markdown export. | — |

### Entities

Every entity card follows the same shape — feed on top, then whatever applies:

- **Feeds are live views of the real ground.** Drones get a top-down orbiting gimbal view, mast cameras and the UGV a tilted oblique view, people a swaying night-vision helmet cam, the satellite its segmented still, acoustic sensors a spectrogram and transcript. Every other entity in frame is drawn as a track box. *Thermal* works on all imagery feeds.
- **Things without a sensor** (the truck, the hostile pickup, the warehouse) are shown *through* the nearest linked drone or camera that can see them — "Seen by SPECTER-1".
- **Vehicles** list make, model, colour, plate and whether they are remote-controllable — and by whom. NOMAD-3 (a UGV) is driven through SSG Reyes's tablet: *Take control*, then click the map to set waypoints.
- **Alerts live on the entity that caused them** — approve the recommended action or dismiss it from the contact's own card.

### HUD

Read-only overlays borrowed from tactical-shooter HUDs: objective tracker with a gold ◆ over whatever needs attention next, mission clock and window countdown, confidence meter, alert strip, radio log, and centre-screen callouts (`INTEL LOGGED`, `PLAN APPROVED`, `OPERATION LIVE`). Marker frames follow NATO symbology: rounded box friendly, diamond hostile, circle unknown, square neutral.

## Assets used

| Asset | Source | License |
|-------|--------|---------|
| Map tiles, sensor feeds + satellite still | [USGS The National Map — USGSImageryOnly](https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer) (USDA NAIP orthoimagery) | US Government work, public domain; credited in-app |
| Map engine | [Leaflet 1.9](https://leafletjs.com) | BSD-2 |
| Icons | [Lucide](https://lucide.dev) (`lucide-react`) | ISC |
| Fonts | Inter, JetBrains Mono via Fontsource (bundled, no external requests) | OFL |

The map and every live feed load tiles from USGS (no API key); the satellite still in `public/imagery/` was exported from the same service, so everything shows the same ground.

## Tech

- React 18 + Vite 6, plain CSS with design tokens in [`src/styles/global.css`](src/styles/global.css).
- All scenario data in [`src/data/mockData.js`](src/data/mockData.js); positions are % of the AO box and converted to lat/lng in [`src/lib/geo.js`](src/lib/geo.js).
- Entities in [`src/data/entities.js`](src/data/entities.js); next-step logic in [`src/lib/nextStep.js`](src/lib/nextStep.js) — the single source of truth for "what should I do now", shared by the HUD, the map's objective marker and the AI bar.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

## Deploying to GitHub Pages

`vite.config.js` uses `base: './'`, so the build works from any Pages sub-path.

### Option A — GitHub Actions (recommended)

Enable Pages in repo settings with **Source: GitHub Actions**; `.github/workflows/deploy.yml` builds and deploys on push to `main`.

### Option B — gh-pages branch

```bash
npm run deploy
```

## Project structure

```
public/imagery/             # USGS still for the satellite feed
src/
  App.jsx                   # full-screen map + HUD + entity card + command bar + debrief
  data/
    entities.js             # every thing in the AO, one shape (+ name lookup for commands)
    mockData.js             # mission, evidence, alerts, plan, radio traffic, AAR
  context/
    OperationContext.jsx    # phase, links, positions/movement, selection, control, evidence, alerts
  lib/
    nextStep.js             # "what should I do now?" — drives the ◆ marker, HUD and "do it"
    commandRouter.js        # natural language → actions
    geo.js  kinds.js  report.js
  components/
    TacticalMap.jsx         # Leaflet + USGS imagery; entity markers, zones, tasking lines, pings
    EntityCard.jsx          # the one panel: entity or spot
    Feed.jsx                # live sensor views (aerial / oblique / helmet / still / audio)
    Hud.jsx  CommandBar.jsx  Debrief.jsx
```

## Extending to real-world data

The preview is deliberately structured so every mock boundary is a swap point. All mock data flows through `src/data/mockData.js` and the phase state lives in `src/context/OperationContext.jsx` — replacing either with live sources doesn't touch the UI components.

### Per-modality integration paths

| Modality | Preview (mock) | Real-world replacement |
|----------|----------------|------------------------|
| **Photo segmentation** | Static `photoSegments` boxes | SAM 2 / SAM-family model behind an inference API (ONNX Runtime Web can even run small variants client-side); stream masks + confidences as JSON matching the existing segment shape |
| **Audio** | Procedural canvas waveform, canned transcript | Web Audio API for live capture/visualization; Whisper-class STT service for transcripts; diarization (pyannote) for speaker segments; translation via any MT API |
| **Video** | Live USGS imagery at the sensor's look point, CSS-tilted per sensor type, entities drawn as track boxes | WebRTC/HLS stream per entity; server-side detector+tracker (e.g. YOLO + ByteTrack) publishing track boxes over WebSocket, rendered as the same overlay |
| **Map / entities** | Leaflet + live USGS tiles; static entity list with simulated movement | Entity positions from a track store (CoT / TAK, ADS-B, GPS telemetry); `entities.js` already has the shape of a track record |
| **Documents** | Canned summaries/entities | LLM API (e.g. Claude) for summarization, NER-style entity extraction, translation, classification — the document card already renders exactly those fields |
| **LLM console / briefings** | Keyword-matched canned responses | Real LLM with tool use: give it functions like `get_anomalies()`, `get_assets()`, `task_asset()` so commands become grounded actions, not text |

### Architecture for a live deployment

```
 sensors/assets ──▸ ingestion gateway (MQTT / WebSocket)
                        │
                        ├─▸ SAM-H segmentation workers (GPU)
                        ├─▸ STT / translation workers
                        ├─▸ tracker / geofence engine
                        │
                        ▼
                  fusion + event bus  ──▸  LLM reasoning layer
                        │                        │
                        ▼                        ▼
                  WebSocket API  ◂──────  briefing/plan generator
                        │
                        ▼
              ReconOPS frontend (this repo, mostly unchanged)
```

- **Transport:** one WebSocket (or SSE) channel delivering typed events — the frontend's entity store, alerts and radio log are already event-driven.
- **Comms:** the mock net maps naturally onto real push-to-talk/chat infrastructure; for interop with tactical ecosystems, Cursor-on-Target (CoT) / TAK server integration is the established pattern.
- **Lifecycle:** stand-up gating becomes real device attestation + key provisioning (mTLS, WireGuard); plan approval becomes a signed, audited operator action; the AAR export becomes a generated artifact stored with the operation archive.
- **Trust & safety:** keep the human-in-the-loop pattern the preview already demonstrates — AI proposes (plans, reroutes, escalations), the operator approves; every model output carries confidence and provenance so low-confidence items route to human review.

## Disclaimers

- Preview/demo only — all AI outputs are prewritten mock text; no models are called.
- No real military, sensitive, or operational data. The scenario, names and events are fictional. The map and stills use real public-domain USGS orthoimagery purely as a backdrop; nothing in the scenario refers to the actual site.
- Original design. The HUD takes general cues from tactical shooters (objective markers, callouts, radio log, compass ribbon) but uses no game names, logos, or assets.
