const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const todoRoutes = require('./routes/todos');
const { initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://todo-app-frontend-c81g.onrender.com',
    'https://todo-app-frontend.onrender.com',
    'https://*.onrender.com',
    'https://*.netlify.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Solo servir archivos estáticos en desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Ruta de salud para verificar que el servidor funciona
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/todos', todoRoutes);

// En producción, solo manejar rutas de API
if (process.env.NODE_ENV === 'production') {
  app.get('/', (req, res) => {
    res.json({ 
      message: 'API del TO-DO App funcionando correctamente',
      endpoints: {
        health: '/api/health',
        todos: '/api/todos'
      }
    });
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
