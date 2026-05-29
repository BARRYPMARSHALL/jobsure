import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => { try { setLeads(await api.leads()); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleQualify = async (id: string) => { try { await api.qualifyLead(id); load(); } catch (e: any) { alert(e.message); } };
  const handleMatch = async (id: string) => { try { const res = await api.matchLead(id); alert(res ? `Matched to: ${res.company_name}` : 'No available partner found'); load(); } catch (e: any) { alert(e.message); } };

  const statusColor = (s: string) => {
    const colors: any = { new: 'bg-blue-500/20 text-blue-400', qualified: 'bg-emerald-500/20 text-emerald-400', booked: 'bg-purple-500/20 text-purple-400', disqualified: 'bg-red-500/20 text-red-400' };
    return colors[s] || 'bg-slate-500/20 text-slate-400';
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Leads</h1><p className="text-sm text-slate-400 mt-1">Incoming customer requests</p></div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-800 text-slate-500 text-xs uppercase">
            <th className="text-left px-4 py-3">Customer</th><th className="text-left px-4 py-3">Service</th>
            <th className="text-left px-4 py-3">Location</th><th className="text-left px-4 py-3">Description</th>
            <th className="text-center px-4 py-3">Status</th><th className="text-center px-4 py-3">Actions</th>
          </tr></thead>
          <tbody>
            {leads.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-slate-500 py-8">No leads yet.</td></tr>
            ) : leads.map((l: any) => (
              <tr key={l.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="px-4 py-3">
                  <div className="text-white font-medium">{l.customer_name}</div>
                  <div className="text-xs text-slate-500">{l.customer_phone}</div>
                </td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">{l.service_category}</span></td>
                <td className="px-4 py-3 text-slate-400 text-xs">{l.city || '-'}{l.state ? `, ${l.state}` : ''}</td>
                <td className="px-4 py-3 text-slate-400 text-xs max-w-[200px] truncate">{l.description}</td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded text-xs ${statusColor(l.status)}`}>{l.status}</span></td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-1">
                    {l.status === 'new' && <button onClick={() => handleQualify(l.id)} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs hover:bg-emerald-500/30">Qualify</button>}
                    {l.status === 'qualified' && <button onClick={() => handleMatch(l.id)} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs hover:bg-purple-500/30">Match</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
