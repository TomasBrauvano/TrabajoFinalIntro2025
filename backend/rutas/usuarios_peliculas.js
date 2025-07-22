const express = require('express');
const router = express.Router();
const usuarioPeliculaModelo = require('../modelos/usuario_pelicula');

router.get('/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const peliculas = await usuarioPeliculaModelo.obtenerPeliculasPorIdUsuario(usuario_id);
        if (!peliculas) {
            return res.status(404).json({ error: 'El usuario no existe' });
        }
        res.status(200).json(peliculas);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.post('/', async (req, res) => {
    const { usuario_id, pelicula_id, calificacion, estado } = req.body;

    if (!usuario_id || !pelicula_id || !estado) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        await usuarioPeliculaModelo.agregar(usuario_id, pelicula_id, calificacion, estado);
        res.status(201).json({ message: 'Pelicula agregada al perfil del usuario' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.put('/', async (req, res) => {
    const { usuario_id, pelicula_id, calificacion, estado } = req.body;

    if (!usuario_id || !pelicula_id || !estado) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const relacionActualizada = await usuarioPeliculaModelo.actualizar(usuario_id, pelicula_id, calificacion, estado);
        if (!relacionActualizada) {
            return res.status(404).json({ error: 'La relacion no existe' });
        }
        res.status(201).json({ message: 'Pelicula actualizada en el perfil del usuario' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.delete('/', async (req, res) => {
    const { usuario_id, pelicula_id } = req.body;

    if (!usuario_id || !pelicula_id) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const relacionEliminada = await usuarioPeliculaModelo.eliminar(usuario_id, pelicula_id);
        if (!relacionEliminada) {
            return res.status(404).json({ error: 'La relacion no existe' });
        }
        res.status(201).json({ message: 'Pelicula eliminada del perfil del usuario' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

module.exports = router;