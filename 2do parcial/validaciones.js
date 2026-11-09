function validarBoleta(boleta) {
  const v = boleta === undefined || boleta === null ? '' : String(boleta).trim();
  if (!v) return 'La boleta es obligatoria.';
  if (!/^[0-9]{10}$/.test(v)) return 'La boleta debe tener exactamente 10 dígitos numéricos.';
  return null;
}

function validarNombre(nombre) {
  const v = typeof nombre === 'string' ? nombre.trim() : '';
  if (!v) return 'El nombre es obligatorio.';
  if (v.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  if (v.length > 100) return 'El nombre no puede pasar de 100 caracteres.';
  return null;
}

function validarCorreo(correo) {
  const v = typeof correo === 'string' ? correo.trim() : '';
  if (!v) return 'El correo es obligatorio.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'El formato del correo no es válido.';
  return null;
}

function validarCupo(cupo) {
  const n = Number(cupo);
  if (!Number.isInteger(n) || n < 1 || n > 500) return 'El cupo debe ser un número entero entre 1 y 500.';
  return null;
}

// 2026010101 -> 2026******
function ocultarBoleta(boleta) {
  if (!boleta || String(boleta).length < 4) return '****';
  return String(boleta).slice(0, 4) + '******';
}

module.exports = { validarBoleta, validarNombre, validarCorreo, validarCupo, ocultarBoleta };
