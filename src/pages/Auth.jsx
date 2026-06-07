import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Zap, ArrowLeft, User, Mail, Lock, GraduationCap, Building, BookOpen, Target } from 'lucide-react';
import toast from 'react-hot-toast';

const degrees = ['B.Tech', 'B.E.', 'BCA', 'B.Sc', 'M.Tech', 'MCA', 'MBA', 'B.Com'];
const branches = ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Data Science', 'AI & ML'];
const careerGoals = ['Software Developer', 'AI Engineer', 'Data Scientist', 'Data Engineer', 'Cybersecurity Engineer', 'Cloud Engineer', 'DevOps Engineer', 'Product Manager', 'UI/UX Designer'];
const interestOptions = ['Web Development', 'AI/ML', 'Data Science', 'Mobile Apps', 'Cybersecurity', 'Cloud Computing', 'DevOps', 'UI/UX Design', 'Open Source'];

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', college: '', degree: '', branch: '',
    current_year: '1', cgpa: '', career_goal: '', interests: []
  });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleInterest = (i) => setForm(f => ({
    ...f, interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i]
  }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🚀');
      navigate('/app/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    try {
      await register({
        ...form,
        current_year: parseInt(form.current_year),
        cgpa: parseFloat(form.cgpa) || null,
      });
      toast.success('Welcome to Guidance+! 🎉');
      navigate('/app/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1035 0%, #2d1b69 50%, #1a2d69 100%)' }}>
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute rounded-full opacity-10 animate-float"
              style={{
                width: `${40 + i * 20}px`, height: `${40 + i * 20}px`,
                top: `${(i * 17) % 90}%`, left: `${(i * 23) % 85}%`,
                background: i % 2 === 0 ? '#6c47ff' : '#06b6d4',
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`
              }}
            />
          ))}
        </div>
        <div className="relative flex flex-col h-full p-12">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-auto">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Home</span>
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">Guidance+</span>
          </div>
          <h2 className="font-display font-black text-4xl text-white mb-4">
            {mode === 'login' ? 'Welcome back,\nlet\'s grow together!' : 'Start your journey\ntoday!'}
          </h2>
          <p className="text-white/60 text-lg mb-8">The all-in-one platform for student career success.</p>
          <div className="space-y-3">
            {['Personalized AI Career Mentor', 'Step-by-step Learning Roadmaps', 'Real Project Recommendations', 'Mock Interviews & Placement Prep'].map(item => (
              <div key={item} className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-8 text-white/40 text-xs">
            © 2024 Guidance+. Trusted by 50,000+ students.
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">Guidance+</span>
          </div>

          {/* Tab toggle */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setStep(1); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${mode === m ? 'btn-primary shadow-md' : ''}`}
                style={mode !== m ? { color: 'var(--text-muted)' } : {}}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="font-display font-bold text-2xl mb-6">Welcome back!</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input className="input-field pl-10" type="email" placeholder="you@example.com" value={form.email} onChange={e => setField('email', e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input className="input-field pl-10 pr-10" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setField('password', e.target.value)} required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPw(!showPw)} style={{ color: 'var(--text-muted)' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" className="text-sm" style={{ color: 'var(--primary)' }}>Forgot password?</button>
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-3 text-base" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                Don't have an account?{' '}
                <button type="button" className="font-semibold" style={{ color: 'var(--primary)' }} onClick={() => setMode('register')}>Create one free</button>
              </p>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-display font-bold text-2xl">{step === 1 ? 'Create your account' : 'Tell us about you'}</h2>
                <div className="ml-auto flex gap-1.5">
                  {[1, 2].map(s => (
                    <div key={s} className="w-2 h-2 rounded-full transition-all"
                      style={{ background: s <= step ? 'var(--primary)' : 'var(--border)', width: s === step ? '20px' : '8px' }}
                    />
                  ))}
                </div>
              </div>

              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                      <input className="input-field pl-10" type="text" placeholder="Aarav Mehta" value={form.name} onChange={e => setField('name', e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                      <input className="input-field pl-10" type="email" placeholder="you@example.com" value={form.email} onChange={e => setField('email', e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                      <input className="input-field pl-10 pr-10" type={showPw ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={e => setField('password', e.target.value)} required minLength={6} />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPw(!showPw)} style={{ color: 'var(--text-muted)' }}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Career Goal</label>
                    <div className="relative">
                      <Target size={16} className="absolute left-3 top-1/2 -translate-y-1/2 z-10" style={{ color: 'var(--text-muted)' }} />
                      <select className="input-field pl-10" value={form.career_goal} onChange={e => setField('career_goal', e.target.value)}>
                        <option value="">Select your goal</option>
                        {careerGoals.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
                    Continue →
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5">College</label>
                      <div className="relative">
                        <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                        <input className="input-field pl-9 text-sm py-2.5" placeholder="Your college" value={form.college} onChange={e => setField('college', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Degree</label>
                      <select className="input-field text-sm py-2.5" value={form.degree} onChange={e => setField('degree', e.target.value)}>
                        <option value="">Select</option>
                        {degrees.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Branch</label>
                      <div className="relative">
                        <GraduationCap size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                        <select className="input-field pl-9 text-sm py-2.5" value={form.branch} onChange={e => setField('branch', e.target.value)}>
                          <option value="">Select</option>
                          {branches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Year</label>
                      <select className="input-field text-sm py-2.5" value={form.current_year} onChange={e => setField('current_year', e.target.value)}>
                        {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">CGPA (optional)</label>
                    <div className="relative">
                      <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                      <input className="input-field pl-9 text-sm py-2.5" type="number" min="0" max="10" step="0.01" placeholder="e.g. 8.5" value={form.cgpa} onChange={e => setField('cgpa', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2">Interests (select all that apply)</label>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map(i => (
                        <button key={i} type="button" onClick={() => toggleInterest(i)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.interests.includes(i) ? 'btn-primary py-1.5 px-3' : 'btn-ghost py-1.5 px-3'}`}
                        >{i}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" className="btn-ghost flex-1 justify-center py-3" onClick={() => setStep(1)}>← Back</button>
                    <button type="submit" className="btn-primary flex-1 justify-center py-3 text-base" disabled={loading}>
                      {loading ? 'Creating...' : 'Join Guidance+ 🚀'}
                    </button>
                  </div>
                </>
              )}

              <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                Already have an account?{' '}
                <button type="button" className="font-semibold" style={{ color: 'var(--primary)' }} onClick={() => { setMode('login'); setStep(1); }}>Sign in</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
