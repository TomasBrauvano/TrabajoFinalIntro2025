const pool = require('./db');

async function obtenerPorNombreUsuario(nombre_usuario) {
    const res = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = $1', [nombre_usuario]);
    return res.rows[0];
}

async function obtenerPorId(id) {
    const res = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return res.rows[0];
}

async function crear({ nombre_usuario, nombre, apellido, contraseña, categoria_preferida }) {
    try {
        await pool.query(
            'INSERT INTO usuarios (nombre_usuario, nombre, apellido, contrasenia, categoria_preferida) VALUES ($1, $2, $3, $4, $5)',
            [nombre_usuario, nombre, apellido, contraseña, categoria_preferida]
        );
    } catch (err) {
        throw err;
    }
}

async function actualizar(id, { nombre_usuario, nombre, apellido, contraseña, categoria_preferida }) {
    try {
        const resultado = await pool.query(
            'UPDATE usuarios SET nombre_usuario = $1 , nombre = $2 , apellido = $3 , contrasenia = $4 , categoria_preferida = $5 WHERE id = $6 RETURNING *',
            [nombre_usuario, nombre, apellido, contraseña, categoria_preferida, id]
        );
        return resultado.rows[0];
    } catch (err) {
        throw err;
    }
}

async function eliminarPorId(id) {
    try {
        const resultado = await pool.query(
            'DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]
        )
        return resultado.rows[0];
    } catch (err) {
        throw err;
    }
}


module.exports = { obtenerPorNombreUsuario, obtenerPorId, crear, actualizar, eliminarPorId };