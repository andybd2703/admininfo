const request = require('supertest');
const express = require('express');
const favoritosRouter = require('../routes/favoritos'); // Ajusta la ruta según corresponda

// Mock de la función createConnection para simular base de datos
jest.mock('../config/db', () => {
  return jest.fn().mockResolvedValue({
    query: jest.fn()
  });
});

const createConnection = require('../config/db');

describe('Favoritos API', () => {
  let app;
  let mockQuery;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/favoritos', favoritosRouter);

    // Resetear mocks antes de cada test
    mockQuery = jest.fn();
    createConnection.mockResolvedValue({ query: mockQuery });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /favoritos/add', () => {
    it('debe retornar 400 si faltan datos', async () => {
      const res = await request(app).post('/favoritos/add').send({ usuario_id: 1 });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Faltan datos: usuario_id o evento_id');
    });

    it('debe retornar 400 si el favorito ya existe', async () => {
      mockQuery.mockResolvedValueOnce([[{ id: 1 }]]); // existingFavorite con un registro
      const res = await request(app).post('/favoritos/add').send({ usuario_id: 1, evento_id: 2 });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Este evento ya está en tus favoritos.');
    });

    it('debe agregar favorito correctamente', async () => {
      mockQuery.mockResolvedValueOnce([[]]); // existingFavorite vacío
      mockQuery.mockResolvedValueOnce({}); // Insert sin error
      const res = await request(app).post('/favoritos/add').send({ usuario_id: 1, evento_id: 2 });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Evento agregado a favoritos con éxito.');
    });
  });

  describe('DELETE /favoritos/remove', () => {
    it('debe retornar 400 si faltan datos', async () => {
      const res = await request(app).delete('/favoritos/remove').send({ usuario_id: 1 });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Faltan datos: usuario_id o evento_id');
    });

    it('debe retornar 400 si el favorito no existe', async () => {
      mockQuery.mockResolvedValueOnce([[]]); // existingFavorite vacío
      const res = await request(app).delete('/favoritos/remove').send({ usuario_id: 1, evento_id: 2 });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Este evento no está en tus favoritos.');
    });

    it('debe eliminar favorito correctamente', async () => {
      mockQuery.mockResolvedValueOnce([[{ id: 1 }]]); // existingFavorite con registro
      mockQuery.mockResolvedValueOnce({}); // Delete sin error
      const res = await request(app).delete('/favoritos/remove').send({ usuario_id: 1, evento_id: 2 });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Evento eliminado de favoritos con éxito.');
    });
  });

  describe('GET /favoritos/verificar/:usuario_id/:evento_id', () => {
    it('debe retornar 400 si faltan datos', async () => {
      const res = await request(app).get('/favoritos/verificar/null/2');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Faltan datos: usuario_id o evento_id');
    });

    it('debe retornar isFavorito true si existe', async () => {
      mockQuery.mockResolvedValueOnce([[{ id: 1 }]]); // Favorito existe
      const res = await request(app).get('/favoritos/verificar/1/2');
      expect(res.statusCode).toBe(200);
      expect(res.body.isFavorito).toBe(true);
    });

    it('debe retornar isFavorito false si no existe', async () => {
      mockQuery.mockResolvedValueOnce([[]]); // Favorito no existe
      const res = await request(app).get('/favoritos/verificar/1/2');
      expect(res.statusCode).toBe(200);
      expect(res.body.isFavorito).toBe(false);
    });
  });

  describe('GET /favoritos/:usuario_id', () => {
    it('debe retornar 400 si falta usuario_id', async () => {
      const res = await request(app).get('/favoritos/');
      expect(res.statusCode).toBe(404); // Porque no coincide ruta, no 400 (express no recibe :usuario_id)
    });

    it('debe retornar los favoritos', async () => {
      const fakeFavoritos = [
        { id: 1, nombre: 'Evento 1', fecha: '2025-05-21', hora: '20:00', imagen: 'img1.jpg' },
        { id: 2, nombre: 'Evento 2', fecha: '2025-05-22', hora: '18:00', imagen: 'img2.jpg' }
      ];
      mockQuery.mockResolvedValueOnce([fakeFavoritos]);
      const res = await request(app).get('/favoritos/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(fakeFavoritos);
    });
  });
});
