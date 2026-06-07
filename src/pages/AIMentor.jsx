import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../utils/api';
import { Send, Bot, Plus, MessageSquare, Trash2, Download, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const suggestedPrompts = [
  'Create a 6-month roadmap for my career goal',
  'Review my resume and suggest improvements',
  'How do I prepare for technical interviews?',
  'What projects should I build for my portfolio?',
  'Which skills are most in-demand right now?',
  'Help me write a cold email to a recruiter',
];

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  const text = msg.content || '';
  const formatted = text.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold">{line.slice(2, -2)}</p>;
    if (line.startsWith('##')) return <h4 key={i} className="font-bold text-sm mt-2">{line.slice(3)}</h4>;
    return <p key={i} className="leading-relaxed">{line}</p>;
  });
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white mr-2 flex-shrink-0 mt-1">
          <Bot size={16} />
        </div>
      )}
      <div className={isUser ? 'chat-bubble-user text-sm' : 'chat-bubble-ai text-sm'}>
        <div className="space-y-1">{formatted}</div>
        <p className="text-xs mt-2 opacity-60">{new Date(msg.timestamp || Date.now()).toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default function AIMentor() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    api.getChatSessions().then(setSessions).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startNewChat = () => {
    const sessionId = uuidv4();
    setCurrentSession(sessionId);
    setMessages([{
      role: 'assistant',
      content: "👋 Hello! I'm your AI Mentor at Guidance+.\n\nI'm here to help you with career planning, resume advice, interview prep, skill recommendations, and project ideas.\n\nWhat would you like to work on today?",
      timestamp: new Date()
    }]);
    inputRef.current?.focus();
  };

  const loadSession = async (sessionId) => {
    try {
      const data = await api.getChatSession(sessionId);
      setCurrentSession(sessionId);
      setMessages(data.messages || []);
    } catch {
      toast.error('Failed to load chat');
    }
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    const sessionId = currentSession || uuidv4();
    if (!currentSession) setCurrentSession(sessionId);
    setInput('');
    const userMsg = { role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const { response } = await api.chat({ message: msg, session_id: sessionId });
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
      api.getChatSessions().then(setSessions).catch(() => {});
    } catch (err) {
      toast.error('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const downloadChat = () => {
    const text = messages.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'guidance-plus-chat.txt'; a.click();
  };

  return (
    <div className="flex h-full gap-0 -m-4 md:-m-6 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Sessions Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} flex-shrink-0 overflow-hidden flex flex-col`}
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <button onClick={startNewChat} className="btn-primary w-full justify-center text-sm py-2.5">
            <Plus size={16} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-xs font-semibold px-2 py-2" style={{ color: 'var(--text-muted)' }}>RECENT CHATS</p>
          {sessions.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>No chats yet. Start a new one!</p>
          ) : sessions.map(s => (
            <button key={s.session_id} onClick={() => loadSession(s.session_id)}
              className={`w-full text-left p-2.5 rounded-lg text-xs transition-all mb-1 ${currentSession === s.session_id ? 'nav-item active' : 'nav-item'}`}>
              <MessageSquare size={14} className="flex-shrink-0" />
              <span className="truncate">{s.session_title || 'Untitled Chat'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-14 flex items-center px-4 gap-3 border-b flex-shrink-0" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn-ghost p-2 rounded-xl">
            <MessageSquare size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">AI Mentor</p>
              <p className="text-xs" style={{ color: '#10b981' }}>● Online</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={downloadChat} className="btn-ghost p-2 ml-auto rounded-xl" title="Download chat">
              <Download size={16} />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center shadow-2xl glow-primary animate-pulse-slow">
                <Bot size={36} className="text-white" />
              </div>
              <div>
                <h2 className="font-display font-black text-2xl mb-2">Your AI Career Mentor</h2>
                <p style={{ color: 'var(--text-muted)' }} className="max-w-sm text-sm">Get personalized career guidance, resume advice, interview tips, and skill recommendations.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {suggestedPrompts.map(p => (
                  <button key={p} onClick={() => { startNewChat(); setTimeout(() => sendMessage(p), 100); }}
                    className="text-left p-3 rounded-xl text-sm transition-all cursor-pointer border hover:border-primary-500"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                    <Sparkles size={14} className="inline mr-1.5 opacity-50" />{p}
                  </button>
                ))}
              </div>
              <button onClick={startNewChat} className="btn-primary">
                <Plus size={16} /> Start a Conversation
              </button>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
              {loading && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white">
                    <Bot size={16} />
                  </div>
                  <div className="chat-bubble-ai">
                    <div className="flex gap-1 py-1">
                      {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--primary)', animationDelay: `${i * 0.15}s` }} />)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Suggested prompts (when in chat) */}
        {messages.length > 0 && !loading && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0">
            {suggestedPrompts.slice(0, 3).map(p => (
              <button key={p} onClick={() => sendMessage(p)} className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all hover:border-primary-500" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                {p.slice(0, 35)}...
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t flex-shrink-0" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="max-w-3xl mx-auto flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything about your career..."
              rows={1}
              className="input-field flex-1 resize-none"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onClick={!currentSession ? startNewChat : undefined}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="btn-primary flex-shrink-0 p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
