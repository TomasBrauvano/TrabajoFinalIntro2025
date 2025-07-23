const pool = require('./db');

async function obtenerLibrosPorIdUsuario(usuario_id) {
    const res = await pool.query(
        'SELECT l.* , ul.calificacion , ul.estado FROM usuario_libro ul JOIN libros l ON ul.libro_id = l.id WHERE ul.usuario_id = $1',
        [usuario_id]);
    return res.rows;
}

async function agregar(usuario_id, libro_id, calificacion, estado) {
    const res = await pool.query(
        'INSERT INTO usuario_libro (usuario_id, libro_id, calificacion, estado) VALUES ($1,$2,$3,$4) RETURNING *',
        [usuario_id, libro_id, calificacion, estado]);
    return res.rows[0];
}

module.exports = { obtenerLibrosPorIdUsuario, agregar };