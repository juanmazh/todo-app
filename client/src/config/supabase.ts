import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno faltantes:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ Faltante');
  console.error('VITE_SUPABASE_KEY:', supabaseKey ? '✅ Configurada' : '❌ Faltante');
  throw new Error(
    'Faltan las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_KEY. ' +
    'Por favor, crea un archivo .env en la carpeta client con estas variables. ' +
    'Ver client/env.example para más información.'
  );
}

// Validar formato de URL
if (!supabaseUrl.startsWith('http')) {
  console.error('❌ VITE_SUPABASE_URL debe ser una URL válida (ej: https://xxx.supabase.co)');
  throw new Error('URL de Supabase inválida');
}

// Crear una instancia única del cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Verificar conexión al inicializar (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔌 Configuración de Supabase:', {
    url: supabaseUrl,
    keyConfigured: supabaseKey ? '✅' : '❌',
    keyLength: supabaseKey?.length || 0
  });
}

