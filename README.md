# Ghost Command: ReconOPS

A futuristic AI-powered **multimodal intelligence dashboard** — a cinematic command-center UI that demonstrates how SAM-H segmentation and LLM reasoning could coordinate photo, audio, video, map, coordinate, 3D, and document intelligence in one operations platform.

> **Preview build.** Everything runs client-side on mock JSON data. No backend, no real AI calls, no real operational data, and a fully fictional scenario. A visible **PREVIEW MODE** badge is always shown.

![status](https://img.shields.io/badge/status-preview-orange) ![stack](https://img.shields.io/badge/stack-React%20%2B%20Vite-blue) ![deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-green)

## Operation Lifecycle

An operations platform can't drop into the middle of a mission — assets have to join, comms have to exist, and targets have to be defined before anything can be "live". ReconOPS models this as a four-stage lifecycle with a **phase stepper** under the header. Each stage transforms the whole dashboard, and stages are **gated**: you can't advance until the real preconditions are met.

| # | Phase | What happens | Gate to advance |
|---|-------|--------------|-----------------|
| 01 | **STAND-UP** | Every asset (drones, cameras, vehicles, human teams, satellites…) authenticates onto the command net: link handshake, key exchange, sensor calibration, health baseline. A checklist tracks net init, key distribution, and per-group linking. The AI layer quarantines data from unlinked assets. | All 12 assets linked (100% readiness) |
| 02 | **PLANNING** | Targets are designated on the map (click to add, set priority), taskings are assigned per asset, and the LLM proposes a full plan — tasking groups, coverage model, contingencies, risk tradeoffs. | Operator explicitly approves the plan |
| 03 | **EXECUTION** | The live multimodal dashboard: workspace (map/photo/audio/video/3D/coords/docs), intelligence feed, threat detection (armed only now), LLM console, operator decision queue. | Operator ends the operation |
| 04 | **DEBRIEF** | After-action synthesis: operation statistics, event timeline, LLM-generated findings / lessons learned / recommendation, and a one-click **export to Markdown** report. The AAR feeds back into the next operation's planning layer. | — |

Supporting panels adapt with the phase: the **Comms Net** panel streams phase-appropriate radio traffic (check-ins during stand-up, tasking confirmations during planning, contact reports during execution, RTB during debrief) and lets the operator transmit to all stations; the Mission Overview derives phase status and progress from the lifecycle; the Threat panel shows an armed/standby state.

## Features

- **Operation Lifecycle** — gated STAND-UP → PLANNING → EXECUTION → DEBRIEF flow (see above), with phase stepper, asset onboarding, target designation, AI plan proposal, and exportable after-action report.
- **Comms Net Panel** — per-phase mock radio traffic from linked assets, operator broadcast input, stations-on-net counter.
- **Command Header** — system status, SAM-H / LLM layer indicators, live mission clock, theater (environment) selector, Preview Mode badge.
- **Multimodal Workspace** — switchable data modes, each with its own visualization:
  - **Map** — stylized tactical map (2D / 3D terrain / topo / satellite / grid views), zones, threat rings, sensor cones, animated paths, radar sweep, ping markers, hover tooltips, marker dropping, area summary.
  - **Photo** — mock SAM-H segmentation overlays: bounding boxes, masks, labels, confidence, heatmap toggle, analyst crosshair with live grid-coordinate readout, per-segment detail panel, AI image summary.
  - **Audio** — animated waveform + spectrum visualizer, scrolling SIGINT-style spectrogram waterfall, SAM-H audio segments (speakers, events, silence), transcript with speaker labels and confidence, translate toggle, language detection, summarize / anomaly-detect actions.
  - **Video** — animated mock feed with drifting tracking boxes, thermal (white-hot) rendering toggle, object IDs, event timeline with playhead, track cards, frame summary / key events / mission briefing generation.
  - **3D** — dependency-free software 3D viewer (terrain mesh, structure scan, drone path, point cloud) with drag-rotate, scroll-zoom, wireframe, elevation heatmap, and segment highlighting.
  - **Coordinates** — parser for DD / DMS / grid / relative formats, tactical location cards, cluster visualization.
  - **Documents** — mock reports with LLM summary, entity extraction, risks, action items, translation, classification tags.
- **AI Intelligence Feed** — streaming observations from all modalities with priority + media-type filters.
- **Mission Overview** — phases, progress, risk, AI recommendations with source attribution, operator decision queue.
- **Asset Coordination** — 12 mock assets with status, health/signal meters, tasks.
- **Threat / Anomaly Panel** — 10 anomalies with severity filters, expandable source data + recommendations.
- **LLM Command Console (control layer)** — available in every phase, with phase-aware suggestion chips. Natural language doesn't just answer — it *drives the app*: switch workspace modes ("show video thermal view"), change theater ("set theater maritime"), control the lifecycle ("link all assets", "approve plan", "advance", "end operation"), filter panels ("filter critical anomalies"), run media actions ("translate the transcript", "play audio"), approve decisions ("approve all decisions"), and generate briefings. The router (`src/lib/commandRouter.js`) maps intents to real UI actions — in a live build each handler becomes an LLM tool.
- **Theaters that matter** — the environment selector re-renders the tactical map into 8 distinct operating pictures: wide-area terrain (Global), city-block grid (Urban), shipping lanes + harbor (Maritime), fence line + crossings (Border), airways + range rings (Airspace), network topology with a flagged node (Cyber), flood extent + SAR grid (Disaster Response), and a facility floorplan (Research Lab).
- **Options everywhere** — anomalies expand into quick actions (Approve / Assign Review / View Source / Dismiss), intelligence feed items click through to their source workspace, console suggestions adapt to the current phase.
- **Operator Briefing** — "Generate Briefing" cycles through synthesized multimodal briefings.
- **System Diagnostics** — pipeline statuses, latency, uptime, queue depth, model confidence.

## Tech

- React 18 + Vite 6, plain CSS (no UI framework).
- Zero runtime dependencies beyond React — the map is SVG, audio/3D are `<canvas>`, all animation is CSS/`requestAnimationFrame`.
- All data lives in [`src/data/mockData.js`](src/data/mockData.js).

## Getting started

```bash
git clone <your-repo-url>
cd ReconOps
npm install
npm run dev        # local dev server at http://localhost:5173
```

Production build:

```bash
npm run build      # outputs static site to dist/
npm run preview    # serve the built dist locally
```

## Deploying to GitHub Pages

`vite.config.js` uses `base: './'` (relative asset paths), so the build works at any Pages URL — user site or project site — with no config changes.

### Option A — GitHub Actions (recommended)

This repo ships with a workflow at `.github/workflows/deploy.yml`. To enable it:

1. Push the repo to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The workflow builds and deploys automatically. Your site appears at `https://<user>.github.io/<repo>/`.

### Option B — gh-pages branch

```bash
npm run deploy     # builds and pushes dist/ to the gh-pages branch
```

Then in **Settings → Pages**, set Source to **Deploy from a branch** → `gh-pages` / root.

## Project structure

```
src/
  data/mockData.js          # all mock intelligence data
  styles/global.css         # tactical HUD theme
  App.jsx                   # command-center layout
  components/
    CommandHeader.jsx       # brand, statuses, clock, environment selector
    MultimodalWorkspace.jsx # mode tabs + active view
    views/
      MapIntelView.jsx
      PhotoIntelView.jsx
      AudioIntelView.jsx
      VideoIntelView.jsx
      ThreeDIntelView.jsx
      CoordinatesIntelView.jsx
      DocumentIntelView.jsx
    IntelligenceFeed.jsx
    MissionOverview.jsx
    AssetPanel.jsx
    ThreatPanel.jsx
    CommandConsole.jsx
    BriefingPanel.jsx
    DiagnosticsPanel.jsx
    HudCard.jsx
    StatusBadge.jsx
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
- No real military, sensitive, or operational data. The scenario, names, and coordinates are fictional.
- Original design; no copyrighted game names, logos, or assets.
