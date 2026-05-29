import { useState, useEffect } from 'react';

interface DashboardData {
  summary: { partners: number; leads: number; qualifiedLeads: number; bookings: number; completedJobs: number; bookingsToday: number; bookingsThisWeek: number };
  revenue: { totalRevenueDollars: number; platformFeesDollars: number; monthlyBreakdown: { month: string; fees: number }[] };
  conversion: { totalLeads: number; booked: number; conversionRate: number; leads30d: number };
  leadsBySource: { source: string; count: number }[];
  agents: { activity24h: number; errors24h: number; breakdown7d: { agent_name: string; count: number }[] };
  recentActivity: { created_at: string; agent_name: string; action_type: string; action_summary: string; status: string }[];
  system: { totalUsers: number };
  osFramework: { tacitKnowledge: any; sensing: any; learning: any; governance: any };
}

export default function OwnerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('jobsure_token')}` },
      });
      if (res.ok) setData(await res.json());
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>;

  const MetricCard = ({ label, value, sub, icon, color }: { label: string; value: string | number; sub?: string; icon?: string; color?: string }) => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
      <div className="flex justify-between mb-2"><span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>{icon && <span>{icon}</span>}</div>
      <div className={`text-2xl font-bold ${color || 'text-white'}`}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Your trade lead network at a glance</p>
        </div>
        <button onClick={fetchData} className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700">⟳ Refresh</button>
      </div>

      {/* Summary */}
      <div>
        <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">📊 Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Active Partners" value={data?.summary.partners || 0} icon="🔧" />
          <MetricCard label="Total Leads" value={data?.summary.leads || 0} icon="📋" />
          <MetricCard label="Bookings" value={data?.summary.bookings || 0} icon="📅" />
          <MetricCard label="Completed Jobs" value={data?.summary.completedJobs || 0} icon="✅" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          <MetricCard label="Today's Bookings" value={data?.summary.bookingsToday || 0} icon="📌" />
          <MetricCard label="This Week" value={data?.summary.bookingsThisWeek || 0} icon="📆" />
          <MetricCard label="Qualified Leads" value={data?.summary.qualifiedLeads || 0} icon="🎯" />
        </div>
      </div>

      {/* Revenue */}
      <div>
        <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">💰 Revenue</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <MetricCard label="Total Job Revenue" value={`$${data?.revenue.totalRevenueDollars || 0}`} icon="💵" color="text-emerald-400" />
          <MetricCard label="Platform Fees" value={`$${data?.revenue.platformFeesDollars || 0}`} icon="🏦" color="text-emerald-400" />
          <MetricCard label="Conversion Rate" value={`${data?.conversion.conversionRate || 0}%`} icon="📈" />
        </div>
      </div>

      {/* Agents */}
      <div>
        <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">🤖 Agents</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <MetricCard label="Actions (24h)" value={data?.agents.activity24h || 0} icon="⚡" />
          <MetricCard label="Errors (24h)" value={data?.agents.errors24h || 0} icon="❌" color={data?.agents.errors24h ? 'text-red-400' : 'text-emerald-400'} />
          <MetricCard label="Leads (30d)" value={data?.conversion.leads30d || 0} icon="📥" />
        </div>
        {data?.agents.breakdown7d && data.agents.breakdown7d.length > 0 && (
          <div className="mt-3 bg-slate-900/30 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Agent Activity (7 days)</div>
            <div className="flex flex-wrap gap-2">
              {data.agents.breakdown7d.map(a => (
                <span key={a.agent_name} className="px-2.5 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  {a.agent_name} <span className="text-emerald-400 font-semibold">{a.count}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Recent Agent Activity</h3>
        {!data?.recentActivity.length ? (
          <div className="text-slate-500 text-sm py-4 text-center">No activity yet</div>
        ) : (
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {data.recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-1.5 border-b border-slate-800/50 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.status === 'failed' ? 'bg-red-400' : 'bg-emerald-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-400">{a.agent_name}</span>
                    <span className="text-xs text-slate-400">{a.action_type}</span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">{a.action_summary}</div>
                </div>
                <div className="text-xs text-slate-600 whitespace-nowrap">
                  {new Date(a.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
