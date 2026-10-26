
import { useMemo, useState } from 'react';
import pizzaImage from '../assets/pizza-image.png';
import Select from '../components/Select.jsx';
import {
  CUSTOMERS_SEED, buildLoyaltySeed, useStore, tierOf, inr, fmtDT, monthKey, MSG_STORE, withBalances,
} from '../lib/loyalty.js';

export default function Dashboard() {
  // TODO: replace with API data
  const [customers] = useStore('ss_customers', CUSTOMERS_SEED);
  const { rules, ledger } = useMemo(() => buildLoyaltySeed(), []); // demo data straight from loyalty.js
  const bal = useMemo(() => withBalances(ledger).customers, [ledger]);
  const [msgs] = useStore(MSG_STORE, []);
  const [offers] = useStore('ss_offers_v3', []);

  // Month (all 12) + Year (current year and next year) pickers
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return [String(y), String(y + 1)]; // current year and next year only
  }, []);
  const [month, setMonth] = useState(monthKey(new Date())); // 'YYYY-MM'
  const [yy, mm] = month.split('-');

  const s = useMemo(() => {
    const L = ledger.filter((l) => monthKey(l.ts) === month);
    const given = L.reduce((n, l) => n + l.earned, 0);
    const used = L.reduce((n, l) => n + l.redeemed, 0);
    const byCust = {};
    L.forEach((l) => {
      byCust[l.mobile] = byCust[l.mobile] || { name: l.name, spend: 0 };
      byCust[l.mobile].spend += l.bill;
    });
    // Gold / Silver by lifetime points earned (thresholds come from the loyalty rules: Gold 1000, Silver 500)
    const tiers = { Gold: 0, Silver: 0, Bronze: 0 };
    customers.forEach((c) => { tiers[tierOf((bal[c.mobile] || {}).added || 0, rules)] += 1; });
    const sent = msgs.filter((m) => monthKey(m.ts) === month);
    return {
      L, given, used,
      visitors: Object.keys(byCust).length,
      sales: L.reduce((n, l) => n + l.bill, 0),
      top: Object.values(byCust).sort((a, b) => b.spend - a.spend).slice(0, 5),
      tiers,
      sentCount: sent.reduce((n, m) => n + m.count, 0),
    };
  }, [ledger, month, customers, bal, rules, msgs]);

  const activeOffers = offers.filter((o) => o.status === 'active');

  return (
    <>
      <div className="banner" style={{ backgroundImage: `url(${pizzaImage})` }} />

      <div className="row between wrap" style={{ marginBottom: 14 }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <div className="row" style={{ gap: 10 }}>
          <div style={{ width: 160 }}>
            <Select value={MONTHS[+mm - 1]} options={MONTHS} onChange={(v) => setMonth(`${yy}-${String(MONTHS.indexOf(v) + 1).padStart(2, '0')}`)} />
          </div>
          <div style={{ width: 110 }}>
            <Select value={yy} options={years} onChange={(v) => setMonth(`${v}-${mm}`)} />
          </div>
        </div>
      </div>

      <div className="kpis">
        <Kpi label="Customers visited" value={s.visitors} sub={`total`} />
        <Kpi label="Total sales" value={inr(s.sales)} sub={`${s.L.length} bills`} />
        <Kpi label="Points added" value={s.given} sub="this month" />
        <Kpi label="Points redeemed" value={s.used} sub={`worth ${inr(s.used * rules.rupeesPerPoint)}`} />
        <Kpi label="Gold customers" value={s.tiers.Gold} sub={`${rules.gold}+ points reached`} />
        <Kpi label="Silver customers" value={s.tiers.Silver} sub={`${rules.silver}+ points reached`} />
      </div>

      <div className="dash-grid">
        <div className="card">
          <h3>Top 5 customers</h3>
          {s.top.length ? s.top.slice(0, 5).map((c) => (
            <div className="list-row" key={c.name}><span>{c.name}</span><b>{inr(c.spend)}</b></div>
          )) : <p className="none">No bills in this month</p>}
        </div>

        <div className="card">
          <h3>Recent bills</h3>
          {s.L.slice(0, 5).map((l) => (
            <div className="list-row" key={l.id}>
              <span>{l.name}<small> · {fmtDT(l.ts)}</small></span>
              <span><b>{inr(l.bill)}</b><small className="ok"> +{l.earned} pts</small></span>
            </div>
          ))}
          {!s.L.length && <p className="none">No bills in this month</p>}
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3>Active offers ({activeOffers.length})</h3>
          {activeOffers.slice(0, 5).map((o) => (
            <div className="list-row" key={o.id}><span>{o.name}<small> · {o.type}</small></span><b>{o.type === 'Percentage discount' ? `${o.value}%` : o.value ? `₹${o.value}` : ''}</b></div>
          ))}
          {!activeOffers.length && <p className="none">No active offers</p>}
        </div>
      </div>
    </>
  );
}

function Kpi({ label, value, sub }) {
  return (
    <div className="card kpi">
      <small>{label}</small>
      <b>{value}</b>
      <small>{sub}</small>
    </div>
  );
}
