import { useState } from 'react'
import CommandHeader from './components/CommandHeader.jsx'
import MultimodalWorkspace from './components/MultimodalWorkspace.jsx'
import IntelligenceFeed from './components/IntelligenceFeed.jsx'
import MissionOverview from './components/MissionOverview.jsx'
import AssetPanel from './components/AssetPanel.jsx'
import ThreatPanel from './components/ThreatPanel.jsx'
import CommandConsole from './components/CommandConsole.jsx'
import BriefingPanel from './components/BriefingPanel.jsx'
import DiagnosticsPanel from './components/DiagnosticsPanel.jsx'

export default function App() {
  const [environment, setEnvironment] = useState('Global')

  return (
    <div className="app">
      <CommandHeader environment={environment} onEnvironmentChange={setEnvironment} />

      <div className="app-body">
        <div className="col">
          <MissionOverview />
          <AssetPanel />
          <DiagnosticsPanel />
        </div>

        <div className="col-center">
          <MultimodalWorkspace environment={environment} />
          <CommandConsole />
        </div>

        <div className="col">
          <IntelligenceFeed />
          <ThreatPanel />
          <BriefingPanel />
        </div>
      </div>

      <footer className="app-footer">
        <span>GHOST COMMAND :: RECONOPS</span>
        <span className="sep">|</span>
        <span>PREVIEW BUILD · ALL DATA SIMULATED</span>
        <span className="sep">|</span>
        <span>SAM-H SEGMENTATION + LLM REASONING LAYER</span>
        <span className="sep">|</span>
        <span style={{ marginLeft: 'auto' }}>NO REAL OPERATIONAL DATA · FICTIONAL SCENARIO</span>
      </footer>
    </div>
  )
}
