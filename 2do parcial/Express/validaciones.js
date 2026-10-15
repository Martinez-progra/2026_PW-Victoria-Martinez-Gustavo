//vamos a tener funciones que se envcragan de validar correo, boleta y contrseña

//wiiiiiii mas tarea siiiiii

//aqui va la funcion de correo
function validarCorreo(correo) {

}
//aqui va funcion de boleta
function validarBoleta(boleta) {
    
}

function validarContraseña(contraseña){
    if(typeof contraseña !== 'string') return false;
    return contraseña.length >= 8;
}

module.exports = {validarContraseña};