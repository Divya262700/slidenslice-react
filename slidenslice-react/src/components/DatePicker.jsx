// import { useState, useRef, useEffect } from 'react';

// const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
// const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
// const pad = (n) => String(n).padStart(2, '0');
// const toStr = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
// const parse = (s) => (s ? s.split('-').map(Number) : null);

// function Dropdown({ label, options, value, onChange, width }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);
//   const listRef = useRef(null);

//   useEffect(() => {
//     if (!open) return;
//     const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener('mousedown', close);
//     return () => document.removeEventListener('mousedown', close);
//   }, [open]);

//   useEffect(() => {
//     if (open && listRef.current) {
//       const el = listRef.current.querySelector('[data-sel="true"]');
//       if (el) el.scrollIntoView({ block: 'center' });
//     }
//   }, [open]);

//   return (
//     <div className="ddn" ref={ref} style={{ width }}>
//       <button type="button" className="ddn-btn" onClick={() => setOpen((o) => !o)}>
//         {label}
//         <svg width="10" height="6" viewBox="0 0 10 6"><path d="M0 0h10L5 6z" fill="currentColor" /></svg>
//       </button>
//       {open && (
//         <div className="ddn-list" ref={listRef}>
//           {options.map((o) => (
//             <div
//               key={o.value}
//               data-sel={o.value === value}
//               className={`ddn-opt ${o.value === value ? 'sel' : ''}`}
//               onClick={() => { onChange(o.value); setOpen(false); }}
//             >
//               {o.label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function DatePicker({ value, onChange, max, disabled, error, placeholder = 'DD/MM/YYYY' }) {
//   const t = new Date();
//   const todayStr = toStr(t.getFullYear(), t.getMonth(), t.getDate());
//   const v = parse(value);
//   const [open, setOpen] = useState(false);
//   const [year, setYear] = useState(v ? v[0] : t.getFullYear());
//   const [month, setMonth] = useState(v ? v[1] - 1 : t.getMonth());

//   const maxStr = max || todayStr;
//   const maxYear = parse(maxStr)[0];
//   const years = Array.from({ length: 101 }, (_, i) => maxYear - i);

//   const show = v ? `${pad(v[2])}/${pad(v[1])}/${v[0]}` : '';
//   const first = new Date(year, month, 1).getDay();
//   const count = new Date(year, month + 1, 0).getDate();
//   const cells = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];

//   const openPicker = () => {
//     if (disabled) return;
//     if (v) { setYear(v[0]); setMonth(v[1] - 1); }
//     setOpen(true);
//   };
//   const move = (step) => {
//     const d = new Date(year, month + step, 1);
//     setYear(d.getFullYear());
//     setMonth(d.getMonth());
//   };
//   const pick = (d) => {
//     onChange(toStr(year, month, d));
//     setOpen(false);
//   };

//   const nextBlocked = toStr(year, month + 1, 1) > maxStr && new Date(year, month + 1, 1) > new Date(maxStr);

//   return (
//     <div className="dp">
//       <button type="button" className={`dp-input ${error ? 'err' : ''}`} onClick={openPicker} disabled={disabled}>
//         <span className={show ? '' : 'ph'}>{show || placeholder}</span>
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <rect x="3" y="5" width="18" height="16" rx="3" />
//           <path d="M3 10h18M8 3v4M16 3v4" />
//         </svg>
//       </button>

//       {open && (
//         <>
//           <div className="dp-back" onClick={() => setOpen(false)} />
//           <div className="dp-pop">
//             <div className="dp-head">
//               <button type="button" className="dp-nav" onClick={() => move(-1)} aria-label="Previous month">
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
//               </button>
//               <div className="dp-sel">
//                 <Dropdown label={MONTHS[month]} value={month} onChange={setMonth} width="118px"
//                   options={MONTHS.map((m, i) => ({ value: i, label: m }))} />
//                 <Dropdown label={String(year)} value={year} onChange={setYear} width="76px"
//                   options={years.map((y) => ({ value: y, label: String(y) }))} />
//               </div>
//               <button type="button" className="dp-nav" onClick={() => move(1)} disabled={nextBlocked} aria-label="Next month">
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
//               </button>
//             </div>

//             <div className="dp-grid dp-days">{DAYS.map((d) => <span key={d}>{d}</span>)}</div>
//             <div className="dp-grid">
//               {cells.map((d, i) => {
//                 if (!d) return <span key={`e${i}`} />;
//                 const s = toStr(year, month, d);
//                 return (
//                   <button
//                     type="button"
//                     key={s}
//                     disabled={s > maxStr}
//                     className={`dp-day ${s === value ? 'sel' : ''} ${s === todayStr ? 'today' : ''}`}
//                     onClick={() => pick(d)}
//                   >
//                     {d}
//                   </button>
//                 );
//               })}
//             </div>

//             <div className="dp-foot">
//               <button type="button" onClick={() => onChange('')}>Clear</button>
//               <button type="button" onClick={() => setOpen(false)}>Close</button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { useState, useRef, useEffect } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const pad = (n) => String(n).padStart(2, '0');
const toStr = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const parse = (s) => (s ? s.split('-').map(Number) : null);

function Dropdown({ label, options, value, onChange, width }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.querySelector('[data-sel="true"]');
      if (el) el.scrollIntoView({ block: 'center' });
    }
  }, [open]);

  return (
    <div className="ddn" ref={ref} style={{ width }}>
      <button type="button" className="ddn-btn" onClick={() => setOpen((o) => !o)}>
        {label}
        <svg width="10" height="6" viewBox="0 0 10 6"><path d="M0 0h10L5 6z" fill="currentColor" /></svg>
      </button>
      {open && (
        <div className="ddn-list" ref={listRef}>
          {options.map((o) => (
            <div
              key={o.value}
              data-sel={o.value === value}
              className={`ddn-opt ${o.value === value ? 'sel' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DatePicker({ value, onChange, min, max, disabled, error, placeholder = 'DD/MM/YYYY' }) {
  const t = new Date();
  const curYear = t.getFullYear();
  const todayStr = toStr(curYear, t.getMonth(), t.getDate());
  const v = parse(value);
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(v ? v[0] : curYear);
  const [month, setMonth] = useState(v ? v[1] - 1 : t.getMonth());

  // year list: max/min kudutha athu padi, illana innaikku +-5 years
  let top = max ? parse(max)[0] : curYear + 5;
  let bottom = min ? parse(min)[0] : max ? top - 100 : curYear - 5;
  if (min && !max) top = Math.max(top, parse(min)[0] + 5);
  if (v) { top = Math.max(top, v[0]); bottom = Math.min(bottom, v[0]); }
  const years = Array.from({ length: top - bottom + 1 }, (_, i) => top - i);

  const show = v ? `${pad(v[2])}/${pad(v[1])}/${v[0]}` : '';
  const first = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];

  const openPicker = () => {
    if (disabled) return;
    const base = v || (min ? parse(min) : null);
    if (base) { setYear(base[0]); setMonth(base[1] - 1); }
    setOpen(true);
  };
  const move = (step) => {
    const d = new Date(year, month + step, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };
  const pick = (d) => {
    onChange(toStr(year, month, d));
    setOpen(false);
  };

  const nf = new Date(year, month + 1, 1);
  const nextBlocked = !!max && toStr(nf.getFullYear(), nf.getMonth(), 1) > max;
  const prevBlocked = !!min && toStr(year, month, 1) <= min;

  return (
    <div className="dp">
      <button type="button" className={`dp-input ${error ? 'err' : ''}`} onClick={openPicker} disabled={disabled}>
        <span className={show ? '' : 'ph'}>{show || placeholder}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </button>

      {open && (
        <>
          <div className="dp-back" onClick={() => setOpen(false)} />
          <div className="dp-pop">
            <div className="dp-head">
              <button type="button" className="dp-nav" onClick={() => move(-1)} disabled={prevBlocked} aria-label="Previous month">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
              </button>
              <div className="dp-sel">
                <Dropdown label={MONTHS[month]} value={month} onChange={setMonth} width="118px"
                  options={MONTHS.map((m, i) => ({ value: i, label: m }))} />
                <Dropdown label={String(year)} value={year} onChange={setYear} width="76px"
                  options={years.map((y) => ({ value: y, label: String(y) }))} />
              </div>
              <button type="button" className="dp-nav" onClick={() => move(1)} disabled={nextBlocked} aria-label="Next month">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            </div>

            <div className="dp-grid dp-days">{DAYS.map((d) => <span key={d}>{d}</span>)}</div>
            <div className="dp-grid">
              {cells.map((d, i) => {
                if (!d) return <span key={`e${i}`} />;
                const s = toStr(year, month, d);
                return (
                  <button
                    type="button"
                    key={s}
                    disabled={(!!max && s > max) || (!!min && s < min)}
                    className={`dp-day ${s === value ? 'sel' : ''} ${s === todayStr ? 'today' : ''}`}
                    onClick={() => pick(d)}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <div className="dp-foot">
              <button type="button" onClick={() => onChange('')}>Clear</button>
              <button type="button" onClick={() => setOpen(false)}>Close</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}