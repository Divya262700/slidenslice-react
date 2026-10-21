

import { useMemo, useState } from 'react';
import { buildLoyaltySeed, useStore, inr, fmtDT, withBalances } from '../lib/loyalty.js';

/* Petpooja sends ONLY the points of each bill (added / used).
   We calculate each customer's balance (total added - total used) in withBalances().
   TODO: replace the demo data with API (GET /api/loyalty), each bill looks like
   { id, name, mobile, ts (bill date), bill (amount), earned (points added), redeemed (points used) } */
export default function Loyalty() {
  const [data] = useStore('ss_loyalty_v2', () => buildLoyaltySeed());
  const [view, setView] = useState('bills'); // bills | customers
  const [q, setQ] = useState('');

  const all = useMemo(() => withBalances(data.ledger), [data]);
  const match = (x) => (x.name + x.mobile).toLowerCase().includes(q.trim().toLowerCase());
  const bills = useMemo(() => all.bills.filter(match), [all, q]);
  const customers = useMemo(() => Object.values(all.customers).filter(match).sort((a, b) => b.balance - a.balance), [all, q]);

  const totalAdded = bills.reduce((n, l) => n + l.earned, 0);
  const totalUsed = bills.reduce((n, l) => n + l.redeemed, 0);

  return (
    <>
      <div className="row between wrap">
        <h1>Loyalty Points</h1>
        <div className="chips">
          <button className={`chip ${view === 'bills' ? 'on' : ''}`} onClick={() => setView('bills')}>Bill-wise</button>
          <button className={`chip ${view === 'customers' ? 'on' : ''}`} onClick={() => setView('customers')}>Customer-wise</button>
        </div>
      </div>
      <p className="hint" style={{ marginTop: 0 }}>Petpooja sends the points of each bill. Balance is calculated here (added - used).</p>

      <div className="search-wrap">
        <input className="search" placeholder="Search customer name or mobile" value={q} onChange={(e) => setQ(e.target.value)} />
        <svg className="search-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
        </svg>
      </div>

      <div className="card table-wrap" style={{ marginTop: 14 }}>
        {view === 'bills' ? (
          <table className="responsive">
            <thead>
              <tr><th>S.No</th><th>Customer Name</th><th>Mobile</th><th>Billing Date</th><th>Amount</th><th>Points Added</th><th>Points Used</th><th>Balance</th></tr>
            </thead>
            <tbody>
              {bills.map((l, i) => (
                <tr key={l.id}>
                  <td data-l="S.No">{i + 1}</td>
                  <td data-l="Customer Name">{l.name}</td>
                  <td data-l="Mobile">{l.mobile}</td>
                  <td data-l="Billing Date">{fmtDT(l.ts)}</td>
                  <td data-l="Amount">{inr(l.bill)}</td>
                  <td data-l="Points Added" className="ok">{l.earned ? `+${l.earned}` : '-'}</td>
                  <td data-l="Points Used" style={{ color: '#c0392b', fontWeight: 600 }}>{l.redeemed ? `-${l.redeemed}` : '-'}</td>
                  <td data-l="Balance"><b>{l.cur}</b></td>
                </tr>
              ))}
              {!bills.length && <tr><td colSpan="8" className="none">No bills found</td></tr>}
            </tbody>
          </table>
        ) : (
          <table className="responsive">
            <thead>
              <tr><th>S.No</th><th>Customer Name</th><th>Mobile</th><th>Visits</th><th>Total Spend</th><th>Points Added</th><th>Points Used</th><th>Balance</th><th>Last Bill</th></tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.mobile}>
                  <td data-l="S.No">{i + 1}</td>
                  <td data-l="Customer Name">{c.name}</td>
                  <td data-l="Mobile">{c.mobile}</td>
                  <td data-l="Visits">{c.visits}</td>
                  <td data-l="Total Spend">{inr(c.spend)}</td>
                  <td data-l="Points Added" className="ok">+{c.added}</td>
                  <td data-l="Points Used" style={{ color: '#c0392b', fontWeight: 600 }}>{c.used ? `-${c.used}` : '-'}</td>
                  <td data-l="Balance"><b>{c.balance}</b></td>
                  <td data-l="Last Bill">{fmtDT(c.last)}</td>
                </tr>
              ))}
              {!customers.length && <tr><td colSpan="9" className="none">No customers found</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      <p className="hint">{bills.length} bills · {totalAdded} points added · {totalUsed} points used</p>
    </>
  );
}

