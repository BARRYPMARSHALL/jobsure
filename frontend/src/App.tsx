import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api, setToken, getToken } from './lib/api';
import Landing from './pages/Landing';
import Login from './pages/Login';
import OwnerDashboard from './pages/OwnerDashboard';
import PartnersPage from './pages/PartnersPage';
import LeadsPage from './pages/LeadsPage';
import BookingsPage from './pages/BookingsPage';
import Layout from './components/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (getToken()) {
      api.me().then(res => { setUser(res.user); setLoading(false); })
        .catch(() => { setToken(null); setLoading(false); });
    } else setLoading(false);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🔧</div>
        <div className="text-emerald-400 text-lg font-semibold">JobSure</div>
        <div className="text-slate-500 text-sm mt-2">Trade Lead Network</div>
        <div className="mt-4 w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={getToken() ? <Navigate to="/app" replace /> : <Landing />} />
        <Route path="/login" element={getToken() ? <Navigate to="/app" replace /> : <Login setUser={setUser} />} />
        <Route path="/app" element={<ProtectedRoute><Layout user={user} setUser={setUser} /></ProtectedRoute>}>
          <Route index element={<OwnerDashboard />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="bookings" element={<BookingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
