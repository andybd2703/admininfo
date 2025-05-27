const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getDB = require('../config/db');

class User {
  static async create(username, email, password, firstName, lastName, birthdate, idNumber, phoneNumber, role = 'usuario') {
    const db = await getDB();

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (username, email, password, first_name, last_name, birthdate, id_number, phone_number, role) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(query, [username, email, hashedPassword, firstName, lastName, birthdate, idNumber, phoneNumber, role]);
    return result;
  }

  static async findByEmail(email) {
    const db = await getDB();
    const query = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await db.query(query, [email]);
    return rows[0];
  }

  static generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'secreto123', { expiresIn: '1h' });
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  // ** NUEVOS MÉTODOS PARA 2FA USANDO userId EN VEZ DE email **

  // Guardar código 2FA y expiración en DB
static async setTwoFactorCode(userId, code, expiresInMs) {
  const db = await getDB();
  const expiresTimestamp = Date.now() + expiresInMs; // 👈 Esto es un número
  const query = `UPDATE users SET two_factor_code = ?, two_factor_expires = ? WHERE id = ?`;
  await db.query(query, [code, expiresTimestamp, userId]);
}


  // Validar código 2FA y si no ha expirado
static async validateTwoFactorCode(userId, code) {
  const db = await getDB();
  const query = `SELECT two_factor_code, two_factor_expires FROM users WHERE id = ?`;
  const [rows] = await db.query(query, [userId]);
  if (rows.length === 0) return false;

  const { two_factor_code, two_factor_expires } = rows[0];
  const now = Date.now(); // 👈 Esto es un número también

  if (!two_factor_code || !two_factor_expires) return false;
  if (two_factor_code !== code) return false;
  if (now > Number(two_factor_expires)) return false;

  return true;
}


  // Activar o desactivar 2FA
  static async setTwoFactorEnabled(userId, enabled) {
    const db = await getDB();
    const query = `UPDATE users SET two_factor_enabled = ? WHERE id = ?`;
    await db.query(query, [enabled ? 1 : 0, userId]);
  }

  // Consultar si 2FA está activado
  static async isTwoFactorEnabled(userId) {
    const db = await getDB();
    const query = `SELECT two_factor_enabled FROM users WHERE id = ?`;
    const [rows] = await db.query(query, [userId]);
    if (rows.length === 0) return false;
    return rows[0].two_factor_enabled === 1;
  }


   static async findById(id) {
    const db = await getDB();
    const query = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  }

  static async updatePassword(userId, newPassword) {
    const db = await getDB();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `UPDATE users SET password = ? WHERE id = ?`;
    const [result] = await db.query(query, [hashedPassword, userId]);
    return result;
  }



}

module.exports = User;
