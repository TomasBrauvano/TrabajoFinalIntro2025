const express = require('express');
const router = express.Router();
const libroModelo = require('../modelos/libro');

router.get("/", async (req, res) => {
    try {
        const libros = await libroModelo.obtenerTodos();
        res.status(200).json(libros);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.get("/:creador_id", async (req, res) => {
    const { creador_id } = req.params;
    try {
        const libros = await libroModelo.obtenerPorCreador(creador_id);
        res.status(200).json(libros);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const libro = await libroModelo.obtenerPorId(id);
        res.status(200).json(libro);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.get("/categorias/:id_categoria", async (req, res) => {
    const { id_categoria } = req.params;
    try {
        const libros = await libroModelo.obtenerPorCategoria(id_categoria);
        res.status(200).json(libros);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.post("/", async (req, res) => {
    const { nombre, anio, autor, sinopsis, imagen, creador_id, categoria } = req.body;

    if (!nombre || !anio || !autor || !sinopsis || !imagen || !creador_id || !categoria) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        await libroModelo.crear({ nombre, anio, autor, sinopsis, imagen, creador_id, categoria });
        res.status(201).json({ mensaje: 'Libro creado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, anio, autor, sinopsis, imagen, creador_id, categoria, usuario_id } = req.body;

    if (!nombre || !anio || !autor || !sinopsis || !imagen || !creador_id || !categoria) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const libro = await libroModelo.obtenerPorId(id);
        if (!libro) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        if (creador_id != usuario_id) {
            return res.status(403).json({ error: 'No tenes permisos para actualizar este libro' });
        }
        await libroModelo.actualizar(id, { nombre, anio, autor, sinopsis, imagen, creador_id, categoria });
        res.status(201).json({ mensaje: 'Libro actualizado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

module.exports = router