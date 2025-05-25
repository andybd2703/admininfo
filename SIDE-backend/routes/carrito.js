const express = require('express');
const router = express.Router();
const createConnection = require('../config/db');

// ➕ Agregar evento al carrito (o aumentar cantidad)
router.post('/add', async (req, res) => {
  const { usuario_id, evento_id, categoria } = req.body;

  if (!usuario_id || !evento_id || !categoria) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const connection = await createConnection();

    const [rows] = await connection.query(`
      SELECT * FROM carrito 
      WHERE usuario_id = ? AND evento_id = ? AND categoria = ?
    `, [usuario_id, evento_id, categoria]);

    if (rows.length > 0) {
      await connection.query(`
        UPDATE carrito 
        SET cantidad = cantidad + 1 
        WHERE usuario_id = ? AND evento_id = ? AND categoria = ?
      `, [usuario_id, evento_id, categoria]);
    } else {
      await connection.query(`
        INSERT INTO carrito (usuario_id, evento_id, categoria, cantidad) 
        VALUES (?, ?, ?, 1)
      `, [usuario_id, evento_id, categoria]);
    }

    res.status(200).json({ message: 'Boleta agregada al carrito' });

  } catch (err) {
    console.error('Error al agregar al carrito:', err);
    res.status(500).json({ error: 'Error interno al agregar al carrito' });
  }
});
// ➕ Agregar múltiples boletos al carrito
router.post('/add-multiple', async (req, res) => {
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'El cuerpo debe ser un array con datos' });
  }

  try {
    const connection = await createConnection();

    await connection.beginTransaction();

    for (const item of items) {
      const { usuario_id, evento_id, categoria, cantidad } = item;

      if (!usuario_id || !evento_id || !categoria || cantidad < 1) {
        await connection.rollback();
        return res.status(400).json({ error: 'Datos inválidos en uno de los ítems' });
      }

      const [rows] = await connection.query(`
        SELECT * FROM carrito 
        WHERE usuario_id = ? AND evento_id = ? AND categoria = ?
      `, [usuario_id, evento_id, categoria]);

      if (rows.length > 0) {
        await connection.query(`
          UPDATE carrito 
          SET cantidad = cantidad + ? 
          WHERE usuario_id = ? AND evento_id = ? AND categoria = ?
        `, [cantidad, usuario_id, evento_id, categoria]);
      } else {
        await connection.query(`
          INSERT INTO carrito (usuario_id, evento_id, categoria, cantidad) 
          VALUES (?, ?, ?, ?)
        `, [usuario_id, evento_id, categoria, cantidad]);
      }
    }

    await connection.commit();
    res.status(200).json({ message: 'Boletos agregados correctamente al carrito' });

  } catch (err) {
    console.error('Error en /add-multiple:', err);
    if (connection) await connection.rollback();
    res.status(500).json({ error: 'Error al agregar múltiples boletos al carrito' });
  }
});


// 🔄 Actualizar cantidad manualmente
router.put('/update', async (req, res) => {
  const { usuario_id, evento_id, categoria, cantidad } = req.body;

  if (!usuario_id || !evento_id || !categoria || cantidad < 1) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const connection = await createConnection();

    await connection.query(`
      UPDATE carrito 
      SET cantidad = ? 
      WHERE usuario_id = ? AND evento_id = ? AND categoria = ?
    `, [cantidad, usuario_id, evento_id, categoria]);

    res.status(200).json({ message: 'Cantidad actualizada' });

  } catch (err) {
    console.error('Error al actualizar cantidad:', err);
    res.status(500).json({ error: 'Error interno al actualizar cantidad' });
  }
});
// ❌ Eliminar evento del carrito
router.delete('/remove/:usuario_id/:evento_id/:categoria', async (req, res) => {
  const { usuario_id, evento_id, categoria } = req.params;

  if (!usuario_id || !evento_id || !categoria) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  try {
    const connection = await createConnection();

    await connection.query(`
      DELETE FROM carrito 
      WHERE usuario_id = ? AND evento_id = ? AND categoria = ?
    `, [usuario_id, evento_id, categoria]);

    res.status(200).json({ message: 'Item eliminado del carrito' });

  } catch (err) {
    console.error('Error al eliminar del carrito:', err);
    res.status(500).json({ error: 'Error interno al eliminar del carrito' });
  }
});

// 📄 Obtener carrito con detalles de eventos
router.get('/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;

  if (!usuario_id) {
    return res.status(400).json({ error: 'Falta usuario_id' });
  }

  try {
    const connection = await createConnection();

    const [carrito] = await connection.query(`
      SELECT 
        e.id AS evento_id,
        e.nombre,
        e.imagen,
        c.categoria,
        c.cantidad,
        CASE
          WHEN c.categoria = 'platino' THEN e.precio_platino_full
          WHEN c.categoria = 'vip' THEN e.precio_vip_full
          ELSE e.precio_general_full
        END AS precio_unitario,
        (CASE
          WHEN c.categoria = 'platino' THEN e.precio_platino_full
          WHEN c.categoria = 'vip' THEN e.precio_vip_full
          ELSE e.precio_general_full
        END * c.cantidad) AS total
      FROM carrito c
      JOIN eventos e ON c.evento_id = e.id
      WHERE c.usuario_id = ?
    `, [usuario_id]);

    res.status(200).json(carrito);

  } catch (err) {
    console.error('Error al obtener el carrito:', err);
    res.status(500).json({ error: 'Error interno al obtener el carrito' });
  }
});
module.exports = router;
