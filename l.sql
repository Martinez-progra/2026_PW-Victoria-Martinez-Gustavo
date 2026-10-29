CREATE DATABASE IF NOT EXISTS cecyt9_local;
USE cecyt9_local;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,      -- hash de bcrypt
  boleta CHAR(10),
  rol VARCHAR(20) DEFAULT 'alumno'
);

CREATE TABLE talleres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE,
  fecha_fin DATE
);

CREATE TABLE asistencia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_taller INT NOT NULL,
  id_usuario INT NOT NULL,
  fecha_asistencia DATE,
  FOREIGN KEY (id_taller) REFERENCES talleres(id),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

INSERT INTO talleres (nombre, descripcion, fecha_inicio, fecha_fin) VALUES
 ('Programación Web con Next.js', 'Taller de desarrollo web', '2026-11-15', '2026-11-15'),
 ('Administración de Bases de Datos MySQL', 'Taller de MySQL', '2026-11-20', '2026-11-20');