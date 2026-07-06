import { useEffect, useState } from 'react'
import HudCard from './HudCard.jsx'
import StatusBadge from './StatusBadge.jsx'
import { feedEvents } from '../data/mockData.js'

const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low']
const MEDIA = ['All', 'Photo', 'Audio', 'Video', 'Map', '3D', 'Document', 'Sensor']

export default function IntelligenceFeed() {
  const [prio, setPrio] = useState('All')
  const [media, setMedia] = useState('All')
  const [visible, setVisible] = useState(5)

  // streaming effect: reveal items over time
  useEffect(() => {
    if (visible >= feedEvents.length) return
    const id = setInterval(() => setVisible((v) => Math.min(v + 1, feedEvents.length)), 2600)
    return () => clearInterval(id)
  }, [visible])

  const items = feedEvents
    .slice(0, visible)
    .filter((e) => (prio === 'All' || e.priority === prio) && (media === 'All' || e.source === media))

  return (
    <HudCard
      title="AI Intelligence Feed"
      right={<span className="chip chip-cyan pulse"><span className="dot" />STREAMING</span>}
      style={{ flex: 2, minHeight: 220 }}
    >
      <div className="filter-row">
        {PRIORITIES.map((p) => (
          <button key={p} className={prio === p ? 'active' : ''} onClick={() => setPrio(p)}>{p}</button>
        ))}
      </div>
      <div className="filter-row">
        {MEDIA.map((m) => (
          <button key={m} className={media === m ? 'active btn-green' : ''} onClick={() => setMedia(m)}>{m}</button>
        ))}
      </div>
      {items.map((e) => (
        <div key={e.id} className={`feed-item prio-${e.priority}`}>
          <div className="feed-top">
            <span className="chip chip-muted">{e.source}</span>
            <span className="chip chip-cyan">{e.tag}</span>
            <StatusBadge status={e.priority} />
            <span className="feed-time">{e.time}</span>
          </div>
          <div className="feed-summary">{e.summary}</div>
          <div className="feed-src">{e.sourceName} · conf {(e.confidence * 100).toFixed(0)}%</div>
        </div>
      ))}
      {items.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 10 }}>No events match current filters.</div>}
    </HudCard>
  )
}
