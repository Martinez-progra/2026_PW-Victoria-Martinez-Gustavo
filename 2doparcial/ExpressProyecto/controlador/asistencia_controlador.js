const AsistenciaModelo = require('../Modelo/asistencia');

async function obtenerAsistencias(req, res) {
    try {
        const asistencia = await AsistenciaModelo.obtenerAsistencias();
        res.json(asistencia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function registrarAsistencia(req, res) {
    try {
        const datos = req.body;
        const nuevaAsistencia = await AsistenciaModelo.registrarAsistencia(datos);
        res.status(201).json(nuevaAsistencia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    obtenerAsistencias,
    registrarAsistencia
};
