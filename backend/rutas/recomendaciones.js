const express = require('express');
const router = express.Router();
const peliculaModelo = require('../modelos/pelicula');

router.get("/:usuario_id", async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const peliculas = await peliculaModelo.obtenerRecomendaciones(usuario_id);
        res.status(200).json(peliculas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "No se pudieron obtener las recomendaciones" });
    }
});

module.exports = router