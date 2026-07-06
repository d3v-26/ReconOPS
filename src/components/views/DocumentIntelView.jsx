import { useState } from 'react'
import StatusBadge from '../StatusBadge.jsx'
import { documents } from '../../data/mockData.js'

export default function DocumentIntelView() {
  const [doc, setDoc] = useState(documents[0])
  const [translated, setTranslated] = useState(false)
  const [aiOutput, setAiOutput] = useState(null)
  const [thinking, setThinking] = useState(false)

  const runAI = (text) => {
    setThinking(true); setAiOutput(null)
    setTimeout(() => { setThinking(false); setAiOutput(text) }, 1000)
  }

  return (
    <div className="view-layout">
      <div className="view-main">
        <div className="view-controls doc-tabs">
          {documents.map((d) => (
            <button key={d.id} className={doc.id === d.id ? 'active' : ''}
              onClick={() => { setDoc(d); setTranslated(false); setAiOutput(null) }}>
              {d.id} · {d.type}
            </button>
          ))}
          <span style={{ flex: 1 }} />
          <button className={translated ? 'active btn-amber' : 'btn-amber'} onClick={() => setTranslated(!translated)}>Translate</button>
          <button className="btn-green" onClick={() => runAI(doc.summary)}>LLM Summary</button>
        </div>

        <div className="doc-body">
          <div className="classification">{doc.classification} · {doc.title}</div>
          {translated ? doc.translated : doc.body}
        </div>

        {thinking && <div className="thinking">LLM EXTRACTING DOCUMENT INTEL <i /><i /><i /></div>}
        {aiOutput && <div className="ai-text">{aiOutput}</div>}

        <div>
          <div className="mini-title">EXTRACTED ENTITIES ({doc.entities.length})</div>
          <div>
            {doc.entities.map((e, i) => (
              <span key={i} className="entity-chip">
                <span className="ek">{e.kind}</span>
                <span className="ev">{e.value}</span>
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="mini-title">RISK ASSESSMENT <StatusBadge status="High" /></div>
          <div className="ai-text amber">{doc.risks}</div>
        </div>
      </div>

      <aside className="view-side">
        <div>
          <div className="mini-title">DOCUMENT META</div>
          <div className="kv"><span className="k">Doc ID</span><span className="v" style={{ color: 'var(--cyan)' }}>{doc.id}</span></div>
          <div className="kv"><span className="k">Type</span><span className="v">{doc.type}</span></div>
          <div className="kv"><span className="k">Tags</span><span className="v">{doc.classification}</span></div>
          <div className="kv"><span className="k">Language</span><span className="v">{translated ? 'EN (translated)' : 'Original'}</span></div>
          <div className="kv"><span className="k">Entities</span><span className="v">{doc.entities.length}</span></div>
        </div>
        <div>
          <div className="mini-title">ACTION ITEMS</div>
          {doc.actions.map((a, i) => (
            <div key={i} className="rec-row">
              <span style={{ color: 'var(--green)' }}>▸</span> {a}
            </div>
          ))}
        </div>
        <div>
          <div className="mini-title">CROSS-REFERENCES</div>
          <div className="ai-text">Entities fused with map layer THR-2 and coordinate cluster CL-1. Two other documents corroborate the 14:00–15:00Z window.</div>
        </div>
      </aside>
    </div>
  )
}
