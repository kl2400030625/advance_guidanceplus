import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { BarChart2, Zap, Flame, Award, BookOpen, Code, Briefcase, Map, Bot, CheckSquare, ChevronRight, Star, TrendingUp, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="stat-card group cursor-pointer">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ background: `${color}20` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-display font-black">{value}</p>
        <p className="text-sm font-medium">{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    Promise.all([
      api.getSkillRecommendations().catch(() => []),
      api.getProjectRecommendations().catch(() => []),
      api.getStudyPlan().catch(() => null),
      api.getActivity().catch(() => []),
    ]).then(([sk, pr, sp, ac]) => {
      setSkills(sk.slice(0, 4));
      setProjects(pr.slice(0, 3));
      setStudyPlan(sp);
      setActivity(ac.slice(-14).map(a => ({ date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), xp: a.xp_earned, tasks: a.tasks_completed })));
    }).finally(() => setLoading(false));
  }, []);

  const readiness = profile?.career_readiness_score || 0;
  const todayPlan = studyPlan?.plan?.[dayOfWeek];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{today}</p>
          <h1 className="font-display font-black text-2xl md:text-3xl">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {profile?.career_goal ? `Working towards: ${profile.career_goal}` : 'Set your career goal to get started'}
          </p>
        </div>
        <div className="flex gap-3">
          {profile?.streak_days > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm" style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' }}>
              <Flame size={18} />
              <span>{profile.streak_days} Day Streak!</span>
            </div>
          )}
          <button onClick={() => navigate('/app/ai-mentor')} className="btn-primary">
            <Bot size={16} /> Ask AI Mentor
          </button>
        </div>
      </div>

      {/* Career Readiness Score */}
      <div className="glass-card p-6" style={{ background: 'linear-gradient(135deg, rgba(108,71,255,0.08), rgba(6,182,212,0.08))' }}>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} style={{ color: 'var(--primary)' }} />
              <h2 className="font-semibold">Career Readiness Score</h2>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <span className="font-display font-black text-5xl gradient-text">{readiness}</span>
              <span className="text-lg" style={{ color: 'var(--text-muted)' }}>/100</span>
            </div>
            <div className="progress-bar mb-2" style={{ height: '10px' }}>
              <div className="progress-fill" style={{ width: `${readiness}%` }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {readiness < 30 ? '🌱 Just getting started — keep building!' : readiness < 60 ? '📈 Good progress — stay consistent!' : readiness < 80 ? '🚀 Almost there — polish your skills!' : '⭐ Interview ready — start applying!'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:w-64">
            {[
              { label: 'Skills Done', value: profile?.skills_completed || 0, icon: '🛠️' },
              { label: 'Projects Done', value: profile?.projects_completed || 0, icon: '💻' },
              { label: 'Certs Earned', value: profile?.certs_completed || 0, icon: '🏆' },
              { label: 'XP Points', value: profile?.total_xp || 0, icon: '⚡' },
            ].map(item => (
              <div key={item.label} className="text-center p-3 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <p className="text-xl mb-0.5">{item.icon}</p>
                <p className="font-bold text-lg">{item.value}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Zap} label="Total XP" value={profile?.total_xp || 0} sub="Experience points" color="#6c47ff" />
        <StatCard icon={Flame} label="Day Streak" value={`${profile?.streak_days || 0} days`} sub="Keep it going!" color="#f97316" />
        <StatCard icon={Award} label="Level" value={profile?.level || 1} sub={`${100 - ((profile?.total_xp || 0) % 100)} XP to next`} color="#f59e0b" />
        <StatCard icon={Star} label="Badges" value={profile?.badges?.length || 0} sub="Achievements earned" color="#10b981" />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Activity (Last 14 Days)</h3>
            <span className="badge badge-primary"><TrendingUp size={12} /> Active</span>
          </div>
          {activity.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={activity} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c47ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6c47ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} labelStyle={{ color: 'var(--text)' }} itemStyle={{ color: 'var(--primary)' }} />
                <Area type="monotone" dataKey="xp" stroke="#6c47ff" strokeWidth={2} fill="url(#xpGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-center">
              <div>
                <BarChart2 size={48} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Start completing tasks to see your activity!</p>
              </div>
            </div>
          )}
        </div>

        {/* Today's Study Plan */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare size={18} style={{ color: 'var(--primary)' }} />
            <h3 className="font-display font-bold">Today's Plan</h3>
          </div>
          {todayPlan ? (
            <>
              <p className="text-xs font-semibold mb-3 badge badge-primary inline-flex">{todayPlan.focus}</p>
              <div className="space-y-2.5">
                {todayPlan.tasks?.map((task, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                    <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5" style={{ borderColor: 'var(--primary)' }} />
                    <span className="text-sm">{task}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <BookOpen size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No plan yet. Ask AI Mentor to generate one!</p>
              <button onClick={() => navigate('/app/ai-mentor')} className="btn-primary mt-3 text-xs px-4 py-2">
                Generate Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recommended Skills */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold">Recommended Skills</h3>
            <button onClick={() => navigate('/app/roadmaps')} className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--primary)' }}>View All <ChevronRight size={14} /></button>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="shimmer h-14 rounded-xl" />)}</div>
          ) : (
            <div className="space-y-2.5">
              {skills.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    {s.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{s.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.category} · {s.learning_time_weeks}w</p>
                  </div>
                  <span className={`badge ${s.importance === 'critical' ? 'badge-danger' : s.importance === 'high' ? 'badge-warning' : 'badge-info'} text-xs`}>{s.importance}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Projects */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold">Recommended Projects</h3>
            <button onClick={() => navigate('/app/projects')} className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--primary)' }}>View All <ChevronRight size={14} /></button>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="shimmer h-20 rounded-xl" />)}</div>
          ) : (
            <div className="space-y-2.5">
              {projects.map(p => (
                <div key={p.id} className="p-3 rounded-xl cursor-pointer transition-all" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-semibold text-sm">{p.title}</p>
                    <span className={`badge text-xs flex-shrink-0 ${p.difficulty === 'beginner' ? 'badge-success' : p.difficulty === 'advanced' ? 'badge-danger' : 'badge-warning'}`}>{p.difficulty}</span>
                  </div>
                  <p className="text-xs line-clamp-1" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {p.technologies?.slice(0, 3).map(t => (
                      <span key={t} className="badge badge-primary text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      {profile?.badges?.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold">Your Achievements</h3>
            <button onClick={() => navigate('/app/progress')} className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--primary)' }}>View All <ChevronRight size={14} /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {profile.badges.map(b => (
              <div key={b.title} className="achievement-badge">
                <div className="text-2xl">{b.icon === 'Star' ? '⭐' : b.icon === 'Flame' ? '🔥' : b.icon === 'Award' ? '🏆' : b.icon === 'Code' ? '💻' : b.icon === 'Map' ? '🗺️' : '🎖️'}</div>
                <p className="text-xs font-semibold text-center">{b.title}</p>
                <p className="text-xs" style={{ color: 'var(--primary)' }}>+{b.xp_reward} XP</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Map, label: 'View Roadmap', path: '/app/roadmaps', color: '#6c47ff' },
          { icon: Bot, label: 'AI Mentor', path: '/app/ai-mentor', color: '#8b5cf6' },
          { icon: BookOpen, label: 'Practice Prep', path: '/app/prep', color: '#f59e0b' },
          { icon: Briefcase, label: 'Find Jobs', path: '/app/jobs', color: '#10b981' },
        ].map(a => (
          <button key={a.label} onClick={() => navigate(a.path)}
            className="glass-card p-4 flex flex-col items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${a.color}20` }}>
              <a.icon size={20} style={{ color: a.color }} />
            </div>
            <span className="text-sm font-semibold">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
