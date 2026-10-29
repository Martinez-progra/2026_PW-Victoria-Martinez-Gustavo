# Talleres (Express + SQLite, sin Next)

## Requisitos
Node 22.13 o superior (SQLite viene incluido en Node, no se instala ni se compila nada).

## Usar
    npm install
    npm start
Abre http://localhost:3000. En la terminal aparece también la dirección de red
(http://TU_IP:3000) para abrirlo desde otro dispositivo de la misma Wi-Fi.

## Páginas (mismas direcciones que el sitio original)
    /                          Inicio
    /mini-servidor/1           Mini-servidor (muestra el parámetro capturado de la ruta)
    /talleres                  Lista de talleres
    /talleres/:id              Detalle e inscripción
    /alumnos/perfil            Usuarios  -> Perfil de Alumno (talleres por boleta)
    /talleres/alumnos/perfil   Asistencia -> Mi perfil (datos, mis talleres, talleres con lugar)

## Datos
Se guardan en `datos.sqlite` (se crea solo). Empieza SIN usuarios ni inscripciones;
solo trae 2 talleres de ejemplo. Para empezar de cero: apaga el servidor y borra
`datos.sqlite`, `datos.sqlite-shm` y `datos.sqlite-wal`.

## Estructura
    server.js          arranca Express, sirve /public, las páginas y /api
    db.js              conexión + tablas (SQLite)   <- archivo a cambiar para usar MySQL
    modelo.js          consultas SQL
    validaciones.js    boleta, nombre, correo, cupo
    rutas/usuarios.js  módulo de usuarios original (bcrypt)
    rutas/api.js       talleres, inscripciones, perfil
    public/            pantallas (HTML, CSS, JS)

## API de usuarios (original: respuestas directas y { error })
    GET    /api/usuarios            lista (sin contraseña)
    GET    /api/usuarios/:id
    POST   /api/usuarios            { nombre, correo, contrasena (min. 6), boleta, rol? }
    DELETE /api/usuarios/:id

## API de talleres
    GET  /api/talleres                  lista (incluye `inscritos`)
    GET  /api/talleres/:id
    POST /api/talleres                  { nombre, cupo, descripcion?, instructor?, fecha? }
    GET  /api/talleres/:id/asistencias  inscritos (boletas enmascaradas)
    POST /api/asistencias               { taller_id, nombre_alumno, boleta }
    GET  /api/alumnos/:boleta/talleres  talleres de un alumno
    GET  /api/alumnos/:boleta/perfil    nombre, boleta y rol
