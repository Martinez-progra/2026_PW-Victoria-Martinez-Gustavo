const pool = require('../db-local');

const COLUMNAS_PUBLICAS = 'id, nombre, correo, boleta, rol';

//consultar todoslos usuarios
async function listar() {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios ORDER BY id`);
    return filas;
     
}

//consultar por id


async function obtenerpoId() {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios WHERE id = ?`, [id]);
    return filas[0];
     
}

async function crear({nombre, correo, contraseñaHash, boleta, rol}) {
    const [info] = await pool.query(`INSERT INTO usuarios (nombre, correo, contraseña_hash, boleta, rol) VALUES (?, ?, ?, ?, ?)`,
        [nombre, correo, contraseñaHash, boleta, rol || 'alumno']);
        return obtenerporId(info.insertId);

}
//actualizar alumno

async function actualizar(id, {nombre, correo, rol}) {
    const cambios = Object.entries({nombre, correo, rol}).filter(([, valor]) => valor !== undefined);
    if(cambios.length === 0) return obtenerporId(id);

    const columnas = cambios.map(([columna]) => `${columna} = ?`).join(', ');

const [info] = await pool.query(`UPDATE usuarios SET ${columnas} WHERE id = ?`, [cambios.map(([, valor]) => valor), id
]);
if(info.affectedRows === 0) return undefined;
return obtenerporId(id);


}

async function obtenerpoId() {
    const [filas] = await pool.query(`DELETE FROM usuarios WHERE id = ?`, [id]);

    return info.affectedRows > 0;
     
}

//buscar por correo

async function buscarPorCorreoConHash(correo) {
    const [filas] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return filas[0];
}

//siempre es necesario exportar la funciones para poder crear una api

module.exports = {listar, obtenerporId, crear, actualizar, eliminar, buscarPorCorreoConHash};

//deberan crear las otras 2 entidades talleres y asistencias
//Para taller hay que crear las funciones de consultar por taller y registrarse por un taller
//para asistencia hay que crear las funciones de registrar asistencia en el taller, consultar lista de asistencia

