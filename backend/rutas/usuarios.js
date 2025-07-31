const express = require('express');
const router = express.Router();
const usuarioModelo = require('../modelos/usuario');
function isAlpha(str) {
    return /^[a-zA-Z]*$/.test(str);
}

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await usuarioModelo.obtenerPorId(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        return res.status(200).json(usuario);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.post('/register', async (req, res) => {
    const { nombre_usuario, nombre, apellido, contrasenia, categoria_preferida } = req.body;

    if (!nombre_usuario || !nombre || !apellido || !contrasenia || !categoria_preferida) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    if (!isAlpha(nombre)) {
        return res.status(400).json({ error: 'El campo nombre solo puede contener letras' });
    }
    if (!isAlpha(apellido)) {
        return res.status(400).json({ error: 'El campo apellido solo puede contener letras' });
    }
    if (!(categoria_preferida >= 1 && categoria_preferida <= 8 && Number.isInteger(parseFloat(categoria_preferida)))) {
        return res.status(400).json({ error: 'El campo categoria preferida solo puede contener un numero entero del 1 al 8' });
    }

    try {
        const usuario = await usuarioModelo.obtenerPorNombreUsuario(nombre_usuario);
        if (usuario) {
            return res.status(409).json({ error: 'El nombre de usuario ya esta en uso' });
        }
        await usuarioModelo.crear({ nombre_usuario, nombre, apellido, contrasenia, categoria_preferida });
        res.status(201).json({ mensaje: 'Usuario creado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, nombre, apellido, contrasenia, categoria_preferida } = req.body;

    if (!nombre_usuario || !nombre || !apellido || !contrasenia || !categoria_preferida) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    if (!isAlpha(nombre)) {
        return res.status(400).json({ error: 'El campo nombre solo puede contener letras' });
    }
    if (!isAlpha(apellido)) {
        return res.status(400).json({ error: 'El campo apellido solo puede contener letras' });
    }
    if (!(categoria_preferida >= 1 && categoria_preferida <= 8 && Number.isInteger(parseFloat(categoria_preferida)))) {
        return res.status(400).json({ error: 'El campo categoria preferida solo puede contener un numero entero del 1 al 8' });
    }

    try {
        const usuario = await usuarioModelo.obtenerPorId(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        await usuarioModelo.actualizar(id, { nombre_usuario, nombre, apellido, contrasenia, categoria_preferida });
        res.status(201).json({ mensaje: 'Usuario actualizado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }

})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await usuarioModelo.obtenerPorId(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        await usuarioModelo.eliminarPorId(id);
        res.status(200).json({ mensaje: 'Usuario eliminado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})

router.post("/login", async (req, res) => {
    const { nombre_usuario, contrasenia } = req.body;

    try {
        const usuario = await usuarioModelo.obtenerPorNombreUsuario(nombre_usuario);
        if (!usuario) {
            return res.status(404).json({ error: 'El nombre de usuario no existe' });
        }
        if (usuario.contrasenia === contrasenia) {
            res.status(200).json({ mensaje: 'Usuario logeado', id: usuario.id });
        } else {
            res.status(401).json({ error: 'La contraseña no coincide' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }

})

module.exports = router;