const express = require('express');
const { Talleres, Asistencias, Usuarios } = require('../modelo');
const v = require('../validaciones');

const router = express.Router();
const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });
const fallo = (res, status, message) => res.status(status).json({ success: false, message });

// Envuelve cada handler: cualquier error inesperado -> 500 en JSON, sin tumbar el servidor
const seguro = (fn) => (req, res) => {
  try { return fn(req, res); }
  catch (e) { console.error(e); return fallo(res, 500, 'Error interno del servidor.'); }
};

// ---------- Talleres ----------
router.get('/talleres', seguro((req, res) => ok(res, Talleres.listar())));

router.get('/talleres/:id', seguro((req, res) => {
  const taller = Talleres.obtener(Number(req.params.id));
  return taller ? ok(res, taller) : fallo(res, 404, 'Taller no encontrado.');
}));

router.post('/talleres', seguro((req, res) => {
  const { nombre, descripcion, instructor, fecha, cupo } = req.body || {};
  const cupoFinal = cupo === undefined || cupo === '' ? 15 : cupo;
  const error = v.validarNombre(nombre) || v.validarCupo(cupoFinal);
  if (error) return fallo(res, 400, error);
  return ok(res, Talleres.crear({
    nombre: nombre.trim(),
    descripcion: typeof descripcion === 'string' ? descripcion.trim() : '',
    instructor: typeof instructor === 'string' && instructor.trim() ? instructor.trim() : 'Por confirmar',
    fecha: typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : null,
    cupo: Number(cupoFinal),
  }), 201);
}));

// Lista pública de inscritos: las boletas salen enmascaradas desde el servidor
router.get('/talleres/:id/asistencias', seguro((req, res) => {
  const id = Number(req.params.id);
  if (!Talleres.obtener(id)) return fallo(res, 404, 'Taller no encontrado.');
  return ok(res, Asistencias.porTaller(id).map((a) => ({ ...a, boleta: v.ocultarBoleta(a.boleta) })));
}));

// ---------- Inscripciones ----------
router.post('/asistencias', seguro((req, res) => {
  const { taller_id, nombre_alumno, boleta } = req.body || {};
  const tallerId = Number(taller_id);
  if (!Number.isInteger(tallerId) || tallerId <= 0) return fallo(res, 400, 'El taller es obligatorio.');
  const error = v.validarNombre(nombre_alumno) || v.validarBoleta(boleta);
  if (error) return fallo(res, 400, error);

  const r = Asistencias.inscribir({
    tallerId,
    nombre: nombre_alumno.trim(),
    boleta: String(boleta).trim(),
  });
  return r.ok ? ok(res, r.data, 201) : fallo(res, r.status, r.message);
}));

// ---------- Perfil de alumno (por boleta) ----------
router.get('/alumnos/:boleta/talleres', seguro((req, res) => {
  const error = v.validarBoleta(req.params.boleta);
  if (error) return fallo(res, 400, error);
  return ok(res, Asistencias.porBoleta(req.params.boleta.trim()));
}));

router.get('/alumnos/:boleta/perfil', seguro((req, res) => {
  const error = v.validarBoleta(req.params.boleta);
  if (error) return fallo(res, 400, error);
  return ok(res, Usuarios.perfilPorBoleta(req.params.boleta.trim()));
}));

module.exports = router;
