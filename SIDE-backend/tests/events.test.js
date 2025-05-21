const request = require('supertest');
const express = require('express');
const multer = require('multer');
const eventsRouter = require('../routes/events');  // Ajusta la ruta si es diferente
const Evento = require('../models/Event');

jest.mock('../models/Event'); // Mockeamos el modelo

const app = express();
app.use(express.json());
app.use('/events', eventsRouter);

describe('Rutas de eventos', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /events - obtener todos los eventos', async () => {
    const mockEventos = [{ id: 1, nombre: 'Evento 1' }, { id: 2, nombre: 'Evento 2' }];
    Evento.getAll.mockResolvedValue(mockEventos);

    const res = await request(app).get('/events');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockEventos);
  });

  test('GET /events/:id - obtener evento por id existente', async () => {
    const evento = { id: 1, nombre: 'Evento 1' };
    Evento.getById.mockResolvedValue(evento);

    const res = await request(app).get('/events/1');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(evento);
  });

  test('GET /events/:id - evento no encontrado', async () => {
    Evento.getById.mockResolvedValue(null);

    const res = await request(app).get('/events/999');
    
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Evento no encontrado');
  });

  test('POST /events/crear - crear evento sin imagen', async () => {
    Evento.create.mockResolvedValue({ insertId: 123 });

    const res = await request(app)
      .post('/events/crear')
      .field('nombre', 'Evento nuevo')
      .field('descripcion', 'Descripción')
      .field('fecha', '2025-05-21')
      .field('hora', '20:00')
      .field('edad_minima', '18')
      .field('precio_platino_full', '100')
      .field('precio_vip_full', '80')
      .field('precio_general_full', '50')
      .field('vender_comida', 'true')
      .field('vender_bebidas_alcoholicas', 'false')
      .field('usuario_id', '1');

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Evento creado exitosamente');
    expect(res.body.eventoId).toBe(123);
  });

  test('PUT /events/:id - actualizar evento existente', async () => {
    Evento.getById.mockResolvedValue({ id: 1 });
    Evento.update.mockResolvedValue({ affectedRows: 1 });

    const res = await request(app)
      .put('/events/1')
      .field('nombre', 'Evento modificado')
      .field('descripcion', 'Nueva descripción')
      .field('fecha', '2025-05-22')
      .field('hora', '21:00')
      .field('edad_minima', '21')
      .field('precio_platino_full', '120')
      .field('precio_vip_full', '90')
      .field('precio_general_full', '60')
      .field('vender_comida', 'false')
      .field('vender_bebidas_alcoholicas', 'true');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Evento actualizado exitosamente');
  });

  test('DELETE /events/:id - eliminar evento existente', async () => {
    Evento.getById.mockResolvedValue({ id: 1 });
    Evento.delete.mockResolvedValue({ affectedRows: 1 });

    const res = await request(app).delete('/events/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Evento eliminado correctamente');
  });

  test('DELETE /events/:id - evento no encontrado', async () => {
    Evento.getById.mockResolvedValue(null);

    const res = await request(app).delete('/events/999');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Evento no encontrado');
  });

  // Más tests para rutas GET /organizador/:usuario_id, errores, etc, si quieres

});
