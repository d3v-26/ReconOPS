import { useEffect, useState } from 'react'
import StatusBadge from './StatusBadge.jsx'
import { feedEvents } from '../data/mockData.js'
import { useOperation } from '../context/OperationContext.jsx'

const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low']
const MEDIA = ['All', 'Photo', 'Audio', 'Video', 'Map', '3D', 'Document', 'Sensor']
const SOURCE_MODE = { Photo: 'photo', Audio: 'audio', Video: 'video', Map: 'map', '3D': '3d', Document: 'docs', Sensor: 'map' }

export default function IntelligenceFeed() {
  const { feedFilters, setFeedFilters, setMode, phase } = useOperation()
  const { prio, media } = feedFilters
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
    <div className="list-panel">
      <div className="filter-bar">
        <select value={prio} onChange={(e) => setFeedFilters((f) => ({ ...f, prio: e.target.value }))} aria-label="Priority">
          {PRIORITIES.map((p) => <option key={p} value={p}>{p === 'All' ? 'All priorities' : p}</option>)}
        </select>
        <select value={media} onChange={(e) => setFeedFilters((f) => ({ ...f, media: e.target.value }))} aria-label="Source">
          {MEDIA.map((m) => <option key={m} value={m}>{m === 'All' ? 'All sources' : m}</option>)}
        </select>
        <span className="live-dot">Live</span>
      </div>
      {items.map((e) => (
        <button
          key={e.id}
          className={`feed-item prio-${e.priority}`}
          disabled={phase !== 'EXECUTION'}
          title="Open the source in the workspace"
          onClick={() => setMode(SOURCE_MODE[e.source] || 'map')}
        >
          <span className="feed-top">
            <span className="feed-src">{e.source}</span>
            <StatusBadge status={e.priority} />
            <span className="feed-time mono">{e.time}</span>
          </span>
          <span className="feed-summary">{e.summary}</span>
          <span className="feed-meta">{e.sourceName} · {e.tag} · {Math.round(e.confidence * 100)}%</span>
        </button>
      ))}
      {items.length === 0 && <div className="empty"><span>No events match the filters.</span></div>}
    </div>
  )
}
