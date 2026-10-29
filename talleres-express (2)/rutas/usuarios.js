// Módulo de usuarios (original de ExpressProyecto): listar, obtener, crear (con bcrypt) y eliminar.
// Mantiene las respuestas originales: arreglo/objeto directo y { error } en los fallos.
const express = require('express');
const bcrypt = require('bcryptjs');
const { Usuarios } = require('../modelo');
const v = require('../validaciones');

const router = express.Router();

const esDuplicado = (e) => String(e.message).includes('UNIQUE');
const interno = (res, e) => { console.error(e); return res.status(500).json({ error: 'Error interno del servidor' }); };

router.get('/', (req, res) => {
  try { res.json(Usuarios.listar()); } catch (e) { interno(res, e); }
});

router.get('/:id', (req, res) => {
  try {
    const usuario = Usuarios.obtenerPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (e) { interno(res, e); }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, correo, contrasena, boleta, rol } = req.body || {};

    if (!nombre || !correo || !contrasena || !boleta) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    const invalido = v.validarNombre(nombre) || v.validarCorreo(correo) || v.validarBoleta(boleta);
    if (invalido) return res.status(400).json({ error: invalido });
    if (typeof contrasena !== 'string' || contrasena.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const nuevo = Usuarios.crear({
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      contrasena: await bcrypt.hash(contrasena, 10),
      boleta: String(boleta).trim(),
      rol,
    });
    res.status(201).json(nuevo);
  } catch (e) {
    if (esDuplicado(e)) return res.status(400).json({ error: 'El correo o la boleta ya están registrados' });
    interno(res, e);
  }
});

router.delete('/:id', (req, res) => {
  try {
    if (!Usuarios.eliminar(req.params.id)) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(204).send();
  } catch (e) {
    if (String(e.message).includes('FOREIGN KEY')) return res.status(409).json({ error: 'No se puede eliminar: el usuario tiene registros asociados' });
    interno(res, e);
  }
});

module.exports = router;
