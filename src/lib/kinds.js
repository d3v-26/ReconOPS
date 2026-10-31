import { Drone, Cctv, Mic, Truck, User, Satellite, ScanLine, Warehouse, MapPin, Users, Package, HelpCircle, Zap, Bot } from 'lucide-react'

export const KIND_ICON = {
  drone: Drone, camera: Cctv, audio: Mic, vehicle: Truck, person: User, satellite: Satellite, scanner: ScanLine,
  structure: Warehouse, poi: MapPin, group: Users, object: Package, event: Zap, ugv: Bot,
}

export const iconFor = (e) => (e.id === 'VH-03' ? Bot : e.id === 'RIDGE' ? HelpCircle : KIND_ICON[e.kind] || MapPin)

export const SIDE_LABEL = { friendly: 'Friendly', hostile: 'Hostile', unknown: 'Unknown', neutral: 'Neutral' }
