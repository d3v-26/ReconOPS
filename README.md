# Ghost Command: ReconOPS

A futuristic AI-powered **multimodal intelligence dashboard** — a cinematic command-center UI that demonstrates how SAM-H segmentation and LLM reasoning could coordinate photo, audio, video, map, coordinate, 3D, and document intelligence in one operations platform.

> **Preview build.** Everything runs client-side on mock JSON data. No backend, no real AI calls, no real operational data, and a fully fictional scenario. A visible **PREVIEW MODE** badge is always shown.

![status](https://img.shields.io/badge/status-preview-orange) ![stack](https://img.shields.io/badge/stack-React%20%2B%20Vite-blue) ![deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-green)

## Features

- **Command Header** — system status, SAM-H / LLM layer indicators, live mission clock, theater (environment) selector, Preview Mode badge.
- **Multimodal Workspace** — switchable data modes, each with its own visualization:
  - **Map** — stylized tactical map (2D / 3D terrain / topo / satellite / grid views), zones, threat rings, sensor cones, animated paths, radar sweep, ping markers, hover tooltips, marker dropping, area summary.
  - **Photo** — mock SAM-H segmentation overlays: bounding boxes, masks, labels, confidence, heatmap toggle, per-segment detail panel, AI image summary.
  - **Audio** — animated waveform + spectrum visualizer, SAM-H audio segments (speakers, events, silence), transcript with speaker labels and confidence, translate toggle, language detection, summarize / anomaly-detect actions.
  - **Video** — animated mock feed with tracking boxes, object IDs, event timeline with playhead, track cards, frame summary / key events / mission briefing generation.
  - **3D** — dependency-free software 3D viewer (terrain mesh, structure scan, drone path, point cloud) with drag-rotate, scroll-zoom, wireframe, elevation heatmap, and segment highlighting.
  - **Coordinates** — parser for DD / DMS / grid / relative formats, tactical location cards, cluster visualization.
  - **Documents** — mock reports with LLM summary, entity extraction, risks, action items, translation, classification tags.
- **AI Intelligence Feed** — streaming observations from all modalities with priority + media-type filters.
- **Mission Overview** — phases, progress, risk, AI recommendations with source attribution, operator decision queue.
- **Asset Coordination** — 12 mock assets with status, health/signal meters, tasks.
- **Threat / Anomaly Panel** — 10 anomalies with severity filters, expandable source data + recommendations.
- **LLM Command Console** — natural-language commands answered with predefined mock responses.
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

## Disclaimers

- Preview/demo only — all AI outputs are prewritten mock text; no models are called.
- No real military, sensitive, or operational data. The scenario, names, and coordinates are fictional.
- Original design; no copyrighted game names, logos, or assets.
