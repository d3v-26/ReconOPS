import { OperationProvider } from './context/OperationContext.jsx'
import TacticalMap from './components/TacticalMap.jsx'
import Hud from './components/Hud.jsx'
import EntityCard from './components/EntityCard.jsx'
import CommandBar from './components/CommandBar.jsx'
import Debrief from './components/Debrief.jsx'
import { AO } from './data/mockData.js'

// The map is the whole interface. Everything else floats over it:
// HUD (read-only), the card for whatever is selected, and the command bar.
export default function App() {
  return (
    <OperationProvider>
      <div className="app">
        <TacticalMap />
        <div className="vignette" />
        <Hud />
        <EntityCard />
        <CommandBar />
        <Debrief />
        <footer className="credit">Fictional scenario · simulated feeds · {AO.imageryCredit} · Icons: Lucide</footer>
      </div>
    </OperationProvider>
  )
}
