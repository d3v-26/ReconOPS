import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { entities } from '../data/entities.js'
import { photoSegments, transcript } from '../data/mockData.js'
import { toLatLng, distM, bearing, formatLatLng } from '../lib/geo.js'
import { TILE_URL } from './TacticalMap.jsx'
import { useOperation } from '../context/OperationContext.jsx'

const STILL = `${import.meta.env.BASE_URL}imagery/s3-still.jpg`
const fmtClock = (s) => `${String(Math.floor(s / 3600) % 24).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}Z`

// Which sensor shows an entity, and where it looks.
// Sensors show their own feed; everything else is shown through the closest
// linked drone (preferred) or camera that is in range.
export function resolveFeed(e, ops, p = ops.pos[e.id]) {
  if (e.feed) {
    if (e.feed.type === 'none' || e.offline) return { source: e, type: 'none' }
    if (!ops.isLinked(e.id)) return { source: e, type: 'nolink' }
    let look = e.feed.look
    if (look) {
      const moved = distM(p, e) > 40
      look = e.feed.type === 'aerial' && moved ? p : { x: p.x + (look.x - e.x), y: p.y + (look.y - e.y) }
    }
    return { source: e, ...e.feed, look }
  }
  const viewers = entities
    .filter((s) => s.feed && ['aerial', 'oblique'].includes(s.feed.type) && !s.offline && ops.isLinked(s.id))
    .map((s) => ({ s, d: distM(ops.pos[s.id], p) - (s.feed.type === 'aerial' ? 1500 : 0) }))
    .filter(({ s, d }) => d < (s.feed.type === 'aerial' ? 2500 : 1800))
    .sort((a, b) => a.d - b.d)
  if (!viewers.length) return { source: null, type: 'nocover' }
  const s = viewers[0].s
  return { source: s, via: true, ...s.feed, look: p, zoom: s.feed.type === 'aerial' ? 18 : 16, heading: s.feed.type === 'aerial' ? 0 : bearing(ops.pos[s.id], p) }
}

// Compass ribbon — the camera's heading, CoD-HUD style.
function Compass({ heading }) {
  const ticks = []
  for (let d = -60; d <= 60; d += 15) {
    const deg = (heading + d + 360) % 360
    const label = { 0: 'N', 90: 'E', 180: 'S', 270: 'W', 45: 'NE', 135: 'SE', 225: 'SW', 315: 'NW' }[deg]
    ticks.push(<span key={d} style={{ left: `${50 + (d / 60) * 50}%` }} className={label ? 'major' : ''}>{label || deg}</span>)
  }
  return <div className="compass">{ticks}<b>{String(heading).padStart(3, '0')}</b></div>
}

// Live imagery feed: a non-interactive Leaflet view of the real ground under the sensor,
// with every entity in frame drawn as a track box. CSS tilts it for oblique / helmet views.
function MapFeed({ feed, focusId }) {
  const ops = useOperation()
  const elRef = useRef(null)
  const mapRef = useRef(null)
  const boxes = useRef({})
  const { look, zoom, type } = feed

  useEffect(() => {
    const map = L.map(elRef.current, {
      zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false,
      boxZoom: false, keyboard: false, touchZoom: false, zoomAnimation: false, fadeAnimation: false, inertia: false,
    })
    L.tileLayer(TILE_URL, { maxNativeZoom: 16, maxZoom: 19 }).addTo(map)
    map.setView(toLatLng(look.x, look.y), zoom)
    mapRef.current = map
    boxes.current = {}
    return () => map.remove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feed.source?.id, type])

  useEffect(() => { mapRef.current?.setView(toLatLng(look.x, look.y), zoom, { animate: false }) }, [look.x, look.y, zoom])

  // track boxes for everything within ~600 m of where the sensor looks
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    entities.forEach((e) => {
      if (e.id === feed.source?.id || e.kind === 'satellite') return
      const p = ops.pos[e.id]
      const near = distM(p, look) < 650
      let m = boxes.current[e.id]
      if (!near) { if (m) { m.remove(); delete boxes.current[e.id] } return }
      const ll = toLatLng(p.x, p.y)
      if (!m) {
        const cls = `trk trk-${e.side} ${e.id === focusId ? 'trk-focus' : ''} ${e.kind === 'structure' ? 'trk-big' : ''}`
        m = L.marker(ll, { interactive: false, icon: L.divIcon({ className: '', iconSize: [0, 0], html: `<div class="${cls}"><span>${e.name}</span></div>` }) }).addTo(map)
        boxes.current[e.id] = m
      } else m.setLatLng(ll)
    })
  }, [ops.pos, look, feed.source?.id, focusId])

  return (
    <div className={`feed-map-wrap feed-${type}`}>
      <div ref={elRef} className="feed-map" />
    </div>
  )
}

function StillFeed() {
  return (
    <div className="feed-still">
      <img src={STILL} alt="KEYHOLE-9 frame 2231 over Warehouse S-3" draggable={false} />
      {photoSegments.map((s) => (
        <div key={s.id} className={`seg seg-${s.tone}`} style={{ left: `${s.box.x}%`, top: `${s.box.y}%`, width: `${s.box.w}%`, height: `${s.box.h}%` }}>
          <span>{s.label} · {Math.round(s.confidence * 100)}</span>
        </div>
      ))}
    </div>
  )
}

// Scrolling spectrogram waterfall, procedural.
function AudioFeed({ withTranscript, translated }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let t = 0
    let raf
    const draw = () => {
      const { width: w, height: h } = canvas
      t += 0.06
      ctx.drawImage(canvas, -2, 0)
      for (let y = 0; y < h; y += 2) {
        const f = y / h
        const v = Math.max(0, Math.sin(f * 14 + t * 2.2) * 0.4 + Math.sin(f * 40 - t * 3.1) * 0.25
          + (f > 0.62 && f < 0.7 ? 0.5 : 0) + (Math.sin(t * 0.9) > 0.8 && f > 0.15 && f < 0.35 ? 0.7 : 0) + Math.random() * 0.2 - 0.3)
        const c = Math.min(1, v)
        ctx.fillStyle = c > 0.6 ? `rgba(255,176,32,${c})` : c > 0.3 ? `rgba(76,201,240,${c})` : `rgba(12,30,40,${0.5 + c})`
        ctx.fillRect(w - 2, y, 2, 2)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])
  const [line, setLine] = useState(0)
  useEffect(() => {
    if (!withTranscript) return
    const id = setInterval(() => setLine((l) => (l + 1) % (transcript.length + 2)), 1800)
    return () => clearInterval(id)
  }, [withTranscript])
  return (
    <div className="feed-audio">
      <canvas ref={ref} width={480} height={150} />
      {withTranscript ? (
        <ol className="transcript">
          {transcript.slice(0, Math.max(1, line)).slice(-3).map((l) => (
            <li key={l.t}><span className="mono">{l.t}</span><b>{l.speaker}</b>{translated ? l.translated : l.text}</li>
          ))}
        </ol>
      ) : <div className="transcript dim">Burst transmissions · language ID pending</div>}
    </div>
  )
}

/** The feed panel inside an entity card. */
export default function Feed({ entity, at, translated }) {
  const ops = useOperation()
  const feed = resolveFeed(entity, ops, at)
  const src = feed.source
  const degraded = src?.degraded
  const heading = feed.heading ?? 0
  const mode = ops.thermal ? 'WHT HOT' : feed.type === 'helmet' ? 'NV' : 'EO'
  const latlng = useMemo(() => (feed.look ? formatLatLng(toLatLng(feed.look.x, feed.look.y)) : ''), [feed.look])

  if (feed.type === 'none') return <div className="feed feed-dead"><div className="static" /><b>NO SIGNAL</b><span>{entity.status}</span></div>
  if (feed.type === 'nolink') return <div className="feed feed-dead"><div className="static" /><b>NO LINK</b><span>Link this asset to see its feed</span></div>
  if (feed.type === 'nocover') return <div className="feed feed-dead"><div className="static" /><b>NO COVERAGE</b><span>No linked sensor can see this — send a drone</span></div>

  const isImg = ['aerial', 'oblique', 'helmet'].includes(feed.type)
  return (
    <div className={`feed ${isImg && ops.thermal ? 'is-thermal' : ''} ${degraded ? 'is-degraded' : ''}`}>
      {isImg && <MapFeed feed={feed} focusId={entity.id} />}
      {feed.type === 'still' && <StillFeed />}
      {feed.type === 'audio' && <AudioFeed withTranscript={feed.transcript} translated={translated} />}
      {degraded && <div className="static light" />}

      {/* HUD overlay */}
      <div className="feed-hud">
        <div className="fh-tl"><i className="rec" />{src.name}{feed.via && <em> · VIA</em>} <span>{feed.sensor}</span></div>
        <div className="fh-tr mono">{fmtClock(ops.simSec)}</div>
        {isImg && <Compass heading={heading} />}
        {isImg && <div className="reticle"><i /><i /><i /><i /></div>}
        <div className="fh-bl mono">{latlng}</div>
        <div className="fh-br mono">{isImg ? `${mode} · Z${feed.zoom}` : feed.type === 'still' ? 'SEG 5' : 'LIVE'}{degraded && <b> · SIG 43%</b>}</div>
        <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
      </div>
    </div>
  )
}
