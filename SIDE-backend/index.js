// ─────────────────────────────────────────────────────────────
// IMPORTACIONES
// ─────────────────────────────────────────────────────────────
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/auth');
const eventosRoutes = require('./routes/events');
const usuariosRoutes = require('./routes/usuarios');
const favoritosRoutes = require('./routes/favoritos');

const db = require('./config/db');

// ─────────────────────────────────────────────────────────────
// CONFIGURACIONES
// ─────────────────────────────────────────────────────────────
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────────────────────
const corsOptions = {
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// ─────────────────────────────────────────────────────────────
// HELMET (Seguridad con políticas personalizadas)
// ─────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "http://localhost:3000", "data:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      scriptSrcAttr: ["'none'"],
    },
  }
}));

// ─────────────────────────────────────────────────────────────
// MIDDLEWARES GENERALES
// ─────────────────────────────────────────────────────────────
app.use(morgan('dev'));
app.use(express.json());

// Servir imágenes con headers específicos
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// ─────────────────────────────────────────────────────────────
// RUTAS
// ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/events', eventosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/favoritos', favoritosRoutes);

// Ruta de prueba simple
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Ruta de prueba para base de datos
app.get('/api/usuarios', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE DE MANEJO DE ERRORES
// ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Ocurrió un error en el servidor' });
});

// ─────────────────────────────────────────────────────────────
// INICIAR SERVIDOR
// ─────────────────────────────────────────────────────────────
console.log('Iniciando el servidor...');
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
