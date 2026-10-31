import { useEffect, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Crosshair } from 'lucide-react'
import { entities, byId } from '../data/entities.js'
import { mapZones, mapPaths, plan, AO } from '../data/mockData.js'
import { toLatLng, fromLatLng, pctToMeters, aoBounds, HEX } from '../lib/geo.js'
import { iconFor } from '../lib/kinds.js'
import { useOperation } from '../context/OperationContext.jsx'
import { getNextStep } from '../lib/nextStep.js'

export const TILE_URL = 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}'

const svg = (Icon, color, size = 15) => renderToStaticMarkup(<Icon size={size} strokeWidth={2.2} color={color} />)

// Marker frame shape follows the NATO symbology convention:
// friendly = rounded box, hostile = diamond, unknown = circle, neutral = square.
function entityIcon(e, st) {
  const color = st.dim ? HEX.muted : st.alert ? HEX.hostile : HEX[e.side]
  const cls = ['ent', `ent-${e.side}`, st.dim && 'is-dim', st.pulse && 'is-pulse', st.alert && 'is-alert', st.sel && 'is-sel',
    st.label && 'show-label', st.ctrl && 'is-ctrl', st.warn && 'is-warn', st.obj && 'is-obj'].filter(Boolean).join(' ')
  return L.divIcon({
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    html: `<div class="${cls}"><div class="ent-frame">${svg(iconFor(e), color)}</div>`
      + `${st.obj ? '<div class="obj-marker"><span>◆</span></div>' : ''}`
      + `<div class="ent-label">${e.name}${st.tag ? `<em>${st.tag}</em>` : ''}</div></div>`,
  })
}

const spotIcon = L.divIcon({ className: '', iconSize: [34, 34], iconAnchor: [17, 17], html: `<div class="spot-mark">${svg(Crosshair, HEX.gold, 30)}</div>` })
const pingIcon = (label) => L.divIcon({ className: '', iconSize: [20, 20], iconAnchor: [10, 10], html: `<div class="ping-mark"><i></i><span>${label}</span></div>` })

/**
 * Full-screen tactical map. The only two ways in: click an entity (select it) or click
 * the ground (spot report — or a waypoint when driving a remote-controlled asset).
 */
export default function TacticalMap() {
  const ops = useOperation()
  const elRef = useRef(null)
  const mapRef = useRef(null)
  const layers = useRef({})
  const markers = useRef({}) // id -> { marker, key }
  const opsRef = useRef(ops)
  opsRef.current = ops

  // create the map once
  useEffect(() => {
    const map = L.map(elRef.current, { zoomControl: false, attributionControl: true, keyboard: true, minZoom: 14, maxZoom: 18 }) // integer zoom only: fractional zoom leaves hairline tile seams
    L.tileLayer(TILE_URL, { maxNativeZoom: 16, maxZoom: 18, attribution: AO.imageryCredit }).addTo(map)
    map.attributionControl.setPrefix(false)
    map.setView(toLatLng(56, 50), elRef.current.clientWidth > 1100 ? 15 : 14)
    map.setMaxBounds(L.latLngBounds(aoBounds).pad(0.3))
    map.on('click', (ev) => {
      const o = opsRef.current
      const p = fromLatLng(ev.latlng)
      if (o.controlled) {
        o.moveEntity(o.controlled, p)
        o.ping(p.x, p.y, 'WAYPOINT')
        o.say(byId[o.controlled].name, 'Moving to waypoint.')
      } else {
        o.selectSpot(p.x, p.y)
      }
    })
    const g = (pane) => L.layerGroup([], pane ? { pane } : undefined).addTo(map)
    layers.current = { zones: g(), lines: g(), ents: g(), marks: g() }
    markers.current = {} // StrictMode remounts the map; cached markers would belong to the removed one

    mapZones.forEach((z) => {
      L.circle(toLatLng(z.x, z.y), {
        radius: pctToMeters(z.r), color: HEX[z.tone], weight: 1.2, dashArray: z.kind === 'safe' ? '6 6' : '2 5',
        fillColor: HEX[z.tone], fillOpacity: z.kind === 'geofence' ? 0.08 : 0.04, interactive: false,
      }).addTo(layers.current.zones)
      L.marker(toLatLng(z.x, z.y - z.r * 1.2), { interactive: false, icon: L.divIcon({ className: '', html: `<div class="zone-label" style="color:${HEX[z.tone]}">${z.name}</div>` }) }).addTo(layers.current.zones)
    })
    mapPaths.forEach((p) => {
      L.polyline(p.points.map(([x, y]) => toLatLng(x, y)), { color: HEX[p.tone], weight: 2, opacity: 0.6, dashArray: '8 6', interactive: false }).addTo(layers.current.zones)
    })

    mapRef.current = map
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(elRef.current)
    return () => { ro.disconnect(); map.remove() }
  }, [])

  const { pos, links, selected, controlled, planProposed, planApproved, pings, phase, alertOf, statusOf } = ops
  const focus = getNextStep(ops).focus

  // entities: create once, then only move / re-icon when their visual state changes
  useEffect(() => {
    const g = layers.current.ents
    entities.forEach((e) => {
      const link = e.asset ? links[e.id] : 'linked'
      const a = alertOf(e.id)
      const open = a && statusOf(a.id) === 'Open' && phase === 'EXECUTION'
      const sel = selected?.type === 'entity' && selected.id === e.id
      const st = {
        dim: link === 'pending' || e.offline,
        pulse: link === 'handshake' || (open && a.severity === 'Critical'),
        alert: open,
        sel,
        ctrl: controlled === e.id,
        warn: e.degraded && link === 'linked',
        obj: focus === e.id,
        label: sel || e.objective || open || focus === e.id || controlled === e.id,
        tag: e.offline ? 'OFFLINE' : link === 'pending' ? 'NO LINK' : link === 'handshake' ? 'LINKING' : controlled === e.id ? 'REMOTE' : open ? a.severity.toUpperCase() : '',
      }
      const key = JSON.stringify(st)
      const ll = toLatLng(pos[e.id].x, pos[e.id].y)
      let m = markers.current[e.id]
      if (!m) {
        const marker = L.marker(ll, { icon: entityIcon(e, st), zIndexOffset: e.objective ? 200 : e.side === 'hostile' ? 400 : 0, riseOnHover: true })
          .on('click', (ev) => { L.DomEvent.stopPropagation(ev); opsRef.current.select(e.id) })
          .addTo(g)
        markers.current[e.id] = m = { marker, key }
      } else {
        if (m.key !== key) { m.marker.setIcon(entityIcon(e, st)); m.key = key }
        m.marker.setLatLng(ll)
      }
      m.marker.setZIndexOffset(sel || st.obj ? 1000 : e.objective ? 200 : e.side === 'hostile' ? 400 : 0)
    })
  }, [pos, links, selected, controlled, focus, phase, alertOf, statusOf])

  // tasking lines + CONTACT-X trail
  useEffect(() => {
    const g = layers.current.lines
    g.clearLayers()
    if (planProposed) {
      plan.taskings.forEach((t) => {
        const a = pos[t.asset]
        const b = pos[t.target]
        L.polyline([toLatLng(a.x, a.y), toLatLng(b.x, b.y)], {
          color: planApproved ? HEX.friendly : HEX.gold, weight: planApproved ? 1.2 : 1.8, opacity: planApproved ? 0.45 : 0.9,
          dashArray: planApproved ? null : '4 6', interactive: false, className: planApproved ? '' : 'line-anim',
        }).addTo(g)
      })
    }
    if (phase === 'EXECUTION' || phase === 'DEBRIEF') {
      const trail = byId.CX.path.filter(([x]) => x >= pos.CX.x).map(([x, y]) => toLatLng(x, y))
      L.polyline([...trail, toLatLng(pos.CX.x, pos.CX.y)], { color: HEX.hostile, weight: 2, opacity: 0.7, dashArray: '3 5', interactive: false }).addTo(g)
    }
  }, [planProposed, planApproved, pos, phase])

  // spot cursor + pings
  useEffect(() => {
    const g = layers.current.marks
    g.clearLayers()
    if (selected?.type === 'spot') L.marker(toLatLng(selected.x, selected.y), { icon: spotIcon, interactive: false }).addTo(g)
    pings.forEach((p) => L.marker(toLatLng(p.x, p.y), { icon: pingIcon(p.label), interactive: false }).addTo(g))
  }, [selected, pings])

  // keep the selected entity in view (integer zoom only)
  const selId = selected?.type === 'entity' ? selected.id : null
  useEffect(() => {
    const map = mapRef.current
    if (!map || !selId) return
    const ll = L.latLng(toLatLng(pos[selId].x, pos[selId].y))
    const pad = L.point(map.getSize().x * 0.22, map.getSize().y * 0.18)
    const inner = L.bounds(pad, map.getSize().subtract(pad))
    if (!inner.contains(map.latLngToContainerPoint(ll))) map.panTo(ll, { animate: true, duration: 0.5 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selId])

  return <div ref={elRef} className={`tac-map ${controlled ? 'driving' : ''}`} />
}
