const API_BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('gp_token');

const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

export const api = {
  // Auth
  register: (data) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => apiFetch('/auth/me'),
  forgotPassword: (email) => apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (data) => apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),

  // Profile
  getProfile: () => apiFetch('/profile'),
  updateProfile: (data) => apiFetch('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updateProgress: (data) => apiFetch('/profile/progress', { method: 'POST', body: JSON.stringify(data) }),
  getProgress: () => apiFetch('/profile/progress'),
  getActivity: () => apiFetch('/profile/activity'),
  markNotificationRead: (id) => apiFetch(`/profile/notifications/${id}/read`, { method: 'PATCH' }),

  // Roadmaps
  getCareers: () => apiFetch('/roadmaps'),
  getRoadmap: (slug) => apiFetch(`/roadmaps/${slug}`),
  getRoadmapProgress: (slug) => apiFetch(`/roadmaps/${slug}/progress`),

  // Projects
  getProjects: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/projects${q ? `?${q}` : ''}`);
  },
  getProjectRecommendations: () => apiFetch('/projects/recommend/me'),

  // Skills
  getSkills: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/skills${q ? `?${q}` : ''}`);
  },
  getSkillRecommendations: () => apiFetch('/skills/recommend/me'),
  getSkillCategories: () => apiFetch('/skills/categories'),

  // Prep
  getAptitudeQuestions: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/prep/aptitude${q ? `?${q}` : ''}`);
  },
  getInterviewQuestions: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/prep/interview${q ? `?${q}` : ''}`);
  },
  startMockInterview: (data) => apiFetch('/prep/mock-interview', { method: 'POST', body: JSON.stringify(data) }),
  submitAnswer: (data) => apiFetch('/prep/submit', { method: 'POST', body: JSON.stringify(data) }),

  // Jobs
  getJobs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/jobs${q ? `?${q}` : ''}`);
  },
  getApplications: () => apiFetch('/jobs/applications'),
  applyJob: (id, data = {}) => apiFetch(`/jobs/${id}/apply`, { method: 'POST', body: JSON.stringify(data) }),
  updateApplication: (id, data) => apiFetch(`/jobs/applications/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // AI
  chat: (data) => apiFetch('/ai/chat', { method: 'POST', body: JSON.stringify(data) }),
  getChatSessions: () => apiFetch('/ai/sessions'),
  getChatSession: (sessionId) => apiFetch(`/ai/sessions/${sessionId}`),
  analyzeATS: (resume) => apiFetch('/ai/ats', { method: 'POST', body: JSON.stringify({ resume }) }),
  getStudyPlan: () => apiFetch('/ai/study-plan'),

  // Forum
  getPosts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/forum${q ? `?${q}` : ''}`);
  },
  createPost: (data) => apiFetch('/forum', { method: 'POST', body: JSON.stringify(data) }),
  getPost: (id) => apiFetch(`/forum/${id}`),
  addComment: (id, data) => apiFetch(`/forum/${id}/comments`, { method: 'POST', body: JSON.stringify(data) }),
  upvotePost: (id) => apiFetch(`/forum/${id}/upvote`, { method: 'POST' }),

  // Admin
  getAnalytics: () => apiFetch('/admin/analytics'),
  getAdminUsers: () => apiFetch('/admin/users'),
  sendNotification: (data) => apiFetch('/admin/notify', { method: 'POST', body: JSON.stringify(data) }),
};

export default api;
