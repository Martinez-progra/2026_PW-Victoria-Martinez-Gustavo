// Utilidades compartidas por todas las pantallas

const MENSAJE_CAIDO = 'El servidor no está disponible. Inténtalo más tarde.';

async function pedirJSON(ruta, opciones = {}) {
  let res;
  try {
    res = await fetch('/api' + ruta, {
      ...opciones,
      headers: { 'Content-Type': 'application/json', ...(opciones.headers || {}) },
    });
  } catch {
    throw new Error(MENSAJE_CAIDO);
  }
  let cuerpo = null;
  try { cuerpo = await res.json(); } catch { cuerpo = null; }
  if (!res.ok) throw new Error((cuerpo && (cuerpo.message || cuerpo.error)) || `Error del servidor (${res.status}).`);
  return cuerpo && 'data' in cuerpo ? cuerpo.data : cuerpo;
}

function formatearFecha(f) {
  if (!f) return 'Por confirmar';
  const [anio, mes, dia] = String(f).split('-');
  return `${dia}/${mes}/${anio}`;
}

// Crea elementos con textContent (nunca innerHTML): evita inyección de HTML con nombres de alumnos
function el(tag, atributos = {}, ...hijos) {
  const nodo = document.createElement(tag);
  for (const [k, val] of Object.entries(atributos)) {
    if (k === 'class') nodo.className = val;
    else if (k === 'text') nodo.textContent = val;
    else nodo.setAttribute(k, val);
  }
  for (const h of hijos.flat()) {
    if (h !== null && h !== undefined) nodo.append(h);
  }
  return nodo;
}

// Mismo menú que el sitio original
function pintarNav() {
  const enlaces = [
    ['/', 'Inicio'],
    ['/mini-servidor/1', 'Mini-servidor'],
    ['/talleres', 'Talleres'],
    ['/alumnos/perfil', 'Usuarios'],
    ['/talleres/alumnos/perfil', 'Asistencia'],
  ];
  const actual = location.pathname.replace(/\/+$/, '') || '/';
  const nav = document.getElementById('nav');
  nav.className = 'navegacion';
  nav.setAttribute('aria-label', 'Navegación principal');
  enlaces.forEach(([href, texto]) => {
    const activa = href === actual || (href === '/mini-servidor/1' && actual.startsWith('/mini-servidor')) ||
      (href === '/talleres' && /^\/talleres\/\d+$/.test(actual));
    nav.append(el('a', { href, text: texto, class: activa ? 'activa' : '' }));
  });
}
