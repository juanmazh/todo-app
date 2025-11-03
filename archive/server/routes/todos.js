const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const supabase = require('../config/supabase');

const router = express.Router();

// Middleware para manejar OPTIONS requests
router.options('*', (req, res) => {
  res.sendStatus(200);
});

// GET /api/todos - Obtener todas las tareas del usuario autenticado
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(todos || []);
  } catch (error) {
    console.error('Error en GET /api/todos:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
});

// GET /api/todos/:id - Obtener una tarea específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: todo, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/todos - Crear una nueva tarea
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, priority = 'medium', category = 'general' } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'El título es requerido' });
  }

  try {
    const { data: todo, error } = await supabase
      .from('todos')
      .insert([{
        title: title.trim(),
        description: description?.trim() || '',
        priority,
        category,
        user_id: req.user.id
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/todos/:id - Actualizar una tarea
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, category } = req.body;
    
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (completed !== undefined) updates.completed = completed;
    if (priority !== undefined) updates.priority = priority;
    if (category !== undefined) updates.category = category;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }
    
    updates.updated_at = new Date().toISOString();

    const { data: todo, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Error en PUT /api/todos/:id:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/todos/:id - Eliminar una tarea
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
