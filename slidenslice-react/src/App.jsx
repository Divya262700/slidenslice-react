
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import Protected from './routes/protectedRoutes.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './components/Loader.jsx';

// Lazy loading
const Login = lazy(() => import('./pages/Login.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Customers = lazy(() => import('./pages/Customers.jsx'));
const Offers = lazy(() => import('./pages/Offers.jsx'));
const Loyalty = lazy(() => import('./pages/Loyalty.jsx'));
const Chats = lazy(() => import('./pages/Chats.jsx'));

export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />

      <Suspense fallback={<Loader/>}>
        <Routes>
          {/* Login page */}
          <Route path="/" element={<Login />} />

          {/* Protected pages */}
          <Route element={<Protected />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/loyalty" element={<Loyalty />} />
              <Route path="/chats" element={<Chats />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
