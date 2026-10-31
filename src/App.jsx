import { useEffect } from 'react'
import { OperationProvider, useOperation } from './context/OperationContext.jsx'
import { WindowProvider, useWindows } from './context/WindowContext.jsx'
import TopBar from './components/TopBar.jsx'
import MissionRail from './components/MissionRail.jsx'
import SidePanel from './components/SidePanel.jsx'
import Workspace from './components/Workspace.jsx'
import StandUpView from './components/phases/StandUpView.jsx'
import PlanningView from './components/phases/PlanningView.jsx'
import DebriefView from './components/phases/DebriefView.jsx'
import CommandConsole from './components/CommandConsole.jsx'
import ProfileWindow from './components/ProfileWindow.jsx'
import { AO } from './data/mockData.js'

// The side panel follows the phase to whatever matters most right now.
const SIDE_TAB_FOR_PHASE = { STANDUP: 'comms', PLANNING: 'assets', EXECUTION: 'alerts', DEBRIEF: 'intel' }

function AppShell() {
  const { phase, setSideTab } = useOperation()
  const { floats } = useWindows()

  useEffect(() => { setSideTab(SIDE_TAB_FOR_PHASE[phase]) }, [phase, setSideTab])

  const stage = {
    STANDUP: <StandUpView />,
    PLANNING: <PlanningView />,
    EXECUTION: <Workspace />,
    DEBRIEF: <DebriefView />,
  }[phase]

  return (
    <div className="app">
      <TopBar />
      <main className="layout">
        <MissionRail />
        <div className="center">
          {stage}
          <CommandConsole />
        </div>
        <SidePanel />
      </main>
      <footer className="footer">
        <span>Fictional scenario · all feeds simulated · no real operational data</span>
        <span>{AO.imageryCredit} · Icons: Lucide (ISC)</span>
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
