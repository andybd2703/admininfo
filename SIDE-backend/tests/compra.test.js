jest.mock('../controllers/checkoutController', () => ({
  generarFacturaPDF: jest.fn((res, data) => {
    res.status(200).json({ message: 'PDF generado (mock)' });
  }),
}));

const request = require('supertest');
const express = require('express');
const compraRouter = require('../routes/compra');
const { generarFacturaPDF } = require('../controllers/checkoutController');

const app = express();
app.use(express.json());
app.use('/api/compra', compraRouter);

describe('📦 Compra - Endpoints', () => {
  beforeEach(() => {
    generarFacturaPDF.mockClear();
  });

  test('POST /api/compra - Procesa compra y llama a generarFacturaPDF', async () => {
    const compraData = {
      username: 'usuario1',
      items: [
        { producto: 'item1', cantidad: 2, precio: 100 },
        { producto: 'item2', cantidad: 1, precio: 50 },
      ],
      total: 250,
    };

    const res = await request(app)
      .post('/api/compra')
      .send(compraData);

    expect(res.statusCode).toBe(200);
    expect(generarFacturaPDF).toHaveBeenCalledTimes(1);
    expect(generarFacturaPDF).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        username: 'usuario1',
        items: expect.any(Array),
        total: 250,
      })
    );
  });

  test('POST /api/compra - Retorna error 400 si carrito vacío', async () => {
    const res = await request(app)
      .post('/api/compra')
      .send({ username: 'usuario1', items: [], total: 0 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('El carrito está vacío');
    expect(generarFacturaPDF).not.toHaveBeenCalled();
  });
});
