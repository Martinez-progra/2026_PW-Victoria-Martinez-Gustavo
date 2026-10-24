const pool = require('../db-local');

const COLUMNAS_PUBLICAS = 'id, nombre, correo, boleta, rol';

async function listar() {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios ORDER BY id`);
    return filas;    
}

async function obtenerPorId(id) { // <-- Se agregó el parámetro id
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios WHERE id = ?`, [id]);
    return filas[0];    
}

async function crear({nombre, correo, contrasena, boleta, rol}) {
    const [info] = await pool.query(`
        INSERT INTO usuarios (nombre, correo, contrasena, boleta, rol) VALUES (?, ?, ?, ?, ?)`, 
    [nombre, correo, contrasena, boleta, rol || 'alumno']);
    return obtenerPorId(info.insertId);    
}

async function actualizar(id, {nombre, correo, rol}) {
    const cambios = Object.entries({nombre, correo, rol}).filter(([, valor])=> valor !== undefined);
    if(cambios.length === 0) return obtenerPorId(id);
    
    const columnas = cambios.map(([columna]) => `${columna} = ?`).join(', ');
    const [info] = await pool.query(`UPDATE usuarios SET ${columnas} WHERE id = ?`, [...cambios.map(([, valor]) => valor), id]);
    if(info.affectedRows === 0) return undefined;
    return obtenerPorId(id);
}

async function eliminar(id) { 
    const [info] = await pool.query(`DELETE FROM usuarios WHERE id = ?`, [id]);
    return info.affectedRows > 0; 
}

async function buscarPorCorreoConHash(correo) {
    const [filas] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return filas[0];
}

module.exports = {listar, obtenerPorId, crear, actualizar, eliminar, buscarPorCorreoConHash};

//deberan de crear las otras 2 entidades talleres y assitencias
//Para taller hay que crear las funciones de consultarportaller y registrarse en un taller
//para assitencia hay que crear las funciones de regitrarassitencia en el taller, consultarlistadeassitencia