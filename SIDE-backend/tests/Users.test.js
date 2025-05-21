const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getDB = require('../config/db');

jest.mock('../config/db');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Modelo User', () => {
  let dbMock;

  beforeEach(() => {
    dbMock = {
      query: jest.fn(),
    };
    getDB.mockResolvedValue(dbMock);

    bcrypt.hash.mockReset();
    bcrypt.compare.mockReset();
    jwt.sign.mockReset();
  });

  test('create() debería crear un usuario si no existe el email', async () => {
    // Simula que no existe usuario con ese email
    dbMock.query.mockResolvedValueOnce([[]]); // findByEmail devuelve vacío
    // Simula el hash
    bcrypt.hash.mockResolvedValue('hashedPassword');
    // Simula inserción con resultado
    const fakeResult = { insertId: 1 };
    dbMock.query.mockResolvedValueOnce([fakeResult]);

    const result = await User.create(
      'user1', 'user1@example.com', 'password123',
      'First', 'Last', '2000-01-01', '12345678', '555-1234'
    );

    expect(dbMock.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM users WHERE email = ?'),
      ['user1@example.com']
    );

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

    expect(dbMock.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      expect.arrayContaining(['user1', 'user1@example.com', 'hashedPassword'])
    );

    expect(result).toEqual(fakeResult);
  });

  test('create() debería lanzar error si email ya existe', async () => {
    // Simula usuario ya existente
    dbMock.query.mockResolvedValueOnce([[{ id: 1 }]]);

    await expect(
      User.create(
        'user1', 'user1@example.com', 'password123',
        'First', 'Last', '2000-01-01', '12345678', '555-1234'
      )
    ).rejects.toThrow('El correo electrónico ya está en uso');
  });

  test('findByEmail() debería retornar un usuario si existe', async () => {
    const fakeUser = { id: 1, email: 'user@example.com' };
    dbMock.query.mockResolvedValue([[fakeUser]]);

    const user = await User.findByEmail('user@example.com');

    expect(dbMock.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM users WHERE email = ?'),
      ['user@example.com']
    );

    expect(user).toEqual(fakeUser);
  });

  test('generateToken() debería crear un JWT válido', () => {
    const fakeUser = {
      id: 1,
      username: 'user1',
      email: 'user1@example.com',
      role: 'usuario'
    };
    jwt.sign.mockReturnValue('token123');

    const token = User.generateToken(fakeUser);

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: fakeUser.id,
        username: fakeUser.username,
        email: fakeUser.email,
        role: fakeUser.role
      },
      expect.any(String),
      { expiresIn: '1h' }
    );
    expect(token).toBe('token123');
  });

  test('comparePassword() debería comparar correctamente contraseñas', async () => {
    bcrypt.compare.mockResolvedValue(true);

    const result = await User.comparePassword('plainPassword', 'hashedPassword');

    expect(bcrypt.compare).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
    expect(result).toBe(true);
  });
});
