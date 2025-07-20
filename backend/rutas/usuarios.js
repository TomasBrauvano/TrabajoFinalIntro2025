const express = require('express');
const router = express.Router();
const usuarioModelo = require('../modelos/usuario');

router.post('/registro', async (req, res) => {
    const { nombre_usuario, nombre, apellido, contraseña, categoria_preferida } = req.body;

    if (!nombre_usuario || !nombre || !apellido || !contraseña || !categoria_preferida) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const usuario = await usuarioModelo.obtenerPorNombreUsuario(nombre_usuario);
        if (usuario) {
            return res.status(409).json({ error: 'El nombre de usuario ya esta en uso' });
        }

        await usuarioModelo.crear({ nombre_usuario, nombre, apellido, contraseña, categoria_preferida });
        res.status(201).json({ mensaje: 'Usuario creado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, nombre, apellido, contraseña, categoria_preferida } = req.body;

    if (!nombre_usuario || !nombre || !apellido || !contraseña || !categoria_preferida) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    try {
        const usuarioActualizado = await usuarioModelo.actualizar(id, { nombre_usuario, nombre, apellido, contraseña, categoria_preferida });
        if (usuarioActualizado) {
            res.status(201).json({ mensaje: 'Usuario actualizado' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }

})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const usuarioEliminado = await usuarioModelo.eliminarPorId(id);
        if (usuarioEliminado) {
            res.status(200).json({ mensaje: 'Usuario eliminado' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.post("/login", async (req, res) => {
    const { nombre_usuario, contraseña } = req.body;

    try {
        const usuario = await usuarioModelo.obtenerPorNombreUsuario(nombre_usuario);
        if (!usuario) {
            return res.status(404).json({ error: 'El nombre de usuario no existe' });
        }
        if (usuario.contrasenia === contraseña) {
            res.status(200).json({ mensaje: 'Usuario logeado' });
        } else {
            res.status(401).json({ mensaje: 'La contraseña no coincide' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }

})

module.exports = router;