const supabase = require('../config/supabase');

// SQL para crear las tablas
const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
  );
`;

const CREATE_TODOS_TABLE = `
  CREATE TABLE IF NOT EXISTS todos (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(10) DEFAULT 'medium',
    category VARCHAR(50) DEFAULT 'general',
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
  );
`;

// SQL para las políticas de seguridad
const ENABLE_RLS = `
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
`;

const CREATE_POLICIES = `
  DROP POLICY IF EXISTS "Users can read their own data" ON users;
  CREATE POLICY "Users can read their own data" ON users
    FOR SELECT USING (auth.uid() = id);

  DROP POLICY IF EXISTS "Users can CRUD their own todos" ON todos;
  CREATE POLICY "Users can CRUD their own todos" ON todos
    FOR ALL USING (auth.uid() = user_id);
`;

async function initDatabase() {
  try {
    console.log('🔧 Iniciando configuración de la base de datos...');

    // Crear tablas
    console.log('📦 Creando tabla users...');
    await supabase.from('users').select('*').limit(1);
    
    console.log('📦 Creando tabla todos...');
    await supabase.from('todos').select('*').limit(1);

    console.log('✅ Base de datos configurada correctamente');
    
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    process.exit(1);
  }
}

initDatabase();
