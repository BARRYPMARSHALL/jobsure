import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company_name: '', contact_name: '', email: '', phone: '', trade_type: 'HVAC Repair', service_areas: '' });

  const load = async () => { try { const res = await api.partners(); setPartners(res || []); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPartner({ ...form, service_areas: JSON.stringify([form.service_areas]) });
      setShowForm(false);
      setForm({ company_name: '', contact_name: '', email: '', phone: '', trade_type: 'HVAC Repair', service_areas: '' });
      load();
    } catch (err: any) { alert(err.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Trade Partners</h1><p className="text-sm text-slate-400 mt-1">Manage your exclusive contractor network</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-sm rounded-lg transition-colors">
          {showForm ? 'Cancel' : '+ Add Partner'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Company Name" value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm" required />
            <input placeholder="Contact Name" value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm" required />
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm" required />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm" required />
            <select value={form.trade_type} onChange={e => setForm({...form, trade_type: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm">
              <option>HVAC Repair</option><option>Plumbing</option><option>Roofing</option><option>Electrical</option><option>Landscaping</option><option>General Handyman</option>
            </select>
            <input placeholder="Service Area (city)" value={form.service_areas} onChange={e => setForm({...form, service_areas: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm" required />
          </div>
          <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-2.5 rounded-lg text-sm">Create Partner</button>
        </form>
      )}

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-800 text-slate-500 text-xs uppercase">
            <th className="text-left px-4 py-3">Company</th><th className="text-left px-4 py-3">Contact</th>
            <th className="text-left px-4 py-3">Trade</th><th className="text-left px-4 py-3">Area</th>
            <th className="text-center px-4 py-3">Jobs</th><th className="text-center px-4 py-3">Rating</th><th className="text-center px-4 py-3">Status</th>
          </tr></thead>
          <tbody>
            {partners.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-slate-500 py-8">No partners yet. Add your first trade partner.</td></tr>
            ) : partners.map((p: any) => (
              <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="px-4 py-3 text-white font-medium">{p.company_name}</td>
                <td className="px-4 py-3 text-slate-300">{p.contact_name}<br /><span className="text-xs text-slate-500">{p.email}</span></td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">{p.trade_type}</span></td>
                <td className="px-4 py-3 text-slate-400 text-xs">{(p.service_areas ? JSON.parse(p.service_areas) : []).join(', ')}</td>
                <td className="px-4 py-3 text-center text-white">{p.total_jobs || 0}</td>
                <td className="px-4 py-3 text-center">{p.rating ? `${p.rating.toFixed(1)} ⭐` : '-'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs ${p.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
