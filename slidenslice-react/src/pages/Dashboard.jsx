// // export default function Dashboard() {
// //   return (
// //     <>
// //       <h1>Dashboard</h1>
// //       <div className="card empty">Dashboard content coming soon.</div>
// //     </>
// //   );
// // }
// import { Link } from 'react-router-dom';
// import pizzaImage from '../assets/pizza-image.png';

// // TODO: replace with API data
// const STATS = [
//   { label: 'Total Customers', value: '1,248', icon: '👤', bg: '#fff1d6' },
//   { label: 'Total Orders', value: '3,562', icon: '🧾', bg: '#fde3e3' },
//   { label: 'Loyalty Members', value: '892', icon: '🎁', bg: '#e3f6e5' },
//   { label: 'Active Offers', value: '3', icon: '🏷️', bg: '#fde3e3' },
// ];
// const ORDERS = [
//   { id: 1, name: 'Priya S', amount: 450, date: '12 Sep 2025 12:32 PM' },
//   { id: 2, name: 'Kumar R', amount: 320, date: '12 Sep 2025 12:10 PM' },
//   { id: 3, name: 'Anitha P', amount: 680, date: '12 Sep 2025 11:58 AM' },
// ];

// export default function Dashboard() {
//   return (
//     <>
//       <div className="banner"  style={{ backgroundImage: `url(${pizzaImage})` }}>
        
//         {/* <h1>Tasty Pizza</h1> */}
//       </div>
//     </>
//   );
// }

// import { useMemo, useState } from 'react';
// import pizzaImage from '../assets/pizza-image.png';
// import Select from '../components/Select.jsx';
// import {
//   CUSTOMERS_SEED, buildLoyaltySeed, useStore, tierOf, inr, fmtDT, monthKey, monthLabel, MSG_STORE,
// } from '../lib/loyalty.js';

// export default function Dashboard() {
//   // TODO: replace with API data
//   const [customers] = useStore('ss_customers', CUSTOMERS_SEED);
//   const [{ rules, accounts, ledger }] = useStore('ss_loyalty', () => buildLoyaltySeed());
//   const [msgs] = useStore(MSG_STORE, []);
//   const [offers] = useStore('ss_offers', []);

//   const months = useMemo(() => {
//     const out = [];
//     const d = new Date();
//     for (let i = 0; i < 6; i++) { out.push(monthKey(new Date(d.getFullYear(), d.getMonth() - i, 1))); }
//     return out;
//   }, []);
//   const [month, setMonth] = useState(months[0]);

//   const s = useMemo(() => {
//     const L = ledger.filter((l) => monthKey(l.ts) === month);
//     const given = L.reduce((n, l) => n + l.earned, 0);
//     const used = L.reduce((n, l) => n + l.redeemed, 0);
//     const byCust = {};
//     L.forEach((l) => {
//       byCust[l.mobile] = byCust[l.mobile] || { name: l.name, spend: 0, visits: 0 };
//       byCust[l.mobile].spend += l.bill; byCust[l.mobile].visits += 1;
//     });
//     const tiers = { Gold: 0, Silver: 0, Bronze: 0 };
//     customers.forEach((c) => { tiers[tierOf((accounts[c.mobile] || {}).lifetime || 0, rules)] += 1; });
//     const sent = msgs.filter((m) => monthKey(m.ts) === month);
//     return {
//       L, given, used,
//       visitors: Object.keys(byCust).length,
//       sales: L.reduce((n, l) => n + l.bill, 0),
//       top: Object.values(byCust).sort((a, b) => b.spend - a.spend).slice(0, 5),
//       tiers,
//       sentCount: sent.reduce((n, m) => n + m.count, 0),
//       active: Object.values(accounts).reduce((n, a) => n + a.points, 0),
//     };
//   }, [ledger, month, customers, accounts, rules, msgs]);

//   const maxTier = Math.max(1, ...Object.values(s.tiers));
//   const activeOffers = offers.filter((o) => o.status === 'active');

//   return (
//     <>
//       <div className="banner" style={{ backgroundImage: `url(${pizzaImage})` }} />

//       <div className="row between wrap" style={{ marginBottom: 14 }}>
//         <h1 style={{ margin: 0 }}>Dashboard</h1>
//         <div style={{ width: 220 }}>
//           <Select value={monthLabel(month)} options={months.map(monthLabel)} onChange={(v) => setMonth(months[months.map(monthLabel).indexOf(v)])} />
//         </div>
//       </div>

//       <div className="kpis">
//         <Kpi label="Customers visited" value={s.visitors} sub={`of ${customers.length} total`} />
//         <Kpi label="Total sales" value={inr(s.sales)} sub={`${s.L.length} bills`} />
//         <Kpi label="Messages sent" value={s.sentCount} sub="offers + bulk" />
//         <Kpi label="Points given" value={s.given} sub="this month" />
//         <Kpi label="Points redeemed" value={s.used} sub={`worth ${inr(s.used * rules.rupeesPerPoint)}`} />
//         <Kpi label="Points balance" value={s.given - s.used} sub={`${s.given} given − ${s.used} redeemed`} />
//       </div>

//       <div className="dash-grid">
//         <div className="card">
//           <h3>Customers by tier</h3>
//           {Object.entries(s.tiers).map(([t, n]) => (
//             <div className="bar-row" key={t}>
//               <span>{t}</span>
//               <div className="bar"><i className={t.toLowerCase()} style={{ width: `${(n / maxTier) * 100}%` }} /></div>
//               <b>{n}</b>
//             </div>
//           ))}
//           <p className="hint">All members hold {s.active} points in total ({inr(s.active * rules.rupeesPerPoint)} liability).</p>
//         </div>

//         <div className="card">
//           <h3>Top customers</h3>
//           {s.top.length ? s.top.map((c) => (
//             <div className="list-row" key={c.name}><span>{c.name}<small> · {c.visits} visit{c.visits > 1 ? 's' : ''}</small></span><b>{inr(c.spend)}</b></div>
//           )) : <p className="none">No bills in this month</p>}
//         </div>

//         <div className="card">
//           <h3>Recent bills</h3>
//           {s.L.slice(0, 5).map((l) => (
//             <div className="list-row" key={l.id}>
//               <span>{l.name}<small> · {fmtDT(l.ts)}</small></span>
//               <span><b>{inr(l.bill)}</b><small className="ok"> +{l.earned} pts</small></span>
//             </div>
//           ))}
//           {!s.L.length && <p className="none">No bills in this month</p>}
//         </div>

//         <div className="card">
//           <h3>Active offers ({activeOffers.length})</h3>
//           {activeOffers.map((o) => (
//             <div className="list-row" key={o.id}><span>{o.name}<small> · {o.segment || 'All customers'}</small></span><b>{o.sentCount || 0} sent</b></div>
//           ))}
//           {!activeOffers.length && <p className="none">No active offers</p>}
//         </div>
//       </div>
//     </>
//   );
// }

// function Kpi({ label, value, sub }) {
//   return (
//     <div className="card kpi">
//       <small>{label}</small>
//       <b>{value}</b>
//       <small>{sub}</small>
//     </div>
//   );
// }


import { useMemo, useState } from 'react';
import pizzaImage from '../assets/pizza-image.png';
import Select from '../components/Select.jsx';
import {
  CUSTOMERS_SEED, buildLoyaltySeed, useStore, tierOf, inr, fmtDT, monthKey, monthLabel, MSG_STORE, withBalances,
} from '../lib/loyalty.js';

export default function Dashboard() {
  // TODO: replace with API data
  const [customers] = useStore('ss_customers', CUSTOMERS_SEED);
  const [{ rules, ledger }] = useStore('ss_loyalty_v2', () => buildLoyaltySeed());
  const bal = useMemo(() => withBalances(ledger).customers, [ledger]);
  const [msgs] = useStore(MSG_STORE, []);
  const [offers] = useStore('ss_offers_v3', []);

  const months = useMemo(() => {
    const out = [];
    const d = new Date();
    for (let i = 0; i < 6; i++) { out.push(monthKey(new Date(d.getFullYear(), d.getMonth() - i, 1))); }
    return out;
  }, []);
  const [month, setMonth] = useState(months[0]);

  const s = useMemo(() => {
    const L = ledger.filter((l) => monthKey(l.ts) === month);
    const given = L.reduce((n, l) => n + l.earned, 0);
    const used = L.reduce((n, l) => n + l.redeemed, 0);
    const byCust = {};
    L.forEach((l) => {
      byCust[l.mobile] = byCust[l.mobile] || { name: l.name, spend: 0, visits: 0 };
      byCust[l.mobile].spend += l.bill; byCust[l.mobile].visits += 1;
    });
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
      active: Object.values(bal).reduce((n, c) => n + c.balance, 0),
    };
  }, [ledger, month, customers, bal, rules, msgs]);

  const maxTier = Math.max(1, ...Object.values(s.tiers));
  const activeOffers = offers.filter((o) => o.status === 'active');

  return (
    <>
      <div className="banner" style={{ backgroundImage: `url(${pizzaImage})` }} />

      <div className="row between wrap" style={{ marginBottom: 14 }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <div style={{ width: 220 }}>
          <Select value={monthLabel(month)} options={months.map(monthLabel)} onChange={(v) => setMonth(months[months.map(monthLabel).indexOf(v)])} />
        </div>
      </div>

      <div className="kpis">
        <Kpi label="Customers visited" value={s.visitors} sub={`of ${customers.length} total`} />
        <Kpi label="Total sales" value={inr(s.sales)} sub={`${s.L.length} bills`} />
        <Kpi label="Messages sent" value={s.sentCount} sub="offers + bulk" />
        <Kpi label="Points given" value={s.given} sub="this month" />
        <Kpi label="Points redeemed" value={s.used} sub={`worth ${inr(s.used * rules.rupeesPerPoint)}`} />
        <Kpi label="Points balance" value={s.given - s.used} sub={`${s.given} given − ${s.used} redeemed`} />
      </div>

      <div className="dash-grid">
        <div className="card">
          <h3>Customers by tier</h3>
          {Object.entries(s.tiers).map(([t, n]) => (
            <div className="bar-row" key={t}>
              <span>{t}</span>
              <div className="bar"><i className={t.toLowerCase()} style={{ width: `${(n / maxTier) * 100}%` }} /></div>
              <b>{n}</b>
            </div>
          ))}
          <p className="hint">All members hold {s.active} points in total ({inr(s.active * rules.rupeesPerPoint)} liability).</p>
        </div>

        <div className="card">
          <h3>Top customers</h3>
          {s.top.length ? s.top.map((c) => (
            <div className="list-row" key={c.name}><span>{c.name}<small> · {c.visits} visit{c.visits > 1 ? 's' : ''}</small></span><b>{inr(c.spend)}</b></div>
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

        <div className="card">
          <h3>Active offers ({activeOffers.length})</h3>
          {activeOffers.map((o) => (
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
