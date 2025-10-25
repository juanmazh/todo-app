const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

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

    // Crear tabla de usuarios
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Crear tabla de tareas (ahora con user_id)
    const createTodosTable = `
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT 0,
        priority TEXT DEFAULT 'medium',
        category TEXT DEFAULT 'general',
        user_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.serialize(() => {
      db.run(createUsersTable, (err) => {
        if (err) {
          console.error('Error al crear tabla users:', err);
          reject(err);
          return;
        }
        console.log('📋 Tabla users creada/verificada correctamente');
      });

      db.run(createTodosTable, (err) => {
        if (err) {
          console.error('Error al crear tabla todos:', err);
          reject(err);
          return;
        }
        console.log('📋 Tabla todos creada/verificada correctamente');
      });

      // Insertar usuario demo si no existe
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row.count === 0) {
          const demoId = uuidv4();
          const demoUsername = 'demo';
          const demoPassword = 'demo123';
          const passwordHash = bcrypt.hashSync(demoPassword, 10);

          const insertUser = db.prepare(`INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)`);
          insertUser.run(demoId, demoUsername, passwordHash, (err) => {
            if (err) {
              console.error('Error al insertar usuario demo:', err);
            } else {
              console.log(`👤 Usuario demo creado -> username: ${demoUsername}, password: ${demoPassword}`);
            }
          });
          insertUser.finalize();

          // Insertar datos de ejemplo para este usuario si la tabla de todos está vacía
          db.get('SELECT COUNT(*) as count FROM todos', (err2, row2) => {
            if (err2) {
              console.error('Error contando todos:', err2);
            } else if (row2.count === 0) {
              const sampleTodos = [
                {
                  id: uuidv4(),
                  title: 'Bienvenido a tu TO-DO App',
                  description: 'Esta es tu primera tarea. ¡Puedes editarla o eliminarla!',
                  completed: 0,
                  priority: 'high',
                  category: 'welcome'
                },
                {
                  id: uuidv4(),
                  title: 'Explorar las funcionalidades',
                  description: 'Prueba agregar nuevas tareas, marcarlas como completadas y organizarlas por categorías.',
                  completed: 0,
                  priority: 'medium',
                  category: 'learning'
                }
              ];

              const insertStmt = db.prepare(`
                INSERT INTO todos (id, title, description, completed, priority, category, user_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
              `);

              sampleTodos.forEach(todo => {
                insertStmt.run(todo.id, todo.title, todo.description, todo.completed, todo.priority, todo.category, demoId);
              });

              insertStmt.finalize();
              console.log('🌱 Datos de ejemplo insertados y asignados al usuario demo');
            }

            // Finalmente cerrar conexión y resolver
            db.close();
            resolve();
          });
        } else {
          // No se necesita crear demo; sólo cerrar y resolver
          db.close();
          resolve();
        }
      });
    });
  });
};

module.exports = { initDatabase };
