// import { useEffect, useState } from 'react';
// import Confirm from '../components/Confirm.jsx';
// import DatePicker from '../components/DatePicker.jsx';
// import Select from '../components/Select.jsx';

// const TYPES = [
//     'Percentage discount',
//     'Flat amount off',
//     'Buy 1 Get 1',
//     'Free item',
//     'Combo offer'
// ];

// const SEED = [
//     {
//         id: 1,
//         name: 'Flat 20% OFF',
//         type: 'Percentage discount',
//         from: '2026-10-01',
//         to: '2026-10-31',
//         status: 'active'
//     },
//     {
//         id: 2,
//         name: 'Weekend Buy 1 Get 1',
//         type: 'Buy 1 Get 1',
//         from: '2026-10-10',
//         to: '2026-10-12',
//         status: 'inactive'
//     }
// ];

// const EMPTY = {
//     name: '',
//     type: '',
//     from: '',
//     to: '',
//     status: 'active'
// };

// const fmt = (d) => (d ? d.split('-').reverse().join('/') : '-');

// export default function Offers() {
//     // TODO: replace localStorage with API calls (GET/POST/PUT/DELETE)
//     const [rows, setRows] = useState(
//         () =>
//             JSON.parse(localStorage.getItem('ss_offers') || 'null') || SEED
//     );

//     const [modal, setModal] = useState(null);
//     const [del, setDel] = useState(null);
//     const [q, setQ] = useState('');

//     useEffect(() => {
//         localStorage.setItem('ss_offers', JSON.stringify(rows));
//     }, [rows]);

//     // Search filter
//     const filteredRows = rows.filter((r) => {
//         const searchText = q.trim().toLowerCase();

//         if (!searchText) return true;

//         return (
//             r.name.toLowerCase().includes(searchText) ||
//             r.type.toLowerCase().includes(searchText)
//         );
//     });

//     const save = (data) => {
//         if (data.id) {
//             setRows(
//                 rows.map((r) => (r.id === data.id ? data : r))
//             );
//         } else {
//             setRows([
//                 ...rows,
//                 {
//                     ...data,
//                     id: Date.now()
//                 }
//             ]);
//         }

//         setModal(null);
//     };

//     return (
//         <>
//             {/* Header */}
//             <div className="row between wrap">
//                 <h1>Offers</h1>

//                 <button
//                     className="btn primary"
//                     onClick={() =>
//                         setModal({
//                             mode: 'create',
//                             data: EMPTY
//                         })
//                     }
//                 >
//                     + Add Offer
//                 </button>
//             </div>

//             {/* Search */}
//             <div className="search-wrap">
//                 <input
//                     type="text"
//                     className="search"
//                     placeholder="Search offer name or type"
//                     value={q}
//                     onChange={(e) => setQ(e.target.value)}
//                 />

//                 <svg
//                     className="search-ic"
//                     width="18"
//                     height="18"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 >
//                     <circle cx="11" cy="11" r="7" />
//                     <path d="M21 21l-4.3-4.3" />
//                 </svg>
//             </div>

//             {/* Table */}
//             <div
//                 className="card table-wrap"
//                 style={{ marginTop: 14 }}
//             >
//                 <table className="responsive">
//                     <thead>
//                         <tr>
//                             <th>S.No</th>
//                             <th>Offer Name</th>
//                             <th>Type</th>
//                             <th>Valid From</th>
//                             <th>Valid To</th>
//                             <th>Status</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {filteredRows.map((r, i) => (
//                             <tr key={r.id}>
//                                 <td data-l="S.No">
//                                     {i + 1}
//                                 </td>

//                                 <td data-l="Offer Name">
//                                     {r.name}
//                                 </td>

//                                 <td data-l="Type">
//                                     {r.type}
//                                 </td>

//                                 <td data-l="Valid From">
//                                     {fmt(r.from)}
//                                 </td>

//                                 <td data-l="Valid To">
//                                     {fmt(r.to)}
//                                 </td>

//                                 <td data-l="Status">
//                                     <span
//                                         className={`badge ${r.status}`}
//                                     >
//                                         {r.status === 'active'
//                                             ? 'Active'
//                                             : 'Inactive'}
//                                     </span>
//                                 </td>

//                                 <td
//                                     data-l="Actions"
//                                     className="acts"
//                                 >
//                                     <button
//                                         className="btn ghost sm"
//                                         onClick={() =>
//                                             setModal({
//                                                 mode: 'edit',
//                                                 data: r
//                                             })
//                                         }
//                                     >
//                                         Edit
//                                     </button>

//                                     <button
//                                         className="btn danger sm"
//                                         onClick={() => setDel(r)}
//                                     >
//                                         Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}

//                         {/* No search results */}
//                         {!filteredRows.length && (
//                             <tr>
//                                 <td
//                                     colSpan="7"
//                                     className="none"
//                                 >
//                                     No offers found
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Add / Edit Modal */}
//             {modal && (
//                 <OfferModal
//                     {...modal}
//                     onSave={save}
//                     onClose={() => setModal(null)}
//                 />
//             )}

//             {/* Delete Confirmation */}
//             {del && (
//                 <Confirm
//                     text={`Are you sure you want to delete "${del.name}"?`}
//                     yes="Delete"
//                     onYes={() => {
//                         setRows(
//                             rows.filter((r) => r.id !== del.id)
//                         );
//                         setDel(null);
//                     }}
//                     onNo={() => setDel(null)}
//                 />
//             )}
//         </>
//     );
// }

// function OfferModal({
//     mode,
//     data,
//     onSave,
//     onClose
// }) {
//     const [f, setF] = useState(data);
//     const [err, setErr] = useState({});

//     const submit = (ev) => {
//         ev.preventDefault();

//         const e = {};

//         if (!f.name.trim()) {
//             e.name = 'Offer name is required';
//         }

//         if (!f.type) {
//             e.type = 'Select an offer type';
//         }

//         if (!f.from) {
//             e.from = 'Start date is required';
//         }

//         if (!f.to) {
//             e.to = 'End date is required';
//         } else if (f.from && f.to < f.from) {
//             e.to = 'End date must be after start date';
//         }

//         setErr(e);

//         if (!Object.keys(e).length) {
//             onSave({
//                 ...f,
//                 name: f.name.trim()
//             });
//         }
//     };

//     return (
//         <div
//             className="overlay"
//             onClick={onClose}
//         >
//             <form
//                 className="modal"
//                 onClick={(e) => e.stopPropagation()}
//                 onSubmit={submit}
//                 noValidate
//             >
//                 <h2>
//                     {mode === 'edit'
//                         ? 'Edit Offer'
//                         : 'Add Offer'}
//                 </h2>

//                 {/* Offer Name */}
//                 <label>Offer Name</label>

//                 <input
//                     value={f.name}
//                     placeholder="Enter offer name"
//                     onChange={(e) =>
//                         setF({
//                             ...f,
//                             name: e.target.value
//                         })
//                     }
//                     className={err.name ? 'err' : ''}
//                 />

//                 {err.name && (
//                     <small className="msg">
//                         {err.name}
//                     </small>
//                 )}

//                 {/* Offer Type */}
//                 <label>Offer Type</label>

//                 <Select
//                     value={f.type}
//                     options={TYPES}
//                     placeholder="Select type"
//                     error={!!err.type}
//                     onChange={(v) =>
//                         setF({
//                             ...f,
//                             type: v
//                         })
//                     }
//                 />

//                 {err.type && (
//                     <small className="msg">
//                         {err.type}
//                     </small>
//                 )}

//                 {/* Dates */}
//                 <div className="two-col">
//                     <div>
//                         <label>Valid From</label>

//                         <DatePicker
//                             value={f.from}
//                             error={!!err.from}
//                             onChange={(v) =>
//                                 setF({
//                                     ...f,
//                                     from: v,
//                                     to:
//                                         f.to &&
//                                             v &&
//                                             f.to < v
//                                             ? ''
//                                             : f.to
//                                 })
//                             }
//                         />

//                         {err.from && (
//                             <small className="msg">
//                                 {err.from}
//                             </small>
//                         )}
//                     </div>

//                     <div>
//                         <label>Valid To</label>

//                         <DatePicker
//                             value={f.to}
//                             min={f.from || undefined}
//                             error={!!err.to}
//                             onChange={(v) =>
//                                 setF({
//                                     ...f,
//                                     to: v
//                                 })
//                             }
//                         />

//                         {err.to && (
//                             <small className="msg">
//                                 {err.to}
//                             </small>
//                         )}
//                     </div>
//                 </div>

//                 {/* Status */}
//                 <label>Status</label>

//                 <div className="switch">
//                     <button
//                         type="button"
//                         className={
//                             f.status === 'active'
//                                 ? 'on'
//                                 : ''
//                         }
//                         aria-label="Toggle status"
//                         onClick={() =>
//                             setF({
//                                 ...f,
//                                 status:
//                                     f.status === 'active'
//                                         ? 'inactive'
//                                         : 'active'
//                             })
//                         }
//                     />

//                     <span>
//                         {f.status === 'active'
//                             ? 'Active'
//                             : 'Inactive'}
//                     </span>
//                 </div>

//                 {/* Buttons */}
//                 <div className="row end">
//                     <button
//                         type="button"
//                         className="btn ghost"
//                         onClick={onClose}
//                     >
//                         Cancel
//                     </button>

//                     <button
//                         className="btn primary"
//                         type="submit"
//                     >
//                         {mode === 'edit'
//                             ? 'Update'
//                             : 'Create'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }



// import { useState } from 'react';
// import Confirm from '../components/Confirm.jsx';
// import DatePicker from '../components/DatePicker.jsx';
// import Select from '../components/Select.jsx';
// import {
//   CUSTOMERS_SEED, buildLoyaltySeed, useStore, inSegment, tierOf, render, TPL,
//   BUILTIN_SEGMENTS, DAYS, daysText, SEGMENT_STORE, MSG_STORE,
// } from '../lib/loyalty.js';

// const TYPES = ['Percentage discount', 'Flat amount off', 'Fixed price item', 'Buy 1 Get 1', 'Free item', 'Combo offer'];
// const NEEDS_VALUE = { 'Percentage discount': '%', 'Flat amount off': '₹', 'Fixed price item': '₹' };
// const ADD_SEG = '+ Add new segment';
// const DISCLAIMER = 'Loyalty points cannot be redeemed on offer items.';

// const SEED = [
//   { id: 1, name: 'Flat 20% OFF', type: 'Percentage discount', value: 20, segment: 'All customers', days: [], from: '2026-10-01', to: '2026-10-31', message: '', disclaimer: true, birthday: false, status: 'active', sentCount: 0 },
//   { id: 2, name: 'Weekend ₹199 XL Pizza', type: 'Fixed price item', value: 199, segment: 'All customers', days: ['Sat', 'Sun'], from: '2026-10-10', to: '2026-12-31', message: '', disclaimer: true, birthday: false, status: 'active', sentCount: 0 },
//   { id: 3, name: 'Birthday 25% OFF', type: 'Percentage discount', value: 25, segment: 'Gold tier', days: [], from: '2026-10-01', to: '2026-12-31', message: '', disclaimer: true, birthday: true, status: 'inactive', sentCount: 0 },
// ];
// const EMPTY = { name: '', type: '', value: '', segment: 'All customers', days: [], from: '', to: '', message: '', disclaimer: true, birthday: false, status: 'active', sentCount: 0 };

// const fmt = (d) => (d ? d.split('-').reverse().join('/') : '-');
// const offerLabel = (o) => (NEEDS_VALUE[o.type] === '%' ? `${o.value}% off` : NEEDS_VALUE[o.type] === '₹' ? (o.type === 'Fixed price item' ? `Only ₹${o.value}` : `₹${o.value} off`) : o.name);

// const messageFor = (o, vars) => {
//   const base = o.message || (o.birthday ? TPL.birthday : TPL.offer);
//   const text = render(base, { offer: offerLabel(o), days: daysText(o.days), valid: `${fmt(o.from)} to ${fmt(o.to)}`, ...vars });
//   return o.disclaimer ? `${text} ${DISCLAIMER}` : text;
// };

// export default function Offers() {
//   // TODO: replace localStorage with API calls (GET/POST/PUT/DELETE + send via WhatsApp/SMS)
//   const [rows, setRows] = useState(() => JSON.parse(localStorage.getItem('ss_offers') || 'null') || SEED);
//   const [custom, setCustom] = useStore(SEGMENT_STORE, []);
//   const [customers] = useStore('ss_customers', CUSTOMERS_SEED);
//   const [loy] = useStore('ss_loyalty', () => buildLoyaltySeed());
//   const [, setLog] = useStore(MSG_STORE, []);

//   const [modal, setModal] = useState(null);
//   const [del, setDel] = useState(null);
//   const [send, setSend] = useState(null);
//   const [q, setQ] = useState('');

//   const persist = (next) => { setRows(next); localStorage.setItem('ss_offers', JSON.stringify(next)); };
//   const segments = [...BUILTIN_SEGMENTS, ...custom.map((c) => c.name)];
//   const recipients = (seg) => customers.filter((c) => inSegment(seg, c, loy.accounts[c.mobile], loy.rules, custom));

//   const list = rows.filter((r) => (r.name + r.type + r.segment).toLowerCase().includes(q.trim().toLowerCase()));

//   const save = (data) => {
//     persist(data.id ? rows.map((r) => (r.id === data.id ? data : r)) : [...rows, { ...data, id: Date.now() }]);
//     setModal(null);
//   };

//   const confirmSend = () => {
//     const n = recipients(send.segment).length;
//     setLog((l) => [...l, { id: Date.now(), ts: new Date().toISOString(), offerId: send.id, count: n }]);
//     persist(rows.map((r) => (r.id === send.id ? { ...r, sentCount: (r.sentCount || 0) + n, lastSent: new Date().toISOString() } : r)));
//     setSend(null);
//   };

//   return (
//     <>
//       <div className="row between wrap">
//         <h1>Offers</h1>
//         <button className="btn primary" onClick={() => setModal({ mode: 'create', data: EMPTY })}>+ Add Offer</button>
//       </div>

//       <div className="search-wrap">
//         <input className="search" placeholder="Search offer, type or segment" value={q} onChange={(e) => setQ(e.target.value)} />
//         <svg className="search-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
//         </svg>
//       </div>

//       <div className="card table-wrap" style={{ marginTop: 14 }}>
//         <table className="responsive">
//           <thead>
//             <tr><th>S.No</th><th>Offer Name</th><th>Type</th><th>Segment</th><th>Days</th><th>Valid</th><th>Status</th><th>Sent</th><th>Actions</th></tr>
//           </thead>
//           <tbody>
//             {list.map((r, i) => (
//               <tr key={r.id}>
//                 <td data-l="S.No">{i + 1}</td>
//                 <td data-l="Offer Name">{r.name}</td>
//                 <td data-l="Type">{r.type}{NEEDS_VALUE[r.type] ? ` (${NEEDS_VALUE[r.type] === '%' ? r.value + '%' : '₹' + r.value})` : ''}</td>
//                 <td data-l="Segment">{r.segment}{r.birthday && <small className="ok"> · birthday</small>}</td>
//                 <td data-l="Days">{daysText(r.days)}</td>
//                 <td data-l="Valid">{fmt(r.from)} - {fmt(r.to)}</td>
//                 <td data-l="Status"><span className={`badge ${r.status}`}>{r.status === 'active' ? 'Active' : 'Inactive'}</span></td>
//                 <td data-l="Sent">{r.birthday ? 'Auto' : r.sentCount || 0}</td>
//                 <td data-l="Actions" className="acts">
//                   {!r.birthday && (
//                     <button className="btn primary sm" disabled={r.status !== 'active'} onClick={() => setSend(r)}>Send</button>
//                   )}
//                   <button className="btn ghost sm" onClick={() => setModal({ mode: 'edit', data: r })}>Edit</button>
//                   <button className="btn danger sm" onClick={() => setDel(r)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//             {!list.length && <tr><td colSpan="9" className="none">No offers found</td></tr>}
//           </tbody>
//         </table>
//       </div>

//       {modal && (
//         <OfferModal {...modal} segments={segments} onSave={save} onClose={() => setModal(null)}
//           onNewSegment={(seg) => setCustom([...custom, seg])} />
//       )}

//       {send && (
//         <div className="overlay" onClick={() => setSend(null)}>
//           <div className="modal wide" onClick={(e) => e.stopPropagation()}>
//             <h2>Send "{send.name}"</h2>
//             <p className="confirm-text">
//               This will go to {recipients(send.segment).length} customer(s) in "{send.segment}".
//             </p>
//             <label>Message preview</label>
//             <div className="msg-preview"><p>
//               {messageFor(send, {
//                 name: (recipients(send.segment)[0] || { name: 'Customer' }).name.split(' ')[0],
//                 tier: tierOf(0, loy.rules),
//               })}
//             </p></div>
//             <div className="row end">
//               <button className="btn ghost" onClick={() => setSend(null)}>Cancel</button>
//               <button className="btn primary" disabled={!recipients(send.segment).length} onClick={confirmSend}>Send now</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {del && (
//         <Confirm text={`Are you sure you want to delete "${del.name}"?`} yes="Delete"
//           onYes={() => { persist(rows.filter((r) => r.id !== del.id)); setDel(null); }} onNo={() => setDel(null)} />
//       )}
//     </>
//   );
// }

// function OfferModal({ mode, data, segments, onSave, onClose, onNewSegment }) {
//   const [f, setF] = useState({ ...EMPTY, ...data });
//   const [err, setErr] = useState({});
//   const [seg, setSeg] = useState(null); // new segment form
//   const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
//   const unit = NEEDS_VALUE[f.type];

//   const toggleDay = (d) => set('days', f.days.includes(d) ? f.days.filter((x) => x !== d) : [...f.days, d]);

//   const submit = (ev) => {
//     ev.preventDefault();
//     const e = {};
//     if (!f.name.trim()) e.name = 'Offer name is required';
//     if (!f.type) e.type = 'Select an offer type';
//     if (unit && (!f.value || Number(f.value) <= 0)) e.value = 'Enter a value';
//     if (unit === '%' && Number(f.value) > 100) e.value = 'Cannot be more than 100%';
//     if (!f.from) e.from = 'Start date is required';
//     if (!f.to) e.to = 'End date is required';
//     else if (f.from && f.to < f.from) e.to = 'End date must be after start date';
//     setErr(e);
//     if (!Object.keys(e).length) onSave({ ...f, name: f.name.trim(), value: unit ? Number(f.value) : '' });
//   };

//   const saveSeg = () => {
//     if (!seg.name.trim() || segments.includes(seg.name.trim())) return setSeg({ ...seg, err: 'Enter a unique segment name' });
//     onNewSegment({ name: seg.name.trim(), min: Number(seg.min) || 0, max: seg.max === '' ? 0 : Number(seg.max) });
//     set('segment', seg.name.trim());
//     setSeg(null);
//   };

//   const preview = messageFor({ ...f, name: f.name || 'Your offer' }, { name: 'Divya', tier: 'Gold' });

//   return (
//     <div className="overlay" onClick={onClose}>
//       <form className="modal wide" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
//         <h2>{mode === 'edit' ? 'Edit Offer' : 'Add Offer'}</h2>

//         <label>Offer Name</label>
//         <input value={f.name} placeholder="Enter offer name" className={err.name ? 'err' : ''} onChange={(e) => set('name', e.target.value)} />
//         {err.name && <small className="msg">{err.name}</small>}

//         <div className="two-col">
//           <div>
//             <label>Discount Type</label>
//             <Select value={f.type} options={TYPES} placeholder="Select type" error={!!err.type} onChange={(v) => set('type', v)} />
//             {err.type && <small className="msg">{err.type}</small>}
//           </div>
//           {unit && (
//             <div>
//               <label>Value ({unit})</label>
//               <input type="number" min="0" value={f.value} className={err.value ? 'err' : ''} onChange={(e) => set('value', e.target.value)} />
//               {err.value && <small className="msg">{err.value}</small>}
//             </div>
//           )}
//         </div>

//         <label>Segment (who gets this offer)</label>
//         <Select value={f.segment} options={[...segments, ADD_SEG]}
//           onChange={(v) => (v === ADD_SEG ? setSeg({ name: '', min: '', max: '', err: '' }) : set('segment', v))} />
//         {seg && (
//           <div className="seg-box">
//             <input placeholder="Segment name" value={seg.name} onChange={(e) => setSeg({ ...seg, name: e.target.value })} />
//             <div className="two-col">
//               <input type="number" min="0" placeholder="Min points" value={seg.min} onChange={(e) => setSeg({ ...seg, min: e.target.value })} />
//               <input type="number" min="0" placeholder="Max points (optional)" value={seg.max} onChange={(e) => setSeg({ ...seg, max: e.target.value })} />
//             </div>
//             {seg.err && <small className="msg">{seg.err}</small>}
//             <div className="row end" style={{ marginTop: 8 }}>
//               <button type="button" className="btn ghost sm" onClick={() => setSeg(null)}>Cancel</button>
//               <button type="button" className="btn primary sm" onClick={saveSeg}>Add segment</button>
//             </div>
//           </div>
//         )}

//         <label>Window (days the offer works)</label>
//         <div className="chips">
//           {DAYS.map((d) => (
//             <button type="button" key={d} className={`chip ${f.days.includes(d) ? 'on' : ''}`} onClick={() => toggleDay(d)}>{d}</button>
//           ))}
//         </div>
//         <small className="hint">{daysText(f.days)}. Leave empty for all days.</small>

//         <div className="two-col">
//           <div>
//             <label>Valid From</label>
//             <DatePicker value={f.from} error={!!err.from} onChange={(v) => setF((p) => ({ ...p, from: v, to: p.to && v && p.to < v ? '' : p.to }))} />
//             {err.from && <small className="msg">{err.from}</small>}
//           </div>
//           <div>
//             <label>Valid To</label>
//             <DatePicker value={f.to} min={f.from || undefined} error={!!err.to} onChange={(v) => set('to', v)} />
//             {err.to && <small className="msg">{err.to}</small>}
//           </div>
//         </div>

//         <label>Message (optional)</label>
//         <textarea rows="3" value={f.message} placeholder="Leave empty to use the default message. Use {name} {offer} {days} {valid} {tier}"
//           onChange={(e) => set('message', e.target.value)} />

//         <div className="switch" style={{ marginTop: 12 }}>
//           <button type="button" className={f.disclaimer ? 'on' : ''} aria-label="Toggle disclaimer" onClick={() => set('disclaimer', !f.disclaimer)} />
//           <span>Add "no loyalty points on offer items" disclaimer</span>
//         </div>
//         <div className="switch" style={{ marginTop: 12 }}>
//           <button type="button" className={f.birthday ? 'on' : ''} aria-label="Toggle birthday" onClick={() => set('birthday', !f.birthday)} />
//           <span>Send automatically on customer's birthday</span>
//         </div>

//         <label>Preview</label>
//         <div className="msg-preview"><p>{preview}</p></div>

//         <label>Status</label>
//         <div className="switch">
//           <button type="button" className={f.status === 'active' ? 'on' : ''} aria-label="Toggle status"
//             onClick={() => set('status', f.status === 'active' ? 'inactive' : 'active')} />
//           <span>{f.status === 'active' ? 'Active' : 'Inactive'}</span>
//         </div>

//         <div className="row end">
//           <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
//           <button className="btn primary" type="submit">{mode === 'edit' ? 'Update' : 'Create'}</button>
//         </div>
//       </form>
//     </div>
//   );
// }


import { useState } from 'react';
import Confirm from '../components/Confirm.jsx';
import DatePicker from '../components/DatePicker.jsx';
import Select from '../components/Select.jsx';
import { DAYS } from '../lib/loyalty.js';

/* Offers are created by the shop owner. Every "when" setting is optional and they combine:
   period (start/end date) + day window (Mon to Sat) + dates of every month + time of day. */
const KEY = 'ss_offers_v3';
const TYPES = ['Percentage discount', 'Flat amount off', 'Fixed price item', 'Buy 1 Get 1', 'Free item', 'Combo offer'];
const UNIT = { 'Percentage discount': '%', 'Flat amount off': '₹', 'Fixed price item': '₹' };

const SEED = [
  { id: 1, name: 'Diwali ₹199 XL Pizza', type: 'Fixed price item', value: 199, from: '2026-11-05', to: '2026-11-10', dFrom: 'Mon', dTo: 'Sun', mFrom: '', mTo: '', tFrom: '', tTo: '', note: '', status: 'active' },
  { id: 2, name: 'Mon-Sat 20% OFF', type: 'Percentage discount', value: 20, from: '2026-10-01', to: '', dFrom: 'Mon', dTo: 'Sat', mFrom: '', mTo: '', tFrom: '', tTo: '', note: '', status: 'active' },
  { id: 3, name: 'First Week Buy 1 Get 1', type: 'Buy 1 Get 1', value: '', from: '2026-10-01', to: '', dFrom: 'Mon', dTo: 'Sun', mFrom: 1, mTo: 7, tFrom: '', tTo: '', note: '', status: 'active' },
];
const EMPTY = { name: '', type: '', value: '', from: '', to: '', dFrom: 'Mon', dTo: 'Sun', mFrom: '', mTo: '', tFrom: '', tTo: '', note: '', status: 'active' };

/* ---------- helpers ---------- */
const pad = (n) => String(n).padStart(2, '0');
const fmt = (d) => (d ? d.split('-').reverse().join('/') : '');
const ord = (n) => n + (['th', 'st', 'nd', 'rd'][(n % 100 > 10 && n % 100 < 14) || n % 10 > 3 ? 0 : n % 10]);
const t12 = (t) => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`; };

const allDays = (o) => !o.dFrom || !o.dTo || (o.dFrom === 'Mon' && o.dTo === 'Sun');
const inWindow = (o, idx) => {
  if (allDays(o)) return true;
  const a = DAYS.indexOf(o.dFrom), b = DAYS.indexOf(o.dTo);
  return a <= b ? idx >= a && idx <= b : idx >= a || idx <= b; // wraps, eg Fri to Mon
};
const hasMonth = (o) => o.mFrom !== '' && o.mTo !== '' && o.mFrom != null && o.mTo != null;
const hasTime = (o) => !!(o.tFrom && o.tTo);

const discountText = (o) =>
  UNIT[o.type] === '%' ? `${o.value}% off` : o.type === 'Fixed price item' ? `Only ₹${o.value}` : UNIT[o.type] === '₹' ? `₹${o.value} off` : o.type;

// list of readable lines: period / days / dates of month / time
const whenLines = (o) => {
  const out = [];
  out.push(o.from && o.to ? `${fmt(o.from)} to ${fmt(o.to)}` : o.from ? `From ${fmt(o.from)} (no end date)` : o.to ? `Until ${fmt(o.to)}` : 'Any date');
  if (!allDays(o)) out.push(o.dFrom === o.dTo ? `Only ${o.dFrom}` : `${o.dFrom} to ${o.dTo}`);
  if (hasMonth(o)) out.push(`${ord(+o.mFrom)} to ${ord(+o.mTo)} of every month`);
  if (hasTime(o)) out.push(`${t12(o.tFrom)} - ${t12(o.tTo)}`);
  return out;
};

// accept rows saved by older versions (schedule: range / weekly / monthly, days[])
const normalize = (o) => {
  const n = { ...EMPTY, ...o };
  if (o.days && o.days.length && !o.dFrom) { n.dFrom = o.days[0]; n.dTo = o.days[o.days.length - 1]; }
  delete n.days; delete n.schedule;
  return n;
};
const loadRows = () => {
  try {
    const v3 = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (v3) return v3.map(normalize);
    const v2 = JSON.parse(localStorage.getItem('ss_offers_v2') || 'null');
    if (v2) { const m = v2.map(normalize); localStorage.setItem(KEY, JSON.stringify(m)); return m; }
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
            <tr><th>S.No</th><th>Offer Name</th><th>Discount</th><th>When</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {list.map((r, i) => {
              return (
                <tr key={r.id}>
                  <td data-l="S.No">{i + 1}</td>
                  <td data-l="Offer Name">{r.name}</td>
                  <td data-l="Discount">{discountText(r)}</td>
                  <td data-l="When">{whenLines(r).map((l) => <div key={l}>{l}</div>)}</td>
                  <td data-l="Status"><span className={`badge ${r.status}`}>{r.status === 'active' ? 'Active' : 'Inactive'}</span></td>
                  <td data-l="Actions" className="acts">
                    <button className="btn ghost sm" onClick={() => setModal({ mode: 'edit', data: r })}>Edit</button>
                    <button className="btn danger sm" onClick={() => setDel(r)}>Delete</button>
                  </td>
                </tr>
              );
            })}
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

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!f.name.trim()) e.name = 'Offer name is required';
    if (!f.type) e.type = 'Select an offer type';
    if (unit && (!f.value || Number(f.value) <= 0)) e.value = 'Enter a value';
    if (unit === '%' && Number(f.value) > 100) e.value = 'Cannot be more than 100%';
    if (f.from && f.to && f.to < f.from) e.to = 'End date must be after start date';
    const m1 = f.mFrom === '' ? null : +f.mFrom, m2 = f.mTo === '' ? null : +f.mTo;
    if ((m1 === null) !== (m2 === null)) e.month = 'Fill both dates, or leave both empty';
    else if (m1 !== null && !(m1 >= 1 && m1 <= 31 && m2 >= 1 && m2 <= 31 && m1 <= m2)) e.month = 'Enter dates 1-31, "to" after "from"';
    if (!f.tFrom !== !f.tTo) e.time = 'Fill both times, or leave both empty';
    else if (f.tFrom && f.tTo && f.tTo <= f.tFrom) e.time = 'End time must be after start time';
    setErr(e);
    if (!Object.keys(e).length) onSave({ ...f, name: f.name.trim(), value: unit ? Number(f.value) : '' });
  };

  const summary = whenLines(f).join(' · ');

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal wide" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <h2>{mode === 'edit' ? 'Edit Offer' : 'Add Offer'}</h2>

        <label>Offer Name</label>
        <input value={f.name} placeholder="Eg: Diwali Special" className={err.name ? 'err' : ''} onChange={(e) => set('name', e.target.value)} />
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

        <label>Offer period (optional)</label>
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

        <label>Window - days of the week (optional)</label>
        <div className="two-col">
          <Select value={f.dFrom} options={DAYS} placeholder="From day" onChange={(v) => set('dFrom', v)} />
          <Select value={f.dTo} options={DAYS} placeholder="To day" onChange={(v) => set('dTo', v)} />
        </div>
        <small className="hint">Mon to Sun = every day.</small>

        <label>Dates of every month (optional)</label>
        <div className="two-col">
          <input type="number" min="1" max="31" placeholder="From date (1-31)" value={f.mFrom} onChange={(e) => set('mFrom', e.target.value)} />
          <input type="number" min="1" max="31" placeholder="To date (1-31)" value={f.mTo} onChange={(e) => set('mTo', e.target.value)} />
        </div>
        {err.month && <small className="msg">{err.month}</small>}

        <label>Time of day (optional)</label>
        <div className="two-col">
          <input type="time" value={f.tFrom} onChange={(e) => set('tFrom', e.target.value)} />
          <input type="time" value={f.tTo} onChange={(e) => set('tTo', e.target.value)} />
        </div>
        {err.time && <small className="msg">{err.time}</small>}

        <label>Note / terms (optional)</label>
        <input value={f.note} placeholder="Eg: Not valid with loyalty points" onChange={(e) => set('note', e.target.value)} />

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
