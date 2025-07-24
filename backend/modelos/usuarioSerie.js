const pool = require('./db');

async function obtenerPorUsuario(usuario_id) {
    try {
        const res = await pool.query(
            `SELECT us.*, s.nombre AS nombre_serie, s.anio, s. director, s.sinopsis, s.imagen, c.nombre AS nombre_categoria
            FROM usuario_serie us
            JOIN series s ON us.serie_id = s.id
            JOIN categorias c ON s.categoria = c.id
            WHERE us.usuario_id = $1`,
            [usuario_id]
        );
        return res.rows;
    } catch (err) {
        console.error('Error al obtener las serie del usuario', err);
        throw err;
    }
}

async function obtenerPorUsuarioYSerie(usuario_id, serie_id) {
    try {
        const res = await pool.query(
            `SELECT us.*, s.nombre AS nombre_serie, s.anio, s.director, s.sinopsis, s.imagen, c.nombre AS nombre_categoria
            FROM usuario_serie us
            JOIN series s ON us.serie_id = s.id
            JOIN categorias c ON s.categoria = c.id
            WHERE us.usuario_id = $1 AND us.serie_id = $2
            `,
            [usuario_id, serie_id]
        );
        return res.rows[0];
    } catch (err) {
        console.error('Error al obtener la serie del usuario', err);
        throw err;
    }
}

async function obtenerPorEstado(usuario_id, estados) {
    try {
        const res = await pool.query(
            `SELECT us.*, s.nombre AS nombre_serie, s.anio, s.director, s.sinopsis, s.imagen, c.nombre AS nombre_categoria
            FROM usuario_serie us
            JOIN series s ON us.serie_id = s.id
            JOIN categorias c ON s.categoria = c.id
            WHERE us.usuario_id = $1 AND us.estado = $2`,
            [usuario_id, estados]
        );
        return res.rows;
    } catch (err) {
        console.error('Error al obtener las series del usuario por estado', err);
        throw err;
    }
}

async function crear(usuario_id, serie_id, calificacion, estado) {
    try {
        const res = await pool.query(
            'INSERT INTO usuario_serie (usuario_id, serie_id, calificacion, estado) VALUES ($1, $2, $3, $4)',
            [usuario_id, serie_id, calificacion, estado]
        );

        return res.rows[0];
    } catch (err) {
        console.error("Error al crear al agregar la serie", err);
        throw err;
    }
}

async function actualizar(usuario_id, serie_id, calificacion, estado) {
    let res;
    if (calificacion) {
        res = await pool.query(
            'UPDATE usuario_serie SET calificacion = $3, estado = $4 WHERE usuario_id = $1 AND serie_id = $2 RETURNING *',
            [usuario_id, serie_id, calificacion, estado]
        );
    } else {
        res = await pool.query(
            'UPDATE usuario_serie SET calificacion = NULL, estado = $3 WHERE usuario_id = $1 AND serie_id = $2 RETURNING *',
            [usuario_id, serie_id, estado]
        );
    }
    return res.rows[0];
}

async function eliminar(usuario_id, serie_id) {
    try {
        const res = await pool.query(
            'DELETE FROM usuario_serie WHERE usuario_id = $1 AND serie_id = $2 RETURNING *',
            [usuario_id, serie_id]
        );

        return res.rows[0];

    } catch (err) {
        console.error('Error al eliminar la serie', err);
        throw err;
    }
}

module.exports = {
    obtenerPorUsuario,
    obtenerPorUsuarioYSerie,
    obtenerPorEstado,
    crear,
    actualizar,
    eliminar
};
