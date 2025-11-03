const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const supabase = require('../config/supabase');

const router = express.Router();

// Middleware para manejar OPTIONS requests
router.options('*', (req, res) => {
  res.sendStatus(200);
});

// GET /api/todos - Obtener todas las tareas del usuario autenticado
router.get('/', authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const userId = req.user.id;

    db.all('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }

      res.json(rows || []);
    });

    db.close();
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
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, completed, priority, category } = req.body;
  
  const db = getDatabase();
  const userId = req.user.id;
  
  // Construir la consulta dinámicamente basada en los campos proporcionados
  const updates = [];
  const values = [];
  
  if (title !== undefined) {
    updates.push('title = ?');
    values.push(title.trim());
  }
  
  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description.trim());
  }
  
  if (completed !== undefined) {
    updates.push('completed = ?');
    values.push(completed ? 1 : 0);
  }
  
  if (priority !== undefined) {
    updates.push('priority = ?');
    values.push(priority);
  }
  
  if (category !== undefined) {
    updates.push('category = ?');
    values.push(category);
  }
  
  if (updates.length === 0) {
    res.status(400).json({ error: 'No hay campos para actualizar' });
    db.close();
    return;
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  
  // Asegurar que la actualización sólo afecta a la tarea del usuario autenticado
  const query = `UPDATE todos SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`;
  values.push(userId);

  db.run(query, values, function(err) {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    
    // Obtener la tarea actualizada
    db.get('SELECT * FROM todos WHERE id = ? AND user_id = ?', [id, userId], (err, row) => {
      if (err) {
        console.error('Error al obtener tarea actualizada:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }
      
      res.json(row);
    });
  });
  
  db.close();
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
