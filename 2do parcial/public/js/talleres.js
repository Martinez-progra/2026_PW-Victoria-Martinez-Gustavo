pintarNav();

let talleres = [];
const rejilla = document.getElementById('rejilla');
const errorP = document.getElementById('error');

function pintar() {
  const termino = document.getElementById('buscador').value.trim().toLocaleLowerCase();
  const filtrados = talleres.filter((t) =>
    (t.nombre || '').toLocaleLowerCase().includes(termino) ||
    (t.instructor || '').toLocaleLowerCase().includes(termino));

  rejilla.replaceChildren();
  if (talleres.length === 0) {
    rejilla.append(el('p', { text: 'Todavía no hay talleres registrados.' }));
    return;
  }
  if (filtrados.length === 0) {
    rejilla.append(el('p', { text: 'No se encontraron talleres con ese nombre o instructor.' }));
    return;
  }
  filtrados.forEach((t) => {
    const libres = Math.max(0, t.cupo - t.inscritos);
    rejilla.append(
      el('div', { class: 'panel' },
        el('h3', { text: t.nombre }),
        el('p', { text: t.descripcion || 'Sin descripción' }),
        el('p', {}, el('strong', { text: 'Cupo: ' }), `${t.cupo} lugares`),
        el('p', { class: libres === 0 ? 'lleno' : '' },
          libres === 0 ? 'Taller lleno' : `${libres} ${libres === 1 ? 'lugar libre' : 'lugares libres'}`),
        el('a', { class: 'enlace', href: `/talleres/${t.id}`, text: 'Ver detalles e inscribirme →' })
      )
    );
  });
}

document.getElementById('buscador').addEventListener('input', pintar);

pedirJSON('/talleres')
  .then((datos) => { talleres = Array.isArray(datos) ? datos : []; pintar(); })
  .catch((err) => {
    errorP.textContent = err.message;
    errorP.hidden = false;
    rejilla.replaceChildren();
  });
