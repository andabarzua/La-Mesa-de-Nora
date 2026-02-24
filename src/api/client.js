/**
 * Cliente HTTP para la API MesadeNora (api.mysison.com).
 * Uso: import api from '@/api/client'; api.get('/search', { params: { q: 'vino' } });
 */

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.lamesadenora.cl/api/v1';

const client = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
});

// Token Sanctum (si existe)
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('mesadenora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mesadenora_token');
      // Opcional: redirigir a login
    }
    return Promise.reject(error);
  }
);

export default client;
