import axios from 'axios';
import type { Todo, TodoFormData } from '../types/Todo';

// Detectar automáticamente la URL del backend
const getApiUrl = () => {
  // Si estamos en desarrollo local
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  
  // En producción: preferir la variable de entorno VITE_API_URL.
  // Si no existe, registrar un warning y usar un fallback conocido.
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    // Nota: hacemos un fallback por compatibilidad, pero lo ideal es
    // configurar VITE_API_URL en Vercel (o la plataforma que use el frontend).
    console.warn('⚠️ VITE_API_URL no está definida. Usando URL por defecto de fallback. Por favor configura VITE_API_URL en Vercel/entorno de producción.');
  }

  return envUrl || 'https://todo-app-backend.onrender.com/api';
};

const API_BASE_URL = getApiUrl();

// Log para debug
console.log('🔗 API URL configurada:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
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
