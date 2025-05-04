const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');

dotenv.config();

const db = require('./config/db'); // <-- Conexión a la base de datos

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes); // Usar las rutas de autenticación
// Ruta de prueba simple
app.get('/api/ping', (req, res) => {
    res.json({ message: 'pong' });
  });

// Ruta de prueba para verificar conexión a MySQL
// Ruta de prueba para verificar conexión a MySQL
app.get('/api/usuarios', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM users');
      res.json(rows);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  });
  
console.log('Iniciando el servidor...');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
