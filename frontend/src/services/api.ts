import axios from 'axios';
import { auth } from '../config/firebase';

// In production (Vercel), we will configure VITE_API_URL to point to the Render backend.
// In development, it defaults to the local backend server on port 8000.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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
