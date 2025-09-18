import axios from 'axios';
import type { Todo, TodoFormData } from '../types/Todo';

// Detectar automáticamente la URL del backend
const getApiUrl = () => {
  // Si estamos en desarrollo local
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  
  // Si estamos en Render, usar la variable de entorno o la URL por defecto
  return import.meta.env.VITE_API_URL || 'https://todo-app-backend-yadb.onrender.com/api';
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
    console.error('Error en la API:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url
    });
    
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
