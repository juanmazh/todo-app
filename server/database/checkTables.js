const supabase = require('../config/supabase');

async function checkTables() {
  try {
    console.log('🔍 Verificando tablas en Supabase...');

    // Intentar consultar la tabla users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (usersError) {
      console.error('❌ Error al verificar tabla users:', usersError);
      console.log('\nEjecuta este SQL en el SQL Editor de Supabase:');
      console.log(`
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid() = id);
`);
      return;
    }

    console.log('✅ Tabla users existe');

    // Intentar consultar la tabla todos
    const { data: todos, error: todosError } = await supabase
      .from('todos')
      .select('*')
      .limit(1);

    if (todosError) {
      console.error('❌ Error al verificar tabla todos:', todosError);
      console.log('\nEjecuta este SQL en el SQL Editor de Supabase:');
      console.log(`
CREATE TABLE todos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(10) DEFAULT 'medium',
  category VARCHAR(50) DEFAULT 'general',
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD their own todos" ON todos
  FOR ALL USING (auth.uid() = user_id);
`);
      return;
    }

    console.log('✅ Tabla todos existe');
    console.log('✅ La base de datos está correctamente configurada');

  } catch (error) {
    console.error('❌ Error al verificar la base de datos:', error);
  }
}

checkTables();