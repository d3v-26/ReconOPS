import { useState } from 'react'
import { Download, Loader2, Sparkles, Map as MapIcon } from 'lucide-react'
import { useOperation } from '../context/OperationContext.jsx'
import { aarReport, mission, evidenceSources } from '../data/mockData.js'
import { exportReport, reportStats } from '../lib/report.js'

// End-of-operation screen, shown over the map like an end-of-round summary.
export default function Debrief() {
  const ops = useOperation()
  const [thinking, setThinking] = useState(false)
  const [hidden, setHidden] = useState(false)
  if (ops.phase !== 'DEBRIEF') return null
  if (hidden) return <button className="debrief-reopen" onClick={() => setHidden(false)}>After-action report</button>

  const generate = () => { setThinking(true); setTimeout(() => { setThinking(false); ops.setReportFiled(true) }, 1200) }
  const pct = Math.round(ops.confidence * 100)

  return (
    <div className="debrief">
      <div className="debrief-inner">
        <div className="verdict">
          <span className="eyebrow">{mission.title} · Complete</span>
          <h2>Staging confirmed</h2>
          <p>“{mission.question}” — <b>Yes</b>, at {pct}% confidence from {ops.evidence.length} independent sources. No escalation.</p>
        </div>

        <div className="d-stats">
          {reportStats(ops).map((s) => <div key={s.label}><b className="mono">{s.value}</b><span>{s.label}</span></div>)}
        </div>

        <div className="d-cols">
          <div>
            <h4>Evidence</h4>
            <ul className="d-evidence">
              {evidenceSources.filter((s) => ops.evidence.includes(s.id)).map((s) => <li key={s.id}><b>{s.label}</b>{s.finding}</li>)}
            </ul>
            <h4>Timeline</h4>
            <ol className="d-timeline">
              {aarReport.timeline.map((t) => <li key={t.t} className={`sev-${t.sev}`}><span className="mono">{t.t}</span>{t.label}</li>)}
            </ol>
          </div>
          <div>
            <h4>After-action synthesis</h4>
            {!ops.reportFiled ? (
              <button className="act act-primary" onClick={generate} disabled={thinking}>
                {thinking ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />} Generate report
              </button>
            ) : (
              <div className="aar">
                <h5>Findings</h5><p>{aarReport.findings}</p>
                <h5>Lessons</h5><p>{aarReport.lessons}</p>
                <h5>Recommendation</h5><p className="aar-rec">{aarReport.recommendation}</p>
              </div>
            )}
          </div>
        </div>

        <div className="d-actions">
          <button className="act" onClick={() => setHidden(true)}><MapIcon size={14} /> Back to map</button>
          <button className="act act-primary" disabled={!ops.reportFiled} onClick={() => exportReport(ops)}><Download size={14} /> Export .md</button>
        </div>
      </div>
    </div>
  )
}
