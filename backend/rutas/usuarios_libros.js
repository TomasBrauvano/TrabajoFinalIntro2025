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

router.post('/', async (req, res) => {
    const { usuario_id, libro_id, calificacion, estado } = req.body;

    if (!usuario_id || !libro_id || !estado) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        await usuarioLibroModelo.agregar(usuario_id, libro_id, calificacion, estado);
        res.status(201).json({ message: 'Libro agregado al perfil del usuario' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.put('/', async (req, res) => {
    const { usuario_id, libro_id, calificacion, estado } = req.body;

    if (!usuario_id || !libro_id || !estado) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const relacionActualizada = await usuarioLibroModelo.actualizar(usuario_id, libro_id, calificacion, estado);
        if (!relacionActualizada) {
            return res.status(404).json({ error: 'La relacion no existe' });
        }
        res.status(201).json({ message: 'Libro actualizado en el perfil del usuario' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

module.exports = router;