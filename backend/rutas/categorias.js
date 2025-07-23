const express = require('express');
const router = express.Router();
const categoriaModelo = require('../modelos/categoria');

router.get("/", async (req, res) => {
    try {
        const estados = await categoriaModelo.obtenerTodas();
        res.status(200).json(estados);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const estado = await categoriaModelo.obtenerPorId(id);
        res.status(200).json(estado);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

module.exports = router