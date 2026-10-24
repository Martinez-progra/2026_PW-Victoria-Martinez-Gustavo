const bcrypt = require('bcryptjs');
const usuariosModel = require('../Modelo/usuarios');

function esDuplicado(error) {
    return error.code === 'ER_DUP_ENTRY' || error.code === '23505';
}


async function obtenerUsuarios(req, res) {
    try {
        const usuarios = await usuariosModel.listar();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function obtenerUsuario(req, res) {
    try {
        const usuario = await usuariosModel.obtenerPorId(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function crearUsuario(req, res) {
    try {
        const { nombre, correo, contrasena, boleta } = req.body;
        
        
        if (!nombre || !correo || !contrasena || !boleta) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }

        
        if (contrasena.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }
        
       
        const contrasenaHash = await bcrypt.hash(contrasena, 10);
        
        const nuevoUsuario = await usuariosModel.crear({ 
            nombre, 
            correo, 
            contrasena: contrasenaHash, 
            boleta, 
            rol: req.body.rol 
        });
        
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        if (esDuplicado(error)) {
            return res.status(400).json({ error: 'El correo o la boleta ya están registrados' });
        }
        res.status(500).json({ error: error.message });
    }
}



async function eliminarUsuario(req, res) {
    try {
        const eliminado = await usuariosModel.eliminar(req.params.id);
        if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    eliminarUsuario
};