const express = require('express')

const app = express();

app.use(express.json());


const PORT = 5000;


//tenemos la ruta principal por medio del metodo get
app.get('/saludo', (req, res) => {
    res.json({mensaje:'Hola esto es una prueba en GET'});
});

//rutas por medio del metodo post, como un endpoint propio
app.post('/eco', (req, res) => {
    const {texto} = req.body;
    if(!texto){
        return res.status(400).json({error:'EL texto es obligatorio'});
    }
    res.status(201).json({eco:texto})
});




const usuariosRutas = require('./controlador/usuarios_controlador');
app.use('/api/usuarios', usuariosRutas);



const talleresModelo = require('././rutas/rutas_talleres');
app.use('/api/talleres', talleresModelo);


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${PORT}`);
});

const asistenciaRutas = require('./rutas/rutas_asistencia');
app.use('/api/asistencia', asistenciaRutas);
