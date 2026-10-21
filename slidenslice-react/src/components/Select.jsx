import { useState, useRef, useEffect } from 'react';

export default function Select({ value, onChange, options, placeholder = 'Select', error, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div className="ddn" ref={ref}>
      <button type="button" className={`dp-input ${error ? 'err' : ''}`} disabled={disabled} onClick={() => setOpen((o) => !o)}>
        <span className={value ? '' : 'ph'}>{value || placeholder}</span>
        <svg width="12" height="8" viewBox="0 0 10 6"><path d="M0 0h10L5 6z" fill="currentColor" /></svg>
      </button>
      {open && (
        <div className="ddn-list">
          {options.map((o) => (
            <div key={o} className={`ddn-opt ${o === value ? 'sel' : ''}`} onClick={() => { onChange(o); setOpen(false); }}>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}