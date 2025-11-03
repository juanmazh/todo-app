const { pool } = require('./pgConnection');

async function createTables() {
  try {
    // Crear tabla users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla users creada/verificada correctamente');

    // Crear tabla todos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        priority VARCHAR(10) DEFAULT 'medium',
        category VARCHAR(50) DEFAULT 'general',
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla todos creada/verificada correctamente');

    console.log('🎉 Base de datos inicializada correctamente');
  } catch (err) {
    console.error('❌ Error creando tablas:', err);
  } finally {
    await pool.end();
  }
}

// Ejecutar la función
createTables();