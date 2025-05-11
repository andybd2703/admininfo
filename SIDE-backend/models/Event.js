const getDB = require('../config/db');

class Evento {
  // Método para crear un evento
  static async create(nombre, descripcion, imagen, fecha, hora, edad_minima, precio_platino_full, precio_vip_full, precio_general_full, vender_comida, vender_bebidas_alcoholicas) {
    const db = await getDB();
    const query = `
      INSERT INTO eventos (nombre, descripcion, imagen, fecha, hora, edad_minima, precio_platino_full, precio_vip_full, precio_general_full, vender_comida, vender_bebidas_alcoholicas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [nombre, descripcion, imagen, fecha, hora, edad_minima, precio_platino_full, precio_vip_full, precio_general_full, vender_comida, vender_bebidas_alcoholicas]);
    return result;
  }

  // Método para obtener todos los eventos
  static async getAll() {
    const db = await getDB();
    const query = `SELECT * FROM eventos ORDER BY fecha ASC`;
    const [rows] = await db.query(query);
    return rows;
  }

  // Método para obtener un evento por su ID
  static async getById(id) {
    const db = await getDB();
    const query = `SELECT * FROM eventos WHERE id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0]; // Retorna el primer resultado, si existe
  }

  // Método para actualizar un evento
  static async update(id, nombre, descripcion, imagen, fecha, hora, edad_minima, precio_platino_full, precio_vip_full, precio_general_full, vender_comida, vender_bebidas_alcoholicas) {
    const db = await getDB();
    const query = `
      UPDATE eventos 
      SET nombre = ?, descripcion = ?, imagen = ?, fecha = ?, hora = ?, edad_minima = ?, precio_platino_full = ?, precio_vip_full = ?, precio_general_full = ?, vender_comida = ?, vender_bebidas_alcoholicas = ? 
      WHERE id = ?
    `;
    const [result] = await db.query(query, [nombre, descripcion, imagen, fecha, hora, edad_minima, precio_platino_full, precio_vip_full, precio_general_full, vender_comida, vender_bebidas_alcoholicas, id]);
    return result;
  }

  // Método para eliminar un evento
  static async delete(id) {
    const db = await getDB();
    const query = `DELETE FROM eventos WHERE id = ?`;
    const [result] = await db.query(query, [id]);
    return result;
  }
}

module.exports = Evento;
