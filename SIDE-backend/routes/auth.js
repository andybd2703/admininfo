const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Ruta de registro
router.post('/register', async (req, res) => {
  const { username, email, password, firstName, lastName, birthdate, idNumber, phoneNumber, role = 'usuario' } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    // Crear el nuevo usuario (se hace el hashing dentro del método create)
    const result = await User.create(username, email, password, firstName, lastName, birthdate, idNumber, phoneNumber, role);

    const newUser = {
      id: result.insertId,
      username,
      email,
      firstName,
      lastName,
      birthdate,
      idNumber,
      phoneNumber,
      role
    };

    // Generar el token para el nuevo usuario
    const token = User.generateToken(newUser);
    res.status(201).json({ message: 'Usuario registrado', token, usuario: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por correo electrónico
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña proporcionada con la almacenada (cifrada)
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar el token si la contraseña es correcta
    const token = User.generateToken(user);
    res.json({ message: 'Inicio de sesión exitoso', token, usuario: user });
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
});

module.exports = router;
