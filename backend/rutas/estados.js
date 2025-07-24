const express = require('express');
const router = express.Router();
const estadoModelo = require('../modelos/estado');

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const estado = await estadoModelo.obtenerNombrePorId(id);
        res.status(200).json(estado);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

module.exports = router