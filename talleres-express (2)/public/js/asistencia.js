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
    resultado.replaceChildren();
    return;
  }
  boton.disabled = true; boton.textContent = 'Buscando…';
  try {
    const [perfil, mios, todos] = await Promise.all([
      pedirJSON(`/alumnos/${boleta}/perfil`),
      pedirJSON(`/alumnos/${boleta}/talleres`),
      pedirJSON('/talleres'),
    ]);
    pintar(boleta, perfil, mios, todos);
  } catch (err) {
    errorP.textContent = err.message;
    errorP.hidden = false;
    resultado.replaceChildren();
  } finally {
    boton.disabled = false; boton.textContent = 'Ver mi perfil';
  }
}

function pintar(boleta, perfil, mios, todos) {
  const nombre = perfil ? perfil.nombre : '';
  const inscritosIds = new Set(mios.map((t) => t.id));
  const disponibles = todos.filter((t) => !inscritosIds.has(t.id) && t.inscritos < t.cupo);

  const panel = perfil
    ? el('section', { class: 'panel' },
        el('h2', { text: perfil.nombre }),
        el('p', {}, el('strong', { text: 'Boleta: ' }), boleta),
        el('p', {}, el('strong', { text: 'Rol: ' }), perfil.rol || 'alumno'))
    : el('section', { class: 'panel' },
        el('p', { text: `No hay una cuenta registrada para la boleta ${boleta}. Si ya estás inscrito en un taller, usa la misma boleta para consultar tu inscripción.` }));

  const listaMios = mios.length === 0
    ? el('p', { text: 'Todavía no estás inscrito en ningún taller.' })
    : el('ul', { class: 'lista' }, mios.map((t) => el('li', {},
        el('a', { href: `/talleres/${t.id}`, text: t.nombre_taller }), ` — ${formatearFecha(t.fecha)}`)));

  const listaDisp = disponibles.length === 0
    ? el('p', { text: 'No hay más talleres con lugar.' })
    : el('ul', { class: 'lista' }, disponibles.map((t) => {
        const libres = t.cupo - t.inscritos;
        const q = new URLSearchParams({ boleta });
        if (nombre) q.set('nombre', nombre);
        return el('li', {}, `${t.nombre} — ${libres} ${libres === 1 ? 'lugar' : 'lugares'} · `,
          el('a', { href: `/talleres/${t.id}?${q}`, text: 'Inscribirme' }));
      }));

  resultado.replaceChildren(
    panel,
    el('h2', { text: `Mis talleres (${mios.length})` }), listaMios,
    el('h2', { text: 'Talleres con lugar disponible' }), listaDisp
  );
}

document.getElementById('form').addEventListener('submit', (e) => { e.preventDefault(); consultar(inputBoleta.value); });

const inicial = new URLSearchParams(location.search).get('boleta');
if (inicial) { inputBoleta.value = inicial; consultar(inicial); }
