-- Habilitar uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Recrear tabla users
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Recrear tabla todos
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

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Políticas para users
DROP POLICY IF EXISTS "Enable insert for users" ON users;
CREATE POLICY "Enable insert for users" ON users
  FOR INSERT 
  WITH CHECK (true);  -- Permitir registro de usuarios

DROP POLICY IF EXISTS "Enable select for users" ON users;
CREATE POLICY "Enable select for users" ON users
  FOR SELECT 
  USING (true);  -- Permitir lectura para autenticación

-- Políticas para todos
DROP POLICY IF EXISTS "Enable all for users todos" ON todos;
CREATE POLICY "Enable all for users todos" ON todos
  FOR ALL
  USING (auth.uid()::text = user_id::text OR auth.uid() IS NULL)
  WITH CHECK (auth.uid()::text = user_id::text OR auth.uid() IS NULL);
