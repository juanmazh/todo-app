const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../database/connection');
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
    const db = getDatabase();

    // Verificar si ya existe el usuario
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }

      if (row) {
        res.status(409).json({ error: 'El usuario ya existe' });
        db.close();
        return;
      }

      const id = uuidv4();
      const passwordHash = bcrypt.hashSync(password, 10);

      const stmt = db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)');
      stmt.run(id, username, passwordHash, function(insertErr) {
        if (insertErr) {
          console.error('Error al crear usuario:', insertErr);
          res.status(500).json({ error: 'Error interno al crear usuario' });
          return;
        }

        const token = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id, username } });
      });

      stmt.finalize();
      db.close();
    });
  } catch (error) {
    console.error('Error en POST /auth/register:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login: POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('🔐 POST /api/auth/login - body:', req.body);

  if (!username || !password) {
    return res.status(400).json({ error: 'username y password son requeridos' });
  }

  try {
    const db = getDatabase();
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (err) {
        console.error('Error en login:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
        db.close();
        return;
      }

      if (!user) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        db.close();
        return;
      }

      const matches = bcrypt.compareSync(password, user.password_hash);
      if (!matches) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        db.close();
        return;
      }

      try {
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, username: user.username } });
      } catch (jwtErr) {
        console.error('Error generando JWT en login:', jwtErr);
        res.status(500).json({ error: 'Error generando token' });
      }
      db.close();
    });
  } catch (error) {
    console.error('Error en POST /auth/login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
