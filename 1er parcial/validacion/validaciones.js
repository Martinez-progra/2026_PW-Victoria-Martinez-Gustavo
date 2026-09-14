/*
Las validaciones de formulario son expresiones regulares, las cuales en este momento las podemos dividir en 3 partes:
1. Nombre
2. boleta
3. Fecha
*/

const patrones = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{2,60}$/,
    boleta: /^\d{8}$/, 
    fecha: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2]|1[0-2])\/(19|20)\d{4}$/,

}

const mensajes = {
    nombre: "El nombre debe contener solo letras y espacios, entre 2 y 60 caracteres.",
    boleta: "La boleta debe contener exactamente 8 dígitos.",
    fecha: "La fecha debe tener el formato dd/mm/yyyy y ser una fecha válida (ejemplo: 31/12/2020)."
}

function validarCampo(campo, valor) {
    return patrones[campo].test(valor);
    
}

