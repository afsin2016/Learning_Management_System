import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically inject JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear local auth
      const currentPath = window.location.pathname;
      if (
        currentPath.startsWith('/student') ||
        currentPath.startsWith('/instructor') ||
        currentPath.startsWith('/admin')
      ) {
        localStorage.removeItem('lms_token');
        localStorage.removeItem('lms_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
