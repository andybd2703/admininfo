const express = require('express');
const router = express.Router();
const { generarFacturaPDF } = require('../controllers/checkoutController');

// Ruta para procesar la compra
router.post('/', async (req, res) => {
  try {
    const { username, items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    // Aquí podrías guardar la compra en la base de datos si quieres
console.log('🧾 Datos recibidos en backend:', req.body);

    // Generar y enviar el PDF como respuesta
    generarFacturaPDF(res, { username, items, total });
  } catch (err) {
    res.status(500).json({ message: 'Error al procesar la compra', error: err.message });
  }
});

module.exports = router;
