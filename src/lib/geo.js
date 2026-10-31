import { AO } from '../data/mockData.js'

// Positions in mock data are % of the AO box; convert to real lat/lng for the map.
const { north, south, west, east } = AO.bounds

export const toLatLng = (x, y) => [north - (y / 100) * (north - south), west + (x / 100) * (east - west)]

// radius given as % of AO width → metres
const widthM = (east - west) * 111320 * Math.cos(((north + south) / 2) * Math.PI / 180)
export const pctToMeters = (r) => (r / 100) * widthM

export const formatLatLng = ([lat, lng]) => `${lat.toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° W`

export const aoBounds = [[south, west], [north, east]]

// Hex mirrors of the CSS tokens — Leaflet writes colors as SVG attributes, where var() doesn't resolve.
export const HEX = {
  red: '#ff5a5f', amber: '#f5b041', green: '#3ddc97', cyan: '#4cc9f0', muted: '#7c8696', white: '#e8edf3',
}
export const cssToHex = (c) => HEX[(c || '').replace(/var\(--(\w+)\)/, '$1')] || c
