import HudCard from '../HudCard.jsx'
import StatusBadge from '../StatusBadge.jsx'
import { useOperation } from '../../context/OperationContext.jsx'
import { assets, onboardingChecklist } from '../../data/mockData.js'

const LINK_LABEL = { pending: 'NO LINK', handshake: 'HANDSHAKE…', linked: 'LINKED' }
const LINK_TONE = { pending: 'red', handshake: 'amber', linked: 'green' }

export default function StandUpView() {
  const { links, establishLink, linkAll, linkedCount, readiness } = useOperation()

  const checkDone = (chk) =>
    chk.auto ? linkedCount > 0 : chk.linkGate.every((id) => links[id] === 'linked')

  return (
    <HudCard
      panelId="workspace"
      className="workspace"
      title="Operation Stand-Up · Asset Onboarding"
      right={<span className={`chip chip-${readiness === 100 ? 'green' : 'amber'} pulse`}><span className="dot" />READINESS {readiness}%</span>}
    >
      <div className="standup-layout">
        <div className="view-main">
          <div className="view-controls" style={{ alignItems: 'center' }}>
            <button className="btn-green" onClick={linkAll}>⚡ Establish All Links</button>
            <div className="progress-block" style={{ flex: 1, minWidth: 160 }}>
              <div className="meter"><i style={{ width: `${readiness}%`, background: 'linear-gradient(90deg, var(--amber), var(--green))' }} /></div>
              <span className="progress-label">{linkedCount}/{assets.length}</span>
            </div>
          </div>

          <div className="link-grid">
            {assets.map((a) => {
              const st = links[a.id]
              return (
                <div key={a.id} className={`link-card lc-${st}`}>
                  <div className="lc-head">
                    <span className="asset-name">{a.id} · {a.name}</span>
                    <span className={`chip chip-${LINK_TONE[st]} ${st === 'handshake' ? 'pulse' : ''}`}>
                      <span className="dot" />{LINK_LABEL[st]}
                    </span>
                  </div>
                  <div className="asset-type">{a.type} → {a.dataType}</div>
                  {st === 'pending' && (
                    <button onClick={() => establishLink(a.id)}>Establish Link</button>
                  )}
                  {st === 'handshake' && (
                    <div className="thinking" style={{ fontSize: 9 }}>KEY EXCHANGE · NET JOIN <i /><i /><i /></div>
                  )}
                  {st === 'linked' && (
                    <div className="lc-linked">▸ encrypted net joined · telemetry flowing · calibration OK</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <aside className="view-side">
          <div>
            <div className="mini-title">STAND-UP CHECKLIST</div>
            {onboardingChecklist.map((chk) => {
              const done = checkDone(chk)
              return (
                <div key={chk.id} className={`phase-row ${done ? 'st-Complete' : 'st-Pending'}`}>
                  <span className="ph-dot" style={done ? { background: 'var(--green)', borderColor: 'var(--green)' } : undefined} />
                  <span style={{ flex: 1 }}>{chk.label}</span>
                  <span style={{ fontSize: 8 }}>{done ? 'DONE' : 'WAITING'}</span>
                </div>
              )
            })}
          </div>
          <div>
            <div className="mini-title">WHY STAND-UP FIRST <StatusBadge status="Pending" tone="cyan" /></div>
            <div className="ai-text">
              An operation cannot start mid-stream. Every asset must authenticate onto the command net,
              exchange encryption keys, calibrate its sensors, and report a health baseline. The AI fusion
              layer only trusts feeds from linked assets — unlinked data is quarantined.
            </div>
          </div>
          <div>
            <div className="mini-title">LLM PRE-BRIEF</div>
            <div className="ai-text amber">
              Ingesting prior intel while assets link: 3 documents parsed, baseline imagery loaded,
              acoustic noise floors captured. Planning workspace unlocks at 100% readiness.
            </div>
          </div>
        </aside>
      </div>
    </HudCard>
  )
}
