const pool = require('./db');

async function obtenerPeliculasPorIdUsuario(usuario_id) {
    const res = await pool.query(
        'SELECT p.* , up.calificacion , up.estado FROM usuario_pelicula up JOIN peliculas p ON up.pelicula_id = p.id WHERE up.usuario_id = $1',
        [usuario_id]);
    return res.rows;
}

module.exports = { obtenerPeliculasPorIdUsuario };