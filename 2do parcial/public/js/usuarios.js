pintarNav();

const inputBoleta = document.getElementById('boleta');
const boton = document.getElementById('boton');
const errorP = document.getElementById('error');
const resultado = document.getElementById('resultado');

async function consultar(valor) {
  const boleta = String(valor || '').trim();
  errorP.hidden = true;
  if (!/^[0-9]{10}$/.test(boleta)) {
    errorP.textContent = boleta ? 'La boleta debe tener exactamente 10 dígitos numéricos.' : 'La boleta es obligatoria.';
    errorP.hidden = false;
    return;
  }
  boton.disabled = true; boton.textContent = 'Buscando...';
  try {
    const mios = await pedirJSON(`/alumnos/${boleta}/talleres`);
    resultado.replaceChildren(mios.length === 0
      ? el('p', { class: 'vacio', text: 'No hay talleres registrados para esta boleta.' })
      : el('table', {},
          el('thead', {}, el('tr', {}, el('th', { text: 'Taller' }), el('th', { text: 'Instructor' }), el('th', { text: 'Fecha' }))),
          el('tbody', {}, mios.map((t) => el('tr', {},
            el('td', {}, el('a', { class: 'enlace', href: `/talleres/${t.id}`, text: t.nombre_taller })),
            el('td', { text: t.instructor || 'Por confirmar' }),
            el('td', { text: formatearFecha(t.fecha) }))))));
  } catch (err) {
    errorP.textContent = err.message;
    errorP.hidden = false;
  } finally {
    boton.disabled = false; boton.textContent = 'Consultar';
  }
}

document.getElementById('form').addEventListener('submit', (e) => { e.preventDefault(); consultar(inputBoleta.value); });

const inicial = new URLSearchParams(location.search).get('boleta');
if (inicial) { inputBoleta.value = inicial; consultar(inicial); }
