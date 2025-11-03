import axios from 'axios';
import type { Todo, TodoFormData } from '../types/Todo';

// Detectar automáticamente la URL del backend
const getApiUrl = () => {
  // Si estamos en desarrollo local, usar ruta relativa para que Vite proxy la reenvíe
  if (window.location.hostname === 'localhost') {
    return '/api';
  }
  
  // En producción: preferir la variable de entorno VITE_API_URL.
  // Normalizar la URL: eliminar slashes finales y asegurar que termine en /api.
  const rawEnvUrl = import.meta.env.VITE_API_URL;
  if (rawEnvUrl) {
    const trimmed = rawEnvUrl.replace(/\/+$/g, '');
    const normalized = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
    return normalized;
  }
  return 'https://todo-app-backend-yadb.onrender.com/api';
};

const API_BASE_URL = getApiUrl();

// Normalizar la URL base (debería incluir /api ya 
const AXIOS_BASE_URL = (API_BASE_URL || '').replace(/\/+$/g, '');



const api = axios.create({
  baseURL: AXIOS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log más detallado para diagnosticar CORS/503/NetworkError
    try {
      const details = {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        // URL completa a la que se intentó conectar
        requestUrl: error.request?.responseURL || `${API_BASE_URL}${error.config?.url}`,
        configUrl: error.config?.url,
        // Información serializada por axios si está disponible
        errorJson: typeof error.toJSON === 'function' ? error.toJSON() : undefined
      };

      console.error('Error en la API:', error);
      console.error('Error details:', details);
    } catch (logErr) {
      console.error('Error al intentar loggear el error de la API:', logErr, error);
    }
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error(`No se puede conectar con el servidor en ${API_BASE_URL}. Verifica que el backend esté funcionando.`);
    }
    
    if (error.response?.status === 503) {
      throw new Error('El servidor está temporalmente no disponible. Intenta de nuevo en unos minutos.');
    }
    
    throw error;
  }
);

// Interceptor para enviar Authorization header si hay token en localStorage
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
}, (error) => Promise.reject(error));

export const todoService = {
  // Obtener todas las tareas
  async getAllTodos(): Promise<Todo[]> {
    const response = await api.get('/todos');
    return response.data;
  },

  // Obtener una tarea por ID
  async getTodoById(id: string): Promise<Todo> {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  // Crear una nueva tarea
  async createTodo(todoData: TodoFormData): Promise<Todo> {
    const response = await api.post('/todos', todoData);
    return response.data;
  },

  // Actualizar una tarea
  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data;
  },

  // Eliminar una tarea
  async deleteTodo(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  },

  // Marcar tarea como completada/pendiente
  async toggleTodoComplete(id: string, completed: boolean): Promise<Todo> {
    const response = await api.put(`/todos/${id}`, { completed });
    return response.data;
  }
};
