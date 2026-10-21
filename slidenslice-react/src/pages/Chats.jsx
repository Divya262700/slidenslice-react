// import { useEffect, useMemo, useRef, useState } from 'react';
// import { CUSTOMERS_SEED, useStore } from '../lib/loyalty.js';

// /* WhatsApp chat module (UI only).
//    TODO: replace localStorage with the WhatsApp Business API:
//      - incoming messages  -> webhook -> backend -> GET /api/chats
//      - send               -> POST /api/chats/:mobile/messages  (backend calls WhatsApp Cloud API)
//    message = { id, from: 'customer' | 'bot' | 'shop', text, ts, read } */

// const min = (m) => new Date(Date.now() - m * 60000).toISOString();
// let n = 0;
// const M = (from, text, ago, read = true) => ({ id: ++n, from, text, ts: min(ago), read });

// const seedChats = () => ({
//   '9876543210': { bot: true, msgs: [
//     M('bot', 'Hi Priya! Weekend ₹199 XL Pizza on Sat to Sun. Visit Slide and Slice to enjoy it.', 190),
//     M('customer', 'Table available aa Saturday night?', 185),
//     M('bot', 'Yes! Tables are available on Saturday. Time slots: 7:00 PM, 8:00 PM, 9:00 PM. Which slot would you like?', 185),
//     M('customer', '8 PM, 4 members', 180),
//     M('bot', 'Great! Your request for 4 members at 8:00 PM is noted. We will confirm shortly.', 180),
//     M('shop', 'Confirmed! See you on Saturday 🍕', 120),
//   ] },
//   '9123456780': { bot: true, msgs: [
//     M('bot', 'Thank you Kumar! Your bill of Rs.560 is received. 5 loyalty points added. Current points: 83.', 1500),
//     M('customer', 'Thanks! 😊', 1490, false),
//   ] },
//   '9840011223': { bot: true, msgs: [
//     M('bot', 'Dear Divya, Happy Birthday from Slide and Slice! As our Gold member, enjoy 25% off on your special day.', 3000),
//     M('customer', 'Thank you! Offer eppo varai irukku?', 25, false),
//     M('bot', 'This offer is valid till 30/11/2026.', 24),
//     M('customer', 'Ok will visit this weekend', 20, false),
//   ] },
//   '9791122334': { bot: true, msgs: [
//     M('customer', 'I have one doubt about my loyalty points', 600, false),
//     M('bot', 'Kindly contact us at the shop for further details.', 599),
//   ] },
// });

// const hm = (iso) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
// const dayKey = (iso) => new Date(iso).toDateString();
// const dayLabel = (iso) => {
//   const d = new Date(iso), t = new Date();
//   if (d.toDateString() === t.toDateString()) return 'Today';
//   if (d.toDateString() === new Date(t.getTime() - 864e5).toDateString()) return 'Yesterday';
//   return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
// };
// const listTime = (iso) => {
//   const lbl = dayLabel(iso);
//   return lbl === 'Today' ? hm(iso) : lbl;
// };
// const QUICK = ['Offer details', 'Table booking', 'Thank you!'];

// export default function Chats() {
//   const [customers] = useStore('ss_customers', CUSTOMERS_SEED);
//   const [chats, setChats] = useStore('ss_chats', seedChats);
//   const [active, setActive] = useState(null); // mobile number of the open chat
//   const [q, setQ] = useState('');
//   const [text, setText] = useState('');
//   const endRef = useRef(null);

//   const list = useMemo(
//     () =>
//       Object.entries(chats)
//         .map(([mobile, c]) => {
//           const cu = customers.find((x) => x.mobile === mobile);
//           const last = c.msgs[c.msgs.length - 1];
//           return { mobile, name: cu ? cu.name : mobile, last, unread: c.msgs.filter((m) => m.from === 'customer' && !m.read).length };
//         })
//         .filter((x) => (x.name + x.mobile).toLowerCase().includes(q.trim().toLowerCase()))
//         .sort((a, b) => new Date(b.last.ts) - new Date(a.last.ts)),
//     [chats, customers, q]
//   );

//   const open = (mobile) => {
//     setActive(mobile);
//     setText('');
//     setChats((p) => ({ ...p, [mobile]: { ...p[mobile], msgs: p[mobile].msgs.map((m) => ({ ...m, read: true })) } }));
//   };

//   const cur = active && chats[active];
//   const curName = active ? (list.find((x) => x.mobile === active) || { name: (customers.find((c) => c.mobile === active) || {}).name || active }).name : '';

//   useEffect(() => { endRef.current && endRef.current.scrollIntoView({ block: 'end' }); }, [active, cur && cur.msgs.length]);

//   const send = (e) => {
//     e && e.preventDefault();
//     const t = text.trim();
//     if (!t || !active) return;
//     const msg = { id: Date.now(), from: 'shop', text: t, ts: new Date().toISOString(), read: true };
//     setChats((p) => ({ ...p, [active]: { ...p[active], msgs: [...p[active].msgs, msg] } }));
//     setText('');
//   };

//   const toggleBot = () => setChats((p) => ({ ...p, [active]: { ...p[active], bot: !p[active].bot } }));

//   // group messages by day for the date separators
//   const groups = [];
//   (cur ? cur.msgs : []).forEach((m) => {
//     const k = dayKey(m.ts);
//     if (!groups.length || groups[groups.length - 1].k !== k) groups.push({ k, label: dayLabel(m.ts), msgs: [] });
//     groups[groups.length - 1].msgs.push(m);
//   });

//   return (
//     <>
//       <h1 className="wa-title">WhatsApp Chats</h1>
//       <div className={`wa ${active ? 'has-chat' : ''}`}>
//         {/* ---------- conversation list ---------- */}
//         <aside className="wa-list">
//           <div className="wa-list-head">
//             <input className="wa-search" placeholder="Search or start new chat" value={q} onChange={(e) => setQ(e.target.value)} />
//           </div>
//           <div className="wa-items">
//             {list.map((c) => (
//               <button key={c.mobile} className={`wa-item ${active === c.mobile ? 'on' : ''}`} onClick={() => open(c.mobile)}>
//                 <span className="wa-avatar">{c.name[0]}</span>
//                 <span className="wa-meta">
//                   <span className="wa-row"><b>{c.name}</b><small className={c.unread ? 'new' : ''}>{listTime(c.last.ts)}</small></span>
//                   <span className="wa-row">
//                     <span className="wa-preview">{c.last.from !== 'customer' && <i>{c.last.from === 'bot' ? '🤖 ' : '✓✓ '}</i>}{c.last.text}</span>
//                     {c.unread > 0 && <em className="wa-badge">{c.unread}</em>}
//                   </span>
//                 </span>
//               </button>
//             ))}
//             {!list.length && <p className="none" style={{ padding: 20 }}>No chats found</p>}
//           </div>
//         </aside>

//         {/* ---------- chat window ---------- */}
//         <section className="wa-chat">
//           {!cur ? (
//             <div className="wa-empty">
//               <div style={{ fontSize: 56 }}>💬</div>
//               <h3>Slide and Slice WhatsApp</h3>
//               <p>Select a chat to see the conversation with your customer.</p>
//             </div>
//           ) : (
//             <>
//               <header className="wa-head">
//                 <button className="wa-back" onClick={() => setActive(null)} aria-label="Back">←</button>
//                 <span className="wa-avatar">{curName[0]}</span>
//                 <span className="wa-who"><b>{curName}</b><small>+91 {active}</small></span>
//                 <button className={`wa-bot ${cur.bot ? 'on' : ''}`} onClick={toggleBot} title="AI bot replies automatically">
//                   🤖 AI bot: {cur.bot ? 'ON' : 'OFF'}
//                 </button>
//               </header>

//               <div className="wa-msgs">
//                 {groups.map((g) => (
//                   <div key={g.k}>
//                     <div className="wa-day"><span>{g.label}</span></div>
//                     {g.msgs.map((m) => (
//                       <div key={m.id} className={`wa-bubble ${m.from === 'customer' ? 'in' : 'out'}`}>
//                         {m.from === 'bot' && <small className="wa-tag">🤖 AI Bot</small>}
//                         <p>{m.text}</p>
//                         <small className="wa-time">{hm(m.ts)}{m.from !== 'customer' && <span className="tick"> ✓✓</span>}</small>
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//                 <div ref={endRef} />
//               </div>

//               <div className="wa-quick">
//                 {QUICK.map((t) => <button key={t} type="button" className="chip" onClick={() => setText(t)}>{t}</button>)}
//               </div>
//               <form className="wa-input" onSubmit={send}>
//                 <input placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} />
//                 <button type="submit" className="wa-send" aria-label="Send" disabled={!text.trim()}>➤</button>
//               </form>
//             </>
//           )}
//         </section>
//       </div>
//     </>
//   );
// }

import { useEffect, useMemo, useRef, useState } from 'react';
import { CUSTOMERS_SEED, useStore } from '../lib/loyalty.js';

/* WhatsApp chat module (UI only).
   TODO: replace localStorage with the WhatsApp Business API:
     - incoming messages  -> webhook -> backend -> GET /api/chats
     - send               -> POST /api/chats/:mobile/messages  (backend calls WhatsApp Cloud API)
   message = { id, from: 'customer' | 'bot' | 'shop', text, ts, read } */

const min = (m) => new Date(Date.now() - m * 60000).toISOString();
let n = 0;
const M = (from, text, ago, read = true) => ({ id: ++n, from, text, ts: min(ago), read });

const seedChats = () => ({
  '9876543210': { bot: true, msgs: [
    M('bot', 'Hi Priya! Weekend ₹199 XL Pizza on Sat to Sun. Visit Slide and Slice to enjoy it.', 190),
    M('customer', 'Table available aa Saturday night?', 185),
    M('bot', 'Yes! Tables are available on Saturday. Time slots: 7:00 PM, 8:00 PM, 9:00 PM. Which slot would you like?', 185),
    M('customer', '8 PM, 4 members', 180),
    M('bot', 'Great! Your request for 4 members at 8:00 PM is noted. We will confirm shortly.', 180),
    M('shop', 'Confirmed! See you on Saturday 🍕', 120),
  ] },
  '9123456780': { bot: true, msgs: [
    M('bot', 'Thank you Kumar! Your bill of Rs.560 is received. 5 loyalty points added. Current points: 83.', 1500),
    M('customer', 'Thanks! 😊', 1490, false),
  ] },
  '9840011223': { bot: true, msgs: [
    M('bot', 'Dear Divya, Happy Birthday from Slide and Slice! As our Gold member, enjoy 25% off on your special day.', 3000),
    M('customer', 'Thank you! Offer eppo varai irukku?', 25, false),
    M('bot', 'This offer is valid till 30/11/2026.', 24),
    M('customer', 'Ok will visit this weekend', 20, false),
  ] },
  '9791122334': { bot: true, msgs: [
    M('customer', 'I have one doubt about my loyalty points', 600, false),
    M('bot', 'Kindly contact us at the shop for further details.', 599),
  ] },
});

const hm = (iso) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const dayKey = (iso) => new Date(iso).toDateString();
const dayLabel = (iso) => {
  const d = new Date(iso), t = new Date();
  if (d.toDateString() === t.toDateString()) return 'Today';
  if (d.toDateString() === new Date(t.getTime() - 864e5).toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};
const listTime = (iso) => {
  const lbl = dayLabel(iso);
  return lbl === 'Today' ? hm(iso) : lbl;
};
const PALETTE = [['#ff8a5c', '#e8453c'], ['#f7b733', '#e8851d'], ['#3ecfa7', '#12a07c'], ['#6d9bff', '#4561e0'], ['#b57bff', '#8a3fd6'], ['#ff7aa8', '#d6336c']];
const avatarBg = (name) => {
  const h = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length;
  return `linear-gradient(135deg, ${PALETTE[h][0]}, ${PALETTE[h][1]})`;
};
const initial = (name) => (/^\d/.test(name) ? '👤' : name[0].toUpperCase());
const QUICK = ['Offer details', 'Table booking', 'Thank you!'];

export default function Chats() {
  const [customers] = useStore('ss_customers', CUSTOMERS_SEED);
  const [chats, setChats] = useStore('ss_chats', seedChats);
  const [active, setActive] = useState(null); // mobile number of the open chat
  const [q, setQ] = useState('');
  const [text, setText] = useState('');
  const endRef = useRef(null);

  const list = useMemo(
    () =>
      Object.entries(chats)
        .map(([mobile, c]) => {
          const cu = customers.find((x) => x.mobile === mobile);
          const last = c.msgs[c.msgs.length - 1];
          return { mobile, name: cu ? cu.name : mobile, last, unread: c.msgs.filter((m) => m.from === 'customer' && !m.read).length };
        })
        .filter((x) => (x.name + x.mobile).toLowerCase().includes(q.trim().toLowerCase()))
        .sort((a, b) => new Date(b.last.ts) - new Date(a.last.ts)),
    [chats, customers, q]
  );

  const open = (mobile) => {
    setActive(mobile);
    setText('');
    setChats((p) => ({ ...p, [mobile]: { ...p[mobile], msgs: p[mobile].msgs.map((m) => ({ ...m, read: true })) } }));
  };

  const cur = active && chats[active];
  const curName = active ? (list.find((x) => x.mobile === active) || { name: (customers.find((c) => c.mobile === active) || {}).name || active }).name : '';

  useEffect(() => { endRef.current && endRef.current.scrollIntoView({ block: 'end' }); }, [active, cur && cur.msgs.length]);

  const send = (e) => {
    e && e.preventDefault();
    const t = text.trim();
    if (!t || !active) return;
    const msg = { id: Date.now(), from: 'shop', text: t, ts: new Date().toISOString(), read: true };
    setChats((p) => ({ ...p, [active]: { ...p[active], msgs: [...p[active].msgs, msg] } }));
    setText('');
  };

  const toggleBot = () => setChats((p) => ({ ...p, [active]: { ...p[active], bot: !p[active].bot } }));

  // group messages by day for the date separators
  const groups = [];
  (cur ? cur.msgs : []).forEach((m) => {
    const k = dayKey(m.ts);
    if (!groups.length || groups[groups.length - 1].k !== k) groups.push({ k, label: dayLabel(m.ts), msgs: [] });
    groups[groups.length - 1].msgs.push(m);
  });

  return (
    <>
      <h1 className="wa-title">WhatsApp Chats</h1>
      <div className={`wa ${active ? 'has-chat' : ''}`}>
        {/* ---------- conversation list ---------- */}
        <aside className="wa-list">
          <div className="wa-list-head">
            <div className="wa-search-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
              </svg>
              <input className="wa-search" placeholder="Search name or mobile" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
          <div className="wa-items">
            {list.map((c) => (
              <button key={c.mobile} className={`wa-item ${active === c.mobile ? 'on' : ''}`} onClick={() => open(c.mobile)}>
                <span className="wa-avatar" style={{ background: avatarBg(c.name) }}>{initial(c.name)}</span>
                <span className="wa-meta">
                  <span className="wa-row"><b>{c.name}</b><small className={c.unread ? 'new' : ''}>{listTime(c.last.ts)}</small></span>
                  <span className="wa-row">
                    <span className="wa-preview">{c.last.from !== 'customer' && <i>{c.last.from === 'bot' ? '🤖 ' : '✓✓ '}</i>}{c.last.text}</span>
                    {c.unread > 0 && <em className="wa-badge">{c.unread}</em>}
                  </span>
                </span>
              </button>
            ))}
            {!list.length && <p className="none" style={{ padding: 20 }}>No chats found</p>}
          </div>
        </aside>

        {/* ---------- chat window ---------- */}
        <section className="wa-chat">
          {!cur ? (
            <div className="wa-empty">
              <div style={{ fontSize: 56 }}>💬</div>
              <h3>Slide and Slice WhatsApp</h3>
              <p>Select a chat to see the conversation with your customer.</p>
            </div>
          ) : (
            <>
              <header className="wa-head">
                <button className="wa-back" onClick={() => setActive(null)} aria-label="Back">←</button>
                <span className="wa-avatar" style={{ background: avatarBg(curName) }}>{initial(curName)}</span>
                <span className="wa-who"><b>{curName}</b><small>+91 {active}</small></span>
                <button className={`wa-bot ${cur.bot ? 'on' : ''}`} onClick={toggleBot} title="AI bot replies automatically">
                  🤖 AI bot: {cur.bot ? 'ON' : 'OFF'}
                </button>
              </header>

              <div className="wa-msgs">
                {groups.map((g) => (
                  <div key={g.k}>
                    <div className="wa-day"><span>{g.label}</span></div>
                    {g.msgs.map((m) => (
                      <div key={m.id} className={`wa-bubble ${m.from === 'customer' ? 'in' : 'out'}`}>
                        {m.from === 'bot' && <small className="wa-tag">🤖 AI Bot</small>}
                        <p>{m.text}</p>
                        <small className="wa-time">{hm(m.ts)}{m.from !== 'customer' && <span className="tick"> ✓✓</span>}</small>
                      </div>
                    ))}
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <div className="wa-quick">
                {QUICK.map((t) => <button key={t} type="button" className="chip" onClick={() => setText(t)}>{t}</button>)}
              </div>
              <form className="wa-input" onSubmit={send}>
                <input placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} />
                <button type="submit" className="wa-send" aria-label="Send" disabled={!text.trim()}>➤</button>
              </form>
            </>
          )}
        </section>
      </div>
    </>
  );
}
