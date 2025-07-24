const express = require('express');
const router = express.Router();
const peliculaModelo = require('../modelos/pelicula');
const libroModelo = require('../modelos/libro');
const serieModelo = require('../modelos/serie');
const usuarioModelo = require('../modelos/usuario');

router.get("/:usuario_id", async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const pelicula = await peliculaModelo.obtenerRecomendacionAleatoria(usuario_id);
        const serie = await serieModelo.obtenerRecomendacionAleatoria(usuario_id);
        const libro = await libroModelo.obtenerRecomendacionAleatoria(usuario_id);

        res.json({ pelicula, serie, libro });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "No se pudieron obtener las recomendaciones" });
    }
});

module.exports = router