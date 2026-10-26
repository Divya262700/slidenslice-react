import { useEffect, useState } from 'react';

/* ---------- rules (all editable on the Loyalty page) ---------- */
export const DEFAULT_RULES = {
  pointsPer100: 1,    // Rs.100 bill -> 1 point (Rs.1000 -> 10 points)
  minRedeem: 100,     // minimum balance before points can be used
  rupeesPerPoint: 1,  // 100 points -> Rs.100 off
  gold: 1000,         // lifetime points for Gold
  silver: 500,        // lifetime points for Silver (below this = Bronze)
};

/* ---------- templates (WhatsApp / SMS text) ---------- */
// export const TPL = {
//   thanks:
//     'Thank you {name}! Your bill of Rs.{bill} is received.{used} {earned} loyalty points added. Previous points: {prev}, current points: {cur}. Points can be used on regular orders once you reach {min}.',
//   offer:
//     'Hi {name}! {offer} on {days} ({valid}). Visit Slide and Slice to enjoy it.',
//   birthday:
//     'Dear {name}, Happy Birthday from Slide and Slice! As our {tier} member, enjoy {offer} on your special day.',
// };
// export const render = (tpl, vars) =>
//   (tpl || '').replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));

/* ---------- helpers ---------- */
export const tierOf = (lifetime, r) => (lifetime >= r.gold ? 'Gold' : lifetime >= r.silver ? 'Silver' : 'Bronze');
export const earnFor = (amount, r) => Math.floor((amount / 100) * r.pointsPer100);
export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
export const fmtDT = (iso) =>
  new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
export const monthKey = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}`;
};
export const monthLabel = (key) => {
  const [y, m] = key.split('-');
  return new Date(+y, +m - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
};

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const daysText = (days = []) =>
  !days.length || days.length === 7 ? 'All days' : days.join(', ');

/* ---------- segments ---------- */
export const BUILTIN_SEGMENTS = ['All customers', 'Gold tier', 'Silver tier', 'Bronze tier', 'New customers'];


/* ---------- storage hook (same localStorage pattern as the other pages) ---------- */
// TODO: replace with API calls
const load = (k, d) => {
  try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; }
};
export function useStore(key, seed) {
  const [v, setV] = useState(() => load(key, typeof seed === 'function' ? seed() : seed));
  useEffect(() => localStorage.setItem(key, JSON.stringify(v)), [key, v]);
  return [v, setV];
}

/* ---------- demo data ---------- */
export const CUSTOMERS_SEED = [
  { id: 1, name: 'Priya S', mobile: '9876543210', dob: '1995-04-12' },
  { id: 2, name: 'Kumar R', mobile: '9123456780', dob: '1990-11-03' },
  { id: 3, name: 'Divya M', mobile: '9840011223', dob: '1996-09-26' },
  { id: 4, name: 'Anitha P', mobile: '9791122334', dob: '1992-01-18' },
  { id: 5, name: 'Rahul V', mobile: '9884455667', dob: '1998-07-07' },
  { id: 6, name: 'Meena K', mobile: '9710099887', dob: '1989-12-30' },
  { id: 7, name: 'Arun D', mobile: '9600123456', dob: '1994-03-21' },
  { id: 8, name: 'Sneha L', mobile: '9944556677', dob: '2000-10-15' },
];

// Demo data. Petpooja sends ONLY these per bill: customer, mobile, date, amount, points added, points used.
// [daysAgo, mobile, amount, pointsAdded, pointsUsed]
const BILLS = [
  // Gold demo: Priya S (1229 points added, 200 used, balance 1029) | Silver demo: Kumar R (603 points added)
  [100, '9876543210', 60000, 600, 0], [90, '9876543210', 45000, 450, 0], [45, '9876543210', 3000, 30, 200],
  [95, '9123456780', 30000, 300, 0], [80, '9123456780', 22000, 220, 0],
  [75, '9840011223', 12000, 120, 0], [60, '9876543210', 8000, 80, 0], [34, '9840011223', 900, 9, 0],
  [20, '9791122334', 520, 5, 0], [14, '9123456780', 7800, 78, 0], [9, '9876543210', 6500, 65, 0],
  [6, '9840011223', 1200, 12, 100], [5, '9884455667', 450, 4, 0], [3, '9944556677', 399, 3, 0],
  [2, '9710099887', 840, 8, 0], [1, '9123456780', 560, 5, 0], [0, '9876543210', 400, 4, 0],
];

export function buildLoyaltySeed(customers = CUSTOMERS_SEED) {
  const ledger = [];
  BILLS.forEach(([ago, mobile, bill, earned, redeemed], i) => {
    const c = customers.find((x) => x.mobile === mobile);
    if (!c) return;
    const ts = new Date(Date.now() - ago * 864e5 - i * 36e5).toISOString();
    ledger.push({ id: i + 1, ts, mobile, name: c.name, bill, earned, redeemed });
  });
  return { rules: DEFAULT_RULES, ledger };
}

/* We calculate the balance: running total of (points added - points used) per customer.
   Returns bills (newest first, each with prev/cur balance) and per-customer totals. */
export function withBalances(ledger = []) {
  const customers = {};
  const asc = [...ledger].sort((a, b) => new Date(a.ts) - new Date(b.ts)).map((l) => {
    const c = customers[l.mobile] || (customers[l.mobile] = { name: l.name, mobile: l.mobile, added: 0, used: 0, balance: 0, spend: 0, visits: 0, last: l.ts });
    const prev = c.balance;
    c.added += l.earned; c.used += l.redeemed; c.balance = prev + l.earned - l.redeemed;
    c.spend += l.bill; c.visits += 1; c.last = l.ts; c.name = l.name;
    return { ...l, prev, cur: c.balance };
  });
  return { bills: asc.reverse(), customers };
}

export const SEGMENT_STORE = 'ss_segments';
export const MSG_STORE = 'ss_messages';
