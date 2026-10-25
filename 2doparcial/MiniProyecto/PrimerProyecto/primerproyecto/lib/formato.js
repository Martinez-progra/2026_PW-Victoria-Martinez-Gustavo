export function formatearFecha(fechaStr) {
    if (!fechaStr) return '';
    const [anio, mes, dia] = fechaStr.split('-');
    return `${dia}/${mes}/${anio}`;
}


export function ocultarBoleta(boleta) {
    if (!boleta || boleta.length < 4) return '****';
    return boleta.slice(0, 4) + '******'; 
}