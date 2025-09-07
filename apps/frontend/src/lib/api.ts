import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth storage:', error);
      }
    }

    // Agregar church-id header si existe y no es un endpoint de selección de iglesia
    const churchStorage = localStorage.getItem('church-storage');
    if (churchStorage && !config.url?.includes('available-churches') && !config.url?.includes('select-church')) {
      try {
        const { state } = JSON.parse(churchStorage);
        if (state.selectedChurch?.id) {
          config.headers['x-church-id'] = state.selectedChurch.id;
        }
      } catch (error) {
        console.error('Error parsing church storage:', error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
