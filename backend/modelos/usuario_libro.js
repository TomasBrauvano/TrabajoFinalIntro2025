const pool = require('./db');

async function obtenerLibrosPorIdUsuario(usuario_id) {
    const res = await pool.query(
        'SELECT l.* , ul.calificacion , ul.estado FROM usuario_libro ul JOIN libros l ON ul.libro_id = l.id WHERE ul.usuario_id = $1',
        [usuario_id]);
    return res.rows;
}

async function agregar(usuario_id, libro_id, calificacion, estado) {
    let res;
    if (calificacion) {
        res = await pool.query(
            'INSERT INTO usuario_libro (usuario_id, libro_id, calificacion, estado) VALUES ($1,$2,$3,$4) RETURNING *',
            [usuario_id, libro_id, calificacion, estado]);
    } else {
        res = await pool.query(
            'INSERT INTO usuario_libro (usuario_id, libro_id, estado) VALUES ($1,$2,$3) RETURNING *',
            [usuario_id, libro_id, estado]);
    }
    return res.rows[0];
}

async function actualizar(usuario_id, libro_id, calificacion, estado) {
    let res;
    if (calificacion) {
        res = await pool.query(
            'UPDATE usuario_libro SET calificacion = $3 , estado = $4 WHERE usuario_id = $1 AND libro_id = $2 RETURNING *',
            [usuario_id, libro_id, calificacion, estado]);
    } else {
        res = await pool.query(
            'UPDATE usuario_libro SET calificacion = NULL , estado = $3 WHERE usuario_id = $1 AND libro_id = $2 RETURNING *',
            [usuario_id, libro_id, estado]);
    }
    return res.rows[0];
}

async function eliminar(usuario_id, libro_id) {
    const res = await pool.query(
        'DELETE FROM usuario_libro WHERE usuario_id = $1 AND libro_id = $2 RETURNING *',
        [usuario_id, libro_id]);
    return res.rows[0];
}

module.exports = { obtenerLibrosPorIdUsuario, agregar, actualizar, eliminar };