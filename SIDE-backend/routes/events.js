const express = require('express');
const multer = require('multer');
const Evento = require('../models/Event');
const router = express.Router();

// Configuración de multer para guardar la imagen en una carpeta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nombre único para evitar conflictos
  }
});

const upload = multer({ storage: storage });

// Ruta para crear evento con imagen
router.post('/crear', upload.single('imagen'), async (req, res) => {
  const { nombre, descripcion, fecha, hora, edad_minima, precio_platino_full, precio_vip_full, precio_general_full, vender_comida, vender_bebidas_alcoholicas, usuario_id } = req.body;
  const imagen = req.file ? req.file.filename : null;

  try {
    const result = await Evento.create(
      nombre, descripcion, imagen, fecha, hora, edad_minima, precio_platino_full, precio_vip_full, precio_general_full, vender_comida, vender_bebidas_alcoholicas, usuario_id
    );
    res.status(201).json({ message: 'Evento creado exitosamente', eventoId: result.insertId });
  } catch (err) {
    console.error('Error al crear evento:', err);
    res.status(500).json({ message: 'Error al crear evento', error: err.message });
  }
});

// Ruta para obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const eventos = await Evento.getAll();
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener eventos', error: err.message });
  }
});

// 🔥 NUEVA RUTA para obtener un evento por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const evento = await Evento.getById(id);

    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.json(evento);
  } catch (err) {
    console.error('Error al obtener evento:', err);
    res.status(500).json({ message: 'Error al obtener evento', error: err.message });
  }
});

// Ruta para obtener los eventos creados por un organizador específico
router.get('/organizador/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const eventos = await Evento.getByUsuarioId(usuario_id);

    if (eventos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron eventos para este organizador' });
    }

    res.json(eventos);
  } catch (err) {
    console.error('Error al obtener eventos por organizador:', err);
    res.status(500).json({ message: 'Error al obtener eventos', error: err.message });
  }
});




// Ruta para actualizar un evento (sin verificación de usuario)
router.put('/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    fecha,
    hora,
    edad_minima,
    precio_platino_full,
    precio_vip_full,
    precio_general_full,
    vender_comida,
    vender_bebidas_alcoholicas
  } = req.body;

  const imagen = req.file ? req.file.filename : null;

  try {
    const evento = await Evento.getById(id);

    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    const result = await Evento.update(
      id,
      nombre,
      descripcion,
      imagen,
      fecha,
      hora,
      edad_minima,
      precio_platino_full,
      precio_vip_full,
      precio_general_full,
      vender_comida,
      vender_bebidas_alcoholicas
    );

    res.json({ message: 'Evento actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar evento:', err);
    res.status(500).json({ message: 'Error al actualizar evento', error: err.message });
  }
});

// Ruta para eliminar un evento (sin verificación de usuario)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el evento existe
    const evento = await Evento.getById(id);

    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Eliminar el evento directamente
    await Evento.delete(id);
    res.json({ message: 'Evento eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar evento:', err);
    res.status(500).json({ message: 'Error al eliminar evento', error: err.message });
  }
});

module.exports = router;
