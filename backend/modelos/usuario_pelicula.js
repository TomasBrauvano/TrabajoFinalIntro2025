const pool = require('./db');

async function obtenerPeliculasPorIdUsuario(usuario_id) {
    const res = await pool.query(
        'SELECT p.* , up.calificacion , up.estado FROM usuario_pelicula up JOIN peliculas p ON up.pelicula_id = p.id WHERE up.usuario_id = $1',
        [usuario_id]);
    return res.rows;
}

async function agregar(usuario_id, pelicula_id, calificacion, estado) {
    const res = await pool.query(
        'INSERT INTO usuario_pelicula (usuario_id, pelicula_id, calificacion, estado) VALUES ($1,$2,$3,$4) RETURNING *',
        [usuario_id, pelicula_id, calificacion, estado]);
    return res.rows[0];
}

async function actualizar(usuario_id, pelicula_id, calificacion, estado) {
    const res = await pool.query(
        'UPDATE usuario_pelicula SET calificacion = $3 , estado = $4 WHERE usuario_id = $1 AND pelicula_id = $2 RETURNING *',
        [usuario_id, pelicula_id, calificacion, estado]);
    return res.rows[0];
}

async function eliminar(usuario_id, pelicula_id) {
    const res = await pool.query(
        'DELETE FROM usuario_pelicula WHERE usuario_id = $1 AND pelicula_id = $2 RETURNING *',
        [usuario_id, pelicula_id]);
    return res.rows[0];
}

module.exports = { obtenerPeliculasPorIdUsuario, agregar, actualizar, eliminar };