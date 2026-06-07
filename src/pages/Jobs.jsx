import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Filter, Search, Briefcase, MapPin, Clock, DollarSign, ExternalLink, CheckCircle, XCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors = {
  applied: { bg: 'rgba(6,182,212,0.1)', color: '#06b6d4', label: 'Applied' },
  interviewing: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'Interviewing' },
  offered: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: 'Offered' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'Rejected' },
};

export default function Jobs() {
  const [tab, setTab] = useState('listings');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', domain: '', search: '' });
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.domain) params.domain = filters.domain;
      if (filters.search) params.search = filters.search;
      const [jobsData, appsData] = await Promise.all([
        api.getJobs(params),
        api.getApplications().catch(() => [])
      ]);
      setJobs(jobsData);
      setApplications(appsData);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (jobId) => {
    setApplying(jobId);
    try {
      await api.applyJob(jobId);
      toast.success('Applied successfully! 🎉');
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setApplying(null);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.updateApplication(appId, { status });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
      toast.success('Status updated!');
    } catch {
      toast.error('Update failed');
    }
  };

  const appliedJobIds = new Set(applications.map(a => a.job_id));
  const kanbanGroups = ['applied', 'interviewing', 'offered', 'rejected'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-2xl md:text-3xl mb-1">Jobs & Internships</h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">Find and track internships and entry-level opportunities.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl w-fit" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        {[{ id: 'listings', label: 'Listings' }, { id: 'tracker', label: 'My Applications' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'btn-primary shadow' : ''}`}
            style={tab !== t.id ? { color: 'var(--text-muted)' } : {}}>
            {t.label} {t.id === 'tracker' && applications.length > 0 ? `(${applications.length})` : ''}
          </button>
        ))}
      </div>

      {tab === 'listings' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-40">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input className="input-field pl-9 py-2 text-sm" placeholder="Search roles, companies..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
            </div>
            <select className="input-field py-2 text-sm w-36" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
              <option value="">All Types</option>
              <option value="internship">Internship</option>
              <option value="full_time">Full Time</option>
            </select>
            <select className="input-field py-2 text-sm w-40" value={filters.domain} onChange={e => setFilters(f => ({ ...f, domain: e.target.value }))}>
              <option value="">All Domains</option>
              <option value="Web Development">Web Dev</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Data Engineering">Data Eng</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Cloud Computing">Cloud</option>
              <option value="Data Science">Data Science</option>
            </select>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="shimmer h-40 rounded-2xl" />)}</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {jobs.map(job => {
                const isApplied = appliedJobIds.has(job.id);
                return (
                  <div key={job.id} className="glass-card p-5 animate-slide-up">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-sm">{job.title}</h3>
                          <span className={`badge text-xs ${job.type === 'internship' ? 'badge-info' : 'badge-success'}`}>
                            {job.type === 'internship' ? 'Internship' : 'Full Time'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>{job.company}</p>
                      </div>
                      {job.is_remote && <span className="badge badge-primary text-xs flex-shrink-0">🌐 Remote</span>}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                      {job.location && <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>}
                      {job.stipend_month && <span className="flex items-center gap-1"><DollarSign size={12} />₹{job.stipend_month.toLocaleString()}/mo</span>}
                      {job.salary_lpa && <span className="flex items-center gap-1"><DollarSign size={12} />₹{job.salary_lpa} LPA</span>}
                      {job.deadline && <span className="flex items-center gap-1"><Clock size={12} />Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {job.required_skills?.slice(0, 4).map(s => <span key={s} className="badge badge-primary text-xs">{s}</span>)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => !isApplied && applyToJob(job.id)}
                        disabled={isApplied || applying === job.id}
                        className={`flex-1 justify-center py-2 text-sm ${isApplied ? 'btn-ghost cursor-not-allowed opacity-60' : 'btn-primary'}`}
                        style={isApplied ? { display: 'flex', alignItems: 'center', gap: '0.5rem' } : {}}
                      >
                        {applying === job.id ? <><Loader size={14} className="animate-spin" /> Applying...</> : isApplied ? <><CheckCircle size={14} /> Applied</> : 'Quick Apply'}
                      </button>
                      {job.apply_url && (
                        <a href={job.apply_url} target="_blank" rel="noreferrer" className="btn-ghost p-2 rounded-xl">
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
              {jobs.length === 0 && (
                <div className="col-span-2 text-center py-12">
                  <Briefcase size={48} className="mx-auto mb-3 opacity-20" />
                  <p style={{ color: 'var(--text-muted)' }}>No listings found. Try different filters.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'tracker' && (
        <div>
          {applications.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase size={48} className="mx-auto mb-3 opacity-20" />
              <p className="font-semibold text-lg mb-2">No applications yet</p>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-4">Apply to jobs and track your progress here.</p>
              <button onClick={() => setTab('listings')} className="btn-primary">Browse Listings</button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 gap-4">
              {kanbanGroups.map(status => {
                const statusApps = applications.filter(a => a.status === status);
                const meta = statusColors[status];
                return (
                  <div key={status} className="rounded-2xl p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <span className="w-3 h-3 rounded-full" style={{ background: meta.color }} />
                      <h3 className="font-semibold text-sm">{meta.label}</h3>
                      <span className="ml-auto badge text-xs" style={{ background: meta.bg, color: meta.color }}>{statusApps.length}</span>
                    </div>
                    <div className="space-y-2">
                      {statusApps.map(app => (
                        <div key={app.id} className="glass-card p-3">
                          <p className="font-semibold text-sm">{app.job_title}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{app.company}</p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            Applied: {new Date(app.applied_at).toLocaleDateString()}
                          </p>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {kanbanGroups.filter(s => s !== status).map(s => (
                              <button key={s} onClick={() => updateStatus(app.id, s)}
                                className="text-xs px-2 py-1 rounded-lg border transition-all hover:border-primary-500"
                                style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                                → {statusColors[s].label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      {statusApps.length === 0 && (
                        <div className="text-center py-4 text-xs" style={{ color: 'var(--text-muted)' }}>No applications here</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
