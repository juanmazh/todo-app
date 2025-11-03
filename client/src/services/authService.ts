import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

export const authService = {
  // Register using email derived from username (keeps existing UX),
  // but do NOT require the presence of a `users` table in the DB.
  async register(username: string, password: string) {
    try {
      const domain = import.meta.env.VITE_USERNAME_EMAIL_DOMAIN || 'todo-app.local';
      const derivedEmail = `${username}@${domain}`;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: derivedEmail,
        password
      });

      if (signUpError) throw signUpError;
      const userId = (data && (data as any).user) ? (data as any).user.id : null;

      // Try to obtain the session (may require email confirmation depending on project settings)
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        // Not fatal for register: user was created in Auth, but session might be unavailable
        console.warn('No session after signUp:', sessionError);
      }

      // Store the minimal user info locally so the client can operate (id and username)
      const storedId = userId || (sessionData && sessionData.session && sessionData.session.user ? sessionData.session.user.id : null);
      if (storedId) {
        localStorage.setItem('token', sessionData && sessionData.session ? sessionData.session.access_token : '');
        localStorage.setItem('user', JSON.stringify({ id: storedId, username }));
      }

      return {
        user: {
          id: storedId,
          username
        },
        access_token: sessionData && sessionData.session ? sessionData.session.access_token : null
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
      if (!data || !data.session || !data.user) throw new Error('No session returned from Supabase');

      // Save session token and an in-memory user object (username comes from the parameter)
      localStorage.setItem('token', data.session.access_token);
      localStorage.setItem('user', JSON.stringify({ id: data.user.id, username }));

      return {
        user: { id: data.user.id, username },
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
