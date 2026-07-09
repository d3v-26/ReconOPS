// SVG silhouette library — asset / entity glyphs, drawn in currentColor.
// viewBox 0 0 64 64, filled silhouettes with subtle detail cuts.

const ICONS = {
  // top-down MALE recon UAV (long straight wing, V-tail, sensor ball)
  uav: (
    <g>
      <path d="M32 4c2.2 0 3.4 2.6 3.4 7.2V26h24.2c1.6 0 2.4.7 2.4 1.9s-.8 1.9-2.4 1.9H35.4v11.6l9.8 9.4c.9.9 1 1.9.3 2.6-.7.7-1.7.6-2.6-.3L34 44.5v3.9c0 2.6-.8 3.9-2 3.9s-2-1.3-2-3.9v-3.9l-8.9 8.6c-.9.9-1.9 1-2.6.3-.7-.7-.6-1.7.3-2.6l9.8-9.4V29.8H4.4C2.8 29.8 2 29.1 2 27.9S2.8 26 4.4 26h24.2V11.2C28.6 6.6 29.8 4 32 4z" />
      <circle cx="32" cy="12" r="3" opacity="0.45" />
    </g>
  ),
  // PTZ camera on bracket
  camera: (
    <g>
      <rect x="8" y="50" width="48" height="4" rx="1" />
      <rect x="29" y="34" width="6" height="18" />
      <path d="M14 16c0-3.3 2.7-6 6-6h24c3.3 0 6 2.7 6 6v12c0 3.3-2.7 6-6 6H20c-3.3 0-6-2.7-6-6V16z" />
      <circle cx="44" cy="22" r="6.5" opacity="0.4" />
      <circle cx="44" cy="22" r="3" opacity="0.8" />
      <rect x="17" y="13" width="10" height="3" rx="1.5" opacity="0.4" />
    </g>
  ),
  // acoustic mast with mic pods
  sensor: (
    <g>
      <rect x="30" y="14" width="4" height="40" />
      <rect x="18" y="52" width="28" height="4" rx="1" />
      <circle cx="32" cy="12" r="5" />
      <circle cx="16" cy="26" r="4.4" />
      <path d="M20 26.8 30 22" stroke="currentColor" strokeWidth="2.4" fill="none" />
      <circle cx="48" cy="26" r="4.4" />
      <path d="M44 26.8 34 22" stroke="currentColor" strokeWidth="2.4" fill="none" />
      <path d="M8 10c4 4 4 10 0 14M56 10c-4 4-4 10 0 14" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
    </g>
  ),
  // top-down patrol vehicle
  vehicle: (
    <g>
      <rect x="6" y="24" width="8" height="7" rx="1.6" /><rect x="6" y="34" width="8" height="7" rx="1.6" />
      <rect x="50" y="24" width="8" height="7" rx="1.6" /><rect x="50" y="34" width="8" height="7" rx="1.6" />
      <rect x="24" y="24" width="8" height="7" rx="1.6" /><rect x="24" y="34" width="8" height="7" rx="1.6" />
      <path d="M10 22c0-2.8 2-4 4.6-4h36c4.6 0 8.4 4.6 8.4 9v11c0 4.4-3.8 9-8.4 9h-36C12 47 10 45.8 10 43V22z" />
      <rect x="44" y="24" width="6" height="17" opacity="0.35" />
      <circle cx="28" cy="32.5" r="6" opacity="0.4" />
      <circle cx="28" cy="32.5" r="2.4" opacity="0.85" />
    </g>
  ),
  // satellite: bus + panels + dish
  satellite: (
    <g transform="rotate(45 32 32)">
      <rect x="26" y="22" width="12" height="20" rx="1.5" />
      <rect x="2" y="27" width="21" height="10" rx="1" opacity="0.75" />
      <rect x="41" y="27" width="21" height="10" rx="1" opacity="0.75" />
      <path d="M10 28.5v7M17 28.5v7M47 28.5v7M54 28.5v7" stroke="#0b0e10" strokeWidth="1.4" />
      <circle cx="32" cy="16" r="6" opacity="0.9" />
      <rect x="30.8" y="16" width="2.4" height="7" />
    </g>
  ),
  // soldier bust (helmet + plate carrier)
  person: (
    <g>
      <path d="M20 20c0-8 5.4-13 12-13s12 5 12 13v1.4H20V20z" />
      <path d="M18.4 21.8h27.2v2.6H18.4z" opacity="0.85" />
      <path d="M23.5 25h17c-.6 5.8-4 10.4-8.5 10.4S24.1 30.8 23.5 25z" opacity="0.9" />
      <path d="M10 58c1-12.4 9.6-19.6 22-19.6S53 45.6 54 58H10z" />
      <path d="M26 41.5h12v9.5c0 2-1.6 3.4-6 3.4s-6-1.4-6-3.4v-9.5z" opacity="0.4" />
    </g>
  ),
  // fire team: 2 offset silhouettes + count
  team: (
    <g>
      <g opacity="0.45" transform="translate(12 2) scale(0.82)">
        <path d="M20 20c0-8 5.4-13 12-13s12 5 12 13v3H20v-3z" />
        <path d="M10 58c1-12.4 9.6-19.6 22-19.6S53 45.6 54 58H10z" />
      </g>
      <g transform="translate(-4 8) scale(0.86)">
        <path d="M20 20c0-8 5.4-13 12-13s12 5 12 13v1.4H20V20z" />
        <path d="M18.4 21.8h27.2v2.6H18.4z" />
        <path d="M23.5 25h17c-.6 5.8-4 10.4-8.5 10.4S24.1 30.8 23.5 25z" opacity="0.9" />
        <path d="M10 58c1-12.4 9.6-19.6 22-19.6S53 45.6 54 58H10z" />
      </g>
    </g>
  ),
  // stacked map layers
  maplayer: (
    <g>
      <path d="M32 8 58 20 32 32 6 20z" opacity="0.9" />
      <path d="M10 28.5 6 30.5 32 42.5 58 30.5l-4-2L32 38z" opacity="0.65" />
      <path d="M10 39 6 41 32 53 58 41l-4-2L32 48.5z" opacity="0.4" />
    </g>
  ),
  // document sheet
  docfeed: (
    <g>
      <path d="M16 6h22l10 10v42H16V6z" />
      <path d="M38 6v10h10" opacity="0.4" />
      <rect x="22" y="24" width="20" height="2.6" fill="#0b0e10" opacity="0.7" />
      <rect x="22" y="31" width="20" height="2.6" fill="#0b0e10" opacity="0.7" />
      <rect x="22" y="38" width="14" height="2.6" fill="#0b0e10" opacity="0.7" />
      <rect x="22" y="45" width="17" height="2.6" fill="#0b0e10" opacity="0.7" />
    </g>
  ),
  // tripod lidar
  lidar: (
    <g>
      <rect x="24" y="10" width="16" height="14" rx="2" />
      <circle cx="40" cy="17" r="4.4" opacity="0.45" />
      <rect x="30" y="24" width="4" height="8" />
      <path d="M32 32 16 56h4.6L32 38.5 43.4 56H48L32 32z" />
      <path d="M30 32h4l-2 10z" opacity="0.6" />
      <path d="M46 8c3 3 3 8 0 11M52 5c5 5 5 12 0 17" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
    </g>
  ),
  // hostile vehicle contact
  threat: (
    <g>
      <path d="M12 24c0-2.4 1.8-3.6 4-3.6h30c4 0 7 4 7 7.8v9.6c0 3.8-3 7.8-7 7.8H16c-2.2 0-4-1.2-4-3.6V24z" />
      <rect x="40" y="22.5" width="5" height="21" opacity="0.35" />
      <path d="M6 24.5h5v6H6zM6 33.5h5v6H6zM53 45l6 8h-5l-5-7zM53 19l6-8h-5l-5 7z" opacity="0.8" />
      <path d="M28 50h8v6c0 1.6-1.4 2.6-4 2.6s-4-1-4-2.6v-6z" opacity="0" />
      <text x="32" y="60" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor" fontFamily="monospace">▲!</text>
    </g>
  ),
  // unknown entity
  unknown: (
    <g>
      <path d="M32 5 58 19v26L32 59 6 45V19z" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="7 4" />
      <text x="32" y="41" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="monospace">?</text>
    </g>
  ),
  // voice / intercept
  voice: (
    <g>
      <path d="M20 20c0-8 5.4-13 12-13s12 5 12 13v3H20v-3z" opacity="0.9" />
      <path d="M10 58c1-12.4 9.6-19.6 22-19.6S53 45.6 54 58H10z" opacity="0.9" />
      <path d="M8 26c3 3.4 3 8.6 0 12M56 26c-3 3.4-3 8.6 0 12" stroke="currentColor" strokeWidth="2.6" fill="none" />
      <path d="M2 21c5.4 5.6 5.4 16.4 0 22M62 21c-5.4 5.6-5.4 16.4 0 22" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
      <rect x="24" y="26" width="16" height="4" fill="#0b0e10" opacity="0.8" />
    </g>
  ),
  // building / POI
  structure: (
    <g>
      <path d="M8 56V30l14-8v34H8z" />
      <path d="M24 56V20l24-9v45H24z" opacity="0.85" />
      <path d="M50 56V26l8 4v26h-8z" opacity="0.6" />
      {[0, 1, 2].map((r) => [0, 1].map((c) => (
        <rect key={`${r}${c}`} x={30 + c * 9} y={26 + r * 9} width="5" height="5.6" fill="#0b0e10" opacity="0.75" />
      )))}
    </g>
  ),
  // quadruped
  animal: (
    <g>
      <path d="M12 30c2-5 8-7 14-7h14c4 0 7-3 8-6l4 1-3 8c3 1 5 3 5 6l-3 2-4-3h-3l2 21h-5l-3-14-12 1-2 13h-5l1-14c-4-1-8-4-8-8z" />
      <path d="M50 14l6-4 1 5-4 3z" opacity="0.8" />
    </g>
  ),
}

export default function AssetIcon({ kind = 'unknown', size = 20, color = 'currentColor', style }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ color, flexShrink: 0, ...style }} fill="currentColor">
      {ICONS[kind] || ICONS.unknown}
    </svg>
  )
}

export const TYPE_ICON = {
  'Drone': 'uav', 'Camera': 'camera', 'Audio Sensor': 'sensor', 'Vehicle': 'vehicle',
  'Satellite': 'satellite', 'Human Team': 'team', 'Map Layer': 'maplayer',
  'Document Feed': 'docfeed', '3D Scanner': 'lidar',
}

export const MARKER_ICON = {
  drone: 'uav', camera: 'camera', sensor: 'sensor', vehicle: 'vehicle',
  team: 'team', threat: 'threat', poi: 'structure',
}
