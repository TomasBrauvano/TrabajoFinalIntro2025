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

module.exports = router