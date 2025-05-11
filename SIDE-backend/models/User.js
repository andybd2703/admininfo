const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getDB = require('../config/db'); // Función para obtener la conexión a la base de datos

class User {
  // Método para crear un nuevo usuario
  static async create(username, email, password, firstName, lastName, birthdate, idNumber, phoneNumber, role = 'usuario') {
    const db = await getDB();

    // Verifica si ya existe un usuario con el mismo correo
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserta el nuevo usuario en la base de datos
    const query = `INSERT INTO users (username, email, password, first_name, last_name, birthdate, id_number, phone_number, role) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(query, [username, email, hashedPassword, firstName, lastName, birthdate, idNumber, phoneNumber, role]);
    return result;
  }

  // Método para buscar un usuario por su correo electrónico
  static async findByEmail(email) {
    const db = await getDB();
    const query = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await db.query(query, [email]);
    return rows[0]; // Devuelve el primer usuario encontrado (si existe)
  }

  // Método para generar un token JWT
  static generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'secreto123', { expiresIn: '1h' });
  }

  // Método para comparar la contraseña ingresada con la almacenada (cifrada)
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword); // Compara las contraseñas
  }

  // Método para hashear una contraseña (no es necesario si solo se usa en `create`)
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10); // Hashea la contraseña antes de almacenarla
  }
}

module.exports = User;
