db = require('../db-local');

class AsistenciaModelo {
    static async registrarAsistencia(datos) {
        const { id_taller, id_usuario, fecha_asistencia } = datos;
        const [result] = await db.query(
            'INSERT INTO asistencia (id_taller, id_usuario, fecha_asistencia) VALUES (?, ?, ?)',
            [id_taller, id_usuario, fecha_asistencia]
        );
        return { id: result.insertId, ...datos };
    }

    static async obtenerAsistencias() {
        const [rows] = await db.query('SELECT * FROM asistencia');
        return rows;
    }   

}

module.exports = AsistenciaModelo;