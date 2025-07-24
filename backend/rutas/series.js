const express = require('express');
const router = express.Router();
const serieModelo = require('../modelos/serie');
const usuarioSerieModelo = require('../modelos/usuarioSerie');

//GET
router.get("/", async (req, res) => {
    try {
        const series = await serieModelo.obtenerTodas();
        res.status(200).json(series);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.get("/creador/:creador_id", async (req, res) => {
    const { creador_id } = req.params;
    try {
        const series = await serieModelo.obtenerPorCreador(creador_id);
        res.status(200).json(series);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor al obtener series por creador.' });
    }
});


router.get("/categoria/:id_categoria", async (req, res) => {
    const { id_categoria } = req.params;
    try {
        const series = await serieModelo.obtenerTodasPorCategoria(id_categoria);
        res.status(200).json(series);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const serie = await serieModelo.obtenerPorId(id);
        if (!serie) {
            return res.status(404).json({ error: 'No se encontro la serie' });
        }
        res.status(200).json(serie);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


//POST
router.post("/", async (req, res) => {
    const { nombre, anio, director, sinopsis, imagen, creador_id, categoria, calificacion, estado } = req.body;

    if (!nombre || !anio || !director || !sinopsis || !imagen || !creador_id || !categoria || !estado) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const nuevaSerie = await serieModelo.crear(creador_id, { nombre, anio, director, sinopsis, imagen, categoria });
        await usuarioSerieModelo.crear(creador_id, nuevaSerie.id, calificacion, estado);
        res.status(201).json(nuevaSerie);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor al crear la serie.' })
    }
});

router.post("/buscar", async (req, res) => {
    const { nombre } = req.body;
    try {
        const series = await serieModelo.obtenerPorNombre(nombre);
        if (!series[0]) {
            return res.status(404).json({ error: 'Serie no encontrada' });
        }
        res.status(200).json(series);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

//PUT
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, anio, director, sinopsis, imagen, creador_id, categoria } = req.body;

    if (!nombre || !anio || !director || !sinopsis || !imagen || !creador_id || !categoria) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const serieExistente = await serieModelo.obtenerPorId(id);
        if (!serieExistente) {
            return res.status(404).json({ error: 'Serie no encontrada' });
        }
        const serieActualizada = await serieModelo.actualizar(id, { nombre, anio, director, sinopsis, imagen, creador_id, categoria });
        res.status(200).json(serieActualizada);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor al actualizar la serie.' });
    }
});

//DELETE
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.body.usuario_id;

    try {
        const serieExistente = await serieModelo.obtenerPorId(id);

        if (!serieExistente) {
            return res.status(404).json({ error: "Serie no encontrada" });
        }

        if (serieExistente.creador_id !== usuario_id) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar esta serie.' });
        }

        await serieModelo.eliminarPorId(id);
        res.status(200).json({ mensaje: 'Serie eliminada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor al eliminar serie' })
    }
})

module.exports = router;