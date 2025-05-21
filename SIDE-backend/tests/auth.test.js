const request = require('supertest');
const express = require('express');
const authRouter = require('../routes/auth'); // ajusta la ruta según tu estructura
const User = require('../models/User');

jest.mock('../models/User');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Rutas de autenticación', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('Debería registrar un usuario y devolver token', async () => {
      User.findByEmail.mockResolvedValue(null); // no existe usuario
      User.create.mockResolvedValue({ insertId: 1 });
      User.generateToken.mockReturnValue('token123');

      const newUserData = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'pass123',
        firstName: 'First',
        lastName: 'Last',
        birthdate: '2000-01-01',
        idNumber: '123456',
        phoneNumber: '555-1234',
      };

      const res = await request(app)
        .post('/auth/register')
        .send(newUserData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Usuario registrado');
      expect(res.body).toHaveProperty('token', 'token123');
      expect(res.body.usuario).toMatchObject({
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        firstName: 'First',
        lastName: 'Last',
        birthdate: '2000-01-01',
        idNumber: '123456',
        phoneNumber: '555-1234',
        role: 'usuario'
      });
      expect(User.findByEmail).toHaveBeenCalledWith('user1@example.com');
      expect(User.create).toHaveBeenCalledWith(
        'user1', 'user1@example.com', 'pass123',
        'First', 'Last', '2000-01-01', '123456', '555-1234', 'usuario'
      );
    });

    it('Debería devolver error 400 si usuario ya existe', async () => {
      User.findByEmail.mockResolvedValue({ id: 1 }); // usuario existe

      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'user1',
          email: 'user1@example.com',
          password: 'pass123',
          firstName: 'First',
          lastName: 'Last',
          birthdate: '2000-01-01',
          idNumber: '123456',
          phoneNumber: '555-1234',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Usuario ya existe');
    });

    it('Debería devolver error 500 en caso de excepción', async () => {
      User.findByEmail.mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'user1',
          email: 'user1@example.com',
          password: 'pass123',
          firstName: 'First',
          lastName: 'Last',
          birthdate: '2000-01-01',
          idNumber: '123456',
          phoneNumber: '555-1234',
        });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('message', 'Error al registrar usuario');
      expect(res.body).toHaveProperty('error', 'DB error');
    });
  });

  describe('POST /auth/login', () => {
    it('Debería iniciar sesión correctamente y devolver token', async () => {
      const fakeUser = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password: 'hashedpass',
        role: 'usuario'
      };

      User.findByEmail.mockResolvedValue(fakeUser);
      User.comparePassword.mockResolvedValue(true);
      User.generateToken.mockReturnValue('token123');

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'user1@example.com', password: 'pass123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Inicio de sesión exitoso');
      expect(res.body).toHaveProperty('token', 'token123');
      expect(res.body.usuario).toEqual(fakeUser);

      expect(User.findByEmail).toHaveBeenCalledWith('user1@example.com');
      expect(User.comparePassword).toHaveBeenCalledWith('pass123', 'hashedpass');
    });

    it('Debería devolver error 400 si usuario no existe', async () => {
      User.findByEmail.mockResolvedValue(null);

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'noexiste@example.com', password: 'pass123' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Usuario no encontrado');
    });

    it('Debería devolver error 400 si contraseña es incorrecta', async () => {
      User.findByEmail.mockResolvedValue({ password: 'hashedpass' });
      User.comparePassword.mockResolvedValue(false);

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'user@example.com', password: 'wrongpass' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Contraseña incorrecta');
    });

    it('Debería devolver error 500 en caso de excepción', async () => {
      User.findByEmail.mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'user1@example.com', password: 'pass123' });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('message', 'Error al iniciar sesión');
      expect(res.body).toHaveProperty('error', 'DB error');
    });
  });
});
