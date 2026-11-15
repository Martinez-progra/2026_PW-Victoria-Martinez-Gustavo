// Consultas a la tabla usuarios. Siempre con ? (consulta parametrizada), nunca pegando texto en el SQL.
const bcrypt = require('bcryptjs');

function crearModeloUsuarios(pool) {
    return {
        async verificar(usuario, contrasenaIngresada) {
            try {
                // Buscamos al usuario por su nombre en la base de datos
                const [rows] = await pool.query(
                    'SELECT * FROM usuarios WHERE usuario = ?',
                    [usuario]
                );
                
                if (rows.length === 0) {
                    return null; // El usuario no existe
                }

                const user = rows[0];

                // Comparamos la contraseña ingresada con el hash guardado en MySQL
                // (Si en tu BD las contraseñas están en texto plano, puedes cambiar esto por una comparación directa: user.contrasena === contrasenaIngresada)
                const passwordMatch = await bcrypt.compare(contrasenaIngresada, user.contrasena_hash);

                if (!passwordMatch) {
                    return null; // Contraseña incorrecta
                }

                return user; // Retorna los datos del usuario si todo es correcto
            } catch (error) {
                console.error("Error en el modelo de usuarios:", error);
                throw error;
            }
        }
    };
}

module.exports = { crearModeloUsuarios };
