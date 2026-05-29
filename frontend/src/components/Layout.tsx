import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { setToken } from '../lib/api';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: '📊' },
  { to: '/app/partners', label: 'Partners', icon: '🔧' },
  { to: '/app/leads', label: 'Leads', icon: '📋' },
  { to: '/app/bookings', label: 'Bookings', icon: '📅' },
];

const adminItems = [
  { to: '/app/admin', label: 'Admin', icon: '⚙️' },
];

export default function Layout({ user, setUser }: { user: any; setUser: (u: any) => void }) {
  const navigate = useNavigate();
  const handleLogout = () => { setToken(null); setUser(null); navigate('/login'); };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔧</span>
            <div>
              <div className="text-emerald-400 font-bold">JobSure</div>
              <div className="text-slate-500 text-xs">Trade Lead Network</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          </nav>
          <div className="px-3 mb-1">
          <div className="h-px bg-white/5 mb-3" />
          {adminItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-accent/10 text-accent border border-accent/20' : 'text-slate-500 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          </div>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-bold">
              {user?.name?.charAt(0) || 'O'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{user?.name || 'Owner'}</div>
              <div className="text-xs text-slate-500 capitalize">{user?.role || 'owner'}</div>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors" title="Logout">🚪</button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto"><Outlet /></div>
      </main>
    </div>
  );
}
