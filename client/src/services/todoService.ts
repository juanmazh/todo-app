import axios from 'axios';
import type { Todo, TodoFormData } from '../types/Todo';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://todo-app-backend.onrender.com/api';

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
    if (error.code === 'ERR_NETWORK') {
      throw new Error('No se puede conectar con el servidor. Verifica que el backend esté funcionando.');
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
