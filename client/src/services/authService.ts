import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

export const authService = {
  async register(username: string, password: string) {
    try {
      // Verificar si el usuario ya existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        throw new Error('El usuario ya existe');
      }

      // Registrar usuario en Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: `${username}@example.com`,
        password: password
      });

      if (signUpError || !data.user) throw signUpError || new Error('Error al crear usuario');

      // Crear registro en la tabla users
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          username: username,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError || !newUser) throw insertError || new Error('Error al crear usuario en la base de datos');

      // Obtener la sesión
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) throw sessionError || new Error('Error al obtener la sesión');

      localStorage.setItem('token', sessionData.session.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: newUser.id,
        username: newUser.username
      }));

      return {
        user: {
          id: newUser.id,
          username: newUser.username
        },
        access_token: sessionData.session.access_token
      };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  async login(username: string, password: string) {
    try {
      // Iniciar sesión en Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: `${username}@example.com`,
        password: password
      });

      if (signInError || !data.session || !data.user) {
        throw new Error('Credenciales inválidas');
      }

      // Obtener datos del usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username')
        .eq('id', data.user.id)
        .single();

      if (userError || !userData) throw userError || new Error('Usuario no encontrado');

      localStorage.setItem('token', data.session.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        username: userData.username
      }));

      return {
        user: {
          id: userData.id,
          username: userData.username
        },
        access_token: data.session.access_token
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    supabase.auth.signOut();
  }
};
