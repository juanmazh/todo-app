const express = require('express');
const cors = require('cors');
require('dotenv').config();

const todoRoutes = require('./routes/todos');
const authRoutes = require('./routes/auth');
const { initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
// In production prefer to set ALLOWED_ORIGINS as a comma-separated list of allowed origins.
const rawAllowed = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = rawAllowed.split(',').map(s => s.trim()).filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    // If no allowedOrigins configured, allow all origins
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS not allowed for origin ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
// Handle preflight across the board
app.options('*', cors(corsOptions));

app.use(express.json());

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
app.use('/api/auth', authRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'API del TO-DO App funcionando correctamente',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      todos: '/api/todos'
    }
  });
});

// Error handler that ensures CORS headers are present on error responses
app.use((err, req, res, next) => {
  if (!err) return next();
  try {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } catch (e) {
    // ignore
  }
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

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
