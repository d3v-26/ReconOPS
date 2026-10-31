# ReconOps — Ghost Command

An AI-assisted ISR (intelligence, surveillance, reconnaissance) console built around **one clear question**:

> **Is Warehouse S-3 being used to stage supplies?** Confirm or rule it out before the 15:00Z movement window closes — without escalating.

Every screen exists to answer that question. The operator brings sensors online, approves a collection plan, reviews imagery / drone video / intercepted audio / field reports, logs what corroborates, resolves critical alerts, and files the after-action report. A **Next step** card always says exactly what to do and has a one-click button to do it.

> **Preview build.** Runs fully client-side on mock data. No backend, no real AI calls, fictional scenario. A **Preview · simulated data** badge is always shown.

![status](https://img.shields.io/badge/status-preview-orange) ![stack](https://img.shields.io/badge/stack-React%20%2B%20Vite-blue) ![deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-green)

## How it works

| # | Phase | What you do | Gate |
|---|-------|-------------|------|
| 1 | **Stand-up** | Link all 12 assets onto the command net (watch them light up on the map). | 12/12 linked |
| 2 | **Planning** | Review targets on the map (click to add more), generate the AI collection plan, approve it. | Plan approved |
| 3 | **Execution** | Open each evidence source (Imagery, Video, Audio, Reports). Each shows what it says about S-3 — **Log as evidence** to raise confidence. Resolve the two critical alerts. | ≥3 sources logged + no open critical alerts |
| 4 | **Debrief** | See the answer, stats and timeline; generate and export the AAR (Markdown). | — |

The layout never changes shape:

- **Left — Mission rail:** the question, objective, live confidence meter (confirm threshold 75%), evidence checklist, **Next step**, and success criteria.
- **Center — Stage:** the current phase. In execution it is a tabbed workspace (Map, Imagery, Video, Audio, Reports, 3D Scan, Coordinates); tabs with a dot are evidence sources.
- **Right — Side panel:** Alerts, Intel feed, Assets, Comms. It switches to the most relevant tab on each phase change.
- **Bottom — AI bar:** natural-language control. Try `what's next?`, `do it`, `open video thermal`, `log evidence`, `approve plan`, `end operation`.

## Assets used

| Asset | Source | License |
|-------|--------|---------|
| Map tiles + photo/video stills | [USGS The National Map — USGSImageryOnly](https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer) (USDA NAIP orthoimagery) | US Government work, public domain; credited in-app |
| Map engine | [Leaflet 1.9](https://leafletjs.com) | BSD-2 |
| Icons | [Lucide](https://lucide.dev) (`lucide-react`) | ISC |
| Fonts | Inter, JetBrains Mono via Fontsource (bundled, no external requests) | OFL |

Stills in `public/imagery/` were exported from the same USGS service so the map, imagery and video all show the same area of operations. The map loads tiles live from USGS (no API key).

## Tech

- React 18 + Vite 6, plain CSS with design tokens in [`src/styles/global.css`](src/styles/global.css).
- All scenario data in [`src/data/mockData.js`](src/data/mockData.js); positions are % of the AO box and converted to lat/lng in [`src/lib/geo.js`](src/lib/geo.js).
- Next-step logic in [`src/lib/nextStep.js`](src/lib/nextStep.js) — the single source of truth for "what should I do now", shared by the mission rail and the AI bar.

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
public/imagery/             # USGS stills (photo + drone video views)
src/
  App.jsx                   # shell: top bar · mission rail · stage · side panel · AI bar
  context/
    OperationContext.jsx    # phase, links, plan, evidence, alerts, UI state
    WindowContext.jsx       # floating dossier windows
  lib/
    nextStep.js             # "what should I do now?"
    commandRouter.js        # natural language → UI actions
    geo.js                  # AO % ↔ lat/lng
  components/
    TopBar.jsx  MissionRail.jsx  SidePanel.jsx  CommandConsole.jsx
    TacticalMap.jsx         # Leaflet + USGS imagery, assets/targets/zones/paths
    Workspace.jsx           # execution tabs + evidence banner
    phases/  StandUpView · PlanningView · DebriefView
    views/   MapView · PhotoIntelView · VideoIntelView · AudioIntelView · DocumentIntelView · ThreeDIntelView · CoordinatesIntelView
    ThreatPanel · IntelligenceFeed · AssetPanel · CommsPanel · ProfileWindow
```

## Extending to real-world data

The preview is deliberately structured so every mock boundary is a swap point. All mock data flows through `src/data/mockData.js` and the phase state lives in `src/context/OperationContext.jsx` — replacing either with live sources doesn't touch the UI components.

### Per-modality integration paths

| Modality | Preview (mock) | Real-world replacement |
|----------|----------------|------------------------|
| **Photo segmentation** | Static `photoSegments` boxes | SAM 2 / SAM-family model behind an inference API (ONNX Runtime Web can even run small variants client-side); stream masks + confidences as JSON matching the existing segment shape |
| **Audio** | Procedural canvas waveform, canned transcript | Web Audio API for live capture/visualization; Whisper-class STT service for transcripts; diarization (pyannote) for speaker segments; translation via any MT API |
| **Video** | Animated SVG frame, static tracks | WebRTC/HLS stream in a `<video>` element; server-side detector+tracker (e.g. YOLO + ByteTrack) publishing track boxes over WebSocket, rendered as the same overlay divs |
| **Map** | Stylized SVG | MapLibre GL + real tile source; markers/zones/paths become GeoJSON layers; the marker/zone data shapes already map 1:1 to GeoJSON features |
| **Coordinates** | Regex-ish mock parser | Proper geodesy lib (proj4js, mgrs) for DD/DMS/MGRS conversion; reverse-geocoding for location cards |
| **3D** | Custom canvas wireframe | Three.js scene fed by real point clouds (LAS/PLY) or photogrammetry meshes; the viewer controls (rotate/zoom/wireframe/heatmap) carry over |
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

- **Transport:** one WebSocket (or SSE) channel delivering typed events — the frontend's feed, threat, comms, and diagnostics panels are already event-list renderers.
- **Comms:** the mock net maps naturally onto real push-to-talk/chat infrastructure; for interop with tactical ecosystems, Cursor-on-Target (CoT) / TAK server integration is the established pattern.
- **Lifecycle:** stand-up gating becomes real device attestation + key provisioning (mTLS, WireGuard); plan approval becomes a signed, audited operator action; the AAR export becomes a generated artifact stored with the operation archive.
- **Trust & safety:** keep the human-in-the-loop pattern the preview already demonstrates — AI proposes (plans, reroutes, escalations), the operator approves; every model output carries confidence and provenance so low-confidence items route to human review.

## Disclaimers

- Preview/demo only — all AI outputs are prewritten mock text; no models are called.
- No real military, sensitive, or operational data. The scenario, names and events are fictional. The map and stills use real public-domain USGS orthoimagery purely as a backdrop; nothing in the scenario refers to the actual site.
- Original design; no copyrighted game names, logos, or assets.
