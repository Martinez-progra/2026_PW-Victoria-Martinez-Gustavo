// Base de datos en un archivo: datos.sqlite (en esta carpeta). Los datos sobreviven a reiniciar.
// Para empezar de cero: apaga el servidor y borra datos.sqlite*
// SQLite viene incluido en Node (22.13 o superior): no hay que instalar ni compilar nada.
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(process.env.DB_FILE || path.join(__dirname, 'datos.sqlite'));
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS talleres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT DEFAULT '',
    instructor TEXT DEFAULT 'Por confirmar',
    fecha TEXT,
    cupo INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS asistencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taller_id INTEGER NOT NULL REFERENCES talleres(id),
    nombre_alumno TEXT NOT NULL,
    boleta TEXT NOT NULL,
    fecha TEXT DEFAULT (date('now')),
    UNIQUE (taller_id, boleta)
  );
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL DEFAULT '',
    boleta TEXT UNIQUE,
    rol TEXT DEFAULT 'alumno'
  );
`);

// Si ya existía una tabla usuarios de una versión anterior, agrega la columna contrasena
if (!db.prepare('PRAGMA table_info(usuarios)').all().some((c) => c.name === 'contrasena')) {
  db.exec("ALTER TABLE usuarios ADD COLUMN contrasena TEXT NOT NULL DEFAULT ''");
}

// Talleres de ejemplo, solo la primera vez
if (db.prepare('SELECT COUNT(*) AS n FROM talleres').get().n === 0) {
  const ins = db.prepare('INSERT INTO talleres (nombre, descripcion, instructor, fecha, cupo) VALUES (?, ?, ?, ?, ?)');
  ins.run('Programación Web con Next.js', 'Introducción al desarrollo web moderno.', 'Por confirmar', '2026-11-15', 25);
  ins.run('Administración de Bases de Datos MySQL', 'Diseño de tablas, consultas y respaldos.', 'Por confirmar', '2026-11-20', 20);
}

module.exports = db;
