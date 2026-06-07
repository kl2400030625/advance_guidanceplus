import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Filter, Search, Clock, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const domains = ['All', 'AI/ML', 'Web Development', 'Mobile Development', 'Data Science', 'Cybersecurity', 'IoT', 'Cloud Computing'];
const difficultyConfig = { beginner: { label: 'Beginner', color: '#10b981', bg: 'rgba(16,185,129,0.1)' }, intermediate: { label: 'Intermediate', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' }, advanced: { label: 'Advanced', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' } };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ domain: 'All', difficulty: '', search: '' });
  const [saved, setSaved] = useState(new Set());

  useEffect(() => {
    loadProjects();
  }, [filters]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.domain !== 'All') params.domain = filters.domain;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.search) params.search = filters.search;
      const data = await api.getProjects(params);
      setProjects(data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (id) => {
    setSaved(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
    toast.success(saved.has(id) ? 'Removed from saved' : 'Project saved!');
  };

  const markStarted = async (project) => {
    try {
      await api.updateProgress({ item_type: 'project', item_id: project.id, item_title: project.title, status: 'in_progress', progress_pct: 10 });
      toast.success('Project marked as started! +10 XP 🚀');
    } catch { toast.error('Failed to update progress'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-2xl md:text-3xl mb-1">Project Recommendations</h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">Find the perfect project to build your portfolio and develop skills.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input className="input-field pl-9 py-2 text-sm" placeholder="Search projects..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
        </div>
        <select className="input-field py-2 text-sm w-36" value={filters.difficulty} onChange={e => setFilters(f => ({ ...f, difficulty: e.target.value }))}>
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Domain Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {domains.map(d => (
          <button key={d} onClick={() => setFilters(f => ({ ...f, domain: d }))}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${filters.domain === d ? 'btn-primary border-transparent' : 'border-transparent hover:border-primary-500'}`}
            style={filters.domain !== d ? { background: 'var(--surface-2)', color: 'var(--text-muted)' } : {}}>
            {d}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="shimmer h-52 rounded-2xl" />)}</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => {
            const diff = difficultyConfig[p.difficulty] || difficultyConfig.intermediate;
            return (
              <div key={p.id} className="glass-card p-5 flex flex-col animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <span className="badge text-xs mb-2" style={{ background: diff.bg, color: diff.color }}>{diff.label}</span>
                    <h3 className="font-bold text-sm leading-snug">{p.title}</h3>
                  </div>
                  <button onClick={() => toggleSave(p.id)} className="flex-shrink-0 p-1.5 rounded-lg transition-all hover:scale-110" style={{ color: saved.has(p.id) ? '#f59e0b' : 'var(--text-muted)' }}>
                    <Star size={16} className={saved.has(p.id) ? 'fill-current' : ''} />
                  </button>
                </div>
                <p className="text-xs leading-relaxed flex-1 mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                <div className="flex items-center gap-1 mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Clock size={12} />
                  <span>~{p.estimated_days} days</span>
                  <span className="mx-1">·</span>
                  <span className="badge badge-info text-xs">{p.domain}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.technologies?.slice(0, 4).map(t => <span key={t} className="badge badge-primary text-xs">{t}</span>)}
                </div>
                {p.learning_outcomes?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>YOU'LL LEARN:</p>
                    <ul className="space-y-1">
                      {p.learning_outcomes.slice(0, 2).map(o => (
                        <li key={o} className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                          <span className="text-green-500">✓</span>{o}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button onClick={() => markStarted(p)} className="btn-primary w-full justify-center text-sm py-2.5 mt-auto">
                  Start Project →
                </button>
              </div>
            );
          })}
          {projects.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <p style={{ color: 'var(--text-muted)' }}>No projects found. Try different filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
