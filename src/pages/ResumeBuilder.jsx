import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { FileText, Download, Plus, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_RESUME = {
  personal: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
  summary: '',
  education: [{ institution: '', degree: '', year: '', cgpa: '' }],
  skills: { technical: '', soft: '' },
  experience: [],
  projects: [{ title: '', description: '', tech: '', link: '' }],
  certifications: [{ title: '', provider: '', year: '' }],
};

export default function ResumeBuilder() {
  const { profile, user } = useAuth();
  const [resume, setResume] = useState({
    ...INITIAL_RESUME,
    personal: { ...INITIAL_RESUME.personal, name: user?.name || '', email: user?.email || '' },
    summary: profile?.bio || '',
    skills: { technical: (profile?.skills || []).join(', '), soft: 'Communication, Teamwork, Problem Solving' }
  });
  const [atsResult, setAtsResult] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [template, setTemplate] = useState('modern');
  const [activeSection, setActiveSection] = useState('personal');
  const printRef = useRef();

  const set = (section, key, val) => setResume(r => ({ ...r, [section]: { ...r[section], [key]: val } }));
  const addItem = (section) => setResume(r => ({ ...r, [section]: [...r[section], ...([{ ...(INITIAL_RESUME[section]?.[0] || {}) }])] }));
  const removeItem = (section, idx) => setResume(r => ({ ...r, [section]: r[section].filter((_, i) => i !== idx) }));
  const setItem = (section, idx, key, val) => setResume(r => ({ ...r, [section]: r[section].map((item, i) => i === idx ? { ...item, [key]: val } : item) }));

  const runATS = async () => {
    setAtsLoading(true);
    try {
      const result = await api.analyzeATS(resume);
      setAtsResult(result);
    } catch { toast.error('ATS analysis failed'); }
    finally { setAtsLoading(false); }
  };

  const printResume = () => {
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><title>${resume.personal.name} - Resume</title>
    <style>
      body{font-family:Arial,sans-serif;margin:20px;color:#111;font-size:12px;line-height:1.5}
      h1{font-size:22px;margin:0;color:#6c47ff}
      h2{font-size:13px;border-bottom:2px solid #6c47ff;padding-bottom:4px;margin:14px 0 8px;color:#333;text-transform:uppercase;letter-spacing:0.5px}
      .contact{color:#666;font-size:11px;margin:4px 0 12px}
      .item{margin-bottom:8px}
      .item-title{font-weight:bold}
      .item-sub{color:#666;font-size:11px}
      .skills-row{display:flex;flex-wrap:wrap;gap:4px}
      .skill-chip{background:#6c47ff20;padding:2px 8px;border-radius:12px;font-size:10px;color:#6c47ff}
      @media print{body{margin:0}}
    </style></head><body>
    <h1>${resume.personal.name}</h1>
    <div class="contact">${[resume.personal.email, resume.personal.phone, resume.personal.location, resume.personal.linkedin, resume.personal.github].filter(Boolean).join(' · ')}</div>
    ${resume.summary ? `<h2>Summary</h2><p>${resume.summary}</p>` : ''}
    <h2>Education</h2>
    ${resume.education.map(e => `<div class="item"><div class="item-title">${e.institution}</div><div class="item-sub">${e.degree} ${e.year ? `· ${e.year}` : ''} ${e.cgpa ? `· CGPA: ${e.cgpa}` : ''}</div></div>`).join('')}
    <h2>Skills</h2>
    <div class="skills-row">${(resume.skills.technical || '').split(',').map(s => `<span class="skill-chip">${s.trim()}</span>`).join('')}</div>
    ${resume.projects.length > 0 ? `<h2>Projects</h2>${resume.projects.map(p => `<div class="item"><div class="item-title">${p.title} ${p.link ? `<a href="${p.link}">[Link]</a>` : ''}</div><div class="item-sub">${p.tech}</div><p style="margin:2px 0;font-size:11px;color:#444">${p.description}</p></div>`).join('')}` : ''}
    ${resume.certifications.some(c => c.title) ? `<h2>Certifications</h2>${resume.certifications.filter(c => c.title).map(c => `<div class="item"><div class="item-title">${c.title}</div><div class="item-sub">${c.provider} ${c.year ? `· ${c.year}` : ''}</div></div>`).join('')}` : ''}
    </body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  const sections = ['personal', 'summary', 'education', 'skills', 'projects', 'certifications'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl mb-1">Resume Builder</h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Build a professional resume with ATS analysis.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={runATS} className="btn-secondary text-sm py-2 px-4" disabled={atsLoading}>
            {atsLoading ? '⏳ Scanning...' : '🎯 ATS Check'}
          </button>
          <button onClick={printResume} className="btn-primary text-sm py-2 px-4">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {sections.map(s => (
              <button key={s} onClick={() => setActiveSection(s)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all ${activeSection === s ? 'btn-primary' : 'btn-ghost'}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Personal */}
          {activeSection === 'personal' && (
            <div className="glass-card p-5 grid grid-cols-2 gap-3">
              {Object.entries(resume.personal).map(([k, v]) => (
                <div key={k} className={k === 'name' || k === 'email' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-medium mb-1 capitalize">{k}</label>
                  <input className="input-field text-sm py-2" placeholder={k} value={v} onChange={e => set('personal', k, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {activeSection === 'summary' && (
            <div className="glass-card p-5">
              <label className="block text-sm font-medium mb-2">Professional Summary</label>
              <textarea className="input-field min-h-32 resize-none" placeholder="A passionate engineering student with focus on..." value={resume.summary} onChange={e => setResume(r => ({ ...r, summary: e.target.value }))} />
            </div>
          )}

          {/* Education */}
          {activeSection === 'education' && (
            <div className="space-y-3">
              {resume.education.map((edu, idx) => (
                <div key={idx} className="glass-card p-5 grid grid-cols-2 gap-3 relative">
                  {resume.education.length > 1 && <button className="absolute top-3 right-3 btn-ghost p-1 rounded-lg text-red-400" onClick={() => removeItem('education', idx)}><Trash2 size={14} /></button>}
                  {['institution', 'degree', 'year', 'cgpa'].map(k => (
                    <div key={k} className={k === 'institution' || k === 'degree' ? 'col-span-2' : ''}>
                      <label className="block text-xs font-medium mb-1 capitalize">{k}</label>
                      <input className="input-field text-sm py-2" placeholder={k} value={edu[k]} onChange={e => setItem('education', idx, k, e.target.value)} />
                    </div>
                  ))}
                </div>
              ))}
              <button onClick={() => addItem('education')} className="btn-ghost text-sm w-full justify-center py-2.5"><Plus size={16} /> Add Education</button>
            </div>
          )}

          {/* Skills */}
          {activeSection === 'skills' && (
            <div className="glass-card p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Technical Skills (comma-separated)</label>
                <textarea className="input-field min-h-20 resize-none" placeholder="Python, React, SQL, Docker..." value={resume.skills.technical} onChange={e => set('skills', 'technical', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Soft Skills</label>
                <input className="input-field" placeholder="Communication, Teamwork..." value={resume.skills.soft} onChange={e => set('skills', 'soft', e.target.value)} />
              </div>
            </div>
          )}

          {/* Projects */}
          {activeSection === 'projects' && (
            <div className="space-y-3">
              {resume.projects.map((proj, idx) => (
                <div key={idx} className="glass-card p-5 space-y-3 relative">
                  {resume.projects.length > 1 && <button className="absolute top-3 right-3 btn-ghost p-1 rounded-lg text-red-400" onClick={() => removeItem('projects', idx)}><Trash2 size={14} /></button>}
                  {[{ k: 'title', label: 'Project Title', full: true }, { k: 'description', label: 'Description', full: true, area: true }, { k: 'tech', label: 'Technologies Used', full: false }, { k: 'link', label: 'GitHub/Demo Link', full: false }].map(({ k, label, full, area }) => (
                    <div key={k} className={full ? 'col-span-2' : ''}>
                      <label className="block text-xs font-medium mb-1">{label}</label>
                      {area ? (
                        <textarea className="input-field text-sm py-2 min-h-16 resize-none" placeholder={label} value={proj[k]} onChange={e => setItem('projects', idx, k, e.target.value)} />
                      ) : (
                        <input className="input-field text-sm py-2" placeholder={label} value={proj[k]} onChange={e => setItem('projects', idx, k, e.target.value)} />
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <button onClick={() => addItem('projects')} className="btn-ghost text-sm w-full justify-center py-2.5"><Plus size={16} /> Add Project</button>
            </div>
          )}

          {/* Certifications */}
          {activeSection === 'certifications' && (
            <div className="space-y-3">
              {resume.certifications.map((cert, idx) => (
                <div key={idx} className="glass-card p-5 grid grid-cols-3 gap-3 relative">
                  {resume.certifications.length > 1 && <button className="absolute top-3 right-3 btn-ghost p-1 rounded-lg text-red-400" onClick={() => removeItem('certifications', idx)}><Trash2 size={14} /></button>}
                  {[['title', 2], ['provider', 1], ['year', 1]].map(([k, span]) => (
                    <div key={k} className={`col-span-${span}`}>
                      <label className="block text-xs font-medium mb-1 capitalize">{k}</label>
                      <input className="input-field text-sm py-2" placeholder={k} value={cert[k]} onChange={e => setItem('certifications', idx, k, e.target.value)} />
                    </div>
                  ))}
                </div>
              ))}
              <button onClick={() => addItem('certifications')} className="btn-ghost text-sm w-full justify-center py-2.5"><Plus size={16} /> Add Certification</button>
            </div>
          )}
        </div>

        {/* Preview / ATS Panel */}
        <div className="space-y-4">
          {/* ATS Result */}
          {atsResult && (
            <div className="glass-card p-5">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> ATS Score</h3>
              <div className="text-center mb-4">
                <p className="font-display font-black text-5xl" style={{ color: atsResult.score >= 70 ? '#10b981' : atsResult.score >= 50 ? '#f59e0b' : '#ef4444' }}>{atsResult.score}%</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{atsResult.score >= 70 ? 'ATS Friendly!' : atsResult.score >= 50 ? 'Needs improvement' : 'Needs major work'}</p>
              </div>
              <div className="progress-bar mb-4">
                <div className="progress-fill" style={{ width: `${atsResult.score}%` }} />
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold mb-2 text-green-600">✅ Found Keywords ({atsResult.found_keywords?.length})</p>
                <div className="flex flex-wrap gap-1">{atsResult.found_keywords?.map(k => <span key={k} className="badge badge-success text-xs">{k}</span>)}</div>
              </div>
              {atsResult.missing_keywords?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold mb-2 text-red-500">❌ Missing Keywords</p>
                  <div className="flex flex-wrap gap-1">{atsResult.missing_keywords.map(k => <span key={k} className="badge badge-danger text-xs">{k}</span>)}</div>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>💡 Suggestions</p>
                <ul className="space-y-1">{atsResult.suggestions?.map((s, i) => <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-muted)' }}><AlertTriangle size={12} className="flex-shrink-0 mt-0.5 text-yellow-500" />{s}</li>)}</ul>
              </div>
            </div>
          )}

          {/* Live Preview */}
          <div className="glass-card p-5" style={{ fontSize: '11px', lineHeight: 1.5 }}>
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><FileText size={16} /> Preview</h3>
            <div style={{ minHeight: '400px' }}>
              <h2 className="font-bold text-base mb-0.5">{resume.personal.name || 'Your Name'}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{[resume.personal.email, resume.personal.phone, resume.personal.location].filter(Boolean).join(' · ')}</p>
              {resume.summary && <><p className="font-bold mt-2 text-xs" style={{ color: 'var(--primary)' }}>SUMMARY</p><p style={{ color: 'var(--text-muted)' }} className="text-xs">{resume.summary}</p></>}
              {resume.skills.technical && (
                <>
                  <p className="font-bold mt-2 text-xs" style={{ color: 'var(--primary)' }}>SKILLS</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {resume.skills.technical.split(',').filter(s => s.trim()).map(s => <span key={s} className="badge badge-primary text-xs">{s.trim()}</span>)}
                  </div>
                </>
              )}
              {resume.education.some(e => e.institution) && (
                <>
                  <p className="font-bold mt-2 text-xs" style={{ color: 'var(--primary)' }}>EDUCATION</p>
                  {resume.education.filter(e => e.institution).map((e, i) => <div key={i} className="mt-1"><p className="font-semibold text-xs">{e.institution}</p><p style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{e.degree} {e.year ? `· ${e.year}` : ''}</p></div>)}
                </>
              )}
              {resume.projects.some(p => p.title) && (
                <>
                  <p className="font-bold mt-2 text-xs" style={{ color: 'var(--primary)' }}>PROJECTS</p>
                  {resume.projects.filter(p => p.title).map((p, i) => <div key={i} className="mt-1"><p className="font-semibold text-xs">{p.title}</p><p style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{p.tech}</p></div>)}
                </>
              )}
            </div>
            <button onClick={printResume} className="btn-primary w-full justify-center text-xs py-2 mt-3">
              <Download size={14} /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
