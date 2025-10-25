import React, { useState } from 'react';
import { User, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';

interface AuthProps {
  onAuth: (user: { id: string; username: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = mode === 'login'
        ? await authService.login(username, password)
        : await authService.register(username, password);

      const { token, user } = data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  onAuth(user);
    } catch (err: any) {
      console.error('Auth error (detailed):', err);
      const serverMsg = err?.response?.data?.error || err?.response?.data || null;
      setError(serverMsg || err.message || 'Error en autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-side auth-side--promo">
          <div className="promo-content">
            <h3>Bienvenido a</h3>
            <h1>Mi Lista de Tareas</h1>
            <p>Organiza tu día, gestiona prioridades y alcanza tus metas. Inicia sesión o crea una cuenta para sincronizar tus tareas.</p>
            <div className="promo-stats">
              <div><CheckCircle /> <span>Rápido</span></div>
              <div><CheckCircle /> <span>Seguro</span></div>
              <div><CheckCircle /> <span>Intuitivo</span></div>
            </div>
          </div>
        </div>

        <div className="auth-side auth-side--form">
          <div className="brand">
            <h2>Accede a tu cuenta</h2>
            <p className="muted">{mode === 'login' ? 'Introduce tus credenciales para entrar' : 'Crea una cuenta nueva — es rápido'}</p>
          </div>

          <form onSubmit={submit} className="auth-form">
            <label className="input-label">Usuario</label>
            <div className="input-with-icon">
              <User className="input-icon" />
              <input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="tu_usuario" />
            </div>

            <label className="input-label">Contraseña</label>
            <div className="input-with-icon">
              <Lock className="input-icon" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-actions" style={{ marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Procesando...' : (mode === 'login' ? 'Entrar' : 'Crear cuenta')}
                <ArrowRight size={16} />
              </button>

              <button type="button" className="btn btn-secondary" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'Crear cuenta' : 'Ir a login'}
              </button>
            </div>

            <p className="auth-hint">Usa el usuario demo: <strong>demo</strong> / <strong>demo123</strong></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
