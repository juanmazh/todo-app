const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const todoRoutes = require('./routes/todos');
const { initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Rutas de la API
app.use('/api/todos', todoRoutes);

// Servir la aplicación React en producción (solo si existe)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Inicializar base de datos y servidor
const startServer = async () => {
  try {
    await initDatabase();
    console.log('✅ Base de datos inicializada correctamente');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📱 Aplicación TO-DO lista para usar`);
    });
  } catch (error) {
    console.error('❌ Error al inicializar el servidor:', error);
    process.exit(1);
  }
};

startServer();
