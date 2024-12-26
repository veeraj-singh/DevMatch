import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('idToken');

    if (!token) {
      const user = auth.currentUser;
      if (user) {
        token = await user.getIdToken(true); // Force refresh
        localStorage.setItem('idToken', token);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 (Unauthorized), try refreshing the token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true);
          localStorage.setItem('idToken', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error('Token refresh failed:', err);
        // Optionally, redirect to login page here
      }
    }

    return Promise.reject(error);
  }
);

export default api;
