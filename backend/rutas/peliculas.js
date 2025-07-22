const express = require('express');
const router = express.Router();
const peliculaModelo = require('../modelos/pelicula');
const usuarioPeliculaModelo = require('../modelos/usuario_pelicula');

router.get("/", async (req, res) => {
    try {
        const peliculas = await peliculaModelo.obtenerTodas();
        res.status(200).json(peliculas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.get("/creadores/:creador_id", async (req, res) => {
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
    const { nombre, anio, director, sinopsis, imagen, creador_id, categoria, calificacion, estado } = req.body;

    if (!nombre || !anio || !director || !sinopsis || !imagen || !creador_id || !categoria || !estado) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const pelicula = await peliculaModelo.crear(creador_id, { nombre, anio, director, sinopsis, imagen, categoria });
        await usuarioPeliculaModelo.agregar(creador_id, pelicula.id, calificacion, estado);
        res.status(201).json({ mensaje: 'Pelicula creada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, anio, director, sinopsis, imagen, creador_id, categoria, usuario_id } = req.body;

    if (!nombre || !anio || !director || !sinopsis || !imagen || !creador_id || !categoria) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const pelicula = await peliculaModelo.obtenerPorId(id);
        if (!pelicula) {
            return res.status(404).json({ error: 'Pelicula no encontrada' });
        }
        if (creador_id != usuario_id) {
            return res.status(403).json({ error: 'No tenes permisos para actualizar esta pelicula' });
        }
        await peliculaModelo.actualizar(id, { nombre, anio, director, sinopsis, imagen, creador_id, categoria });
        res.status(201).json({ mensaje: 'Pelicula actualizada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.body.usuario_id

    try {
        const pelicula = await peliculaModelo.obtenerPorId(id);
        if (!pelicula) {
            return res.status(404).json({ error: 'Pelicula no encontrada' });
        }
        if (pelicula.creador_id !== usuario_id) {
            return res.status(403).json({ error: 'No tenes permisos para eliminar esta pelicula' });
        }
        await peliculaModelo.eliminarPorId(id);
        res.status(200).json({ mensaje: 'Pelicula eliminada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

module.exports = router