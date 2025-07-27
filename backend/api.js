const express = require('express');
const app = express();
const usuariosRouter = require('./rutas/usuarios');
const peliculasRouter = require('./rutas/peliculas');
const usuariosPeliculasRouter = require('./rutas/usuarios_peliculas')
const estadosRouter = require('./rutas/estados');
const categoriasRouter = require('./rutas/categorias')
const recomendacionesRouter = require('./rutas/recomendaciones')
const plataformasRouter = require('./rutas/plataformas');
const peliculaPlataformaRouter = require('./rutas/peliculas_plataformas');

const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.use('/api/usuarios', usuariosRouter);
app.use('/api/peliculas', peliculasRouter);
app.use('/api/usuarios_peliculas', usuariosPeliculasRouter)
app.use('/api/estados', estadosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/recomendaciones', recomendacionesRouter);
app.use('/api/plataformas',plataformasRouter);
app.use('/api/peliculas_plataformas', peliculaPlataformaRouter);



app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});