import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Users, TrendingUp, Map, Briefcase, Bell, BarChart2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Admin() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [notifForm, setNotifForm] = useState({ title: '', message: '', type: 'info' });

  useEffect(() => {
    Promise.all([
      api.getAnalytics().catch(() => null),
      api.getAdminUsers().catch(() => [])
    ]).then(([a, u]) => { setAnalytics(a); setUsers(u); setLoading(false); });
  }, []);

  const sendNotification = async () => {
    if (!notifForm.title) return toast.error('Title required');
    try {
      const result = await api.sendNotification(notifForm);
      toast.success(`Sent to ${result.sent_to} users!`);
      setNotifForm({ title: '', message: '', type: 'info' });
    } catch { toast.error('Failed to send'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
          <Shield size={20} className="text-red-500" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl">Admin Panel</h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Platform management and analytics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl w-fit" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        {['overview', 'users', 'notifications'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'btn-primary' : ''}`}
            style={tab !== t ? { color: 'var(--text-muted)' } : {}}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && analytics && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Total Users', value: analytics.total_users, color: '#6c47ff' },
              { icon: TrendingUp, label: 'Active (7d)', value: analytics.active_users, color: '#10b981' },
              { icon: Map, label: 'Total Roadmaps', value: analytics.total_roadmaps, color: '#0ea5e9' },
              { icon: Briefcase, label: 'Total Projects', value: analytics.total_projects, color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} className="glass-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
                  <s.icon size={20} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="font-display font-black text-2xl">{s.value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><BarChart2 size={16} /> Daily Signups (30d)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.daily_signups?.map(d => ({ date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), signups: parseInt(d.count) })) || []} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Bar dataKey="signups" fill="#6c47ff" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-bold mb-4">Popular Career Goals</h3>
              <div className="space-y-3">
                {analytics.popular_careers?.map(c => (
                  <div key={c.career_goal} className="flex items-center gap-3">
                    <span className="text-sm flex-1">{c.career_goal}</span>
                    <span className="badge badge-primary text-xs">{c.count} students</span>
                  </div>
                ))}
                {analytics.popular_careers?.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No data yet</p>}
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">Recent Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Name', 'Email', 'Joined', 'Last Active'].map(h => (
                      <th key={h} className="text-left pb-2 pr-4 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analytics.recent_users?.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-2.5 pr-4 font-medium">{u.name}</td>
                      <td className="py-2.5 pr-4" style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                      <td className="py-2.5 pr-4" style={{ color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="py-2.5" style={{ color: 'var(--text-muted)' }}>Recently</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'users' && (
        <div className="glass-card p-6 overflow-x-auto">
          <h3 className="font-bold mb-4">All Users ({users.length})</h3>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Email', 'Career Goal', 'Profile %', 'Streak', 'Role', 'Joined'].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover:bg-opacity-50">
                  <td className="py-2.5 pr-4 font-medium">{u.name}</td>
                  <td className="py-2.5 pr-4" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{u.email}</td>
                  <td className="py-2.5 pr-4">{u.career_goal || '—'}</td>
                  <td className="py-2.5 pr-4"><span className="badge badge-primary text-xs">{u.completion_percentage || 0}%</span></td>
                  <td className="py-2.5 pr-4">🔥 {u.streak_days || 0}</td>
                  <td className="py-2.5 pr-4"><span className={`badge text-xs ${u.role === 'admin' ? 'badge-danger' : 'badge-success'}`}>{u.role}</span></td>
                  <td className="py-2.5" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="glass-card p-6 max-w-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Bell size={18} /> Send Notification to All Users</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input className="input-field" placeholder="Notification title" value={notifForm.title} onChange={e => setNotifForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea className="input-field min-h-20 resize-none" placeholder="Notification message..." value={notifForm.message} onChange={e => setNotifForm(f => ({ ...f, message: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select className="input-field" value={notifForm.type} onChange={e => setNotifForm(f => ({ ...f, type: e.target.value }))}>
                <option value="info">ℹ️ Info</option>
                <option value="success">✅ Success</option>
                <option value="warning">⚠️ Warning</option>
                <option value="achievement">🏆 Achievement</option>
              </select>
            </div>
            <button onClick={sendNotification} className="btn-primary w-full justify-center py-3">
              <Bell size={16} /> Send to All Users
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
