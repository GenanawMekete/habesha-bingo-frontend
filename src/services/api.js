import axios from 'axios';

// Use environment variable, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('API URL:', API_URL); // Debug log

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
