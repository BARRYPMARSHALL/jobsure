import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface AgentStatus {
  key: string;
  label: string;
  icon: string;
  desc: string;
  status: string;
  lastActive: string | null;
  lastAction: string | null;
  lastStatus: string | null;
}

interface PartnerSync {
  id: string;
  companyName: string;
  tradeType: string;
  onboarded: boolean;
  totalJobs: number;
  rating: number;
  lastSync: string | null;
  syncStatus: string;
  updatedAt: string;
}

interface StripeConfig {
  payoutSchedule: string;
  payoutDelayDays: number;
  platformFeePercent: number;
  minimumPayoutDollars: string;
  connectedAccount: string;
  ownerPayoutSplit: number;
}

interface SystemHealth {
  totalLeads: number;
  totalBookings: number;
  totalJobs: number;
  pendingReviews: number;
  activePartners: number;
}

interface AdminData {
  agentCycle: AgentStatus[];
  partners: PartnerSync[];
  partnerCount: number;
  stripe: StripeConfig;
  system: SystemHealth;
}

const statusColors: Record<string, string> = {
  running: 'bg-emerald-400',
  idle: 'bg-amber-400',
  never: 'bg-slate-600',
  failed: 'bg-red-400',
};

const statusLabels: Record<string, string> = {
  running: 'Active',
  idle: 'Idle',
  never: 'Not Started',
};

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [syncingPartner, setSyncingPartner] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('jobsure_token')}` },
      });
      if (res.ok) setData(await res.json());
      else setError('Failed to load admin dashboard');
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveConfig = async (key: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('jobsure_token')}` },
        body: JSON.stringify({ key, value: editValue }),
      });
      if (res.ok) {
        setSaveMsg(`${key} updated`);
        setEditingConfig(null);
        fetchData();
      } else setSaveMsg('Update failed');
    } catch { setSaveMsg('Error saving'); }
    finally { setTimeout(() => setSaveMsg(null), 3000); setSaving(false); }
  };

  const handleSyncPartner = async (partnerId: string) => {
    setSyncingPartner(partnerId);
    try {
      await fetch('/api/admin/partner-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('jobsure_token')}` },
        body: JSON.stringify({ partnerId }),
      });
      fetchData();
    } catch {}
    finally { setSyncingPartner(null); }
  };

  const formatTime = (iso: string | null) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const timeAgo = (iso: string | null) => {
    if (!iso) return 'Never';
    const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (secs < 60) return 'Just now';
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    return `${Math.floor(secs / 86400)}d ago`;
  };

  if (loading && !data) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-surface border border-red-400/20 rounded-xl p-6 text-center">
      <div className="text-red-400 text-lg font-bold mb-2">⚠ Error</div>
      <div className="text-muted text-sm">{error}</div>
      <button onClick={fetchData} className="mt-4 px-4 py-2 bg-surface border border-white/5 rounded-lg text-sm text-muted-light hover:text-white transition-colors">Retry</button>
    </div>
  );

  const Card = ({ className = '', children }: { className?: string; children: React.ReactNode }) => (
    <div className={`bg-surface border border-white/5 rounded-xl p-6 transition-all duration-300 hover:-translate-y-[2px] hover:border-accent/15 ${className}`}>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-1.5 border-b border-white/[0.03] last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-xs text-muted-light font-medium">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Control</h1>
          <p className="text-sm text-muted mt-1">Operational oversight & configuration</p>
        </div>
        <button onClick={fetchData} className="px-3 py-1.5 text-xs bg-surface border border-white/5 text-muted-light rounded-lg hover:text-white hover:border-accent/20 transition-all duration-300">
          ⟳ Refresh
        </button>
      </div>

      {/* System Health Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Active Partners', value: data?.system.activePartners || 0, icon: '🔧' },
          { label: 'Total Leads', value: data?.system.totalLeads || 0, icon: '📋' },
          { label: 'Bookings', value: data?.system.totalBookings || 0, icon: '📅' },
          { label: 'Completed Jobs', value: data?.system.totalJobs || 0, icon: '✅' },
          { label: 'Pending Reviews', value: data?.system.pendingReviews || 0, icon: '⏳' },
        ].map(s => (
          <Card key={s.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-tiny text-muted uppercase tracking-wide-label font-semibold">{s.label}</span>
              <span>{s.icon}</span>
            </div>
            <div className="text-display-num font-extrabold text-accent leading-none">{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Agent Cycle Status */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-lg">⚙️</span>
          <h2 className="font-sans font-extrabold tracking-label uppercase text-micro-label text-accent">Agent Flywheel Status</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {data?.agentCycle.map((agent, i) => (
            <div key={agent.key}
              className={`bg-surface-deep/50 border border-white/5 rounded-xl p-5 transition-all duration-300 hover:-translate-y-[3px] hover:border-accent/20 ${i < 4 ? 'relative' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">{agent.icon}</span>
                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  agent.status === 'running' ? 'bg-emerald-500/10 text-emerald-400' :
                  agent.status === 'idle' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusColors[agent.status] || 'bg-slate-500'}`} />
                  {statusLabels[agent.status] || agent.status}
                </span>
              </div>
              <div className="font-bold text-white text-sm mb-1">{agent.label}</div>
              <div className="text-[10px] text-muted mb-3">{agent.desc}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted">Last active</span>
                  <span className="text-muted-light">{timeAgo(agent.lastActive)}</span>
                </div>
                {agent.lastAction && (
                  <div className="text-[10px] text-muted truncate" title={agent.lastAction}>{agent.lastAction}</div>
                )}
              </div>
              {i < 4 && (
                <div className="hidden xl:block absolute -right-3 top-1/2 -translate-y-1/2 text-muted text-lg select-none font-light">→</div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Partner Sync Status */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-lg">🔗</span>
          <h2 className="font-sans font-extrabold tracking-label uppercase text-micro-label text-accent">Partner Synchronization ({data?.partnerCount || 0})</h2>
        </div>
        {!data?.partners.length ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">🔧</div>
            <div className="text-muted text-sm">No active partners yet</div>
            <div className="text-muted text-[10px] mt-1">Partners will appear here once onboarded</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-muted uppercase tracking-wider font-semibold py-2 pr-4">Company</th>
                  <th className="text-left text-muted uppercase tracking-wider font-semibold py-2 pr-4">Trade</th>
                  <th className="text-center text-muted uppercase tracking-wider font-semibold py-2 pr-4">Jobs</th>
                  <th className="text-center text-muted uppercase tracking-wider font-semibold py-2 pr-4">Rating</th>
                  <th className="text-center text-muted uppercase tracking-wider font-semibold py-2 pr-4">Onboarded</th>
                  <th className="text-center text-muted uppercase tracking-wider font-semibold py-2 pr-4">Sync</th>
                  <th className="text-right text-muted uppercase tracking-wider font-semibold py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.partners.map(p => (
                  <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                    <td className="py-2.5 pr-4">
                      <div className="text-muted-light font-medium">{p.companyName}</div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="px-2 py-0.5 bg-surface border border-white/5 rounded text-[10px] text-muted capitalize">{p.tradeType}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-center text-muted-light">{p.totalJobs}</td>
                    <td className="py-2.5 pr-4 text-center">
                      <span className="text-accent font-semibold">{p.rating.toFixed(1)}</span>
                      <span className="text-accent/60 text-[10px]">★</span>
                    </td>
                    <td className="py-2.5 pr-4 text-center">
                      {p.onboarded
                        ? <span className="text-accent text-[10px] font-semibold">✓</span>
                        : <span className="text-amber-400 text-[10px] font-semibold">…</span>}
                    </td>
                    <td className="py-2.5 pr-4 text-center">
                      <span className={`text-[10px] ${p.syncStatus === 'success' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {p.lastSync ? timeAgo(p.lastSync) : 'Never'}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleSyncPartner(p.id)}
                        disabled={syncingPartner === p.id}
                        className="text-[10px] px-2 py-1 bg-surface border border-white/5 rounded text-muted hover:text-white hover:border-accent/20 transition-all disabled:opacity-50"
                      >
                        {syncingPartner === p.id ? '…' : 'Ping'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Stripe Payout Configuration */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-lg">💰</span>
          <h2 className="font-sans font-extrabold tracking-label uppercase text-micro-label text-accent">Stripe Payout Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface-deep/50 border border-white/5 rounded-xl p-4 text-center">
            <div className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-1">Payout Schedule</div>
            <div className="text-lg font-extrabold text-accent capitalize">{data?.stripe.payoutSchedule || 'weekly'}</div>
          </div>
          <div className="bg-surface-deep/50 border border-white/5 rounded-xl p-4 text-center">
            <div className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-1">Platform Fee</div>
            <div className="text-lg font-extrabold text-accent">{data?.stripe.platformFeePercent || 15}%</div>
          </div>
          <div className="bg-surface-deep/50 border border-white/5 rounded-xl p-4 text-center">
            <div className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-1">Min Payout</div>
            <div className="text-lg font-extrabold text-accent">${data?.stripe.minimumPayoutDollars || '50.00'}</div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs text-muted-light font-semibold mb-3">Configuration Parameters</h3>
          {[
            { key: 'stripe_payout_schedule', label: 'Payout Frequency', value: data?.stripe.payoutSchedule || '', type: 'select', options: ['daily', 'weekly', 'monthly'] },
            { key: 'stripe_payout_delay_days', label: 'Payout Delay (days)', value: String(data?.stripe.payoutDelayDays || 2), type: 'number' },
            { key: 'stripe_platform_fee_percent', label: 'Platform Fee (%)', value: String(data?.stripe.platformFeePercent || 15), type: 'number' },
            { key: 'stripe_minimum_payout', label: 'Min Payout (cents)', value: String(parseInt(data?.stripe.minimumPayoutDollars?.replace('.', '') || '5000')), type: 'number' },
            { key: 'owner_payout_split', label: 'Owner Payout Split (%)', value: String(data?.stripe.ownerPayoutSplit || 85), type: 'number' },
            { key: 'stripe_connected_account', label: 'Connected Account ID', value: data?.stripe.connectedAccount || '', type: 'text' },
          ].map(cfg => (
            <div key={cfg.key} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
              <div>
                <div className="text-xs text-muted-light">{cfg.label}</div>
                <div className="text-[10px] text-muted font-mono">{cfg.key}</div>
              </div>
              <div className="flex items-center gap-2">
                {editingConfig === cfg.key ? (
                  <div className="flex items-center gap-2">
                    {cfg.type === 'select' ? (
                      <select
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="bg-surface-deep border border-white/10 rounded-lg px-2 py-1 text-xs text-muted-light font-mono focus:border-accent/40 focus:outline-none"
                      >
                        {cfg.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type={cfg.type}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="bg-surface-deep border border-white/10 rounded-lg px-2 py-1 text-xs text-muted-light font-mono w-24 focus:border-accent/40 focus:outline-none"
                      />
                    )}
                    <button
                      onClick={() => handleSaveConfig(cfg.key)}
                      disabled={saving}
                      className="text-[10px] px-2 py-1 bg-accent text-black font-bold rounded hover:bg-accent-dark transition-colors disabled:opacity-50"
                    >
                      {saving ? '…' : 'Save'}
                    </button>
                    <button onClick={() => setEditingConfig(null)} className="text-[10px] text-muted hover:text-muted-light transition-colors">✕</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-light font-mono">{cfg.value}</span>
                    <button
                      onClick={() => { setEditingConfig(cfg.key); setEditValue(cfg.value); }}
                      className="text-[10px] text-muted hover:text-accent transition-colors"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {saveMsg && (
          <div className="mt-4 text-xs text-center text-accent bg-accent/5 border border-accent/20 rounded-lg py-2">{saveMsg}</div>
        )}

        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] text-muted">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            Stripe Connect is in sandbox mode. Set a live account ID above to enable real payouts.
          </div>
        </div>
      </Card>

    </div>
  );
}
