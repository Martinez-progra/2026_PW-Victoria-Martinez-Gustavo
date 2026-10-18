// 02-objetos-json.js
// Object.keys/values/entries y JSON.stringify/parse. Completa cada TODO.

const taller = {
  nombre: 'Introducción a Python',
  instructor: 'Ing. María López',
  cupo: 25,
  inscritos: 25,
};

// TODO: Object.keys — imprime solo los nombres de las propiedades de `taller`
console.log('Manejo de object keys');
console.log(Object.keys(taller));

// TODO: Object.values — imprime solo los valores
console.log('Manejo de valores del objeto');
console.log(Object.values(taller));

// TODO: Object.entries — recorre con for..of e imprime "campo: valor" de cada propiedad
console.log('Manejo de objetos por for para entries');
for (const [campo, valor] of Object.entries(taller)) {
  console.log(`${campo}: ${valor}`);
}

// TODO: JSON.stringify — convierte `taller` a texto (guárdalo en `textoJson`) e imprímelo
console.log('Manejo de conversion de objeto a string');
const textoJson = JSON.stringify(taller, null, 2);
console.log(textoJson);
console.log('tipo: ', typeof textoJson);

// Inverso de cadena a JSON
console.log('Inverso de cadena a JSON');
const objetoDeVuelta = JSON.parse(textoJson);
console.log('tipo: ', typeof objetoDeVuelta);


 <section className="ejercicio" aria-labelledby="titulo-objeto">
    <h2 id="titulo-objeto">Segunda parte de ejercicios manejo de objetos y JSON</h2>
    <p>Edita el taller y elige la operación que deseas</p>

    <form className="formulario" id="form-objeto">
        <div className="campo">
            <label htmlFor="obj-nombre">Nombre</label>
            <input type="text" id="obj-nombre" name="obj-nombre" defaultValue="Introducción a Python" />
        </div>

        <div className="campo campo-corta">
            <label htmlFor="obj-instructor">Instructor</label>
            <input type="text" id="obj-instructor" name="obj-instructor" defaultValue="Ing. María López" />
        </div>

        <div className="campo campo-corta">
            <label htmlFor="obj-cupo">Cupo</label>
            <input type="number" id="obj-cupo" name="obj-cupo" defaultValue={25} />
        </div>

        <div className="campo campo-corta">
            <label htmlFor="obj-inscritos">Inscritos</label>
            <input type="number" id="obj-inscritos" name="obj-inscritos" defaultValue={25} />
        </div>

        <div className="campo">
            <label htmlFor="operacion-objeto">Operación a realizar</label>
            <select name="operacion-objeto" id="operacion-objeto">
                <option value="keys">Object.keys</option>
                <option value="values">Object.values</option>
                <option value="entries">Object.entries</option>
                <option value="stringify">JSON.stringify</option>
                <option value="roundtrip">Ida y vuelta de cadena a JSON</option>
            </select>
        </div>
        
        <button type="submit">Ejecutar opción de objeto</button>
    </form>

    <output className="resultado" id="resultado-objeto" htmlFor="form-objeto"></output>
</section>

