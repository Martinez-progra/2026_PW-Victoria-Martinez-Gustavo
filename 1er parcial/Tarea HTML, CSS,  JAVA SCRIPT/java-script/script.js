

document.getElementById("registro2").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const nombre = document.getElementById("nombre").value.trim();
  const boleta = document.getElementById("boleta").value.trim();
  const contenedorResultado = document.getElementById("resultado");
  const formulario = document.getElementById("registro2");

 
  if (nombre === "" || boleta === "") {
   
    formulario.classList.add("error");
    formulario.classList.remove("exito");

    contenedorResultado.className = "aviso error mostrar";
    contenedorResultado.innerHTML = "Por favor, complete todos los campos obligatorios para continuar.";
    return; 
  }

 
  formulario.classList.add("exito");
  formulario.classList.remove("error");

  contenedorResultado.className = "aviso exito mostrar";
  contenedorResultado.innerHTML = `¡Registro exitoso! <strong>${nombre}</strong> (Boleta: ${boleta}) se ha registrado correctamente.`;
  
  console.log({ nombre, boleta });

  // Limpiamos el formulario tras un registro exitoso
  this.reset();
});