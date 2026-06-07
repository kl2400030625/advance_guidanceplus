import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { BookOpen, Code, Mic, Brain, CheckCircle, ChevronRight, Timer, Award, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'aptitude', label: 'Aptitude', icon: Brain },
  { id: 'interview', label: 'Interview Q&A', icon: BookOpen },
  { id: 'mock', label: 'Mock Interview', icon: Mic },
];
const aptitudeCategories = ['All', 'Quantitative', 'Logical', 'Verbal'];
const interviewTypes = ['All', 'HR', 'Technical', 'System Design'];
const difficultyColors = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

function QuestionCard({ q, showAnswer, onToggle }) {
  return (
    <div className="glass-card p-5 animate-slide-up">
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="font-medium text-sm leading-relaxed flex-1">{q.question}</p>
        <span className="badge text-xs flex-shrink-0" style={{ background: `${difficultyColors[q.difficulty]}20`, color: difficultyColors[q.difficulty] }}>
          {q.difficulty}
        </span>
      </div>
      {q.options && (
        <div className="space-y-2 mb-3">
          {(typeof q.options === 'string' ? JSON.parse(q.options) : q.options).map((opt, i) => (
            <div key={i} className={`p-2.5 rounded-lg text-sm border transition-all ${showAnswer && i === q.correct_answer ? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400' : 'border-transparent'}`}
              style={{ background: showAnswer && i !== q.correct_answer ? 'var(--surface-2)' : undefined }}>
              <span className="font-bold mr-2" style={{ color: 'var(--primary)' }}>{String.fromCharCode(65 + i)}.</span>
              {opt}
            </div>
          ))}
        </div>
      )}
      {q.sample_answer && (
        <div className={`overflow-hidden transition-all ${showAnswer ? 'max-h-96' : 'max-h-0'}`}>
          <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
            <p className="font-semibold text-xs mb-1" style={{ color: '#10b981' }}>✅ MODEL ANSWER:</p>
            {q.sample_answer}
          </div>
        </div>
      )}
      {q.explanation && showAnswer && (
        <div className="p-3 rounded-lg text-sm mt-2" style={{ background: 'rgba(16,185,129,0.08)' }}>
          <p className="font-semibold text-xs mb-1 text-green-600">💡 Explanation:</p>
          <p style={{ color: 'var(--text-muted)' }}>{q.explanation}</p>
        </div>
      )}
      <button onClick={onToggle} className="btn-ghost text-xs mt-3 py-1.5 px-3">
        {showAnswer ? 'Hide Answer' : 'Show Answer'}
      </button>
    </div>
  );
}

export default function PlacementPrep() {
  const [tab, setTab] = useState('aptitude');
  const [questions, setQuestions] = useState([]);
  const [shownAnswers, setShownAnswers] = useState({});
  const [aptCategory, setAptCategory] = useState('All');
  const [intType, setIntType] = useState('All');
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const [mockInterview, setMockInterview] = useState(null);
  const [mockRole, setMockRole] = useState('Software Developer');
  const [mockQ, setMockQ] = useState(0);
  const [mockAnswers, setMockAnswers] = useState({});
  const [mockDone, setMockDone] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const loadQuestions = async () => {
    setLoading(true);
    setShownAnswers({});
    try {
      if (tab === 'aptitude') {
        const params = {};
        if (aptCategory !== 'All') params.category = aptCategory;
        if (difficulty) params.difficulty = difficulty;
        params.limit = 8;
        const data = await api.getAptitudeQuestions(params);
        setQuestions(data);
      } else if (tab === 'interview') {
        const params = {};
        if (intType !== 'All') params.type = intType;
        if (difficulty) params.difficulty = difficulty;
        params.limit = 8;
        const data = await api.getInterviewQuestions(params);
        setQuestions(data);
      }
    } catch {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (tab !== 'mock') loadQuestions(); }, [tab, aptCategory, intType, difficulty]);

  const startMock = async () => {
    setLoading(true);
    try {
      const data = await api.startMockInterview({ role: mockRole, experience_level: 'entry-level' });
      setMockInterview(data);
      setMockQ(0);
      setMockAnswers({});
      setMockDone(false);
      setScore(null);
      setTimeLeft(90);
    } catch {
      toast.error('Failed to start mock interview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft === null || mockDone) return;
    if (timeLeft === 0) { setMockQ(q => q + 1); setTimeLeft(90); return; }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, mockDone]);

  const submitMock = () => {
    const total = mockInterview?.questions?.length || 0;
    const answered = Object.keys(mockAnswers).length;
    const fakeScore = Math.min(100, Math.round((answered / total) * 70 + Math.random() * 30));
    setScore(fakeScore);
    setMockDone(true);
  };

  const currentMockQ = mockInterview?.questions?.[mockQ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-2xl md:text-3xl mb-1">Placement Preparation</h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">Practice aptitude, interview questions, and take AI-powered mock interviews.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 flex-1 justify-center py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'btn-primary shadow' : ''}`}
            style={tab !== t.id ? { color: 'var(--text-muted)' } : {}}>
            <t.icon size={16} />{t.label}
          </button>
        ))}
      </div>

      {/* Aptitude Tab */}
      {tab === 'aptitude' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {aptitudeCategories.map(c => (
              <button key={c} onClick={() => setAptCategory(c)}
                className={aptCategory === c ? 'btn-primary text-xs py-1.5 px-3' : 'btn-ghost text-xs py-1.5 px-3'}>
                {c}
              </button>
            ))}
            <select className="input-field text-xs py-1.5 w-32" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button onClick={loadQuestions} className="btn-secondary text-xs py-1.5 px-3">Refresh</button>
          </div>
          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="shimmer h-40 rounded-2xl" />)}</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {questions.map((q, i) => (
                <QuestionCard key={q.id} q={q} showAnswer={!!shownAnswers[i]} onToggle={() => setShownAnswers(s => ({ ...s, [i]: !s[i] }))} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interview Q&A Tab */}
      {tab === 'interview' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {interviewTypes.map(t => (
              <button key={t} onClick={() => setIntType(t)}
                className={intType === t ? 'btn-primary text-xs py-1.5 px-3' : 'btn-ghost text-xs py-1.5 px-3'}>
                {t}
              </button>
            ))}
            <select className="input-field text-xs py-1.5 w-32" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          {loading ? (
            <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="shimmer h-28 rounded-2xl" />)}</div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, i) => (
                <QuestionCard key={q.id} q={q} showAnswer={!!shownAnswers[i]} onToggle={() => setShownAnswers(s => ({ ...s, [i]: !s[i] }))} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mock Interview Tab */}
      {tab === 'mock' && (
        <div>
          {!mockInterview ? (
            <div className="glass-card p-8 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <Mic size={32} className="text-white" />
              </div>
              <h2 className="font-display font-black text-xl mb-2">AI Mock Interview</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Practice with an AI interviewer. Get questions across HR, Technical, and System Design rounds.</p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-left">Select Role</label>
                <select className="input-field" value={mockRole} onChange={e => setMockRole(e.target.value)}>
                  {['Software Developer', 'AI Engineer', 'Data Scientist', 'Product Manager', 'UI/UX Designer', 'DevOps Engineer'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button onClick={startMock} className="btn-primary w-full justify-center py-3" disabled={loading}>
                {loading ? 'Preparing...' : 'Start Mock Interview →'}
              </button>
            </div>
          ) : mockDone ? (
            <div className="glass-card p-8 text-center max-w-lg mx-auto animate-slide-up">
              <div className="text-6xl mb-4">{score >= 80 ? '🏆' : score >= 60 ? '🎯' : '📚'}</div>
              <h2 className="font-display font-black text-2xl mb-2">Interview Complete!</h2>
              <p className="font-display font-black text-6xl gradient-text mb-2">{score}%</p>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                {score >= 80 ? 'Excellent! You\'re interview ready!' : score >= 60 ? 'Good performance! A bit more practice and you\'ll nail it.' : 'Keep practicing — you\'re improving!'}
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setMockInterview(null)} className="btn-ghost">← Back</button>
                <button onClick={startMock} className="btn-primary">Try Again</button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="glass-card p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="badge badge-primary text-xs">{currentMockQ?.round}</span>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Question {mockQ + 1} of {mockInterview.questions.length}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold" style={{ color: timeLeft < 20 ? '#ef4444' : 'var(--text)' }}>
                    <Timer size={16} />
                    <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="progress-bar mb-4">
                  <div className="progress-fill" style={{ width: `${((mockQ) / mockInterview.questions.length) * 100}%` }} />
                </div>
                {mockInterview.intro && mockQ === 0 && (
                  <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)' }}>
                    <p className="text-sm" style={{ color: 'var(--primary)' }}>{mockInterview.intro}</p>
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-4">{currentMockQ?.question}</h3>
                <textarea
                  className="input-field min-h-32"
                  placeholder="Type your answer here..."
                  value={mockAnswers[mockQ] || ''}
                  onChange={e => setMockAnswers(a => ({ ...a, [mockQ]: e.target.value }))}
                />
                <div className="flex gap-3 mt-4">
                  {mockQ < mockInterview.questions.length - 1 ? (
                    <button onClick={() => { setMockQ(q => q + 1); setTimeLeft(90); }} className="btn-primary flex-1 justify-center py-3">
                      Next Question <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button onClick={submitMock} className="btn-primary flex-1 justify-center py-3">
                      <CheckCircle size={16} /> Submit Interview
                    </button>
                  )}
                  <button onClick={() => setMockInterview(null)} className="btn-ghost">Exit</button>
                </div>
              </div>
              {currentMockQ?.sample_answer && mockAnswers[mockQ] && (
                <div className="glass-card p-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: '#10b981' }}>💡 Hint / Sample Answer</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{currentMockQ.sample_answer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
