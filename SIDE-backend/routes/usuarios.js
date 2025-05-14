const express = require('express');
const router = express.Router();
const getDB = require('../config/db'); 
const User = require('../models/User'); // tu modelo

// Obtener todos los usuarios (solo admin)
router.get('/', async (req, res) => {
  try {
    const db = await getDB();  // Conexión a la base de datos
    const query = 'SELECT * FROM users';  // Consulta para obtener todos los usuarios
    const [users] = await db.query(query);  // Ejecutar la consulta y obtener los usuarios
    res.json(users);  // Enviar la lista de usuarios como respuesta
  } catch (err) {
    console.error(err);  // Mostrar error en consola
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario específico por ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id  // Obtener el id del usuario desde la URL
    const db = await getDB();
    const query = 'SELECT * FROM users WHERE id = ?';  // Consulta para obtener un solo usuario
    const [user] = await db.query(query, [userId]);  // Ejecutar la consulta

    if (user.length > 0) {
      res.json(user[0]);  // Enviar los datos del usuario como respuesta
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});



// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const db = await getDB();  // Conexión a la base de datos
    const query = 'DELETE FROM users WHERE id = ?';  // Consulta para eliminar un usuario
    const [result] = await db.query(query, [req.params.id]);  // Ejecutar la consulta

    if (result.affectedRows > 0) {  // Si el usuario fue eliminado correctamente
      res.json({ message: 'Usuario eliminado' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error(err);  // Mostrar error en consola
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});
// Editar usuario
router.put('/:id', async (req, res) => {
  try {
    // Extraemos los datos del cuerpo de la solicitud
    const { 
      username, 
      email, 
      password, 
      first_name, 
      last_name, 
      birthdate, 
      id_number, 
      phone_number, 
      role 
    } = req.body;

    // Validación básica para asegurarnos de que los campos necesarios están presentes
    if (!username || !email || !first_name || !last_name || !birthdate || !id_number || !phone_number || !role) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const db = await getDB();  // Conexión a la base de datos

    // Consulta para actualizar el usuario con el id correspondiente
    const query = `
      UPDATE users 
      SET 
        username = ?, 
        email = ?, 
        password = ?, 
        first_name = ?, 
        last_name = ?, 
        birthdate = ?, 
        id_number = ?, 
        phone_number = ?, 
        role = ?
      WHERE id = ?`;
    
    const [result] = await db.query(query, [
      username, 
      email, 
      password, 
      first_name, 
      last_name, 
      birthdate, 
      id_number, 
      phone_number, 
      role, 
      req.params.id
    ]);

    // Verificamos si la actualización fue exitosa
    if (result.affectedRows > 0) {
      res.json({ message: 'Usuario actualizado correctamente' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error(err);  // Mostrar error en consola
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

module.exports = router;
