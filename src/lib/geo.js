import { AO } from '../data/mockData.js'

// Positions in data are % of the AO box; convert to real lat/lng for the map.
const { north, south, west, east } = AO.bounds

export const toLatLng = (x, y) => [north - (y / 100) * (north - south), west + (x / 100) * (east - west)]
export const fromLatLng = ({ lat, lng }) => ({ x: ((lng - west) / (east - west)) * 100, y: ((north - lat) / (north - south)) * 100 })

const heightM = (north - south) * 111320
const widthM = (east - west) * 111320 * Math.cos(((north + south) / 2) * Math.PI / 180)
// radius given as % of AO width → metres
export const pctToMeters = (r) => (r / 100) * widthM

export const distM = (a, b) => Math.hypot(((b.x - a.x) / 100) * widthM, ((b.y - a.y) / 100) * heightM)
export const bearing = (a, b) => (Math.round(Math.atan2(((b.x - a.x) / 100) * widthM, ((a.y - b.y) / 100) * heightM) * 180 / Math.PI) + 360) % 360
export const fmtDist = (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m / 10) * 10} m`)

export const formatLatLng = ([lat, lng]) => `${lat.toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° W`
// Fictional 8-figure grid, consistent with the "QT 4412 8867" references in the reports.
export const grid = (x, y) => `QT ${String(Math.round(3800 + x * 12)).padStart(4, '0')} ${String(Math.round(9400 - y * 10)).padStart(4, '0')}`

export const aoBounds = [[south, west], [north, east]]

// Hex mirrors of the CSS tokens — Leaflet writes colors as SVG attributes, where var() doesn't resolve.
export const HEX = {
  friendly: '#4cc9f0', hostile: '#ff4d4f', unknown: '#f5c542', neutral: '#e8edf3', gold: '#ffb020',
  red: '#ff4d4f', amber: '#f5c542', green: '#3ddc97', cyan: '#4cc9f0', muted: '#7c8696', white: '#e8edf3',
}
