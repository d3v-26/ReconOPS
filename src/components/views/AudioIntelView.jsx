import { useEffect, useRef, useState } from 'react'
import StatusBadge from '../StatusBadge.jsx'
import { audioSegments, transcript, audioMeta } from '../../data/mockData.js'

// Canvas waveform + spectrum, procedurally animated when "playing".
function WaveCanvas({ playing }) {
  const ref = useRef(null)
  const raf = useRef(0)
  const t = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')

    const draw = () => {
      const { width: w, height: h } = canvas.getBoundingClientRect()
      if (canvas.width !== w * 2) { canvas.width = w * 2; canvas.height = h * 2; ctx.scale(2, 2) }
      ctx.clearRect(0, 0, w, h)
      if (playing) t.current += 0.045

      // waveform
      const mid = h * 0.35
      ctx.beginPath()
      for (let x = 0; x <= w; x += 2) {
        const p = x / w
        const env = Math.sin(p * Math.PI) ** 0.6
        const y = mid +
          Math.sin(p * 40 + t.current * 3) * 10 * env * (0.5 + 0.5 * Math.sin(t.current + p * 9)) +
          Math.sin(p * 90 - t.current * 5) * 5 * env
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(61,214,232,0.9)'
      ctx.lineWidth = 1.2
      ctx.shadowColor = 'rgba(61,214,232,0.6)'
      ctx.shadowBlur = 6
      ctx.stroke()
      ctx.shadowBlur = 0

      // mirrored ghost
      ctx.beginPath()
      for (let x = 0; x <= w; x += 3) {
        const p = x / w
        const env = Math.sin(p * Math.PI) ** 0.6
        const y = mid - Math.sin(p * 40 + t.current * 3) * 10 * env
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(61,214,232,0.2)'
      ctx.stroke()

      // spectrum bars
      const bars = 48
      const bw = w / bars
      for (let i = 0; i < bars; i++) {
        const v = playing
          ? Math.abs(Math.sin(i * 0.55 + t.current * 2.4) * Math.sin(i * 0.13 + t.current)) * 0.85 + 0.05
          : 0.06 + (i % 5) * 0.015
        const bh = v * h * 0.34
        const hot = v > 0.7
        ctx.fillStyle = hot ? 'rgba(255,180,84,0.9)' : 'rgba(52,209,123,0.65)'
        ctx.fillRect(i * bw + 1, h - bh - 4, bw - 2, bh)
        ctx.fillStyle = 'rgba(52,209,123,0.18)'
        ctx.fillRect(i * bw + 1, h - v * h * 0.34 - 8, bw - 2, 2)
      }
      raf.current = requestAnimationFrame(draw)
    }
    raf.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf.current)
  }, [playing])

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}

export default function AudioIntelView() {
  const [playing, setPlaying] = useState(true)
  const [showWave, setShowWave] = useState(true)
  const [showTranscript, setShowTranscript] = useState(true)
  const [translated, setTranslated] = useState(false)
  const [aiOutput, setAiOutput] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [cursor, setCursor] = useState(0)
  const dur = audioMeta.duration

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setCursor((c) => (c + 0.25) % dur), 250)
    return () => clearInterval(id)
  }, [playing, dur])

  const runAI = (text) => {
    setThinking(true)
    setAiOutput(null)
    setTimeout(() => { setThinking(false); setAiOutput(text) }, 1100)
  }

  return (
    <div className="view-layout">
      <div className="view-main">
        <div className="view-controls">
          <button className={playing ? 'active btn-green' : 'btn-green'} onClick={() => setPlaying(!playing)}>
            {playing ? '❚❚ Pause' : '▶ Play'}
          </button>
          <button className={showWave ? 'active' : ''} onClick={() => setShowWave(!showWave)}>Waveform</button>
          <button className={showTranscript ? 'active' : ''} onClick={() => setShowTranscript(!showTranscript)}>Transcript</button>
          <button className={translated ? 'active btn-amber' : 'btn-amber'} onClick={() => setTranslated(!translated)}>Translate</button>
          <button onClick={() => runAI(audioMeta.summary)}>Summarize Audio</button>
          <button onClick={() => runAI(audioMeta.anomalies)}>Detect Anomalies</button>
        </div>

        {showWave && (
          <div className="stage" style={{ minHeight: 170, flex: 'unset', height: 190 }}>
            <WaveCanvas playing={playing} />
            <div className="stage-label"><span className="rec-dot" />EARSHOT-A · CH.2 · {playing ? 'LIVE CAPTURE' : 'PAUSED'}</div>
            <div style={{ position: 'absolute', bottom: 6, right: 10, fontSize: 9, color: 'var(--muted)', zIndex: 6 }}>
              00:{String(Math.floor(cursor)).padStart(2, '0')} / 00:{dur}
            </div>
          </div>
        )}

        <div>
          <div className="mini-title">
            SAM-H AUDIO SEGMENTATION
            <span style={{ color: 'var(--muted)', letterSpacing: '0.05em' }}>{audioMeta.language}</span>
          </div>
          <div className="audio-track">
            {audioSegments.map((s) => (
              <div
                key={s.id}
                className="audio-seg"
                title={`${s.label} · ${(s.confidence * 100).toFixed(0)}%`}
                style={{ left: `${(s.start / dur) * 100}%`, width: `${((s.end - s.start) / dur) * 100}%`, color: s.color }}
              />
            ))}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, width: 1, background: 'var(--green)',
              boxShadow: '0 0 6px var(--green)', left: `${(cursor / dur) * 100}%`, transition: 'left 0.25s linear',
            }} />
          </div>
          <div className="audio-seg-label">
            {audioSegments.map((s) => (
              <i key={s.id} style={{ color: s.color }}>{s.label} {(s.confidence * 100).toFixed(0)}%</i>
            ))}
          </div>
        </div>

        {thinking && <div className="thinking">LLM PROCESSING AUDIO CONTEXT <i /><i /><i /></div>}
        {aiOutput && <div className="ai-text">{aiOutput}</div>}

        {showTranscript && (
          <div style={{ overflowY: 'auto', minHeight: 0 }}>
            <div className="mini-title">
              TRANSCRIPT {translated && <span style={{ color: 'var(--amber)' }}>· TRANSLATED (EN)</span>}
            </div>
            {transcript.map((line, i) => (
              <div className="transcript-line" key={i}>
                <span className="tt">{line.t}</span>
                <span className="spk" style={{
                  color: line.speaker === 'Speaker A' ? 'var(--cyan)'
                    : line.speaker === 'Speaker B' ? 'var(--green)'
                    : line.speaker.startsWith('Unknown') ? 'var(--red)' : 'var(--muted)',
                }}>{line.speaker}</span>
                <span className="txt">{translated ? line.translated : line.text}</span>
                <span className="cf">{(line.conf * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="view-side">
        <div>
          <div className="mini-title">SIGNAL META</div>
          <div className="kv"><span className="k">Source</span><span className="v">EARSHOT-A ch.2</span></div>
          <div className="kv"><span className="k">Duration</span><span className="v">00:{dur}</span></div>
          <div className="kv"><span className="k">Language</span><span className="v">Foreign Lang A</span></div>
          <div className="kv"><span className="k">Detect Conf</span><span className="v">86%</span></div>
          <div className="kv"><span className="k">Speakers</span><span className="v">2 + unknown</span></div>
          <div className="kv"><span className="k">Transcript Conf</span><span className="v">87% mean</span></div>
        </div>
        <div>
          <div className="mini-title">DETECTED EVENTS</div>
          {audioSegments.filter((s) => s.kind === 'event').map((s) => (
            <div key={s.id} className="rec-row">
              <span style={{ color: s.color }}>◉ {s.label}</span>
              <div style={{ color: 'var(--muted)', marginTop: 2 }}>
                00:{String(s.start).padStart(2, '0')}–00:{String(s.end).padStart(2, '0')} · conf {(s.confidence * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="mini-title">PRIORITY FLAG <StatusBadge status="High" /></div>
          <div className="ai-text amber">Ridge reflection mention at 00:16 correlates with photo anomaly SEG-05. Cross-modal link established.</div>
        </div>
      </aside>
    </div>
  )
}
