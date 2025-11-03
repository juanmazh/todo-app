-- Script de configuración de Supabase para la aplicación Todo
-- Ejecuta este script en el SQL Editor de Supabase

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla todos (Supabase Auth maneja los usuarios automáticamente)
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(10) DEFAULT 'medium',
  category VARCHAR(50) DEFAULT 'general',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Habilitar Row Level Security
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para todos
-- Permitir que los usuarios vean solo sus propias tareas
CREATE POLICY "Todos - select own" ON public.todos
  FOR SELECT
  USING (auth.uid() = user_id);

-- Permitir que los usuarios inserten sus propias tareas
CREATE POLICY "Todos - insert own" ON public.todos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permitir que los usuarios actualicen sus propias tareas
CREATE POLICY "Todos - update own" ON public.todos
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Permitir que los usuarios eliminen sus propias tareas
CREATE POLICY "Todos - delete own" ON public.todos
  FOR DELETE
  USING (auth.uid() = user_id);

-- Notas importantes:
-- 1. Usa la clave anon (public) en el frontend. NUNCA expongas la service_role key.
-- 2. Asegúrate de que user_id se establezca como auth.uid() al crear tareas.
-- 3. Después de ejecutar las políticas, prueba con una sesión incógnito para verificar el acceso.

