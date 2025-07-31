const express = require('express');
const router = express.Router();
const peliculaPlataformaModelo = require('../modelos/pelicula_plataforma');

router.get('/:plataforma_id', async (req, res) => {
    const { plataforma_id } = req.params;

    try {
        const peliculas = await peliculaPlataformaModelo.obtenerPeliculasPorIdPlataforma(plataforma_id);
        if (!peliculas) {
            return res.status(404).json({ error: 'La plataforma no existe' });
        }
        res.status(200).json(peliculas);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.post('/', async (req, res) => {
    const { pelicula_id, plataforma_id, calif_general } = req.body;

    if (!pelicula_id || !plataforma_id) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        await peliculaPlataformaModelo.agregar(pelicula_id, plataforma_id, calif_general);
        res.status(201).json({ message: 'Pelicula agregada a la plataforma seleccionada' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.put('/', async (req, res) => {
    const { pelicula_id, plataforma_id, calif_general } = req.body;

    if (!pelicula_id || !plataforma_id) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    const califGenRegex = /^(10|[0-9])\.[0-9]{2}$/;

    if (!califGenRegex.test(calif_general)) {
        return res.status(400).json({ error: 'Calificacion general en formato inválido'})
    }

    try {
        const relacionActualizada = await peliculaPlataformaModelo.actualizar(pelicula_id, plataforma_id, calif_general);
        if (!relacionActualizada) {
            return res.status(404).json({ error: 'La relacion no existe' });
        }
        res.status(201).json({ message: 'Pelicula actualizada en la plataforma seleccionada' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.delete('/', async (req, res) => {
    const { pelicula_id, plataforma_id } = req.body;

    if (!pelicula_id || !plataforma_id) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const relacionEliminada = await peliculaPlataformaModelo.eliminar(pelicula_id, plataforma_id);
        if (!relacionEliminada) {
            return res.status(404).json({ error: 'La relacion no existe' });
        }
        res.status(201).json({ message: 'Pelicula eliminada de la plataforma seleccionada' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

module.exports = router;