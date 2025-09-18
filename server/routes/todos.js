const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/connection');

const router = express.Router();

// Middleware para manejar CORS en las rutas
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// GET /api/todos - Obtener todas las tareas
router.get('/', (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT * FROM todos ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Error al obtener tareas:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    
    res.json(rows);
  });
  
  db.close();
});

// GET /api/todos/:id - Obtener una tarea específica
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error al obtener tarea:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    
    res.json(row);
  });
  
  db.close();
});

// POST /api/todos - Crear una nueva tarea
router.post('/', (req, res) => {
  const { title, description, priority = 'medium', category = 'general' } = req.body;
  
  if (!title || title.trim() === '') {
    res.status(400).json({ error: 'El título es requerido' });
    return;
  }
  
  const id = uuidv4();
  const db = getDatabase();
  
  const stmt = db.prepare(`
    INSERT INTO todos (id, title, description, priority, category)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(id, title.trim(), description?.trim() || '', priority, category, function(err) {
    if (err) {
      console.error('Error al crear tarea:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    
    res.status(201).json({
      id,
      title: title.trim(),
      description: description?.trim() || '',
      completed: false,
      priority,
      category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  });
  
  stmt.finalize();
  db.close();
});

// PUT /api/todos/:id - Actualizar una tarea
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed, priority, category } = req.body;
  
  const db = getDatabase();
  
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
  
  const query = `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`;
  
  db.run(query, values, function(err) {
    if (err) {
      console.error('Error al actualizar tarea:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    
    // Obtener la tarea actualizada
    db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
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
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error al eliminar tarea:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    
    res.json({ message: 'Tarea eliminada correctamente' });
  });
  
  db.close();
});

module.exports = router;
