const express = require('express');
const router = express.Router();
const plataformaModelo = require('../modelos/plataforma');
const peliculaPlataformaModelo = require('../modelos/pelicula_plataforma');
function isAlpha(str) {
    return /^[a-zA-Z ]+$/.test(str);
}

router.get("/", async (req, res) => {
    try {
        const plataformas = await plataformaModelo.obtenerTodas();
        res.status(200).json(plataformas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const plataformas = await plataformaModelo.obtenerPorId(id);
        res.status(200).json(plataformas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.get("/creadores/:creador_id", async (req, res) => {
    const { creador_id } = req.params;
    try {
        const plataformas = await plataformaModelo.obtenerPorCreador(creador_id);
        res.status(200).json(plataformas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.get("/disponibilidad", async (req, res) => {
    try {
        const plataformas = await plataformaModelo.obtenerPorDisponibilidad();
        res.status(200).json(plataformas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.post("/", async (req, res) => {
    const { nombre, logo_url, costo_mensual, pagina_url, ceo, disponible_en_argentina, creador_id } = req.body;

    if (!nombre || !logo_url || !costo_mensual || !pagina_url || !ceo || !disponible_en_argentina || !creador_id) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    if (costo_mensual < 0) {
        return res.status(400).json({ error: 'El costo mensual no puede ser negativo' });
    }
    const costoRegex = /^[0-9]{1,10}\.[0-9]{1,2}$/;

    if (!costoRegex.test(costo_mensual)) {
        return res.status(400).json({ error: 'El formato de costo mensual es inválido' })
    }

    if (!isAlpha(ceo)) {
        return res.status(400).json({ error: 'El CEO solo puede contener letras' })
    }

    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/

    if (!urlRegex.test(logo_url) || !urlRegex.test(pagina_url)) {
        return res.status(400).json({ error: 'el formato de la url es inválido' })
    }

    if (!(disponible_en_argentina === "true") && !(disponible_en_argentina === "false")) {
        return res.status(400).json({ error: 'Disponible en Argentina si o no?' });
    }

    try {
        await plataformaModelo.crear(creador_id, { nombre, logo_url, costo_mensual, pagina_url, ceo, disponible_en_argentina });
        res.status(201).json({ mensaje: 'Plataforma creada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, logo_url, costo_mensual, pagina_url, ceo, disponible_en_argentina, creador_id } = req.body;

    if (!nombre || !logo_url || !costo_mensual || !pagina_url || !ceo || !disponible_en_argentina || !creador_id) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    if (costo_mensual < 0) {
        return res.status(400).json({ error: 'El costo mensual no puede ser negativo' });
    }
    const costoRegex = /^[0-9]{1,10}\.[0-9]{2}$/;

    if (!costoRegex.test(costo_mensual)) {
        return res.status(400).json({ error: 'El formato de costo mensual es inválido' })
    }

    if (!isAlpha(ceo)) {
        return res.status(400).json({ error: 'El CEO solo puede contener letras' })
    }

    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/

    if (!urlRegex.test(logo_url) || !urlRegex.test(pagina_url)) {
        return res.status(400).json({ error: 'el formato de la url es inválido' })
    }

    if (!(disponible_en_argentina === "true") && !(disponible_en_argentina === "false")) {
        return res.status(400).json({ error: 'Disponible en Argentina si o no?' });
    }

    try {
        const plataforma = await plataformaModelo.obtenerPorId(id);
        if (!plataforma) {
            return res.status(404).json({ error: 'Plataforma no encontrada' });
        }
        await plataformaModelo.actualizar(id, { nombre, logo_url, costo_mensual, pagina_url, ceo, disponible_en_argentina, creador_id });
        res.status(201).json({ mensaje: 'Plataforma actualizada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const plataforma = await plataformaModelo.obtenerPorId(id);
        if (!plataforma) {
            return res.status(404).json({ error: 'Plataforma no encontrada' });
        }
        await plataformaModelo.eliminarPorId(id);
        res.status(200).json({ mensaje: 'Plataforma eliminada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

module.exports = router;