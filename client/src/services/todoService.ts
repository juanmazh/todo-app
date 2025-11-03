import { supabase } from '../config/supabase';
import type { Todo, TodoFormData } from '../types/Todo';

export const todoService = {
  // Obtener todas las tareas
  // Las RLS policies de Supabase filtran automáticamente por auth.uid()
  async getAllTodos(): Promise<Todo[]> {
    // Verificar que hay una sesión activa
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión.');
    }

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Obtener una tarea por ID
  async getTodoById(id: string): Promise<Todo> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión.');
    }

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Tarea no encontrada');
    return data;
  },

  // Crear una nueva tarea
  async createTodo(todoData: TodoFormData): Promise<Todo> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión.');
    }

    // Usar auth.uid() que es manejado automáticamente por Supabase
    // Las RLS policies verifican que user_id = auth.uid()
    const { data, error } = await supabase
      .from('todos')
      .insert([{
        ...todoData,
        user_id: session.user.id
      }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Error al crear la tarea');
    return data;
  },

  // Actualizar una tarea
  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión.');
    }

    // Las RLS policies solo permiten actualizar tus propias tareas
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Tarea no encontrada');
    return data;
  },

  // Eliminar una tarea
  async deleteTodo(id: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión.');
    }

    // Las RLS policies solo permiten eliminar tus propias tareas
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Marcar tarea como completada/pendiente
  async toggleTodoComplete(id: string, completed: boolean): Promise<Todo> {
    return this.updateTodo(id, { completed });
  }
};
