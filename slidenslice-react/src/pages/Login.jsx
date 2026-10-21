import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const Eye = ({ off }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <line x1="3" y1="3" x2="21" y2="21" />}
  </svg>
);

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const nav = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    // TODO: replace with real login API call
    localStorage.setItem('ss_user', JSON.stringify({ email: form.email }));
    nav('/', { replace: true });
  };

  const set = (k) => (ev) => setForm({ ...form, [k]: ev.target.value });

  return (
    <div className="login-wrap">
      <div className="login-split">
        {/* Left: login */}
        <div className="login-left">
          <form className="login-card" onSubmit={submit} noValidate>
            <img src={logo} alt="Slide N Slice" className="login-logo" />
            <h2>Welcome back</h2>

            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="Enter your email" className={errors.email ? 'err' : ''} />
            {errors.email && <small className="msg">{errors.email}</small>}

            <label>Password</label>
            <div className="pw">
              <input type={show ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Enter your password" className={errors.password ? 'err' : ''} />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
                <Eye off={show} />
              </button>
            </div>
            {errors.password && <small className="msg">{errors.password}</small>}

            <button className="btn primary block" type="submit">Login</button>
          </form>
        </div>

        {/* Right: image (laptop/tablet landscape only) */}
        <div className="login-right">
          <img src={logo} alt="Slide N Slice" />
        </div>
      </div>
    </div>
  );
}