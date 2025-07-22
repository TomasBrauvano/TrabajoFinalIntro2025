const express = require('express');
const router = express.Router();
const usuarioPeliculaModelo = require('../modelos/usuario_pelicula');

router.get('/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const peliculas = await usuarioPeliculaModelo.obtenerPeliculasPorIdUsuario(usuario_id);
        if (!peliculas) {
            return res.statusCode(404).json({ error: 'El usuario no existe' });
        }
        res.status(200).json(peliculas);
    } catch (err) {
        console.log(err);
        res.statusCode(500).json({ error: 'Error en el servidor' });
    }
})

module.exports = router;