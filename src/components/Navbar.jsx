import { Bell, Menu, Sun, Moon, Search, LogOut, User, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export default function Navbar({ onMenuClick }) {
  const { user, profile, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifications = profile?.notifications || [];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const markRead = async (id) => {
    await api.markNotificationRead(id).catch(() => {});
  };

  return (
    <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      className="h-16 flex items-center px-4 md:px-6 gap-4 z-40 sticky top-0">
      {/* Menu toggle */}
      <button onClick={onMenuClick} className="btn-ghost p-2 lg:hidden" aria-label="Toggle sidebar">
        <Menu size={20} />
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2 mr-auto lg:mr-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center shadow-lg">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-lg gradient-text hidden sm:block">Guidance+</span>
      </div>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search skills, careers, projects..."
            className="input-field pl-9 py-2 text-sm"
            style={{ background: 'var(--surface-2)' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* XP/Level */}
        {profile && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Zap size={12} />
            <span>{profile.total_xp || 0} XP</span>
          </div>
        )}

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="btn-ghost p-2 rounded-xl" aria-label="Toggle theme">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }} className="btn-ghost p-2 rounded-xl relative" aria-label="Notifications">
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="glass-card absolute right-0 top-12 w-80 z-50 p-2 max-h-80 overflow-y-auto">
              <p className="text-xs font-semibold px-2 py-1 mb-1" style={{ color: 'var(--text-muted)' }}>NOTIFICATIONS</p>
              {notifications.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>All caught up! 🎉</p>
              ) : notifications.map(n => (
                <div key={n.id} onClick={() => markRead(n.id)} className="p-3 rounded-xl cursor-pointer hover:bg-opacity-50 transition-all" style={{ background: 'var(--surface-2)' }}>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }} className="flex items-center gap-2 rounded-xl p-1.5 transition-all hover:bg-opacity-50" style={{ background: 'var(--surface-2)' }}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white text-sm font-bold shadow">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold leading-none">{user?.name}</p>
              <p className="text-xs leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>Level {profile?.level || 1}</p>
            </div>
          </button>
          {showProfile && (
            <div className="glass-card absolute right-0 top-12 w-52 z-50 p-2">
              <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
              <button onClick={() => { setShowProfile(false); navigate('/app/dashboard'); }} className="nav-item w-full mt-1">
                <User size={16} /> My Profile
              </button>
              <button onClick={handleLogout} className="nav-item w-full mt-1 text-red-400">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
