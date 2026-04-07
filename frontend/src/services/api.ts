import axios from 'axios';
import { auth } from '../config/firebase';

// Dynamically ensure the API URL has the correct /api/v1 suffix to prevent 404s
const rawURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const baseURL = rawURL.endsWith('/api/v1') ? rawURL : `${rawURL.replace(/\/$/, '')}/api/v1`;

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
