import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Confirm from './Confirm.jsx';

const MENU = [
  ['/', 'Dashboard', '🏠'],
  // ['/orders', 'Orders', '🧾'],
  ['/customers', 'Customers', '👥'],
  ['/offers', 'Offers', '🏷️'],
  ['/loyalty', 'Loyalty & Rewards', '🎁'],
   ['/chats', 'WhatsApp Chats', '💬'],
  // ['/bulk-message', 'Bulk Message', '💬'],
  // ['/faq-auto-reply', 'FAQ Auto Reply', '❓'],
  // ['/settings', 'Settings', '⚙️'],
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [askLogout, setAskLogout] = useState(false);
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem('ss_user');
    nav('/login', { replace: true });
  };

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* <div className="brand">🍕 Slide <span>and</span> Slice</div> */}
       <div className="brand">
  <svg className="brand-icon" viewBox="0 0 64 64" aria-hidden="true">
    <path d="M8 58 L26 8 Q54 10 56 38 Z" fill="#FFCB3D" stroke="#E8912D" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M26 8 Q54 10 56 38" fill="none" stroke="#F0A030" strokeWidth="7" strokeLinecap="round" />
    <path d="M28 12 Q49 14 52 35" fill="none" stroke="#FFE08A" strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
    <circle cx="28" cy="29" r="5.2" fill="#D62828" />
    <circle cx="26.6" cy="27.6" r="1.6" fill="#F26A6A" />
    <circle cx="41" cy="39" r="4.6" fill="#D62828" />
    <circle cx="39.8" cy="37.8" r="1.4" fill="#F26A6A" />
    <circle cx="20" cy="47" r="3.7" fill="#D62828" />
    <circle cx="36" cy="26" r="1.5" fill="#3d7a2a" />
    <circle cx="29" cy="42" r="1.4" fill="#3d7a2a" />
    <circle cx="19" cy="34" r="1.3" fill="#3d7a2a" />
  </svg>
  <div className="brand-text">
    <b>Slide</b>
    <b>and Slice</b>
  </div>
  <small className="brand-tag">Pizza • Friends • Happiness</small>
</div>
        <nav onClick={() => setOpen(false)}>
          {MENU.map(([to, label, icon]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              <span>{icon}</span> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {open && <div className="backdrop" onClick={() => setOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="burger" onClick={() => setOpen((o) => !o)} aria-label="Menu">☰</button>
          <div className="spacer" />
          {/* <div className="user"><span>Welcome</span><div className="avatar">A</div></div> */}
          <button className="btn ghost sm" onClick={() => setAskLogout(true)}>Logout</button>
        </header>
        <div className="content">{children}</div>
      </div>

      {askLogout && (
        <Confirm text="Are you sure you want to logout?" yes="Logout" onYes={logout} onNo={() => setAskLogout(false)} />
      )}
    </div>
  );
}