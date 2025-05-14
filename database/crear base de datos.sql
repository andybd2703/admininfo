CREATE DATABASE side_db;
USE side_db;
DROP TABLE users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,        -- Nombre
  last_name VARCHAR(100) NOT NULL,         -- Apellidos
  birthdate DATE NOT NULL,                 -- Fecha de nacimiento
  id_number VARCHAR(50) NOT NULL UNIQUE,   -- Número de identificación
  phone_number VARCHAR(20) NOT NULL,       -- Teléfono
  role ENUM('admin', 'usuario', 'organizador') NOT NULL DEFAULT 'usuario',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE favoritos;
DROP TABLE eventos;
CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY, -- ID único para cada evento
    nombre VARCHAR(255) NOT NULL, -- Nombre del evento
    descripcion TEXT, -- Descripción del evento
    imagen VARCHAR(255), -- Nombre del archivo de la imagen del evento
    fecha DATE NOT NULL, -- Fecha del evento
    hora TIME NOT NULL, -- Hora del evento
    edad_minima INT NOT NULL, -- Edad mínima para asistir
    precio_platino_full DECIMAL(10, 2) NOT NULL, -- Precio completo para platino
    precio_vip_full DECIMAL(10, 2) NOT NULL, -- Precio completo para VIP
    precio_general_full DECIMAL(10, 2) NOT NULL, -- Precio completo para general
    vender_comida BOOLEAN NOT NULL, -- Si se venderá comida (true o false)
    vender_bebidas_alcoholicas BOOLEAN NOT NULL, -- Si se venderán bebidas alcohólicas (true o false)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del evento
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Fecha de última actualización
	usuario_id INT NOT NULL,
	FOREIGN KEY (usuario_id) REFERENCES users(id)

);

CREATE TABLE favoritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  evento_id INT NOT NULL,
  UNIQUE(usuario_id, evento_id),
  FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);

