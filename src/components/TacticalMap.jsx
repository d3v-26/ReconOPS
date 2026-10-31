import { useEffect, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Drone, Cctv, Mic, Truck, Users, ScanLine, Siren, Warehouse, Target, MapPin } from 'lucide-react'
import { assets, ASSET_POS, mapMarkers, mapZones, mapPaths, AO } from '../data/mockData.js'
import { toLatLng, pctToMeters, aoBounds, HEX, cssToHex } from '../lib/geo.js'

const TILE_URL = 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}'

const TYPE_ICON = { Drone, Camera: Cctv, 'Audio Sensor': Mic, Vehicle: Truck, 'Human Team': Users, '3D Scanner': ScanLine }
const LINK_TONE = { pending: 'muted', handshake: 'amber', linked: 'cyan' }
const PRIO_TONE = { High: 'red', Medium: 'amber', Low: 'green' }

function divIcon({ Icon, tone, label, cls = '' }) {
  const svg = renderToStaticMarkup(<Icon size={15} strokeWidth={2} color={HEX[tone]} />)
  return L.divIcon({
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    html: `<div class="mk mk-${tone} ${cls}">${svg}</div>${label ? `<div class="mk-label">${label}</div>` : ''}`,
  })
}

/**
 * Real-imagery tactical map of the AO.
 * show: { assets, targets, zones, paths, contact, pois } — which overlays to draw.
 * links: per-asset link state (stand-up shows assets coming online).
 * onPick(x, y): map click in AO % (planning target designation).
 * onSelect(name): entity click → dossier.
 */
export default function TacticalMap({ show = {}, links, targets = [], onPick, onSelect, selectedTarget, className = '' }) {
  const elRef = useRef(null)
  const mapRef = useRef(null)
  const overlayRef = useRef(null)
  const cbRef = useRef({})
  cbRef.current = { onPick, onSelect }

  // create the map once
  useEffect(() => {
    const map = L.map(elRef.current, { zoomControl: false, attributionControl: true, minZoom: 13, maxZoom: 18 }) // integer zoom only: fractional zoom leaves hairline tile seams
    L.tileLayer(TILE_URL, { maxNativeZoom: 16, maxZoom: 18, attribution: AO.imageryCredit }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    map.attributionControl.setPrefix(false)
    // open on Warehouse S-3 and its approaches; wide panes get the closer zoom
    map.setView(toLatLng(60, 52), elRef.current.clientWidth > 760 ? 15 : 14)
    map.setMaxBounds(L.latLngBounds(aoBounds).pad(0.4))
    map.on('click', (e) => {
      const { onPick: pick } = cbRef.current
      if (!pick) return
      const { north, south, west, east } = AO.bounds
      pick(((e.latlng.lng - west) / (east - west)) * 100, ((north - e.latlng.lat) / (north - south)) * 100)
    })
    overlayRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(elRef.current)
    return () => { ro.disconnect(); map.remove() }
  }, [])

  // redraw overlays whenever inputs change
  useEffect(() => {
    const g = overlayRef.current
    if (!g) return
    g.clearLayers()
    const select = (name) => () => cbRef.current.onSelect?.(name)

    if (show.zones) {
      mapZones.forEach((z) => {
        const color = cssToHex(z.color)
        L.circle(toLatLng(z.x, z.y), {
          radius: pctToMeters(z.r), color, weight: 1.5, dashArray: z.kind === 'safe' ? '6 6' : null,
          fillColor: color, fillOpacity: z.kind === 'geofence' ? 0.12 : 0.07,
        }).bindTooltip(z.name, { className: 'map-tip', direction: 'top' }).addTo(g)
      })
    }

    if (show.paths) {
      mapPaths.forEach((p) => {
        L.polyline(p.points.map(([x, y]) => toLatLng(x, y)), {
          color: cssToHex(p.color), weight: 2.5, dashArray: '8 6', className: 'path-anim',
        }).bindTooltip(p.label, { className: 'map-tip', sticky: true }).addTo(g)
      })
    }

    if (show.pois) {
      mapMarkers.filter((m) => m.kind === 'poi').forEach((m) => {
        L.marker(toLatLng(m.x, m.y), { icon: divIcon({ Icon: m.name.includes('WAREHOUSE') ? Warehouse : MapPin, tone: 'white', label: m.name }) })
          .on('click', select(m.name)).addTo(g)
      })
    }

    if (show.assets) {
      assets.forEach((a) => {
        const pos = ASSET_POS[a.id]
        if (!pos) return
        const st = links ? links[a.id] : 'linked'
        const tone = st === 'linked' && a.status === 'Degraded' ? 'amber' : st === 'linked' && a.status === 'Offline' ? 'red' : LINK_TONE[st]
        L.marker(toLatLng(pos.x, pos.y), {
          icon: divIcon({ Icon: TYPE_ICON[a.type] || MapPin, tone, label: a.name, cls: `mk-quiet ${st === 'handshake' ? 'mk-pulse' : st === 'pending' ? 'mk-off' : ''}` }),
        }).on('click', select(a.name)).addTo(g)
      })
    }

    if (show.contact) {
      const c = mapMarkers.find((m) => m.kind === 'threat')
      L.marker(toLatLng(c.x, c.y), { icon: divIcon({ Icon: Siren, tone: 'red', label: c.name, cls: 'mk-pulse' }) })
        .on('click', select(c.name)).addTo(g)
    }

    if (show.targets) {
      targets.forEach((t) => {
        const tone = PRIO_TONE[t.priority] || 'amber'
        L.marker(toLatLng(t.x, t.y), {
          icon: divIcon({ Icon: Target, tone, label: `${t.id} · ${t.name}`, cls: `mk-target ${selectedTarget === t.id ? 'mk-sel' : ''}` }),
          zIndexOffset: 500,
        }).on('click', (e) => { L.DomEvent.stopPropagation(e); cbRef.current.onSelect?.(t.id) }).addTo(g)
      })
    }
  }, [show.zones, show.paths, show.pois, show.assets, show.contact, show.targets, links, targets, selectedTarget])

  return <div ref={elRef} className={`tac-map ${onPick ? 'pickable' : ''} ${className}`} />
}
