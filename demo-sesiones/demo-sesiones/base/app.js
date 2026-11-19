const path = require('path');
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { crearModeloUsuarios } = require('./modelos/usuarios.modelo');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {crearModeloTokens} = require('/modelos/tokens.modelo');

const NOMBRE_COOKIE = 'connect.sid';

function todasLasSesiones(almacen) {
  return new Promise((resolve, reject) => {
    const promesa = almacen.all((error, sesiones) => (error ? reject(error) : resolve(sesiones)));
    if (promesa && typeof promesa.then === 'function') promesa.then(resolve, reject);
  });
}

function crearApp(config, pool) {
  const app = express();
  app.use(express.json());

  const usuarios = crearModeloUsuarios(pool);

  const almacen = config.almacen === 'memoria'
    ? new session.MemoryStore()
    : new MySQLStore({ createDatabaseTable: false, clearExpired: false }, pool);
  app.locals.almacen = almacen;

  app.use(
    session({
      name: NOMBRE_COOKIE,
      secret: process.env.SESSION_SECRET || 'secreto-solo.para-la-demo',
      store: almacen,
      resave: false,
      saveUninitialized: false,
      rolling: config.rolling || false,
      cookie: {
        httpOnly: config.httpOnly ?? true,
        secure: config.secure ?? false,
        maxAge: config.maxAgeMs || 1000 * 60 * 60 * 24,
        sameSite: config.sameSite || 'lax',
      },
    })
  );

  const cortoId = (id) => (id ? `${id.slice(0, 8)}...` : null);

  function vencida(sesion) {
    const desde = config.rolling ? sesion.ultimoUso : sesion.creada;
    return Date.now() - desde > config.maxAgeMs;
  }

  // Middleware único de validación de sesión y expiración
  function requiereSesion(req, res, next) {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ error: '401 No has iniciado sesión con la cuenta correcta.' });
    }

    // Verificamos si ya expiró antes de actualizar el último uso
    if (vencida(req.session)) {
      return req.session.destroy(() => {
        res.clearCookie(NOMBRE_COOKIE);
        res.status(401).json({ error: '401 · Tu sesión venció: vuelve a iniciar sesión' });
      });
    }

    // Solo una sesión vigente puede extender su expiración por actividad
    if (config.rolling) {
      req.session.ultimoUso = Date.now();
    }

    next();
  }

  // Middleware único para validar roles
  function requiereRol(rol) {
    return (req, res, next) => {
      if (req.session.usuario.rol !== rol) {
        return res.status(403).json({
          error: `403. Eres ${req.session.usuario.usuario}, pero esta ruta es solo para ${rol}`
        });
      }
      next();
    };
  }

  // --- RUTAS ---

  app.get('/api/config', (req, res) => res.json(config));

  app.post('/api/visita', (req, res) => {
    if (!req.session) return res.json({ error: 'No tiene una sesión asociada' });
    req.session.visitas = (req.session.visitas || 0) + 1;
    res.json({ visitas: req.session.visitas, sesion: cortoId(req.sessionID) });
  });

  app.post('/api/login', async (req, res, next) => {
    try {
      const { usuario, contrasena } = req.body || {};
      const datos = await usuarios.verificar(usuario, contrasena);
      if (!datos) return res.status(401).json({ error: 'Usuario o contraseña incorrecto' });

      // Quitamos la contraseña hasheada para que la prueba pase con éxito
      const { contrasena_hash, ...usuarioSeguro } = datos;

      const antes = req.session.visitas !== undefined ? cortoId(req.sessionID) : null;
      const visitas = req.session.visitas || 0;

      const guardar = () => {
        req.session.usuario = usuarioSeguro;
        req.session.visitas = visitas;
        req.session.creada = Date.now();
        req.session.ultimoUso = Date.now();
        req.session.save((error) => {
          if (error) return next(error);
          res.json({ usuario: usuarioSeguro, sesionAntes: antes, sesionDespues: cortoId(req.sessionID) });
        });
      };

      if (config.regenerarAlEntrar) {
        req.session.regenerate((error) => (error ? next(error) : guardar()));
      } else {
        guardar();
      }
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
      res.clearCookie(NOMBRE_COOKIE);
      res.json({ mensaje: 'Sesión cerrada: el servidor la borró' });
    });
  });

  app.get('/api/sesion', requiereSesion, (req, res) => {
    const desde = config.rolling ? req.session.ultimoUso : req.session.creada;
    return res.json({
      usuario: req.session.usuario,
      sesion: cortoId(req.sessionID),
      expiraEnSegundos: Math.max(0, Math.round((desde + config.maxAgeMs - Date.now()) / 1000)),
    });
  });

  app.get('/api/perfil', requiereSesion, (req, res) => {
    req.session.visitas = (req.session.visitas || 0) + 1;
    res.json({
      mensaje: `Hola ${req.session.usuario.nombre}, rol ${req.session.usuario.rol}, visitas: ${req.session.visitas}`,
      visitas: req.session.visitas // <-- Esto es lo que exige probar.js
    });
  });

  app.get('/api/admin/reporte', requiereSesion, requiereRol('admin'), (req, res) => {
    res.json({
      reporte: 'Talleres: 3 · Inscritos: 57 · Cupo libre: 18'
    });
  });

  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  });

  //Nuevo

  const SECRETO_JWT = config.jwtSecreto || process.env.JWT_SECRET || 'secreto-jwt-solo-para-esta-demo';

 function firmarToken(usuario){
  return jwt.sign(
    {
      sub: String(usuario.id), usuario: usuario, nombre:
      usuario.nombre, rol: usuario.rol
    }, SECRETO_JWT,
    {
      algorithm: 'HS256', expiresIn: config.jwtEspiraSeg, jwtid: crypto.randomUUID()
    }
  );
 }

 async function requireJWT(req, res, next){
  const encabezado = req.headers.authorization || '';
  if(!encabezado.startWith('Bearer')){
    return res.status(401).json({error: '401: Falta el token'});
  }
  const token = encabezado.slice('Bearer'.length);
  let datos;
  try{
    datos = jwt.verify(token, SECRETO_JWT, {algorithms:['HS256']});
  }catch(error){
    if(error.name === 'TokenExpiredError'){
    return res.status(401).json({error: '401 Token expirado, por favor renuevelo'});
    }
    return res.status(401).json({error: '401, Expirado'});
  }

  try{
    if(config.jwtRevocar && (await crearModeloTokens.estaRevocado(datos.jti))){
      return res.status(401).json({error: '401 Token revocadoy ya peto la sesion'});
    }
  }catch(error){
    return next(error);
  }

  req.jwt = datos;
  next();

 }

 function requiereRolJWT(rol){
  return (req, res, next) => {
    if(req.jwt.rol !== rol){
      return res.status(403).json({error: `403 Eres ${req.jwt.usuario}, pero esta ruta le pertenece a ${rol}`});

    }
  }
 }
 //esto ya es para que implementen en las rutas

 app.post('api/jwt/login', async(req, res, next) => {
  try{
    const {usuario, contrasena} = req.body || '';
    const datos = await usuarios.verificar(usuario,contrasena);
    if(!datos) return res.status(401).json({error: 'Usuario o contrasena incorrecto'});

    res.json({token: firmarToken(datos), usuario:datos});
  }catch{
    next(error);
  }

  app.get('/api/jwt/perfil', requiereRolJWT, (req, res) => {
    res.json({
      mensaje: `Hola: ${req.jwt.nombre}`, }
      rol :  req.jwt.rol,
      expiraEnSegundos : match.max(0, req.jwt.exp - Math.floor(Date.now() / 1000)),
    });

  app.get('api/jwt/admin/reporte', requiereRolJWT, requiereRol('admin'), (req, res))

  });
 })
  return app;
}



module.exports = { crearApp, NOMBRE_COOKIE };