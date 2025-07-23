const express = require('express');
const app = express();
const usuariosRouter = require('./rutas/usuarios');
const seriesRouter = require('./rutas/series');
const peliculasRouter = require('./rutas/peliculas');
const librosRouter = require('./rutas/libros');
const usuariosPeliculasRouter = require('./rutas/usuarios_peliculas')
const usuariosLibrosRouter = require('./rutas/usuarios_libros')
const estadosRouter = require('./rutas/estados');

const usuarioSerieRouter = require('./rutas/usuarioSeries');
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/usuarios', usuariosRouter);
app.use('/api/series', seriesRouter);
app.use('/api/peliculas', peliculasRouter);
app.use('/api/libros', librosRouter);
app.use('/api/usuarios_peliculas', usuariosPeliculasRouter)
app.use('/api/usuarios_libros', usuariosLibrosRouter)
app.use('/api/estados', estadosRouter);


app.use('/api/usuarioSeries', usuarioSerieRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});