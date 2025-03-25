// Importamos las librerías necesarias
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

// Creamos la aplicación Express
const app = express();

// Middleware para permitir solicitudes desde el frontend y procesar JSON
app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',    // Cambia esto si usas un servidor diferente
    user: 'root',         // Tu usuario de MySQL
    password: '',         // Tu contraseña de MySQL
    database: 'tu_base_de_datos' // Cambia esto por el nombre de tu base de datos
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
    } else {
        console.log('✅ Conectado a MySQL');
    }
});

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send('🚀 ¡Servidor funcionando correctamente!');
});

// Definir el puerto
const PORT = process.env.PORT || 5000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
