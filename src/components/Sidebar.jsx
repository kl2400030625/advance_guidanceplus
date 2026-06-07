import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, Bot, BookOpen, FileText, Folder, Briefcase, MessageSquare, TrendingUp, ShieldCheck, Zap, X, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
  { icon: Map, label: 'Career Roadmaps', path: '/app/roadmaps' },
  { icon: Bot, label: 'AI Mentor', path: '/app/ai-mentor' },
  { icon: BookOpen, label: 'Placement Prep', path: '/app/prep' },
  { icon: FileText, label: 'Resume Builder', path: '/app/resume' },
  { icon: Folder, label: 'Projects', path: '/app/projects' },
  { icon: Briefcase, label: 'Jobs & Internships', path: '/app/jobs' },
  { icon: MessageSquare, label: 'Forum', path: '/app/forum' },
  { icon: TrendingUp, label: 'My Progress', path: '/app/progress' },
];

export default function Sidebar({ open, onClose }) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-full z-50 w-64 flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center shadow-lg">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">Guidance+</span>
          </button>
          <button onClick={onClose} className="lg:hidden btn-ghost p-1.5 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Profile Card */}
        {profile && (
          <div className="m-3 p-3 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-bold text-sm shadow">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{profile?.career_goal || 'Set career goal'}</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                <span>Profile</span>
                <span>{profile?.completion_percentage || 0}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${profile?.completion_percentage || 0}%` }} />
              </div>
            </div>
            {profile?.streak_days > 0 && (
              <div className="flex items-center gap-1 mt-2 text-xs font-medium text-orange-400">
                <Flame size={12} />
                <span>{profile.streak_days} day streak!</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <p className="text-xs font-semibold px-2 py-1 mb-1" style={{ color: 'var(--text-muted)' }}>MAIN MENU</p>
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) => `nav-item mb-0.5 ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <p className="text-xs font-semibold px-2 py-1 mt-4 mb-1" style={{ color: 'var(--text-muted)' }}>ADMIN</p>
              <NavLink to="/app/admin" onClick={onClose} className={({ isActive }) => `nav-item mb-0.5 ${isActive ? 'active' : ''}`}>
                <ShieldCheck size={18} />
                <span>Admin Panel</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Bottom XP Stats */}
        {profile && (
          <div className="p-3 m-3 rounded-xl" style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)' }}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-semibold" style={{ color: 'var(--primary)' }}>Level {profile.level || 1}</span>
              <span className="text-xs" style={{ color: 'var(--primary)' }}>{profile.total_xp || 0} XP</span>
            </div>
            <div className="progress-bar" style={{ height: '6px' }}>
              <div className="progress-fill" style={{ width: `${((profile.total_xp || 0) % 100)}%` }} />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--primary)' }}>
              {100 - ((profile.total_xp || 0) % 100)} XP to next level
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
