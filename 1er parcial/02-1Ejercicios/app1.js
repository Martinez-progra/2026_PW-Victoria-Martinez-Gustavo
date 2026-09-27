const talleres = [
  { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
  { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
  { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
  { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];

// Corrección: Se agregó explícitamente el parámetro 'datos'
function pintarTabla(datos) {
    const tbody = document.querySelector('#tabla-talleres tbody');
    const lista = Array.isArray(datos) ? datos : [datos];
    
    if (lista.length === 0 || !lista[0]) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No hay registros</td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(t => `
        <tr>
            <td>${t.nombre}</td>
            <td>${t.instructor}</td>
            <td>${t.cupo}</td>
            <td>${t.inscritos}</td>
        </tr>
    `).join('');
}


pintarTabla(talleres);

const formArreglos = document.getElementById(`form-arreglos`);
const resultadoArreglos = document.getElementById(`resultado-arreglo`);
const selectOperacionArreglo = document.getElementById(`operacion-arreglo`);

formArreglos.addEventListener(`submit`, (evento) =>{
    evento.preventDefault();
    const operacion = selectOperacionArreglo.value;

    let resultado = '';

    switch(operacion){
        case 'forEach':
            resultado = talleres.map((t) => `- ${t.nombre} (${t.inscritos}/${t.cupo})`).join('\n');
            pintarTabla(talleres);
            break;

        case 'map':
            const nombres = talleres.map((t) => t.nombre);
            resultado = '\n' + nombres.join('\n');
            pintarTabla(talleres);
            break;

        case 'filter':
            const llenos = talleres.filter((t) => t.inscritos >= t.cupo);
            resultado = '\n' + llenos.map((t) => `• ${t.nombre} (${t.inscritos}/${t.cupo})`).join('\n');
            pintarTabla(llenos); // Aquí sí filtra visualmente la tabla
            break;

        case 'find':
            const encontrado = talleres.find((t) => t.instructor === 'Ing. María López');
            if (encontrado) {
                resultado = resultado = `Taller encontrado:\nNombre: ${encontrado.nombre} | Instructor: ${encontrado.instructor}`;
                pintarTabla([encontrado]); // CORREGIDO: Se pasa como arreglo [encontrado]
            } else {
                resultado = "No se encontró ningún taller con ese criterio.";
                pintarTabla([]);
            }
            break;
        
        case 'reduce':
            const totalInscritos = talleres.reduce((acumulador, t) => acumulador + t.inscritos, 0);
            resultado = `-\nTotal de inscritos en todos los talleres: ${totalInscritos}`;
            pintarTabla(talleres);
            break;

        case 'filter-map': 
            const conCupo = talleres.filter((t) => t.inscritos < t.cupo);
            const nombresDisponibles = conCupo.map((t) => t.nombre);
            resultado = `\nTalleres con cupo disponible:\n- ${nombresDisponibles.join('\n- ')}`;
            pintarTabla(conCupo); // Filtra visualmente la tabla con los que tienen cupo
            break;

        default:
            pintarTabla(talleres);
            break;
    }
    resultadoArreglos.textContent = resultado;
});


const formObjeto = document.getElementById('form-objeto');
const resultadoObjeto = document.getElementById('resultado-objeto');

formObjeto.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const taller = {
        nombre: document.getElementById('obj-nombre').value,
        instructor: document.getElementById('obj-instructor').value,
        cupo: Number(document.getElementById('obj-cupo').value) || 0, // Validación básica por si está vacío
        inscritos: Number(document.getElementById('obj-inscritos').value) || 0
    };

    const operacion = document.getElementById('operacion-objeto').value;
    let resultado = '';

    switch(operacion){
        case 'keys':
            resultado = JSON.stringify(Object.keys(taller), null, 2);
            break;

        case 'values':
            resultado = JSON.stringify(Object.values(taller), null, 2);
            break;

        case 'entries':
            resultado = JSON.stringify(Object.entries(taller), null, 2);    
            break;

        case 'stringify':
            const textoJson = JSON.stringify(taller, null, 2);
            resultado = `${textoJson} \n\n tipo: ${typeof textoJson}`;
            break;

        case 'roundtrip':
            const textoJsons = JSON.stringify(taller, null, 2);
            const objetoDevuelta = JSON.parse(textoJsons);

            resultado = [
                textoJsons,
                '',
                `tipo: ${typeof objetoDevuelta}`,
                `Nombre recuperado: ${objetoDevuelta.nombre}`
            ].join('\n');
            break;
            
        default:
            resultado = "Operación no válida";
            break;
    }
    
    resultadoObjeto.textContent = resultado;
});