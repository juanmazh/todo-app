import axios from 'axios';

// Detectar URL de API: en desarrollo usamos la ruta relativa '/api' (Vite proxy).
// En producción preferimos VITE_API_URL y normalizamos para que termine en /api.
const getApiUrl = () => {
  if (window.location.hostname === 'localhost') return '/api';

  const rawEnvUrl = import.meta.env.VITE_API_URL;
  if (rawEnvUrl) {
    const trimmed = rawEnvUrl.replace(/\/+$/g, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  return 'https://todo-app-backend-yadb.onrender.com/api';
};

const API_BASE = getApiUrl().replace(/\/+$/g, '');

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

// Mejor logging para detectar `Network Error` y CORS
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      console.error('AuthService - API error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        requestUrl: error.config?.url ? `${API_BASE}${error.config.url}` : API_BASE,
        configUrl: error.config?.url,
        body: error.config?.data,
      });
    } catch (logErr) {
      console.error('Error al loggear error de authService', logErr);
    }

    if (error.code === 'ERR_NETWORK') {
      throw new Error(`No se puede conectar con el servidor en ${API_BASE}. Verifica que el backend esté funcionando y que no haya problemas de CORS.`);
    }

    throw error;
  }
);

export const authService = {
  async register(username: string, password: string) {
    const resp = await api.post('/auth/register', { username, password });
    return resp.data; // { token, user }
  },

  async login(username: string, password: string) {
    const resp = await api.post('/auth/login', { username, password });
    return resp.data; // { token, user }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
