pintarNav();

const params = new URLSearchParams(location.search);
// /talleres/3  (o, por compatibilidad, ?id=3)
const coincide = location.pathname.match(/^\/talleres\/(\d+)\/?$/);
const id = coincide ? coincide[1] : params.get('id');
const contenido = document.getElementById('contenido');

function volver() {
  return el('a', { class: 'volver', href: '/talleres', text: '← Volver a talleres' });
}

function mostrarError(mensaje) {
  contenido.replaceChildren(el('p', { class: 'error', text: mensaje }), volver());
}

async function cargar() {
  if (!id || !/^\d+$/.test(id)) return mostrarError('Taller no válido.');
  try {
    const [taller, inscritos] = await Promise.all([
      pedirJSON(`/talleres/${id}`),
      pedirJSON(`/talleres/${id}/asistencias`),
    ]);
    pintar(taller, inscritos);
  } catch (err) {
    mostrarError(err.message);
  }
}

function pintar(taller, inscritos) {
  document.title = taller.nombre;
  const ocupados = inscritos.length;
  const libres = Math.max(0, taller.cupo - ocupados);
  const lleno = libres === 0;
  const porcentaje = Math.min(100, (ocupados / taller.cupo) * 100);

  const nombre = el('input', { placeholder: 'Nombre completo', 'aria-label': 'Nombre completo', maxlength: '100' });
  const boleta = el('input', { placeholder: 'Boleta (10 dígitos)', 'aria-label': 'Boleta', maxlength: '10', inputmode: 'numeric' });
  const boton = el('button', { type: 'submit', text: lleno ? 'Sin lugares' : 'Inscribirme' });
  if (lleno) boton.disabled = true;
  const msgError = el('p', { class: 'error', hidden: '' });
  const msgExito = el('p', { class: 'exito', hidden: '' });

  // Si vienes del perfil: ?id=1&boleta=...&nombre=...
  if (params.get('boleta')) boleta.value = params.get('boleta');
  if (params.get('nombre')) nombre.value = params.get('nombre');

  const form = el('form', { class: 'formulario' }, nombre, boleta, boton);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msgError.hidden = true; msgExito.hidden = true;
    boton.disabled = true; boton.textContent = 'Inscribiendo…';
    try {
      await pedirJSON('/asistencias', {
        method: 'POST',
        body: JSON.stringify({ taller_id: Number(id), nombre_alumno: nombre.value, boleta: boleta.value }),
      });
      const quien = nombre.value.trim();
      await cargar();                       // vuelve a pintar con datos nuevos
      const ok = document.getElementById('exito');
      ok.textContent = `¡Listo! ${quien} quedó inscrito(a) en el taller.`;
      ok.hidden = false;
    } catch (err) {
      msgError.textContent = err.message;
      msgError.hidden = false;
      boton.disabled = lleno; boton.textContent = lleno ? 'Sin lugares' : 'Inscribirme';
    }
  });

  const tabla = ocupados === 0
    ? el('p', { text: 'Todavía no hay inscritos. ¡Sé el primero!' })
    : el('table', {},
        el('thead', {}, el('tr', {}, el('th', { text: '#' }), el('th', { text: 'Nombre' }), el('th', { text: 'Boleta' }))),
        el('tbody', {}, inscritos.map((a, i) =>
          el('tr', {}, el('td', { text: String(i + 1) }), el('td', { text: a.nombre_alumno }), el('td', { text: a.boleta })))));

  contenido.replaceChildren(
    volver(),
    el('h1', { text: taller.nombre }),
    el('section', { class: 'panel' },
      el('p', { text: taller.descripcion || 'Sin descripción' }),
      el('p', {}, el('strong', { text: 'Instructor: ' }), taller.instructor || 'Por confirmar'),
      el('p', {}, el('strong', { text: 'Fecha: ' }), formatearFecha(taller.fecha)),
      el('div', { class: 'barra' }, el('div', { class: 'relleno', style: `width:${porcentaje}%` })),
      el('p', {}, `${ocupados} de ${taller.cupo} lugares ocupados · `,
        lleno ? el('span', { class: 'lleno', text: 'Taller lleno' })
              : `${libres} ${libres === 1 ? 'lugar libre' : 'lugares libres'}`)),
    el('section', { class: 'panel' },
      el('h2', { text: 'Inscribirme' }),
      form, msgError, msgExito,
      el('p', { id: 'exito', class: 'exito', hidden: '' })),
    el('h2', { text: `Inscritos (${ocupados})` }),
    tabla
  );
}

cargar();
