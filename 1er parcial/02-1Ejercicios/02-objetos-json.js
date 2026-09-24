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

console.log('Manejo de objectos por for para entries')
for(const [campo,valor] of Object.entries(taller)){
console.log(`${campo}: ${valor}`);
}
// TODO: JSON.stringify — convierte `taller` a texto (guárdalo en `textoJson`) e imprímelo
console.log('Manejo de conversion de objetivo a string');
const textoJson = JSON.stringify(taller, null, 2);
console.log(textoJson);
//Lo quiero visualizar como cadena ya no como objeto
console.log('tipo: ', typeof textoJson);

console.log('Inverso de cadena a JSON');
const objetoDeVuelta = JSON.parse(textoJson);
console.log('tipo: ', typeof objetoDeVuelta);


 <section class="ejercicio" aria-labelledby="titulo-objeto">
            <h2 id="titulo-objetivo"> Segunda parte de ejercicios manejo de objetoa y JSON</h2>
            <p>Edita el taller y elije la operacion que desea </p>




            <form class="formulario" id="form-objeto">
                <div class="campo">
                    <label for="obj-nombre">Nombre</label>
                    <input type="text" id="obj-nombre" name="obj-nombre" value="Introduccion a python">
                </div>

                div class="campo campo-corta">
                    <label for="obj-instructor">Nombre</label>
                    <input type="text" id="obj-nombre" name="obj-nombre" value="Introduccion a python">
                </div>

            div class="campo campo-corta">
                    <label for="obj-instructor">Nombre</label>
                    <input type="text" id="obj-nombre" name="obj-cupo" value="Introduccion a python">
                </div>

                div class="campo campo-corta">
                    <label for="obj-inscritos">Cupo</label>
                    <input type="text" id="obj-nombre" name="obj-cupo" value="Introduccion a python">
                </div>

                <div class= "campo">
                    <label for="operacion-objeto">Opertacion a realizar</label>
                    <select name="operacion-objeto" id="operacion-objeto">
                        <option value="keys">Object.keys</option>
                       <option value="values">Object.values</option>
                       <option value="entries">Object.entries</option>
                       <option value="stringify">JSON.stringify</option>
                       <option value="roundtrip">Ida y vuelta a cadena a JSON</option>


                    </select>
                    
                </div>
                <button type="submit">Ejecutar opcion de objeto</button>

            </form>

            <output class="resultado" id="resultado-objeto" for="form-objeto">

            </output>

        </section>

