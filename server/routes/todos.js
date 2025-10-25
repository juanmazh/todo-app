const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../database/pgConnection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Middleware para manejar OPTIONS requests
router.options('*', (req, res) => {
  res.sendStatus(200);
});

// GET /api/todos - Obtener todas las tareas del usuario autenticado
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows || []);
  } catch (error) {
    console.error('Error en GET /api/todos:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
});

// GET /api/todos/:id - Obtener una tarea específica
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const result = await pool.query('SELECT * FROM todos WHERE id = $1 AND user_id = $2', [id, userId]);
    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(row);
  } catch (err) {
    console.error('Error al obtener tarea:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/todos - Crear una nueva tarea
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, priority = 'medium', category = 'general' } = req.body;
  const userId = req.user.id;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'El título es requerido' });
  }

  const id = uuidv4();
  try {
    const result = await pool.query(
      `INSERT INTO todos (id, title, description, priority, category, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, title.trim(), description?.trim() || '', priority, category, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear tarea:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/todos/:id - Actualizar una tarea
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, completed, priority, category } = req.body;
  const userId = req.user.id;

  // Construir la consulta dinámicamente basada en los campos proporcionados
  const updates = [];
  const values = [];

  if (title !== undefined) {
    updates.push('title = $' + (updates.length + 1));
    values.push(title.trim());
  }
  if (description !== undefined) {
    updates.push('description = $' + (updates.length + 1));
    values.push(description.trim());
  }
  if (completed !== undefined) {
    updates.push('completed = $' + (updates.length + 1));
    values.push(!!completed);
  }
  if (priority !== undefined) {
    updates.push('priority = $' + (updates.length + 1));
    values.push(priority);
  }
  if (category !== undefined) {
    updates.push('category = $' + (updates.length + 1));
    values.push(category);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  // id y userId para el WHERE
  values.push(id);
  values.push(userId);

  const query = `UPDATE todos SET ${updates.join(', ')} WHERE id = $${updates.length + 1} AND user_id = $${updates.length + 2} RETURNING *`;

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar tarea:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/todos/:id - Eliminar una tarea
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar tarea:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
