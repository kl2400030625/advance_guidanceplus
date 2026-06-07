import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Map, ChevronRight, CheckCircle, Circle, Clock, Award, Code, Zap, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const stageColors = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#8b5cf6', 'Industry Ready': '#ef4444' };
const stageBg = { Beginner: 'rgba(16,185,129,0.1)', Intermediate: 'rgba(245,158,11,0.1)', Advanced: 'rgba(139,92,246,0.1)', 'Industry Ready': 'rgba(239,68,68,0.1)' };

export default function Roadmaps() {
  const [careers, setCareers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState({});
  const [expandedStage, setExpandedStage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  useEffect(() => {
    api.getCareers().then(data => { setCareers(data); setLoading(false); });
  }, []);

  const selectCareer = async (career) => {
    setSelected(career);
    setRoadmapLoading(true);
    try {
      const [rm, prog] = await Promise.all([
        api.getRoadmap(career.slug),
        api.getRoadmapProgress(career.slug).catch(() => [])
      ]);
      setRoadmap(rm);
      const progMap = {};
      (prog || []).forEach(p => { progMap[p.item_id] = p; });
      setProgress(progMap);
      setExpandedStage(0);
    } catch (err) {
      toast.error('Failed to load roadmap');
    } finally {
      setRoadmapLoading(false);
    }
  };

  const toggleStageComplete = async (stage) => {
    try {
      const currentStatus = progress[stage.id]?.status;
      const newStatus = currentStatus === 'completed' ? 'in_progress' : 'completed';
      await api.updateProgress({ item_type: 'roadmap_stage', item_id: stage.id, item_title: stage.title, status: newStatus, progress_pct: newStatus === 'completed' ? 100 : 50 });
      setProgress(prev => ({ ...prev, [stage.id]: { ...prev[stage.id], status: newStatus } }));
      toast.success(newStatus === 'completed' ? `✅ "${stage.stage}" stage marked complete! +20 XP` : 'Stage marked as in progress');
    } catch {
      toast.error('Failed to update progress');
    }
  };

  const totalStages = roadmap?.stages?.length || 0;
  const completedStages = Object.values(progress).filter(p => p.status === 'completed').length;
  const progressPct = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-2xl md:text-3xl mb-1">Career Roadmaps</h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">Select a career path to explore your personalized learning roadmap.</p>
      </div>

      {!selected ? (
        <>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => <div key={i} className="shimmer h-28 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {careers.map((c, i) => (
                <button key={c.id} onClick={() => selectCareer(c)}
                  className="glass-card p-5 text-left group animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow" style={{ background: `${c.color}20` }}>
                      <Map size={20} style={{ color: c.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{c.title}</h3>
                      <span className={`badge text-xs ${c.demand_level === 'very_high' ? 'badge-success' : 'badge-warning'}`}>{c.demand_level?.replace('_', ' ')} demand</span>
                    </div>
                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  </div>
                  <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>{c.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold" style={{ color: c.color }}>Avg ₹{c.avg_salary_lpa} LPA</span>
                    <span className="badge badge-primary text-xs">View Roadmap</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Roadmap Header */}
          <div className="glass-card p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <button onClick={() => { setSelected(null); setRoadmap(null); }} className="btn-ghost text-sm w-fit">
                ← All Careers
              </button>
              <div className="flex-1">
                <h2 className="font-display font-black text-2xl mb-1">{selected.title} Roadmap</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{selected.description}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-display font-black gradient-text">{progressPct}%</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{completedStages}/{totalStages} stages done</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="progress-bar" style={{ height: '10px' }}>
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>

          {/* Stages */}
          {roadmapLoading ? (
            <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="shimmer h-24 rounded-2xl" />)}</div>
          ) : (
            <div className="space-y-4">
              {roadmap?.stages?.map((stage, i) => {
                const isComplete = progress[stage.id]?.status === 'completed';
                const isExpanded = expandedStage === i;
                const color = stageColors[stage.stage] || '#6c47ff';
                const bg = stageBg[stage.stage] || 'var(--primary-light)';
                return (
                  <div key={stage.id} className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <button
                      className="w-full p-5 flex items-center gap-4 text-left"
                      onClick={() => setExpandedStage(isExpanded ? -1 : i)}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0"
                        style={{ background: bg, border: `2px solid ${color}` }}>
                        {isComplete ? <CheckCircle size={20} style={{ color }} /> : <span style={{ color }}>{i + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="badge text-xs font-bold" style={{ background: bg, color }}>{stage.stage}</span>
                          {isComplete && <span className="badge badge-success text-xs">✅ Completed</span>}
                        </div>
                        <h3 className="font-display font-bold text-base mt-1">{stage.title}</h3>
                        <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          <Clock size={12} /> ~{stage.estimated_weeks} weeks
                        </p>
                      </div>
                      <ChevronDown size={20} className={`flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-sm pt-4" style={{ color: 'var(--text-muted)' }}>{stage.description}</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                              <Zap size={14} /> SKILLS TO LEARN
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {stage.skills?.map(s => <span key={s} className="badge badge-primary text-xs">{s}</span>)}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                              <Code size={14} /> TOOLS & TECH
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {stage.tools?.map(t => <span key={t} className="badge badge-info text-xs">{t}</span>)}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                              🚀 PROJECTS
                            </h4>
                            <ul className="space-y-1">
                              {stage.projects?.map(p => <li key={p} className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}><ChevronRight size={12} />{p}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                              <Award size={14} /> CERTIFICATIONS
                            </h4>
                            <ul className="space-y-1">
                              {stage.certifications?.map(c => <li key={c} className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}><CheckCircle size={12} className="text-green-500" />{c}</li>)}
                            </ul>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleStageComplete(stage)}
                          className={isComplete ? 'btn-ghost w-full justify-center py-2.5' : 'btn-primary w-full justify-center py-2.5'}
                        >
                          {isComplete ? (
                            <><Circle size={16} /> Mark as In Progress</>
                          ) : (
                            <><CheckCircle size={16} /> Mark Stage as Complete</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
