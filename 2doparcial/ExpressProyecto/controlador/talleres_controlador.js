const TalleresModelo = require('../Modelo/talleres');

async function obtenerTalleres(req, res) {
    try {
        const talleres = await TalleresModelo.obtenerTalleres();
        res.json(talleres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function crearTaller(req, res) {
    try {
        const taller = req.body;
        const nuevoTaller = await TalleresModelo.crearTaller(taller);
        res.status(201).json(nuevoTaller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    obtenerTalleres,
    crearTaller
};