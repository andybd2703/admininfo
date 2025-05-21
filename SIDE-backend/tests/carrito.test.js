const request = require('supertest');
const app = require('../app'); // Asegúrate de que tu archivo principal exporte el `app`
const db = require('../config/db');

// Mock de la conexión a la base de datos
jest.mock('../config/db');

let mockConnection;

// Configura un mock de conexión de MySQL
beforeEach(() => {
  mockConnection = {
    query: jest.fn(),
  };
  db.mockImplementation(() => Promise.resolve(mockConnection));
});

describe('📦 Carrito - Endpoints', () => {
  test('POST /api/carrito/add - Agrega una boleta nueva', async () => {
    // Simular que no hay boleta previa
    mockConnection.query.mockResolvedValueOnce([[]]); // Resultado del SELECT
    mockConnection.query.mockResolvedValueOnce();     // Resultado del INSERT

    const res = await request(app)
      .post('/api/carrito/add')
      .send({
        usuario_id: 1,
        evento_id: 101,
        categoria: 'vip',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Boleta agregada al carrito');
    expect(mockConnection.query).toHaveBeenCalledTimes(2);
  });

  test('PUT /api/carrito/update - Actualiza cantidad de entradas', async () => {
    mockConnection.query.mockResolvedValueOnce(); // UPDATE

    const res = await request(app)
      .put('/api/carrito/update')
      .send({
        usuario_id: 1,
        evento_id: 101,
        categoria: 'vip',
        cantidad: 3,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Cantidad actualizada');
    expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE carrito'), expect.any(Array));
  });

  test('DELETE /api/carrito/remove/:usuario_id/:evento_id/:categoria - Elimina del carrito', async () => {
    mockConnection.query.mockResolvedValueOnce(); // DELETE

    const res = await request(app)
      .delete('/api/carrito/remove/1/101/vip');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Item eliminado del carrito');
  });

  test('GET /api/carrito/:usuario_id - Obtiene los ítems del carrito', async () => {
    const carritoMock = [{
      evento_id: 101,
      nombre: 'Concierto',
      imagen: 'url',
      categoria: 'vip',
      cantidad: 2,
      precio_unitario: 50000,
      total: 100000,
    }];
    mockConnection.query.mockResolvedValueOnce([carritoMock]);

    const res = await request(app)
      .get('/api/carrito/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(carritoMock);
  });
});
