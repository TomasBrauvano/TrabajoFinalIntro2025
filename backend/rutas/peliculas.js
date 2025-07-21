const express = require('express');
const router = express.Router();
const peliculaModelo = require('../modelos/pelicula');

router.get("/", async (req, res) => {
    try {
        const peliculas = await peliculaModelo.obtenerTodas();
        res.status(200).json(peliculas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.get("/:creador_id", async (req, res) => {
    const { creador_id } = req.params;
    try {
        const peliculas = await peliculaModelo.obtenerPorCreador(creador_id);
        res.status(200).json(peliculas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const pelicula = await peliculaModelo.obtenerPorId(id);
        res.status(200).json(pelicula);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.get("/categorias/:id_categoria", async (req, res) => {
    const { id_categoria } = req.params;
    try {
        const peliculas = await peliculaModelo.obtenerPorCategoria(id_categoria);
        res.status(200).json(peliculas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.post("/", async (req, res) => {
    const { nombre, anio, director, sinopsis, imagen, creador_id, categoria } = req.body;

    if (!nombre || !anio || !director || !sinopsis || !imagen || !creador_id || !categoria) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        await peliculaModelo.crear({ nombre, anio, director, sinopsis, imagen, creador_id, categoria });
        res.status(201).json({ mensaje: 'Pelicula creada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, anio, director, sinopsis, imagen, categoria } = req.body;

    if (!nombre || !anio || !director || !sinopsis || !imagen || !categoria) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const peliculaActualizada = await peliculaModelo.actualizar(id, { nombre, anio, director, sinopsis, imagen, categoria });
        if (peliculaActualizada) {
            res.status(201).json({ mensaje: 'Pelicula actualizada' });
        } else {
            res.status(404).json({ error: 'Pelicula no encontrada' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.delete("/:id/:creador_id", async (req, res) => {
    const { id, creador_id } = req.params;

    try {
        if (id != creador_id) {
            return res.status(400).json({ error: 'No podes eliminar esta pelicula' });
        }
        const peliculaEliminada = await peliculaModelo.eliminarPorId(id);
        if (peliculaEliminada) {
            res.status(200).json({ mensaje: 'Pelicula eliminada' });
        } else {
            res.status(404).json({ error: 'Pelicula no encontrada' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

module.exports = router