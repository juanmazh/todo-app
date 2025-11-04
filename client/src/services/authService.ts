import { supabase } from '../config/supabase';

export const authService = {
  // Register using email derived from username (keeps existing UX)
  async register(username: string, password: string) {
    try {
      const domain = import.meta.env.VITE_USERNAME_EMAIL_DOMAIN || 'todo-app.local';
      const derivedEmail = `${username}@${domain}`;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: derivedEmail,
        password
      });

      if (signUpError) throw signUpError;
      
      // Si el proyecto requiere confirmación de email, la sesión puede no estar disponible inmediatamente
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn('No session after signUp:', sessionError);
      }

      const userId = data?.user?.id || sessionData?.session?.user?.id;
      
      if (!userId) {
        throw new Error('No se pudo obtener el ID de usuario después del registro');
      }

      // Guardar username en metadata para referencia (opcional)
      // La sesión de Supabase se maneja automáticamente
      return {
        user: {
          id: userId,
          username
        }
      };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  async login(username: string, password: string) {
    try {
      const domain = import.meta.env.VITE_USERNAME_EMAIL_DOMAIN || 'todo-app.local';
      const derivedEmail = `${username}@${domain}`;

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: derivedEmail,
        password
      });

      if (signInError) throw signInError;
      if (!data || !data.session || !data.user) {
        throw new Error('No session returned from Supabase');
      }

      // La sesión de Supabase se maneja automáticamente
      // Solo guardamos el username para la UI
      return {
        user: { id: data.user.id, username }
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  async logout() {
    // Cerrar sesión en Supabase y limpiar cualquier rastro legado
    await supabase.auth.signOut();
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {
      // ignore storage errors
    }
  },

  // Obtener la sesión actual
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Obtener el usuario actual
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Escuchar cambios en la autenticación
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};
