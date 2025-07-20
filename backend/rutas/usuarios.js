const express = require('express');
const router = express.Router();
const usuarioModelo = require('../modelos/usuario');

router.post('/registro', async (req, res) => {
    const { nombre_usuario, nombre, apellido, contraseña, categoria_preferida } = req.body;

    if (!nombre_usuario || !nombre || !apellido || !contraseña || !categoria_preferida) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const existe = await usuarioModelo.obtenerPorNombreUsuario(nombre_usuario);
        if (existe) {
            return res.status(409).json({ error: 'El nombre de usuario ya esta en uso' });
        }

        await usuarioModelo.crear({ nombre_usuario, nombre, apellido, contraseña, categoria_preferida });
        res.status(201).json({ mensaje: 'Usuario creado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

module.exports = router;