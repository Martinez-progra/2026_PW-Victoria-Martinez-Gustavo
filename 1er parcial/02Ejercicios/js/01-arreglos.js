// 01-arreglos.js
// Métodos de arreglo más usados en JS/Node — practícalos sobre esta lista
// de talleres (misma forma que la API real de CECyT9). Completa cada TODO.

const talleres = [
  { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
  { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
  { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
  { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];



console.log("Aplicando un foreach para imprimir cada taller")
talleres.forEach((t) => console.log(`-${t.nombre} (${t.inscritos}/${t.cupo})`))

console.log("aplicando un forEach para talleres")
talleres.forEach((t) => console.log(`- ${t.nombre} (${t.inscritos}/%{t.cupo})`));
 
// TODO: map — crea un arreglo `nombres` solo con los nombres de los talleres
 
console.log("Aplicando un forEach para imprmir los talleres:");
const nombres = talleres.map((t) => t.nombre);
console.log(nombres);
// TODO: filter — crea un arreglo `llenos` con los talleres donde inscritos >= cupo
 
console.log("aplicando la funcion filder en los talleres")
const llenos = talleres.filter((t) => t.inscritos >= t.cupo);
console.log(llenos.map((t) => t.nombre))

// TODO: find — encuentra el PRIMER taller impartido por 'Ing. María López'

console.log("aplicando la funcion filder en los talleres")
const encontrado = talleres.find((t) => t.inscritos >= t.cupo);
console.log()


// TODO: reduce — calcula `totalInscritos`, la suma de inscritos de todos los talleres
console.log("aplicando la funcion reduce en los talleres")
const totalInscritos = talleres.reduce((acumulador, t) => acumulador + t.inscritos, 0);
console.log(totalInscritos);

// TODO: filter + map encadenados — nombres de los talleres que SÍ tienen cupo disponible

console.log("aplicando la funcion filter + map en los talleres")
const nombresDisponibles = talleres.filter((t) => t.inscritos < t.cupo).map((t) => t.nombre);
console.log(nombresDisponibles);
