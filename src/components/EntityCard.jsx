import { useEffect, useState } from 'react'
import { X, Radio, Flame, Languages, ShieldCheck, ShieldX, FilePlus2, Check, Gamepad2, Navigation, Crosshair, Sparkles, Link2, Loader2 } from 'lucide-react'
import { entities, byId } from '../data/entities.js'
import { evidenceSources, documents, plan } from '../data/mockData.js'
import { useOperation } from '../context/OperationContext.jsx'
import { distM, bearing, fmtDist, grid, formatLatLng, toLatLng } from '../lib/geo.js'
import { iconFor, SIDE_LABEL } from '../lib/kinds.js'
import Feed, { resolveFeed } from './Feed.jsx'

const SEND_TO = ['S-3', 'CKP-N', 'RIDGE']
const movers = (ops) => entities.filter((e) => e.side === 'friendly' && e.move && ops.isLinked(e.id))
const nearestFriendly = (p, ops, skip) => entities
  .filter((f) => f.side === 'friendly' && f.id !== skip && f.kind !== 'satellite')
  .map((f) => ({ f, d: distM(ops.pos[f.id], p) }))
  .sort((a, b) => a.d - b.d)

function Section({ title, children, tone }) {
  return <section className={`card-sec ${tone ? `sec-${tone}` : ''}`}><h4>{title}</h4>{children}</section>
}

function Specs({ rows }) {
  return <dl className="specs">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
}

function EntityBody({ e }) {
  const ops = useOperation()
  const [planning, setPlanning] = useState(false)
  const p = ops.pos[e.id]
  const link = e.asset ? ops.links[e.id] : 'linked'
  const feed = resolveFeed(e, ops)
  const imgFeed = ['aerial', 'oblique', 'helmet'].includes(feed.type)
  const alert = ops.alertOf(e.id)
  const alertState = alert && ops.statusOf(alert.id)
  const ev = e.evidence && evidenceSources.find((s) => s.id === e.evidence)
  const logged = ev && ops.evidence.includes(ev.id)
  const live = ops.phase === 'EXECUTION'
  const near = e.side !== 'friendly' ? nearestFriendly(p, ops, e.id)[0] : null
  const v = e.vehicle
  const remoteBy = v?.remote && byId[v.remote.by]

  const draftPlan = () => { setPlanning(true); setTimeout(() => { setPlanning(false); ops.proposePlan() }, 1100) }

  return (
    <>
      {link !== 'linked' && (
        <Section title="Link" tone="gold">
          <p>{link === 'handshake' ? 'Handshake in progress…' : 'Not on the command net. Its data is quarantined until linked.'}</p>
          <button className="act act-primary" disabled={link === 'handshake'} onClick={() => ops.establishLink(e.id)}>
            {link === 'handshake' ? <Loader2 size={14} className="spin" /> : <Link2 size={14} />} Link {e.name}
          </button>
        </Section>
      )}

      {(e.feed || e.side !== 'friendly') && (
        <div className="card-feed">
          <Feed entity={e} translated={ops.translated} />
          <div className="feed-tools">
            {imgFeed && <button className={`tool ${ops.thermal ? 'on' : ''}`} onClick={() => ops.setThermal(!ops.thermal)}><Flame size={13} /> Thermal</button>}
            {feed.type === 'audio' && feed.transcript && <button className={`tool ${ops.translated ? 'on' : ''}`} onClick={() => ops.setTranslated(!ops.translated)}><Languages size={13} /> Translate</button>}
            {feed.via && <button className="tool" onClick={() => ops.select(feed.source.id)}><Radio size={13} /> Seen by {feed.source.name}</button>}
          </div>
        </div>
      )}

      {alert && live && (
        <Section title={`${alert.severity} alert · ${alert.id}`} tone={alertState === 'Open' ? 'red' : 'muted'}>
          <p><b>{alert.title}.</b> {alertState === 'Open' ? alert.recommended : alertState === 'Approved' ? alert.approveNote : alert.dismissNote}</p>
          {alertState === 'Open' ? (
            <div className="acts">
              <button className="act act-primary" onClick={() => ops.resolveAlert(alert.id, 'Approved')}><ShieldCheck size={14} /> Approve action</button>
              <button className="act" onClick={() => ops.resolveAlert(alert.id, 'Dismissed')}><ShieldX size={14} /> Dismiss</button>
            </div>
          ) : <div className="done"><Check size={13} /> {alertState}</div>}
        </Section>
      )}

      {ev && live && link === 'linked' && (
        <Section title="Evidence" tone={logged ? 'muted' : 'gold'}>
          <p>{ev.finding}</p>
          {logged ? <div className="done"><Check size={13} /> Logged · +{Math.round(ev.weight * 100)}%</div>
            : <button className="act act-primary" onClick={() => ops.logEvidence(ev.id)}><FilePlus2 size={14} /> Log as evidence</button>}
        </Section>
      )}

      {e.id === 'S-3' && ops.phase === 'PLANNING' && (
        <Section title="Collection plan" tone="gold">
          {!ops.planProposed ? (
            <>
              <p>Let the AI task each asset against S-3. Taskings are drawn on the map before anything is committed.</p>
              <button className="act act-primary" onClick={draftPlan} disabled={planning}>{planning ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />} Generate plan</button>
            </>
          ) : (
            <>
              <p>{plan.summary}</p>
              <ul className="taskings">{plan.taskings.map((t) => <li key={t.asset}><b>{byId[t.asset].name}</b>{t.task}</li>)}</ul>
              {ops.planApproved ? <div className="done"><Check size={13} /> Approved</div>
                : <button className="act act-primary" onClick={ops.approvePlan}><Check size={14} /> Approve plan</button>}
            </>
          )}
        </Section>
      )}

      {v && (
        <Section title="Vehicle">
          <Specs rows={[['Make', v.make], ['Model', v.model], ['Colour', v.color], ['Plate', v.plate],
            ['Remote control', v.remote ? 'Yes — drive-by-wire' : 'No']]} />
          {v.remote && (
            <div className="remote">
              <Gamepad2 size={16} />
              <div><b>Controlled by {remoteBy.name}</b><span>{v.remote.via}</span></div>
            </div>
          )}
          {v.remote && link === 'linked' && (ops.controlled === e.id
            ? <button className="act" onClick={ops.releaseControl}>Release control</button>
            : <button className="act act-primary" onClick={() => ops.takeControl(e.id)}><Gamepad2 size={14} /> Take control</button>)}
        </Section>
      )}

      {e.report && (
        <Section title={`Report · ${documents[e.report].title}`}>
          <p className="doc">{documents[e.report].body}</p>
        </Section>
      )}

      {e.move && e.side === 'friendly' && link === 'linked' && !v?.remote && (
        <Section title="Send">
          <div className="acts">
            {SEND_TO.filter((t) => distM(ops.pos[t], p) > 300).map((t) => (
              <button key={t} className="act" onClick={() => { ops.moveEntity(e.id, ops.pos[t]); ops.say(e.name, `Moving to ${byId[t].name}.`) }}>
                <Navigation size={13} /> {byId[t].name}
              </button>
            ))}
          </div>
          <p className="hint">Or click the map, then “Send”.</p>
        </Section>
      )}

      <Section title="Details">
        <p>{e.desc}</p>
        {e.specs && <Specs rows={e.specs} />}
        <Specs rows={[['Grid', grid(p.x, p.y)], ...(near ? [['Nearest friendly', `${near.f.name} · ${fmtDist(near.d)} @ ${bearing(ops.pos[near.f.id], p)}°`]] : [])]} />
      </Section>
    </>
  )
}

function SpotBody({ x, y }) {
  const ops = useOperation()
  const at = { x, y }
  const near = nearestFriendly(at, ops).slice(0, 3)
  const spot = { id: 'SPOT', name: 'SPOT', x, y }
  return (
    <>
      <div className="card-feed"><Feed entity={spot} at={at} /></div>
      <Section title="Send here">
        <div className="acts">
          {movers(ops).map((m) => (
            <button key={m.id} className="act" onClick={() => {
              if (m.vehicle?.remote) ops.takeControl(m.id)
              ops.moveEntity(m.id, at); ops.ping(x, y, m.name); ops.say(m.name, `Moving to ${grid(x, y)}.`)
            }}><Navigation size={13} /> {m.name}</button>
          ))}
        </div>
        {!movers(ops).length && <p className="hint">No linked assets can move yet.</p>}
      </Section>
      <Section title="Mark">
        <div className="acts">
          <button className="act" onClick={() => ops.ping(x, y, 'PING')}><Crosshair size={13} /> Ping</button>
          {ops.phase === 'PLANNING' && <button className="act" onClick={() => { ops.ping(x, y, 'TGT'); ops.say('AI', `Target designated at ${grid(x, y)} — added to the plan.`) }}><Crosshair size={13} /> Designate target</button>}
        </div>
      </Section>
      <Section title="Nearest friendlies">
        <ul className="nearest">
          {near.map(({ f, d }) => (
            <li key={f.id}><button onClick={() => ops.select(f.id)}>{f.name}</button><span>{fmtDist(d)} @ {bearing(ops.pos[f.id], at)}°</span></li>
          ))}
        </ul>
      </Section>
    </>
  )
}

/** The one panel: whatever was clicked on the map (or named in the command bar). */
export default function EntityCard() {
  const ops = useOperation()
  const sel = ops.selected
  useEffect(() => {
    const onKey = (ev) => ev.key === 'Escape' && ops.select(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ops])
  if (!sel) return null

  const e = sel.type === 'entity' ? byId[sel.id] : null
  const Icon = e ? iconFor(e) : Crosshair
  const side = e ? e.side : 'spot'
  return (
    <aside className={`card card-${side}`} key={e ? e.id : `${sel.x}-${sel.y}`}>
      <header>
        <div className="card-ico"><Icon size={18} /></div>
        <div className="card-title">
          <span className="card-side">{e ? `${SIDE_LABEL[e.side]} · ${e.cls}` : 'Spot report'}</span>
          <h3>{e ? e.name : grid(sel.x, sel.y)}</h3>
          <span className="card-status">{e ? e.status : formatLatLng(toLatLng(sel.x, sel.y))}</span>
        </div>
        <button className="x" onClick={() => ops.select(null)} aria-label="Close"><X size={16} /></button>
      </header>
      <div className="card-body">{e ? <EntityBody e={e} /> : <SpotBody x={sel.x} y={sel.y} />}</div>
    </aside>
  )
}
