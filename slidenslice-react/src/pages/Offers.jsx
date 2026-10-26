
import { useState } from 'react';
import Confirm from '../components/Confirm.jsx';
import DatePicker from '../components/DatePicker.jsx';
import Select from '../components/Select.jsx';
import { DAYS } from '../lib/loyalty.js'; // ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

/* Offers are created by the shop owner. Every "validity" setting is optional and they combine:
   period (start/end date) + days of the week (any combination) + time of day.
   Examples:
   - Every Wednesday ............ days: [Wed]
   - Wed, Thu, Fri .............. days: [Wed, Thu, Fri]
   - Diwali week ................ period: 05/11 to 10/11
   - Weekdays 3 PM to 6 PM ...... days: Mon-Fri + time 15:00 to 18:00 */
const KEY = 'ss_offers_v4';
const TYPES = ['Percentage discount', 'Flat amount off', 'Fixed price item', 'Buy 1 Get 1', 'Free item', 'Combo offer'];
const UNIT = { 'Percentage discount': '%', 'Flat amount off': '₹', 'Fixed price item': '₹' };

const SEED = [
  { id: 1, name: 'Diwali ₹199 XL Pizza', type: 'Fixed price item', value: 199, detail: '', from: '2026-11-05', to: '2026-11-10', days: [], tFrom: '', tTo: '', status: 'active' },
  { id: 2, name: 'Mon-Sat 20% OFF', type: 'Percentage discount', value: 20, detail: '', from: '2026-10-01', to: '', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], tFrom: '', tTo: '', status: 'active' },
  { id: 3, name: 'First Week Buy 1 Get 1', type: 'Buy 1 Get 1', value: '', detail: '', from: '2026-10-01', to: '2026-10-07', days: [], tFrom: '', tTo: '', status: 'active' },
  { id: 4, name: 'Wednesday Special', type: 'Combo offer', value: '', detail: 'Zinger + Fries + Drink', from: '', to: '', days: ['Wed'], tFrom: '', tTo: '', status: 'active' },
];
const EMPTY = { name: '', type: '', value: '', detail: '', from: '', to: '', days: [], tFrom: '', tTo: '', status: 'active' };

const PRESETS = [
  { label: 'Every day', days: DAYS },
  { label: 'Weekdays', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { label: 'Weekend', days: ['Sat', 'Sun'] },
];

/* ---------- helpers ---------- */
const pad = (n) => String(n).padStart(2, '0');
const fmt = (d) => (d ? d.split('-').reverse().join('/') : '');
const t12 = (t) => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`; };

const allDays = (o) => !o.days || o.days.length === 0 || o.days.length === 7;
const hasTime = (o) => !!(o.tFrom && o.tTo);

const discountText = (o) => {
  if (UNIT[o.type] === '%') return `${o.value}% off`;
  if (o.type === 'Fixed price item') return `Only ₹${o.value}`;
  if (UNIT[o.type] === '₹') return `₹${o.value} off`;
  return o.detail ? `${o.type}: ${o.detail}` : o.type;
};

// readable lines: period / days / time
const whenLines = (o) => {
  const out = [];
  out.push(o.from && o.to ? `${fmt(o.from)} to ${fmt(o.to)}` : o.from ? `From ${fmt(o.from)} (no end date)` : o.to ? `Until ${fmt(o.to)}` : 'Any date');

  if (!allDays(o)) {
    const idx = DAYS.map((d, i) => (o.days.includes(d) ? i : -1)).filter((i) => i >= 0);
    const names = idx.map((i) => DAYS[i]);
    if (names.length === 1) out.push(`Only ${names[0]}`);
    else if (idx[idx.length - 1] - idx[0] + 1 === idx.length) out.push(`${names[0]} to ${names[names.length - 1]}`);
    else out.push(names.join(', '));
  }

  if (hasTime(o)) out.push(`${t12(o.tFrom)} - ${t12(o.tTo)}`);
  return out;
};

// accept rows saved by older versions (dFrom/dTo day range, mFrom/mTo month range)
const normalize = (o) => {
  const n = { ...EMPTY, ...o };
  if (!Array.isArray(o.days)) {
    n.days = [];
    if (o.dFrom && o.dTo && !(o.dFrom === 'Mon' && o.dTo === 'Sun')) {
      const a = DAYS.indexOf(o.dFrom), b = DAYS.indexOf(o.dTo);
      n.days = DAYS.filter((_, i) => (a <= b ? i >= a && i <= b : i >= a || i <= b));
    }
  }
  ['dFrom', 'dTo', 'mFrom', 'mTo', 'dates', 'note', 'schedule'].forEach((k) => delete n[k]);
  return n;
};
const loadRows = () => {
  try {
    for (const k of [KEY, 'ss_offers_v3', 'ss_offers_v2']) {
      const saved = JSON.parse(localStorage.getItem(k) || 'null');
      if (saved) {
        const m = saved.map(normalize);
        if (k !== KEY) localStorage.setItem(KEY, JSON.stringify(m));
        return m;
      }
    }
  } catch { /* ignore */ }
  return SEED;
};

/* ---------- page ---------- */
export default function Offers() {
  // TODO: replace localStorage with API calls (GET/POST/PUT/DELETE)
  const [rows, setRows] = useState(loadRows);
  const [modal, setModal] = useState(null);
  const [del, setDel] = useState(null);
  const [q, setQ] = useState('');

  const persist = (next) => { setRows(next); localStorage.setItem(KEY, JSON.stringify(next)); };
  const list = rows.filter((r) => (r.name + r.type).toLowerCase().includes(q.trim().toLowerCase()));

  const save = (data) => {
    persist(data.id ? rows.map((r) => (r.id === data.id ? data : r)) : [...rows, { ...data, id: Date.now() }]);
    setModal(null);
  };

  return (
    <>
      <div className="row between wrap">
        <h1>Offers</h1>
        <button className="btn primary" onClick={() => setModal({ mode: 'create', data: EMPTY })}>+ Add Offer</button>
      </div>

      <div className="search-wrap">
        <input className="search" placeholder="Search offer or type" value={q} onChange={(e) => setQ(e.target.value)} />
        <svg className="search-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
        </svg>
      </div>

      <div className="card table-wrap" style={{ marginTop: 14 }}>
        <table className="responsive">
          <thead>
            <tr><th>S.No</th><th>Offer Name</th><th>Discount</th><th>Validity</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {list.map((r, i) => (
              <tr key={r.id}>
                <td data-l="S.No">{i + 1}</td>
                <td data-l="Offer Name">{r.name}</td>
                <td data-l="Discount">{discountText(r)}</td>
                <td data-l="Validity">{whenLines(r).map((l) => <div key={l}>{l}</div>)}</td>
                <td data-l="Status"><span className={`badge ${r.status}`}>{r.status === 'active' ? 'Active' : 'Inactive'}</span></td>
                <td data-l="Actions" className="acts">
                  <button className="btn ghost sm" onClick={() => setModal({ mode: 'edit', data: normalize(r) })}>Edit</button>
                  <button className="btn danger sm" onClick={() => setDel(r)}>Delete</button>
                </td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan="6" className="none">No offers found</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && <OfferModal {...modal} onSave={save} onClose={() => setModal(null)} />}
      {del && (
        <Confirm text={`Are you sure you want to delete "${del.name}"?`} yes="Delete"
          onYes={() => { persist(rows.filter((r) => r.id !== del.id)); setDel(null); }} onNo={() => setDel(null)} />
      )}
    </>
  );
}

/* ---------- create / edit ---------- */
function OfferModal({ mode, data, onSave, onClose }) {
  const [f, setF] = useState({ ...EMPTY, ...data });
  const [err, setErr] = useState({});
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const unit = UNIT[f.type];

  // click a day to select, click again to unselect (keeps Mon..Sun order)
  const toggleDay = (d) =>
    setF((p) => ({ ...p, days: DAYS.filter((x) => (x === d ? !p.days.includes(d) : p.days.includes(x))) }));
  const sameDays = (a) => a.length === f.days.length && a.every((d) => f.days.includes(d));

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!f.name.trim()) e.name = 'Offer name is required';
    if (!f.type) e.type = 'Select an offer type';
    if (unit && (!f.value || Number(f.value) <= 0)) e.value = 'Enter a value';
    if (unit === '%' && Number(f.value) > 100) e.value = 'Cannot be more than 100%';
    if (f.from && f.to && f.to < f.from) e.to = 'End date must be after start date';
    if (!f.tFrom !== !f.tTo) e.time = 'Fill both times, or leave both empty';
    else if (f.tFrom && f.tTo && f.tTo <= f.tFrom) e.time = 'End time must be after start time';
    setErr(e);
    if (!Object.keys(e).length) {
      onSave({
        ...f,
        name: f.name.trim(),
        value: unit ? Number(f.value) : '',
        detail: unit ? '' : f.detail.trim(),
        days: f.days.length === 7 ? [] : f.days,
      });
    }
  };

  const summary = whenLines(f).join(' · ');

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal wide" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <h2>{mode === 'edit' ? 'Edit Offer' : 'Add Offer'}</h2>

        <label>Offer Name</label>
        <input value={f.name} placeholder="Eg: Diwali Special, Wednesday Offer" className={err.name ? 'err' : ''} onChange={(e) => set('name', e.target.value)} />
        {err.name && <small className="msg">{err.name}</small>}

        <div className="two-col">
          <div>
            <label>Discount Type</label>
            <Select value={f.type} options={TYPES} placeholder="Select type" error={!!err.type} onChange={(v) => set('type', v)} />
            {err.type && <small className="msg">{err.type}</small>}
          </div>
          {unit && (
            <div>
              <label>Value ({unit})</label>
              <input type="number" min="0" value={f.value} className={err.value ? 'err' : ''} onChange={(e) => set('value', e.target.value)} />
              {err.value && <small className="msg">{err.value}</small>}
            </div>
          )}
        </div>

        {f.type && !unit && (
          <>
            <label>Offer details (optional)</label>
            <input value={f.detail} placeholder="Eg: Zinger + Fries + Drink" onChange={(e) => set('detail', e.target.value)} />
          </>
        )}

        <label>Offer period - festival / season (optional)</label>
        <div className="two-col">
          <div>
            <DatePicker value={f.from} error={!!err.from} onChange={(v) => setF((p) => ({ ...p, from: v, to: p.to && v && p.to < v ? '' : p.to }))} />
            <small className="hint">Start date (optional)</small>
          </div>
          <div>
            <DatePicker value={f.to} min={f.from || undefined} error={!!err.to} onChange={(v) => set('to', v)} />
            <small className="hint">End date (optional)</small>
            {err.to && <small className="msg" style={{ display: 'block' }}>{err.to}</small>}
          </div>
        </div>

        <label>Days of the week (optional)</label>
        <div className="chips">
          {DAYS.map((d) => (
            <button type="button" key={d} className={`chip ${f.days.includes(d) ? 'on' : ''}`} onClick={() => toggleDay(d)}>{d}</button>
          ))}
        </div>
        <div className="chips small">
          {PRESETS.map((p) => (
            <button type="button" key={p.label} className={`chip ${sameDays(p.days) ? 'on' : ''}`} onClick={() => set('days', sameDays(p.days) ? [] : p.days)}>{p.label}</button>
          ))}
        </div>
        <small className="hint">Pick any days, eg: only Wed, or Wed + Thu + Fri. Nothing selected = every day.</small>

        <label>Time of day (optional)</label>
        <div className="two-col">
          <input type="time" value={f.tFrom} onChange={(e) => set('tFrom', e.target.value)} />
          <input type="time" value={f.tTo} onChange={(e) => set('tTo', e.target.value)} />
        </div>
        {err.time && <small className="msg">{err.time}</small>}

        <div className="msg-preview">
          <b>Runs:</b> {summary}
        </div>

        <label>Status</label>
        <div className="switch">
          <button type="button" className={f.status === 'active' ? 'on' : ''} aria-label="Toggle status"
            onClick={() => set('status', f.status === 'active' ? 'inactive' : 'active')} />
          <span>{f.status === 'active' ? 'Active' : 'Inactive'}</span>
        </div>

        <div className="row end">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" type="submit">{mode === 'edit' ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}

