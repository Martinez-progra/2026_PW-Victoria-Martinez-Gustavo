const db = require('./db');

const LISTA = `
  SELECT t.*, COUNT(a.id) AS inscritos
  FROM talleres t LEFT JOIN asistencias a ON a.taller_id = t.id`;

const Talleres = {
  listar: () => db.prepare(`${LISTA} GROUP BY t.id ORDER BY t.id`).all(),
  obtener: (id) => db.prepare(`${LISTA} WHERE t.id = ? GROUP BY t.id`).get(id),
  crear: ({ nombre, descripcion, instructor, fecha, cupo }) => {
    const r = db.prepare(
      'INSERT INTO talleres (nombre, descripcion, instructor, fecha, cupo) VALUES (?, ?, ?, ?, ?)'
    ).run(nombre, descripcion, instructor, fecha, cupo);
    return Talleres.obtener(Number(r.lastInsertRowid));
  },
};

const Asistencias = {
  porTaller: (tallerId) =>
    db.prepare('SELECT id, nombre_alumno, boleta FROM asistencias WHERE taller_id = ? ORDER BY id').all(tallerId),

  porBoleta: (boleta) =>
    db.prepare(`
      SELECT t.id, t.nombre AS nombre_taller, t.instructor, t.fecha, t.cupo, a.nombre_alumno
      FROM asistencias a JOIN talleres t ON t.id = a.taller_id
      WHERE a.boleta = ? ORDER BY t.fecha, t.id`).all(boleta),

  // Todo en una transacción: revisar cupo + insertar. La restricción UNIQUE evita boletas repetidas.
  inscribir: ({ tallerId, nombre, boleta }) => {
    db.exec('BEGIN IMMEDIATE');   // bloquea escritura: dos inscripciones a la vez no pueden pasarse del cupo
    try {
      const r = inscribirDentro({ tallerId, nombre, boleta });
      db.exec(r.ok ? 'COMMIT' : 'ROLLBACK');
      return r;
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }
  },
};

function inscribirDentro({ tallerId, nombre, boleta }) {
    const taller = Talleres.obtener(tallerId);
    if (!taller) return { ok: false, status: 404, message: 'Taller no encontrado.' };
    if (taller.inscritos >= taller.cupo) return { ok: false, status: 409, message: 'El taller ya no tiene lugares.' };
    try {
      const r = db.prepare('INSERT INTO asistencias (taller_id, nombre_alumno, boleta) VALUES (?, ?, ?)')
        .run(tallerId, nombre, boleta);
      return { ok: true, data: { id: Number(r.lastInsertRowid), taller_id: tallerId, nombre_alumno: nombre } };
    } catch (e) {
      if (String(e.message).includes('UNIQUE')) {
        return { ok: false, status: 409, message: 'Esa boleta ya está inscrita en este taller.' };
      }
      throw e;
    }
}

// Módulo de usuarios original (columnas públicas: nunca se devuelve la contraseña)
const COLUMNAS_PUBLICAS = 'id, nombre, correo, boleta, rol';

const Usuarios = {
  listar: () => db.prepare(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios ORDER BY id`).all(),
  obtenerPorId: (id) => db.prepare(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios WHERE id = ?`).get(Number(id)),
  crear: ({ nombre, correo, contrasena, boleta, rol }) => {
    const r = db.prepare('INSERT INTO usuarios (nombre, correo, contrasena, boleta, rol) VALUES (?, ?, ?, ?, ?)')
      .run(nombre, correo, contrasena, boleta, rol || 'alumno');
    return Usuarios.obtenerPorId(Number(r.lastInsertRowid));
  },
  eliminar: (id) => db.prepare('DELETE FROM usuarios WHERE id = ?').run(Number(id)).changes > 0,
  buscarPorCorreoConHash: (correo) => db.prepare('SELECT * FROM usuarios WHERE correo = ?').get(correo),
  // Perfil público por boleta (sin correo ni contraseña): usuario registrado o, si no, el nombre de su inscripción
  perfilPorBoleta: (boleta) => {
    const u = db.prepare('SELECT nombre, boleta, rol FROM usuarios WHERE boleta = ?').get(boleta);
    if (u) return { ...u, registrado: true };
    const a = db.prepare('SELECT nombre_alumno AS nombre, boleta FROM asistencias WHERE boleta = ? ORDER BY id LIMIT 1').get(boleta);
    return a ? { ...a, rol: 'alumno', registrado: false } : null;
  },
};

module.exports = { Talleres, Asistencias, Usuarios };
