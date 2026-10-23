//vamos atener funciones que se encargan de validar correo, boleta y contraseña

//wiii mas tarea siiiii

//aqui va funcion de correo
function validarCorreo(correo){
    if (typeof correo !== 'string') return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);

}

//aqui va funcion de boleta
function validarBoleta(boleta){
    if (typeof boleta !== 'string') return false;
    const regex = /^\d{8}$/;
    return regex.test(boleta);
}



function validarContrasena(contrasena){
    if (typeof contrasena !== 'string') return false;
    return contrasena.length >= 8;
}

module.exports = {
    validarCorreo, validarBoleta, validarContrasena};

