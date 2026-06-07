import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { TrendingUp, Award, Zap, Flame, CheckCircle, BarChart2, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

export default function Progress() {
  const { profile } = useAuth();
  const [progressItems, setProgressItems] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getProgress().catch(() => []),
      api.getActivity().catch(() => []),
    ]).then(([prog, act]) => {
      setProgressItems(prog);
      setActivity(act.slice(-14).map(a => ({ date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), XP: a.xp_earned, Tasks: a.tasks_completed })));
    }).finally(() => setLoading(false));
  }, []);

  const skills = progressItems.filter(p => p.item_type === 'skill');
  const projects = progressItems.filter(p => p.item_type === 'project');
  const certs = progressItems.filter(p => p.item_type === 'certification');
  const completed = progressItems.filter(p => p.status === 'completed');

  const radarData = [
    { subject: 'Skills', A: Math.min(100, skills.filter(s => s.status === 'completed').length * 20) },
    { subject: 'Projects', A: Math.min(100, projects.filter(p => p.status === 'completed').length * 25) },
    { subject: 'Certs', A: Math.min(100, certs.filter(c => c.status === 'completed').length * 30) },
    { subject: 'Streak', A: Math.min(100, (profile?.streak_days || 0) * 10) },
    { subject: 'XP', A: Math.min(100, (profile?.total_xp || 0) / 10) },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-2xl md:text-3xl mb-1">My Progress</h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">Track your learning journey, achievements, and growth over time.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '🛠️', label: 'Skills Done', value: skills.filter(s => s.status === 'completed').length, total: skills.length, color: '#6c47ff' },
          { icon: '💻', label: 'Projects Done', value: projects.filter(p => p.status === 'completed').length, total: projects.length, color: '#0ea5e9' },
          { icon: '🏆', label: 'Certs Earned', value: certs.filter(c => c.status === 'completed').length, total: certs.length, color: '#f59e0b' },
          { icon: '🔥', label: 'Day Streak', value: profile?.streak_days || 0, total: null, color: '#f97316' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className="font-display font-black text-2xl" style={{ color: s.color }}>{s.value}{s.total ? `/${s.total}` : ''}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="glass-card p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar size={18} style={{ color: 'var(--primary)' }} /> 14-Day Activity
          </h3>
          {activity.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={activity} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} labelStyle={{ color: 'var(--text)' }} />
                <Bar dataKey="XP" fill="#6c47ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No activity yet. Start completing tasks!</p>
            </div>
          )}
        </div>

        {/* Skills Radar */}
        <div className="glass-card p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} /> Skill Balance
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Radar dataKey="A" stroke="#6c47ff" fill="#6c47ff" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Items */}
      <div className="glass-card p-6">
        <h3 className="font-display font-bold text-lg mb-4">All Progress Items</h3>
        {loading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="shimmer h-12 rounded-xl" />)}</div>
        ) : progressItems.length === 0 ? (
          <div className="text-center py-10">
            <BarChart2 size={40} className="mx-auto mb-3 opacity-20" />
            <p style={{ color: 'var(--text-muted)' }}>No progress tracked yet. Start by exploring roadmaps!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {progressItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div className="w-8 h-8 flex items-center justify-center text-lg flex-shrink-0">
                  {item.item_type === 'skill' ? '🛠️' : item.item_type === 'project' ? '💻' : item.item_type === 'certification' ? '🏆' : '📚'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-medium text-sm truncate">{item.item_title || 'Unnamed'}</p>
                    <span className={`badge text-xs flex-shrink-0 ${item.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {item.status === 'completed' ? '✅ Done' : '⏳ In Progress'}
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: '5px' }}>
                    <div className="progress-fill" style={{ width: `${item.progress_pct || 0}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges */}
      {profile?.badges?.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <Award size={18} style={{ color: '#f59e0b' }} /> Achievements Earned
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {profile.badges.map(b => (
              <div key={b.title} className="achievement-badge">
                <div className="text-3xl">{b.icon === 'Star' ? '⭐' : b.icon === 'Flame' ? '🔥' : b.icon === 'Award' ? '🏆' : b.icon === 'Code' ? '💻' : b.icon === 'Map' ? '🗺️' : b.icon === 'User' ? '👤' : '🎖️'}</div>
                <p className="text-xs font-semibold text-center">{b.title}</p>
                <p className="text-xs" style={{ color: '#f59e0b' }}>+{b.xp_reward} XP</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(b.earned_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
