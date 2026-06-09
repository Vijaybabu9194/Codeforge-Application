import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('codeforge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('codeforge_token');
      localStorage.removeItem('codeforge_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getHeatmap: () => api.get('/dashboard/heatmap'),
  getProgress: () => api.get('/dashboard/progress'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
};

// Problems API
export const problemsApi = {
  getProblems: (params: {
    topicId?: number;
    difficulty?: string;
    search?: string;
    page?: number;
    size?: number;
  }) => api.get('/problems', { params }),
  getTopics: () => api.get('/problems/topics'),
  toggleBookmark: (id: number) => api.post(`/problems/${id}/bookmark`),
  markSolved: (id: number) => api.post(`/problems/${id}/solve`),
};

// Companies API
export const companiesApi = {
  getAll: () => api.get('/companies'),
  getDetail: (id: number) => api.get(`/companies/${id}`),
  getProblems: (id: number) => api.get(`/companies/${id}/problems`),
};

// Profile API
export const profileApi = {
  getPlatforms: () => api.get('/profile/platforms'),
  getDashboard: (platform: string) => api.get(`/profile/${platform}`),
};
