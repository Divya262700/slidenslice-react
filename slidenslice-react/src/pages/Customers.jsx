import { useEffect, useState } from 'react';
import Confirm from '../components/Confirm.jsx';
import DatePicker from '../components/DatePicker.jsx';

const SEED = [
  { id: 1, name: 'Priya S', mobile: '9876543210', dob: '1995-04-12', weddingDate: '2020-02-14' },
  { id: 2, name: 'Kumar R', mobile: '9123456780', dob: '1990-11-03', weddingDate: '' },
];
const EMPTY = { name: '', mobile: '', dob: '', weddingDate: '' };
const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : '-');
const today = new Date().toISOString().split('T')[0];

export default function Customers() {
  // TODO: replace localStorage with API calls (GET/POST/PUT/DELETE)
  const [rows, setRows] = useState(() => JSON.parse(localStorage.getItem('ss_customers') || 'null') || SEED);
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(null); // { mode: 'create'|'edit'|'view', data }
  const [del, setDel] = useState(null);

  useEffect(() => localStorage.setItem('ss_customers', JSON.stringify(rows)), [rows]);

  const list = rows.filter((r) => (r.name + r.mobile).toLowerCase().includes(q.toLowerCase()));

  const save = (data) => {
    if (data.id) setRows(rows.map((r) => (r.id === data.id ? data : r)));
    else setRows([...rows, { ...data, id: Date.now() }]);
    setModal(null);
  };

  return (
    <>
      <div className="row between wrap">
        <h1>Customers</h1>
        <button className="btn primary" onClick={() => setModal({ mode: 'create', data: EMPTY })}>+ Add Customer</button>
      </div>

      {/* <input className="search" placeholder="🔍 Search name or mobile" value={q} onChange={(e) => setQ(e.target.value)} /> */}
      <div className="search-wrap">
  <input className="search" placeholder="Search name or mobile" value={q} onChange={(e) => setQ(e.target.value)} />
  <svg className="search-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
  </svg>
</div>

      <div className="card table-wrap">
        <table className="responsive">
          <thead>
            <tr><th>S.No</th><th>Name</th><th>Mobile</th><th>Date of Birth</th><th>Wedding Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {list.map((r, i) => (
              <tr key={r.id}>
                <td data-l="S.No">{i + 1}</td>
                <td data-l="Name">{r.name}</td>
                <td data-l="Mobile">{r.mobile}</td>
                <td data-l="DOB">{fmt(r.dob)}</td>
                <td data-l="Wedding Date">{fmt(r.weddingDate)}</td>
                <td data-l="Actions" className="acts">
                  {/* <button className="btn ghost sm" onClick={() => setModal({ mode: 'view', data: r })}>View</button> */}
                  <button className="btn ghost sm" onClick={() => setModal({ mode: 'edit', data: r })}>Edit</button>
                  <button className="btn danger sm" onClick={() => setDel(r)}>Delete</button>
                </td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan="6" className="none">No customers found</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && <CustomerModal {...modal} onSave={save} onClose={() => setModal(null)} />}
      {del && (
        <Confirm
          text={`Are you sure you want to delete ${del.name}?`}
          yes="Delete"
          onYes={() => { setRows(rows.filter((r) => r.id !== del.id)); setDel(null); }}
          onNo={() => setDel(null)}
        />
      )}
    </>
  );
}

function CustomerModal({ mode, data, onSave, onClose }) {
  const [f, setF] = useState(data);
  const [err, setErr] = useState({});
  const view = mode === 'view';
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!f.name.trim()) e.name = 'Name is required';
    if (!f.mobile) e.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(f.mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
    if (!f.dob) e.dob = 'Date of birth is required';
    else if (f.dob > today) e.dob = 'Date cannot be in the future';
    // wedding date optional (not every customer is married)
    if (f.weddingDate) {
      if (f.weddingDate > today) e.weddingDate = 'Date cannot be in the future';
    }
    setErr(e);
    if (!Object.keys(e).length) onSave({ ...f, name: f.name.trim() });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <h2>{{ create: 'Add Customer', edit: 'Edit Customer', view: 'Customer Details' }[mode]}</h2>

        <label>Name</label>
        <input value={f.name} onChange={set('name')} disabled={view} className={err.name ? 'err' : ''} />
        {err.name && <small className="msg">{err.name}</small>}

        <label>Mobile Number</label>
        <input value={f.mobile} inputMode="numeric" maxLength={10} disabled={view} className={err.mobile ? 'err' : ''}
          onChange={(e) => setF({ ...f, mobile: e.target.value.replace(/\D/g, '') })} />
        {err.mobile && <small className="msg">{err.mobile}</small>}

        <label>Date of Birth</label>
        {/* <input type="date" max={today} value={f.dob} onChange={set('dob')} disabled={view} className={err.dob ? 'err' : ''} /> */}
        <DatePicker value={f.dob} max={today} disabled={view} error={!!err.dob} onChange={(v) => setF({ ...f, dob: v })} />
        {err.dob && <small className="msg">{err.dob}</small>}

        <label>Wedding Date <span style={{ opacity: 0.6, fontWeight: 400 }}>(optional)</span></label>
        <DatePicker value={f.weddingDate || ''} max={today} disabled={view} error={!!err.weddingDate} onChange={(v) => setF({ ...f, weddingDate: v })} />
        {err.weddingDate && <small className="msg">{err.weddingDate}</small>}

        <div className="row end">
          <button type="button" className="btn ghost" onClick={onClose}>{view ? 'Close' : 'Cancel'}</button>
          {!view && <button className="btn primary" type="submit">{mode === 'edit' ? 'Update' : 'Create'}</button>}
        </div>
      </form>
    </div>
  );
}

