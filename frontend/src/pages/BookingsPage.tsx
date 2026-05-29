import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => { try { const res = await api.bookings(); setBookings(res || []); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleStatus = async (id: string, status: string) => { try { await api.updateBookingStatus(id, status); load(); } catch (e: any) { alert(e.message); } };

  const statusColor = (s: string) => {
    const colors: any = { confirmed: 'bg-blue-500/20 text-blue-400', in_progress: 'bg-yellow-500/20 text-yellow-400', completed: 'bg-emerald-500/20 text-emerald-400', cancelled: 'bg-red-500/20 text-red-400', no_show: 'bg-orange-500/20 text-orange-400' };
    return colors[s] || 'bg-slate-500/20 text-slate-400';
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Bookings</h1><p className="text-sm text-slate-400 mt-1">Scheduled appointments</p></div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-800 text-slate-500 text-xs uppercase">
            <th className="text-left px-4 py-3">Customer</th><th className="text-left px-4 py-3">Service</th>
            <th className="text-left px-4 py-3">Date/Time</th><th className="text-left px-4 py-3">Property</th>
            <th className="text-center px-4 py-3">Status</th><th className="text-center px-4 py-3">Actions</th>
          </tr></thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-slate-500 py-8">No bookings yet.</td></tr>
            ) : bookings.map((b: any) => (
              <tr key={b.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="px-4 py-3">
                  <div className="text-white font-medium">{b.customer_name}</div>
                  <div className="text-xs text-slate-500">{b.customer_phone}</div>
                </td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">{b.service_category}</span></td>
                <td className="px-4 py-3 text-slate-300 text-xs">
                  {new Date(b.scheduled_date).toLocaleDateString()}
                  {b.scheduled_time && <><br /><span className="text-slate-500">{b.scheduled_time}</span></>}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs max-w-[150px] truncate">{b.property_address || '-'}</td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded text-xs ${statusColor(b.status)}`}>{b.status}</span></td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-1">
                    {b.status === 'confirmed' && <button onClick={() => handleStatus(b.id, 'in_progress')} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs hover:bg-yellow-500/30">Start</button>}
                    {b.status === 'in_progress' && <button onClick={() => handleStatus(b.id, 'completed')} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs hover:bg-emerald-500/30">Complete</button>}
                    {(b.status === 'confirmed' || b.status === 'in_progress') && <button onClick={() => handleStatus(b.id, 'cancelled')} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30">Cancel</button>}
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
