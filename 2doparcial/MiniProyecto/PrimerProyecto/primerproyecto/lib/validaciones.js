

export function validarBoleta(boleta) {
    
    const regex = /^[0-9]{10}$/; 
    if (!boleta) return "La boleta es obligatoria.";
    if (!regex.test(boleta.trim())) return "La boleta debe tener exactamente 10 dígitos numéricos.";
    return null; 
}

export function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo) return "El correo es obligatorio.";
    if (!regex.test(correo)) return "El formato del correo no es válido.";
    return null;
}