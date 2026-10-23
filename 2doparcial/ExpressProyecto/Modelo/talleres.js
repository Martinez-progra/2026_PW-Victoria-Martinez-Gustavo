const db = require('../db-local');
 async function obtenerTalleres() {
        const [rows] = await db.query('SELECT * FROM talleres');
        return rows;
    }

    async function crearTaller(taller) {
        const { nombre, descripcion, fecha_inicio, fecha_fin } = taller;
        const [result] = await db.query(
            'INSERT INTO talleres (nombre, descripcion, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, fecha_inicio, fecha_fin]
        );
        return { id: result.insertId, ...taller };
    }

    module.exports = {
        obtenerTalleres,
        crearTaller
    };