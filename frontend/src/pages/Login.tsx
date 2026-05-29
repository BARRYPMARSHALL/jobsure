import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../lib/api';

export default function Login({ setUser }: { setUser: (u: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.login(email, password);
      setToken(res.token);
      setUser(res.user);
      navigate('/app');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🔧</div>
          <h1 className="text-xl font-bold text-white">JobSure</h1>
          <p className="text-sm text-slate-500">Partner Login</p>
        </div>
        {error && <div className="text-red-400 text-sm mb-4 bg-red-500/10 p-3 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" required />
          <button type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-2.5 rounded-lg transition-colors">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
