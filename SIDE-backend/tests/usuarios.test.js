const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const userRoutes = require('../routes/usuarios'); // ajusta si tu ruta está en otro archivo

jest.mock('../config/db', () => {
  return jest.fn(() => Promise.resolve({
    query: jest.fn((sql, values) => {
      if (sql.includes('SELECT * FROM users WHERE id = ?')) {
        return Promise.resolve([[{
          id: 1,
          username: 'usuarioTest',
          email: 'usuario@test.com',
          first_name: 'Juan',
          last_name: 'Pérez',
          password: 'secreto', // será eliminado en la respuesta
          birthdate: '2000-01-01',
          id_number: '12345678',
          phone_number: '123456789',
          role: 'admin'
        }]]);
      }
    })
  }));
});
jest.mock('../middlewares/auth', () => {
  return (req, res, next) => {
    req.user = { id: 1 };
    next();
  };
});

const app = express();
app.use(express.json());

// Middleware simulado que inyecta req.user con el ID del usuario
app.use((req, res, next) => {
  req.user = { id: 1 }; // ID del usuario autenticado
  next();
});

app.use('/api/usuarios', userRoutes);

describe('GET /api/usuarios/perfil', () => {
  it('debería devolver el perfil del usuario autenticado', async () => {
    const res = await request(app).get('/api/usuarios/perfil');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('username', 'usuarioTest');
    expect(res.body).not.toHaveProperty('password'); // no debe incluir contraseña
  });
});
