import { createClient } from '@supabase/supabase-js';
import type { Todo, TodoFormData } from '../types/Todo';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

export const todoService = {
  // Obtener todas las tareas
  async getAllTodos(): Promise<Todo[]> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Obtener una tarea por ID
  async getTodoById(id: string): Promise<Todo> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Tarea no encontrada');
    return data;
  },

  // Crear una nueva tarea
  async createTodo(todoData: TodoFormData): Promise<Todo> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { data, error } = await supabase
      .from('todos')
      .insert([{
        ...todoData,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Error al crear la tarea');
    return data;
  },

  // Actualizar una tarea
  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Tarea no encontrada');
    return data;
  },

  // Eliminar una tarea
  async deleteTodo(id: string): Promise<void> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Marcar tarea como completada/pendiente
  async toggleTodoComplete(id: string, completed: boolean): Promise<Todo> {
    return this.updateTodo(id, { completed });
  }
};
