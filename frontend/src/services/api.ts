import axios from 'axios';
import { auth } from '../config/firebase';

// In production (Vercel), we strictly use the relative path so it routes through Vercel.
// We use a runtime check instead of environment variables to guarantee it works.
const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:8000/api/v1' : '/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach Firebase ID token to all outbound requests
api.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
