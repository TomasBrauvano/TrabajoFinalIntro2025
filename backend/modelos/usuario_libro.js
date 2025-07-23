const pool = require('./db');

async function obtenerLibrosPorIdUsuario(usuario_id) {
    const res = await pool.query(
        'SELECT l.* , ul.calificacion , ul.estado FROM usuario_libro ul JOIN libros l ON ul.libro_id = l.id WHERE ul.usuario_id = $1',
        [usuario_id]);
    return res.rows;
}

module.exports = { obtenerLibrosPorIdUsuario };