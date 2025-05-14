// db.js
const mysql = require('mysql2/promise');

// Esta función asíncrona crea la conexión y la exporta
const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
      database: 'side_db'
    });
    console.log('Conectado a la base de datos MySQL');
    return connection;
  } catch (err) {
    console.error('Error de conexión a MySQL:', err.message);
    throw err;
  }
};

module.exports = createConnection;
