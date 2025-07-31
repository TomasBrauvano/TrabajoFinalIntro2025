const express = require('express');
const router = express.Router();
const peliculaModelo = require('../modelos/pelicula');
const usuarioPeliculaModelo = require('../modelos/usuario_pelicula');
const plataformaModelo = require('../modelos/plataforma');
const añoActual = new Date().getFullYear();
function isAlpha(str) {
    return /^[a-zA-Z ]+$/.test(str);
}

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

    if (!Number.isInteger(parseFloat(id))) {
        return res.status(400).json({ error: 'El id tiene que ser un numero entero mayor a 0' });
    }

    try {
        const pelicula = await peliculaModelo.obtenerPorId(id);
        if (!pelicula) {
            return res.status(404).json({ error: 'Pelicula no encontrada' });
        }
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

router.get("/plataformas/:id_plataforma", async (req, res) => {
    const { id_plataforma } = req.params;

    if (!(Number.isInteger(parseFloat(id_plataforma)) && id_plataforma > 0)) {
        return res.status(400).json({ error: 'El id tiene que ser un numero entero mayor a 0' });
    }

    try {
        const peliculas = await peliculaModelo.obtenerPorPlataforma(id_plataforma);
        if (!peliculas) {
            return res.status(404).json({ error: 'No se encotraron peliculas' });
        }
        res.status(200).json(peliculas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.post("/buscar", async (req, res) => {
    const { nombre } = req.body;
    try {
        const peliculas = await peliculaModelo.obtenerPorNombre(nombre);
        if (!peliculas[0]) {
            return res.status(404).json({ error: 'Pelicula no encontrada' });
        }
        res.status(200).json(peliculas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.post("/", async (req, res) => {
    const { nombre, anio, director, sinopsis, imagen, creador_id, categoria, plataforma, calificacion, estado } = req.body;

    if (!nombre || !anio || !director || !sinopsis || !imagen || !creador_id || !categoria || !estado) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    if (!(String(Number(anio)).length === anio.length && Number.isInteger(parseFloat(anio)) && parseInt(anio) >= 1888 && parseInt(anio) <= añoActual)) {
        return res.status(400).json({ error: `El campo año solo puede contener un numero entero del 1888 al ${añoActual}` });
    }

    if (!isAlpha(director)) {
        return res.status(400).json({ error: 'El campo director solo puede contener letras' });
    }

    if (!(categoria >= 1 && categoria <= 8 && Number.isInteger(parseFloat(categoria)))) {
        return res.status(400).json({ error: 'El campo categoria preferida solo puede contener un numero entero del 1 al 8' });
    }

    if (calificacion) {
        if (!(calificacion >= 1 && calificacion <= 5 && Number.isInteger(parseFloat(calificacion)))) {
            return res.status(400).json({ error: 'El campo calificacion solo puede contener un numero entero del 1 al 5' });
        }
    }

    if (!(estado >= 1 && estado <= 3 && Number.isInteger(parseFloat(estado)))) {
        return res.status(400).json({ error: 'El campo estado solo puede contener un numero entero del 1 al 3' });
    }

    if (plataforma) {
        try {
            const existePlataforma = await plataformaModelo.obtenerPorId(plataforma)
            if (!existePlataforma) {
                return res.status(400).json({ error: 'La plataforma no existe' });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'La plataforma no existe' });
        }
    }

    try {
        const pelicula = await peliculaModelo.crear(creador_id, { nombre, anio, director, sinopsis, imagen, categoria, plataforma });
        await usuarioPeliculaModelo.agregar(creador_id, pelicula.id, calificacion, estado);
        res.status(201).json({ mensaje: 'Pelicula creada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, anio, director, sinopsis, imagen, creador_id, categoria, plataforma } = req.body;

    if (!nombre || !anio || !director || !sinopsis || !imagen || !creador_id || !categoria) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    if (!Number.isInteger(parseFloat(id))) {
        return res.status(400).json({ error: 'El id tiene que ser un numero entero mayor a 0' });
    }

    if (!(String(Number(anio)).length === anio.length && Number.isInteger(parseFloat(anio)) && parseInt(anio) >= 1888 && parseInt(anio) <= añoActual)) {
        return res.status(400).json({ error: `El campo año solo puede contener un numero entero del 1888 al ${añoActual}` });
    }

    if (!isAlpha(director)) {
        return res.status(400).json({ error: 'El campo director solo puede contener letras' });
    }

    if (!(categoria >= 1 && categoria <= 8 && Number.isInteger(parseFloat(categoria)))) {
        return res.status(400).json({ error: 'El campo categoria preferida solo puede contener un numero entero del 1 al 8' });
    }

    if (plataforma) {
        try {
            const existePlataforma = await plataformaModelo.obtenerPorId(plataforma)
            if (!existePlataforma) {
                return res.status(400).json({ error: 'La plataforma no existe' });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'La plataforma no existe' });
        }
    }

    try {
        const pelicula = await peliculaModelo.obtenerPorId(id);
        if (!pelicula) {
            return res.status(404).json({ error: 'Pelicula no encontrada' });
        }
        await peliculaModelo.actualizar(id, { nombre, anio, director, sinopsis, imagen, creador_id, categoria, plataforma });
        res.status(201).json({ mensaje: 'Pelicula actualizada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const pelicula = await peliculaModelo.obtenerPorId(id);
        if (!pelicula) {
            return res.status(404).json({ error: 'Pelicula no encontrada' });
        }
        await peliculaModelo.eliminarPorId(id);
        res.status(200).json({ mensaje: 'Pelicula eliminada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

module.exports = router