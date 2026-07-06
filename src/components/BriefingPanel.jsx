import { useState } from 'react'
import HudCard from './HudCard.jsx'
import { briefings } from '../data/mockData.js'

export default function BriefingPanel() {
  const [idx, setIdx] = useState(0)
  const [thinking, setThinking] = useState(false)

  const brief = briefings[idx % briefings.length]

  const generate = () => {
    if (thinking) return
    setThinking(true)
    setTimeout(() => { setIdx((i) => i + 1); setThinking(false) }, 1400)
  }

  return (
    <HudCard
      title="Operator Briefing"
      right={<button className="btn-amber" onClick={generate}>Generate Briefing</button>}
      style={{ flex: 2, minHeight: 200 }}
    >
      {thinking ? (
        <div className="thinking" style={{ padding: '20px 0' }}>
          LLM SYNTHESIZING MULTIMODAL STREAMS <i /><i /><i />
        </div>
      ) : (
        <>
          <div className="brief-section"><div className="bs-label">Situation</div><div className="bs-text">{brief.situation}</div></div>
          <div className="brief-section"><div className="bs-label">Active Data Sources</div><div className="bs-text">{brief.sources}</div></div>
          <div className="brief-section"><div className="bs-label">Key Findings</div><div className="bs-text">{brief.findings}</div></div>
          <div className="brief-section"><div className="bs-label">Risks</div><div className="bs-text" style={{ color: 'var(--amber)' }}>{brief.risks}</div></div>
          <div className="brief-section"><div className="bs-label">Recommended Action</div><div className="bs-text">{brief.action}</div></div>
          <div className="brief-section"><div className="bs-label">Next Decision</div><div className="bs-text" style={{ color: 'var(--cyan)' }}>{brief.next}</div></div>
        </>
      )}
    </HudCard>
  )
}
