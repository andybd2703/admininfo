const express = require('express');
const router = express.Router();
const createConnection = require('../config/db'); // Aquí usamos el db.js

// Ruta para agregar un evento a favoritos
router.post('/add', async (req, res) => {
  const { usuario_id, evento_id } = req.body;

  // Validar que ambos campos estén presentes
  if (!usuario_id || !evento_id) {
    return res.status(400).json({ error: 'Faltan datos: usuario_id o evento_id' });
  }

  try {
    // Crear la conexión a la base de datos
    const connection = await createConnection();

    // Verificar si el favorito ya existe para evitar duplicados
    const [existingFavorite] = await connection.query('SELECT * FROM favoritos WHERE usuario_id = ? AND evento_id = ?', [usuario_id, evento_id]);
    if (existingFavorite.length > 0) {
      return res.status(400).json({ message: 'Este evento ya está en tus favoritos.' });
    }

    // Insertar el nuevo favorito en la base de datos
    await connection.query('INSERT INTO favoritos (usuario_id, evento_id) VALUES (?, ?)', [usuario_id, evento_id]);

    // Responder con éxito
    res.status(201).json({ message: 'Evento agregado a favoritos con éxito.' });
  } catch (err) {
    console.error('Error al agregar a favoritos:', err);
    res.status(500).json({ error: 'Error al agregar el evento a favoritos' });
  }
});

// Ruta para quitar un evento de favoritos
router.delete('/remove', async (req, res) => {
  const { usuario_id, evento_id } = req.body;

  // Validar que ambos campos estén presentes
  if (!usuario_id || !evento_id) {
    return res.status(400).json({ error: 'Faltan datos: usuario_id o evento_id' });
  }

  try {
    // Crear la conexión a la base de datos
    const connection = await createConnection();

    // Verificar si el favorito existe
    const [existingFavorite] = await connection.query('SELECT * FROM favoritos WHERE usuario_id = ? AND evento_id = ?', [usuario_id, evento_id]);
    if (existingFavorite.length === 0) {
      return res.status(400).json({ message: 'Este evento no está en tus favoritos.' });
    }

    // Eliminar el evento de los favoritos
    await connection.query('DELETE FROM favoritos WHERE usuario_id = ? AND evento_id = ?', [usuario_id, evento_id]);

    // Responder con éxito
    res.status(200).json({ message: 'Evento eliminado de favoritos con éxito.' });
  } catch (err) {
    console.error('Error al quitar de favoritos:', err);
    res.status(500).json({ error: 'Error al quitar el evento de favoritos' });
  }
});

// Ruta para obtener si un evento es favorito para un usuario
router.get('/verificar/:usuario_id/:evento_id', async (req, res) => {
  const { usuario_id, evento_id } = req.params;

  // Validar que el usuario_id y evento_id estén presentes
  if (!usuario_id || !evento_id) {
    return res.status(400).json({ error: 'Faltan datos: usuario_id o evento_id' });
  }

  try {
    // Crear la conexión a la base de datos
    const connection = await createConnection();

    // Verificar si el evento está en los favoritos del usuario
    const [favorite] = await connection.query('SELECT * FROM favoritos WHERE usuario_id = ? AND evento_id = ?', [usuario_id, evento_id]);

    if (favorite.length > 0) {
      return res.status(200).json({ isFavorito: true });
    } else {
      return res.status(200).json({ isFavorito: false });
    }
  } catch (err) {
    console.error('Error al verificar si es favorito:', err);
    res.status(500).json({ error: 'Error al verificar si es favorito' });
  }
});

// Ruta para obtener todos los eventos favoritos de un usuario con los detalles del evento
router.get('/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;

  if (!usuario_id) {
    return res.status(400).json({ error: 'Falta el usuario_id' });
  }

  try {
    const connection = await createConnection();

    // JOIN para obtener los datos de los eventos favoritos
    const [favoritos] = await connection.query(`
      SELECT e.id, e.nombre, e.fecha, e.hora, e.imagen
      FROM favoritos f
      JOIN eventos e ON f.evento_id = e.id
      WHERE f.usuario_id = ?
    `, [usuario_id]);

    res.status(200).json(favoritos);
  } catch (err) {
    console.error('Error al obtener los eventos favoritos:', err);
    res.status(500).json({ error: 'Error al obtener los eventos favoritos' });
  }
});


module.exports = router;
