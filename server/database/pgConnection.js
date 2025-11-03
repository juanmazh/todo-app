const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Verificar la conexión
pool.on('connect', () => {
  console.log('🔌 Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en la conexión PostgreSQL:', err);
});

module.exports = { pool };