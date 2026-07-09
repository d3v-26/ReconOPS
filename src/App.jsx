import { useState } from 'react'
import { OperationProvider, useOperation } from './context/OperationContext.jsx'
import { WindowProvider, useWindows } from './context/WindowContext.jsx'
import CommandHeader from './components/CommandHeader.jsx'
import PhaseBar from './components/PhaseBar.jsx'
import MultimodalWorkspace from './components/MultimodalWorkspace.jsx'
import StandUpView from './components/phases/StandUpView.jsx'
import PlanningView from './components/phases/PlanningView.jsx'
import DebriefView from './components/phases/DebriefView.jsx'
import IntelligenceFeed from './components/IntelligenceFeed.jsx'
import MissionOverview from './components/MissionOverview.jsx'
import AssetPanel from './components/AssetPanel.jsx'
import ThreatPanel from './components/ThreatPanel.jsx'
import CommandConsole from './components/CommandConsole.jsx'
import BriefingPanel from './components/BriefingPanel.jsx'
import DiagnosticsPanel from './components/DiagnosticsPanel.jsx'
import CommsPanel from './components/CommsPanel.jsx'
import TaskBar from './components/TaskBar.jsx'
import ProfileWindow from './components/ProfileWindow.jsx'
import HudCard from './components/HudCard.jsx'

function ThreatPanelPlaceholder({ phase }) {
  return (
    <HudCard
      panelId="threats"
      title={<>Threat / Anomaly Detection</>}
      right={<span className="chip chip-muted"><span className="dot" />STANDBY</span>}
      style={{ flex: 1, minHeight: 110 }}
    >
      <div style={{ color: 'var(--muted)', fontSize: 10, lineHeight: 1.6 }}>
        Anomaly detection arms when the operation enters EXECUTION.
        {phase === 'STANDUP'
          ? ' Sensors are still onboarding — no trusted feeds yet.'
          : ' Detection thresholds are being derived from the approved plan.'}
      </div>
    </HudCard>
  )
}

function CenterColumn() {
  const { phase } = useOperation()
  const view = {
    STANDUP: <StandUpView />,
    PLANNING: <PlanningView />,
    DEBRIEF: <DebriefView />,
    EXECUTION: <MultimodalWorkspace />,
  }[phase]
  return (
    <>
      {view}
      <CommandConsole />
    </>
  )
}

// Dockable panel column: accepts panel drops with positional insert.
function DockColumn({ col, render }) {
  const { layout, dragging, movePanel } = useWindows()
  const [hint, setHint] = useState(null) // insertion index preview
  const ids = layout[col]

  const indexFromEvent = (e) => {
    const cards = [...e.currentTarget.querySelectorAll(':scope > .dock-slot > .hud-card')]
    for (let i = 0; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect()
      if (r.height > 0 && e.clientY < r.top + r.height / 2) return i
    }
    return cards.length
  }

  return (
    <div
      className={`col ${dragging ? 'drop-ready' : ''}`}
      onDragOver={(e) => {
        if (!dragging) return
        e.preventDefault()
        setHint(indexFromEvent(e))
      }}
      onDragLeave={() => setHint(null)}
      onDrop={(e) => {
        e.preventDefault()
        const id = e.dataTransfer.getData('text/panel') || dragging
        if (id) movePanel(id, col, indexFromEvent(e))
        setHint(null)
      }}
    >
      {ids.map((id, i) => {
        const node = render(id)
        if (!node) return null
        return (
          <div key={id} className="dock-slot" style={{ display: 'contents' }}>
            {dragging && hint === i && dragging !== id && <div className="drop-hint" />}
            {node}
          </div>
        )
      })}
      {dragging && hint === ids.length && <div className="drop-hint" />}
    </div>
  )
}

function AppShell() {
  const { phase } = useOperation()
  const { floats } = useWindows()
  const live = phase === 'EXECUTION' || phase === 'DEBRIEF'

  const renderPanel = (id) => {
    switch (id) {
      case 'mission': return <MissionOverview />
      case 'assets': return <AssetPanel />
      case 'diagnostics': return <DiagnosticsPanel />
      case 'feed': return live ? <IntelligenceFeed /> : null
      case 'comms': return <CommsPanel />
      case 'threats': return live ? <ThreatPanel /> : <ThreatPanelPlaceholder phase={phase} />
      case 'briefing': return <BriefingPanel />
      default: return null
    }
  }

  const tabIds = ['workspace', 'console', 'mission', 'assets', 'diagnostics', ...(live ? ['feed'] : []), 'comms', 'threats', 'briefing']

  return (
    <div className="app">
      <CommandHeader />
      <PhaseBar />

      <div className="app-body">
        <DockColumn col="left" render={renderPanel} />

        <div className="col-center">
          <CenterColumn />
        </div>

        <DockColumn col="right" render={renderPanel} />
      </div>

      <TaskBar panelIds={tabIds} />

      <footer className="app-footer">
        <span>GHOST COMMAND :: RECONOPS</span>
        <span className="sep">|</span>
        <span>PREVIEW BUILD · ALL DATA SIMULATED</span>
        <span className="sep">|</span>
        <span>SAM-H SEGMENTATION + LLM REASONING LAYER</span>
        <span style={{ marginLeft: 'auto' }}>NO REAL OPERATIONAL DATA · FICTIONAL SCENARIO</span>
      </footer>

      {floats.map((w) => <ProfileWindow key={w.key} win={w} />)}
    </div>
  )
}

export default function App() {
  return (
    <OperationProvider>
      <WindowProvider>
        <AppShell />
      </WindowProvider>
    </OperationProvider>
  )
}
