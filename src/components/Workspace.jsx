import { Map, Image, Video, AudioLines, FileText, Box, Crosshair, CheckCircle2, Plus } from 'lucide-react'
import { DATA_MODES, evidenceSources } from '../data/mockData.js'
import { useOperation } from '../context/OperationContext.jsx'
import MapView from './views/MapView.jsx'
import PhotoIntelView from './views/PhotoIntelView.jsx'
import AudioIntelView from './views/AudioIntelView.jsx'
import VideoIntelView from './views/VideoIntelView.jsx'
import CoordinatesIntelView from './views/CoordinatesIntelView.jsx'
import ThreeDIntelView from './views/ThreeDIntelView.jsx'
import DocumentIntelView from './views/DocumentIntelView.jsx'

const VIEWS = {
  map: MapView, photo: PhotoIntelView, audio: AudioIntelView, video: VideoIntelView,
  '3d': ThreeDIntelView, coords: CoordinatesIntelView, docs: DocumentIntelView,
}
const ICONS = { map: Map, photo: Image, video: Video, audio: AudioLines, docs: FileText, '3d': Box, coords: Crosshair }

// Sits above each evidence-bearing source: states what this source says about
// the mission question and lets the operator log it.
function EvidenceBanner({ source }) {
  const { evidence, logEvidence } = useOperation()
  const got = evidence.includes(source.id)
  return (
    <div className={`evidence-banner ${got ? 'got' : ''}`}>
      <div className="eb-text">
        <span className="eyebrow">{got ? 'Logged as evidence' : 'Does this source show staging at S-3?'}</span>
        <span>{source.finding}</span>
      </div>
      {got
        ? <span className="eb-done"><CheckCircle2 size={16} /> +{Math.round(source.weight * 100)}% confidence</span>
        : <button className="btn btn-accent" onClick={() => logEvidence(source.id)}><Plus size={14} /> Log as evidence</button>}
    </div>
  )
}

export default function Workspace() {
  const { mode, setMode, evidence } = useOperation()
  const View = VIEWS[mode]
  const source = evidenceSources.find((s) => s.id === mode)

  return (
    <section className="pane">
      <header className="pane-head tabs-head">
        <div className="eyebrow">Phase 3 · Execution</div>
        <nav className="mode-tabs" role="tablist">
          {DATA_MODES.map((m) => {
            const Icon = ICONS[m.id]
            const isEvidence = evidenceSources.some((s) => s.id === m.id)
            return (
              <button key={m.id} role="tab" aria-selected={mode === m.id} className={`mode-tab ${mode === m.id ? 'active' : ''}`} onClick={() => setMode(m.id)}>
                <Icon size={14} /> {m.label}
                {isEvidence && <span className={`ev-dot ${evidence.includes(m.id) ? 'got' : ''}`} title={evidence.includes(m.id) ? 'Logged as evidence' : 'Evidence source — not yet logged'} />}
              </button>
            )
          })}
        </nav>
      </header>
      {source && <EvidenceBanner source={source} />}
      <div className="pane-body view-body">
        <View key={mode} />
      </div>
    </section>
  )
}
