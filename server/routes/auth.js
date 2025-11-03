const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

// Registro: POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username y password son requeridos' });
  }

  try {
    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    // Registrar usuario en Supabase Auth
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: `${username}@example.com`,
      password: password
    });

    if (signUpError) throw signUpError;

    // Crear registro en la tabla users
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        id: user.id,
        username: username,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    // Obtener la sesión
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    res.status(201).json({
      user: {
        id: newUser.id,
        username: newUser.username
      },
      access_token: session.access_token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login: POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username y password son requeridos' });
  }

  try {
    // Iniciar sesión en Supabase
    const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
      email: `${username}@example.com`,
      password: password
    });

    if (signInError) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Obtener datos del usuario
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username')
      .eq('id', session.user.id)
      .single();

    if (userError) throw userError;

    res.json({
      user: {
        id: user.id,
        username: user.username
      },
      access_token: session.access_token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;