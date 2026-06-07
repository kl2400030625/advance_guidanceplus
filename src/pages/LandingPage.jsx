import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Brain, Code, Map, Award, TrendingUp, Bot, Briefcase, Star, CheckCircle, Users, Target, Layers, Palette, Shield, Cloud, Settings, Database, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const features = [
  { icon: Map, title: 'Career Guidance', desc: 'Personalized career paths tailored to your interests, degree, and goals.', color: '#6c47ff' },
  { icon: Brain, title: 'Skill Roadmaps', desc: 'Step-by-step learning roadmaps from beginner to industry-ready.', color: '#8b5cf6' },
  { icon: Code, title: 'Project Recommendations', desc: 'Curated real-world projects to build your portfolio.', color: '#0ea5e9' },
  { icon: Award, title: 'Placement Preparation', desc: 'Aptitude, coding challenges, mock interviews & HR prep.', color: '#f59e0b' },
  { icon: Bot, title: 'AI Mentor', desc: 'Chat with your AI career mentor anytime for personalized guidance.', color: '#ec4899' },
  { icon: TrendingUp, title: 'Progress Tracking', desc: 'Track skills, projects, and certifications with visual analytics.', color: '#10b981' },
];

const careers = [
  { icon: Code, title: 'Software Developer', salary: '₹12.5 LPA', demand: 'Very High', color: '#6366f1', slug: 'software-developer' },
  { icon: Brain, title: 'AI Engineer', salary: '₹18 LPA', demand: 'Very High', color: '#8b5cf6', slug: 'ai-engineer' },
  { icon: Database, title: 'Data Scientist', salary: '₹15 LPA', demand: 'High', color: '#0ea5e9', slug: 'data-scientist' },
  { icon: Layers, title: 'Data Engineer', salary: '₹14 LPA', demand: 'High', color: '#f59e0b', slug: 'data-engineer' },
  { icon: Shield, title: 'Cybersecurity Engineer', salary: '₹13 LPA', demand: 'High', color: '#ef4444', slug: 'cybersecurity-engineer' },
  { icon: Cloud, title: 'Cloud Engineer', salary: '₹14.5 LPA', demand: 'Very High', color: '#06b6d4', slug: 'cloud-engineer' },
  { icon: Settings, title: 'DevOps Engineer', salary: '₹13.5 LPA', demand: 'High', color: '#10b981', slug: 'devops-engineer' },
  { icon: Target, title: 'Product Manager', salary: '₹16 LPA', demand: 'High', color: '#f97316', slug: 'product-manager' },
  { icon: Palette, title: 'UI/UX Designer', salary: '₹10 LPA', demand: 'High', color: '#ec4899', slug: 'uiux-designer' },
];

const testimonials = [
  { name: 'Aarav Mehta', role: 'SWE Intern at Google', college: 'IIT Delhi', text: 'Guidance+ gave me a clear roadmap. The AI mentor helped me focus on the right skills. Got my dream internship in 6 months!', avatar: 'A', rating: 5 },
  { name: 'Priya Sharma', role: 'ML Engineer at Flipkart', college: 'NIT Warangal', text: 'The project recommendations were spot on. I built 4 AI projects from the platform and landed a great package!', avatar: 'P', rating: 5 },
  { name: 'Rohit Kumar', role: 'Frontend Dev at Razorpay', college: 'VIT Vellore', text: 'The placement prep module is incredible. Aptitude + coding + mock interviews — everything in one place!', avatar: 'R', rating: 5 },
  { name: 'Sneha Reddy', role: 'Data Analyst at Swiggy', college: 'BITS Pilani', text: 'The personalized study plans kept me on track. The streak system made it fun to learn every day!', avatar: 'S', rating: 5 },
];

const stats = [
  { value: '50,000+', label: 'Students Enrolled' },
  { value: '200+', label: 'Career Roadmaps' },
  { value: '500+', label: 'Project Ideas' },
  { value: '95%', label: 'Placement Rate' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }} className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 h-16 flex items-center px-6 md:px-12" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mr-auto">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center shadow-lg">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl gradient-text">Guidance+</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="btn-ghost p-2 rounded-xl">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => navigate('/auth')} className="btn-ghost">Login</button>
          <button onClick={() => navigate('/auth?mode=register')} className="btn-primary">Get Started <ArrowRight size={16} /></button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden section" style={{ background: 'var(--bg)' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #6c47ff, transparent)' }} />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        </div>

        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-in" style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
            <Zap size={14} />
            <span>AI-Powered Career Platform for Students</span>
          </div>

          <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl leading-tight mb-6 animate-slide-up">
            Your Complete<br />
            <span className="gradient-text">Academic & Career</span><br />
            Growth Companion
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-100" style={{ color: 'var(--text-muted)' }}>
            Discover skills, projects, career paths, certifications, internships, and personalized roadmaps — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up animate-delay-200">
            <button onClick={() => navigate('/auth?mode=register')} className="btn-primary text-base px-8 py-3.5 shadow-xl">
              Get Started Free <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/auth')} className="btn-secondary text-base px-8 py-3.5">
              Explore Roadmaps <Map size={18} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-slide-up animate-delay-300">
            {stats.map(s => (
              <div key={s.label} className="glass-card p-4 text-center">
                <p className="font-display font-black text-2xl md:text-3xl gradient-text">{s.value}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="text-center mb-14">
            <div className="badge badge-primary mb-4">FEATURES</div>
            <h2 className="font-display font-black text-3xl md:text-5xl mb-4">Everything You Need to<br /><span className="gradient-text">Succeed in Your Career</span></h2>
            <p style={{ color: 'var(--text-muted)' }} className="max-w-xl mx-auto text-lg">A comprehensive platform that acts as your mentor, career counselor, and learning roadmap generator.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="glass-card p-6 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg" style={{ background: `${f.color}20` }}>
                  <f.icon size={24} style={{ color: f.color }} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-14">
            <div className="badge badge-info mb-4">CAREER PATHS</div>
            <h2 className="font-display font-black text-3xl md:text-5xl mb-4">Explore <span className="gradient-text">Top Career Paths</span></h2>
            <p style={{ color: 'var(--text-muted)' }} className="text-lg">Choose from 9+ in-demand career paths with detailed roadmaps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {careers.map((c, i) => (
              <div
                key={c.slug}
                onClick={() => navigate('/auth')}
                className="glass-card p-5 cursor-pointer group animate-slide-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow" style={{ background: `${c.color}20` }}>
                    <c.icon size={20} style={{ color: c.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{c.title}</h3>
                    <span className="badge badge-success text-xs">{c.demand}</span>
                  </div>
                  <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: c.color }}>Avg {c.salary}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>View Roadmap →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Guidance+ */}
      <section className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="badge badge-warning mb-4">WHY GUIDANCE+</div>
              <h2 className="font-display font-black text-3xl md:text-4xl mb-6">The Smart Way to <span className="gradient-text">Plan Your Future</span></h2>
              <div className="space-y-4">
                {[
                  'Personalized roadmaps based on your degree and interests',
                  'AI mentor available 24/7 for guidance and advice',
                  'Real project ideas with step-by-step guidance',
                  'Mock interviews with AI-generated feedback',
                  'Track your progress with visual dashboards',
                  'Gamified learning with streaks and achievements',
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/auth?mode=register')} className="btn-primary mt-8">
                Start Your Journey <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Brain, title: 'AI-Powered', desc: 'Intelligent recommendations', color: '#8b5cf6' },
                { icon: Map, title: 'Structured', desc: 'Stage-by-stage roadmaps', color: '#6c47ff' },
                { icon: Users, title: 'Community', desc: 'Learn with peers', color: '#06b6d4' },
                { icon: Award, title: 'Certified', desc: 'Industry certifications', color: '#f59e0b' },
              ].map(item => (
                <div key={item.title} className="glass-card p-5 text-center">
                  <div className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-3 shadow" style={{ background: `${item.color}20` }}>
                    <item.icon size={20} style={{ color: item.color }} />
                  </div>
                  <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-14">
            <div className="badge badge-success mb-4">TESTIMONIALS</div>
            <h2 className="font-display font-black text-3xl md:text-5xl mb-4">Students <span className="gradient-text">Love Guidance+</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <div key={t.name} className="glass-card p-5 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                    <p className="text-xs" style={{ color: 'var(--primary)' }}>{t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display font-black text-4xl md:text-5xl mb-6">
              Ready to Start Your <span className="gradient-text">Dream Career?</span>
            </h2>
            <p className="text-lg mb-10" style={{ color: 'var(--text-muted)' }}>
              Join 50,000+ students who are building their careers with Guidance+. It's completely free to get started.
            </p>
            <button onClick={() => navigate('/auth?mode=register')} className="btn-primary text-lg px-10 py-4 shadow-2xl glow-primary">
              Get Started Free <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }} className="py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="font-display font-bold text-lg gradient-text">Guidance+</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your complete academic and career growth companion.</p>
            </div>
            {[
              { title: 'Platform', links: ['Dashboard', 'Roadmaps', 'AI Mentor', 'Placement Prep'] },
              { title: 'Resources', links: ['Projects', 'Certifications', 'Jobs', 'Forum'] },
              { title: 'Company', links: ['About', 'Contact', 'Privacy Policy', 'Terms of Service'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}>
                      <button onClick={() => navigate('/auth')} className="text-sm hover:text-primary-500 transition-colors" style={{ color: 'var(--text-muted)' }}>{l}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t pt-8 text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            © 2024 Guidance+. Built with ❤️ for students.
          </div>
        </div>
      </footer>
    </div>
  );
}
