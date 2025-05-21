const Evento = require('../models/Event'); // Ajusta la ruta si es diferente
jest.mock('../config/db'); // Mocks de la conexión a la base de datos

const getDB = require('../config/db');

describe('Modelo Evento', () => {
  let dbMock;

  beforeEach(() => {
    dbMock = {
      query: jest.fn()
    };
    getDB.mockResolvedValue(dbMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create() debería insertar un evento en la base de datos', async () => {
    const fakeResult = [{ insertId: 1 }];
    dbMock.query.mockResolvedValue(fakeResult);

    const result = await Evento.create(
      'Concierto', 'Descripción', 'imagen.jpg', '2025-12-31', '20:00:00', 18,
      100, 80, 50, true, true, 1
    );

    expect(dbMock.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO eventos'), expect.any(Array));
    expect(result).toEqual(fakeResult[0]);
  });

 test('getAll() debería retornar todos los eventos', async () => {
  const fakeEvents = [{ id: 1, nombre: 'Evento 1' }];
  dbMock.query.mockResolvedValue([fakeEvents]);

  const result = await Evento.getAll();

  expect(dbMock.query).toHaveBeenCalledWith(
    expect.stringContaining('SELECT * FROM eventos ORDER BY fecha ASC')
  );
  expect(result).toEqual(fakeEvents);
});

 test('getById() debería retornar un evento por ID', async () => {
  const fakeEvent = { id: 1, nombre: 'Evento único' };
  dbMock.query.mockResolvedValue([[fakeEvent]]); // rows[0] será fakeEvent

  const result = await Evento.getById(1);

  expect(dbMock.query).toHaveBeenCalledWith('SELECT * FROM eventos WHERE id = ?', [1]);
  expect(result).toEqual(fakeEvent);
});

  test('getByUsuarioId() debería retornar eventos de un usuario', async () => {
    const fakeEvents = [[{ id: 1, usuario_id: 2 }]];
    dbMock.query.mockResolvedValue(fakeEvents);

    const result = await Evento.getByUsuarioId(2);

    expect(dbMock.query).toHaveBeenCalledWith('SELECT * FROM eventos WHERE usuario_id = ?', [2]);
    expect(result).toEqual(fakeEvents[0]);
  });

  test('update() debería actualizar un evento', async () => {
    const fakeResult = [{ affectedRows: 1 }];
    dbMock.query.mockResolvedValue(fakeResult);

    const result = await Evento.update(
      1, 'Nuevo', 'Desc', 'img.jpg', '2025-01-01', '19:00:00', 16,
      150, 100, 60, false, true
    );

    expect(dbMock.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE eventos SET'), expect.any(Array));
    expect(result).toEqual(fakeResult[0]);
  });

  test('delete() debería eliminar un evento', async () => {
    const fakeResult = [{ affectedRows: 1 }];
    dbMock.query.mockResolvedValue(fakeResult);

    const result = await Evento.delete(1);

    expect(dbMock.query).toHaveBeenCalledWith('DELETE FROM eventos WHERE id = ?', [1]);
    expect(result).toEqual(fakeResult[0]);
  });
});
