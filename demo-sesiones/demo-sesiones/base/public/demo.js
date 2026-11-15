// La página solo hace fetch a la API. El navegador manda la cookie solo (misma página, mismo servidor).
const $ = (id) => document.getElementById(id);


// Función auxiliar para hacer fetch a la API y devolver status y datos por medio del archivo html (si los hay).


async function llamar(metodo, url, cuerpo) {
  const opciones = { method: metodo, headers: {} };
  if (cuerpo) {
    opciones.headers['Content-Type'] = 'application/json';
    opciones.body = JSON.stringify(cuerpo);
  }
  const respuesta = await fetch(url, opciones);
  let datos = null;
  try { datos = await respuesta.json(); } catch { datos = null; }
  return { status: respuesta.status, datos };
}

// Funcion para llamar a las calles de la API y anotar el resultado en la bitácora de la página. 
// Se usa para todas las llamadas a la API desde el navegador de todos los datos necesarios.

function anotar(metodo, url, status, datos) {
  const li = document.createElement('li');
  const clase = status < 300 ? 'ok' : status === 401 ? 'e401' : status === 403 ? 'e403' : 'error';
  li.innerHTML = `<span class="codigo ${clase}">${status}</span> <code>${metodo} ${url}</code>`;
  const cuerpo = document.createElement('pre');
  cuerpo.textContent = JSON.stringify(datos, null, 2);
  li.appendChild(cuerpo);
  $('bitacora').prepend(li);
}

// Función para refrescar el estado de la sesión del usuario por medio de la API y mostrarlo en la página.
//Mandando un error si el usuario no tiene una sesión activa o si la sesión ha caducado.


async function refrescarEstado() {
  const { status, datos } = await llamar('GET', '/api/sesion');
  const estado = $('estado');
  if (status === 200) {
    estado.textContent = `${datos.usuario.nombre} · rol ${datos.usuario.rol} · sesión ${datos.sesion} · vence en ${datos.expiraEnSegundos} s`;
    estado.className = 'estado con-sesion';
  } else {
    estado.textContent = 'Sin sesión (el servidor responde 401)';
    estado.className = 'estado sin-sesion';
  }
  $('cookie-js').textContent = document.cookie || '(vacío)';
}
// Función para refrescar la lista de sesiones activas en el servidor y mostrarla en la página.
// en caso de que el usuario no tenga una sesión valida o si la sesión ha caducado, se mostrará un mensaje siendo es la tuya?.

async function refrescarSesiones() {
  const { datos: respuesta } = await llamar('GET', '/api/diagnostico/sesiones');
  const datos = respuesta ? respuesta.sesiones : [];
  if (respuesta) {
    $('donde').textContent = respuesta.almacen === 'memoria'
      ? 'En la MEMORIA del servidor: se borra al reiniciarlo.'
      : 'En MySQL, tabla sessions. En Workbench: SELECT * FROM demo_sesiones.sessions;';
  }

  // Funcion para mostrar todas las listas de usuarios que tienen una sesión activa en el servidor y mostrarla en la página, mostrando un mensaje si el usuario no tiene una sesión activa o si la sesión ha caducado.
  const cuerpo = $('tabla-sesiones');
  cuerpo.innerHTML = '';
  if (!datos || datos.length === 0) {
    cuerpo.innerHTML = '<tr><td colspan="4">(sin sesiones)</td></tr>';
    return;
  }
  for (const s of datos) {
    const fila = document.createElement('tr');
    if (s.esLaTuya) fila.className = 'tuya';
    const vence = s.expira ? new Date(s.expira).toLocaleTimeString() : '—';
    for (const valor of [s.sesion + (s.esLaTuya ? ' (la tuya)' : ''), s.usuario, s.visitas, vence]) {
      const celda = document.createElement('td');
      celda.textContent = valor;
      fila.appendChild(celda);
    }
    cuerpo.appendChild(fila);
  }
}

// Función para refrescar todo: estado de la sesión y lista de sesiones activas en el servidor.

async function refrescarTodo() {
  await refrescarEstado();
  await refrescarSesiones();
}

$('usuario').addEventListener('change', () => {
  $('contrasena').value = `${$('usuario').value}12345`;
});

$('form-login').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const cuerpo = { usuario: $('usuario').value, contrasena: $('contrasena').value };
  const { status, datos } = await llamar('POST', '/api/login', cuerpo);
  anotar('POST', '/api/login', status, datos);
  await refrescarTodo();
});

for (const boton of document.querySelectorAll('[data-url]')) {
  boton.addEventListener('click', async () => {
    const { metodo, url } = boton.dataset;
    const { status, datos } = await llamar(metodo, url);
    anotar(metodo, url, status, datos);
    await refrescarTodo();
  });
}

$('btn-refrescar').addEventListener('click', refrescarTodo);
$('btn-sesiones').addEventListener('click', refrescarSesiones);

//  Como paso principal: Al cargar la página, se refresca la configuración del servidor y el estado de la sesión del usuario.
//Pasos exactos:
// Se hace una llamada a la API por medio de la función get llamada llamar() para obtener la configuración del servidor y se muestra en la página. 
// Luego se llama a la función refrescarTodo() para actualizar el estado de la sesión y la lista de sesiones activas en el servidor.

llamar('GET', '/api/config').then(({ datos }) => {
  $('config').textContent = JSON.stringify(datos, null, 2);
});
refrescarTodo();
