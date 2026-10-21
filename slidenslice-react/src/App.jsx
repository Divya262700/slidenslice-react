import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Customers from './pages/Customers.jsx';
import Offers from './pages/Offers.jsx';
import Loyalty from './pages/Loyalty.jsx';
import Chats from './pages/Chats.jsx';
import Layout from './components/Layout.jsx';

const isAuthed = () => !!localStorage.getItem('ss_user');

function Protected({ children }) {
  return isAuthed() ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={isAuthed() ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/customers" element={<Protected><Customers /></Protected>} />
      <Route path="/offers" element={<Protected><Offers /></Protected>} />
      <Route path="/loyalty" element={<Protected><Loyalty /></Protected>} />
      <Route path="/chats" element={<Protected><Chats /></Protected>} />
            {/* {['orders', 'loyalty', 'offers', 'bulk-message', 'faq-auto-reply', 'settings'].map((p) => (
        <Route key={p} path={`/${p}`} element={<Protected><h1>Coming soon</h1></Protected>} />
      ))} */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
