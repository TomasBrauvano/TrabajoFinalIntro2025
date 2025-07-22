const express = require('express');
const app = express();
const usuariosRouter = require('./rutas/usuarios');
const seriesRouter = require('./rutas/series');
const peliculasRouter = require('./rutas/peliculas');
const librosRouter = require('./rutas/libros');


const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/usuarios', usuariosRouter);
app.use('/api/series', seriesRouter);
app.use('/api/peliculas', peliculasRouter);
app.use('/api/libros', librosRouter);


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});