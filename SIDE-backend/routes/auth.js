const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS está presente:', process.env.EMAIL_PASS ? '✔️ Sí' : '❌ No');


const transporter = nodemailer.createTransport({
  service: 'gmail', // o el servicio que uses
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    
  },
});

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
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Validar contraseña
    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Aquí validamos si tiene 2FA activado
    if (user.two_factor_enabled) {
      // Respondemos que debe validar 2FA, pero sin token todavía
      return res.status(200).json({
        twoFactorRequired: true,
        userId: user.id,
        message: 'Usuario con 2FA activado, debe validar código'
      });
    }

    // Si NO tiene 2FA, generamos y enviamos token normal
    const token = User.generateToken(user);
    res.json({
      token,
      usuario: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Activar 2FA
// Activar o desactivar 2FA
router.post('/2fa/enable', async (req, res) => {
  try {
    const { userId, enabled } = req.body;
    console.log('BODY:', req.body);

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ message: 'Parámetro "enabled" inválido' });
    }

    await User.setTwoFactorEnabled(userId, enabled);
    res.json({ message: `2FA ${enabled ? 'activado' : 'desactivado'}` });
  } catch (error) {
    console.error('Error en /2fa/enable:', error)
    res.status(500).json({ message: 'Error al cambiar estado de 2FA', error: error.message });
  }
});



// Desactivar 2FA
router.post('/2fa/disable', async (req, res) => {
  try {
    const { userId } = req.body;
    await User.setTwoFactorEnabled(userId, false);
    res.json({ message: '2FA desactivado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al desactivar 2FA', error: error.message });
  }
});




// Enviar código 2FA
router.post('/2fa/send-code', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId); // Crea método findById en tu modelo para esto
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });
    if (!user.two_factor_enabled) return res.status(400).json({ message: '2FA no activado' });

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // ya es un número (timestamp)
    await User.setTwoFactorCode(user.id, code, expiresAt);

    await transporter.sendMail({
      from: `"Tu App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Tu código de autenticación 2FA',
      text: `Tu código de verificación es: ${code}. Expira en 15 minutos.`,
    });

    res.json({ message: 'Código 2FA enviado por email' });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar código 2FA', error: error.message });
  }
});

// Validar código 2FA
router.post('/2fa/validate', async (req, res) => {
  try {
    const { userId, code } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });
    if (!user.two_factor_enabled) return res.status(400).json({ message: '2FA no activado' });

    if (user.two_factor_code !== code) {
      return res.status(400).json({ message: 'Código 2FA incorrecto' });
    }

    if (Date.now() > user.two_factor_expires) {

      return res.status(400).json({ message: 'Código 2FA expirado' });
    }

    // Limpiar código 2FA en DB
    await User.setTwoFactorCode(user.id, null, null);

    // Generar token y devolverlo para acceso completo
    const token = User.generateToken(user);
    res.json({ message: '2FA validado', token, usuario: user });
  } catch (error) {
    res.status(500).json({ message: 'Error al validar 2FA', error: error.message });
  }
});

router.post('/resend-2fa-code', async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    if (!user.two_factor_enabled) return res.status(400).json({ message: '2FA no activado' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    await User.setTwoFactorCode(user.id, code, expiresAt);

    await transporter.sendMail({
      from: `"Tu App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Tu nuevo código de autenticación 2FA',
      text: `Tu nuevo código de verificación es: ${code}. Expira en 15 minutos.`,
    });

    res.json({ message: 'Código reenviado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al reenviar el código', error: err.message });
  }
});


// Ruta para recuperar contraseña
router.post('/recover-password', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'El correo es requerido' });

  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Generar token temporal (válido por 1 hora, por ejemplo)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resetUrl = `http://localhost:8080/reset-password?token=${token}`;

    // Enviar correo
    await transporter.sendMail({
      from: `"Tu App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Recuperación de contraseña',
      html: `
        <p>Hola ${user.username},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    res.json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error('Error en /recover-password:', error);
    res.status(500).json({ message: 'Error al procesar la recuperación', error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token y nueva contraseña son requeridos' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await User.updatePassword(userId, password); // aquí sin hash

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error en /reset-password:', err);
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
});

module.exports = router;

