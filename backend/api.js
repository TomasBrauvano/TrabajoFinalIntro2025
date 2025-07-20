const express = require('express');
const app = express();
const usuariosRouter = require('./rutas/usuarios');

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/usuarios', usuariosRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});