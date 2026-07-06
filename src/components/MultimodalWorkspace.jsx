import { useState } from 'react'
import HudCard from './HudCard.jsx'
import { DATA_MODES } from '../data/mockData.js'
import PhotoIntelView from './views/PhotoIntelView.jsx'
import AudioIntelView from './views/AudioIntelView.jsx'
import VideoIntelView from './views/VideoIntelView.jsx'
import MapIntelView from './views/MapIntelView.jsx'
import CoordinatesIntelView from './views/CoordinatesIntelView.jsx'
import ThreeDIntelView from './views/ThreeDIntelView.jsx'
import DocumentIntelView from './views/DocumentIntelView.jsx'

const VIEWS = {
  map: MapIntelView,
  photo: PhotoIntelView,
  audio: AudioIntelView,
  video: VideoIntelView,
  '3d': ThreeDIntelView,
  coords: CoordinatesIntelView,
  docs: DocumentIntelView,
}

export default function MultimodalWorkspace({ environment }) {
  const [mode, setMode] = useState('map')
  const View = VIEWS[mode]

  return (
    <HudCard
      className="workspace"
      title={`Multimodal Workspace · ${environment.toUpperCase()}`}
      right={<span className="chip chip-green pulse"><span className="dot" />SAM-H + LLM FUSION</span>}
      noPad
    >
      <nav className="mode-tabs">
        {DATA_MODES.map((m) => (
          <button key={m.id} className={`mode-tab ${mode === m.id ? 'active' : ''}`} onClick={() => setMode(m.id)}>
            <span className="icon">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </nav>
      <div className="hud-card-body" style={{ flex: 1 }}>
        <View key={mode} />
      </div>
    </HudCard>
  )
}
