const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'todos.db');

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error al conectar con la base de datos:', err);
        reject(err);
        return;
      }
      console.log('📊 Conectado a la base de datos SQLite');
    });

    // Crear tabla de tareas
    const createTodosTable = `
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT 0,
        priority TEXT DEFAULT 'medium',
        category TEXT DEFAULT 'general',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.run(createTodosTable, (err) => {
      if (err) {
        console.error('Error al crear tabla todos:', err);
        reject(err);
        return;
      }
      console.log('📋 Tabla todos creada/verificada correctamente');
      
      // Insertar datos de ejemplo si la tabla está vacía
      db.get('SELECT COUNT(*) as count FROM todos', (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row.count === 0) {
          const sampleTodos = [
            {
              id: '1',
              title: 'Bienvenido a tu TO-DO App',
              description: 'Esta es tu primera tarea. ¡Puedes editarla o eliminarla!',
              completed: false,
              priority: 'high',
              category: 'welcome'
            },
            {
              id: '2',
              title: 'Explorar las funcionalidades',
              description: 'Prueba agregar nuevas tareas, marcarlas como completadas y organizarlas por categorías.',
              completed: false,
              priority: 'medium',
              category: 'learning'
            }
          ];

          const insertStmt = db.prepare(`
            INSERT INTO todos (id, title, description, completed, priority, category)
            VALUES (?, ?, ?, ?, ?, ?)
          `);

          sampleTodos.forEach(todo => {
            insertStmt.run(todo.id, todo.title, todo.description, todo.completed, todo.priority, todo.category);
          });

          insertStmt.finalize();
          console.log('🌱 Datos de ejemplo insertados');
        }
        
        db.close();
        resolve();
      });
    });
  });
};

module.exports = { initDatabase };
