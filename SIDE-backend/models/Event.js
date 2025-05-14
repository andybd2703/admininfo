const getDB = require('../config/db');

class Evento {
  // Crear un evento
  static async create(
    nombre, descripcion, imagen, fecha, hora, edad_minima,
    precio_platino_full, precio_vip_full, precio_general_full,
    vender_comida, vender_bebidas_alcoholicas, usuario_id
  ) {
    const db = await getDB();
    const query = `
      INSERT INTO eventos (
        nombre, descripcion, imagen, fecha, hora, edad_minima,
        precio_platino_full, precio_vip_full, precio_general_full,
        vender_comida, vender_bebidas_alcoholicas, usuario_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      nombre, descripcion, imagen, fecha, hora, edad_minima,
      precio_platino_full, precio_vip_full, precio_general_full,
      vender_comida, vender_bebidas_alcoholicas, usuario_id
    ]);
    return result;
  }

  // Obtener todos los eventos
  static async getAll() {
    const db = await getDB();
    const [rows] = await db.query(`SELECT * FROM eventos ORDER BY fecha ASC`);
    return rows;
  }

  // Obtener un evento por ID
  static async getById(id) {
    const db = await getDB();
    const [rows] = await db.query(`SELECT * FROM eventos WHERE id = ?`, [id]);
    return rows[0];
  }

  static async getByUsuarioId(usuario_id) {
    const db = await getDB();
    const [rows] = await db.query(`SELECT * FROM eventos WHERE usuario_id = ?`, [usuario_id]);
    return rows;
  }

  // Actualizar un evento (sin verificación de usuario)
  static async update(
    id, nombre, descripcion, imagen, fecha, hora, edad_minima,
    precio_platino_full, precio_vip_full, precio_general_full,
    vender_comida, vender_bebidas_alcoholicas
  ) {
    const db = await getDB();

    const query = `
      UPDATE eventos SET
        nombre = ?,
        descripcion = ?,
        imagen = ?,
        fecha = ?,
        hora = ?,
        edad_minima = ?,
        precio_platino_full = ?,
        precio_vip_full = ?,
        precio_general_full = ?,
        vender_comida = ?,
        vender_bebidas_alcoholicas = ?
      WHERE id = ?
    `;
    const [result] = await db.query(query, [
      nombre, descripcion, imagen, fecha, hora, edad_minima,
      precio_platino_full, precio_vip_full, precio_general_full,
      vender_comida, vender_bebidas_alcoholicas, id
    ]);
    return result;
  }

  // Eliminar un evento (sin verificación de usuario)
  static async delete(id) {
    const db = await getDB();
    const [result] = await db.query(`DELETE FROM eventos WHERE id = ?`, [id]);
    return result;
  }
}

module.exports = Evento;
