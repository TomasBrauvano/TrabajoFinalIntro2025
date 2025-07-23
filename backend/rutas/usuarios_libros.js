const express = require('express');
const router = express.Router();
const usuarioLibroModelo = require('../modelos/usuario_libro');

router.get('/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const libros = await usuarioLibroModelo.obtenerLibrosPorIdUsuario(usuario_id);
        if (!libros) {
            return res.status(404).json({ error: 'El usuario no existe' });
        }
        res.status(200).json(libros);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

module.exports = router;