const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../database/pgConnection');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';


// Registro: POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username y password son requeridos' });
  }

  try {
    // Verificar si ya existe el usuario
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    const id = uuidv4();
    const passwordHash = bcrypt.hashSync(password, 10);

    await pool.query(
      'INSERT INTO users (id, username, password_hash) VALUES ($1, $2, $3)',
      [id, username, passwordHash]
    );

    const token = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id, username } });
  } catch (error) {
    console.error('Error en POST /auth/register:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Login: POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('🔐 POST /api/auth/login - body:', req.body);

  if (!username || !password) {
    return res.status(400).json({ error: 'username y password son requeridos' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = userResult.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const matches = bcrypt.compareSync(password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    try {
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (jwtErr) {
      console.error('Error generando JWT en login:', jwtErr);
      res.status(500).json({ error: 'Error generando token' });
    }
  } catch (error) {
    console.error('Error en POST /auth/login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
