const pool = require('./db');

async function obtenerPorNombreUsuario(nombre_usuario) {
    const res = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = $1', [nombre_usuario]);
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


module.exports = { obtenerPorNombreUsuario, crear };