const pool = require('./db');

async function obtenerPorUsuario(usuario_id) {
    try{
        const res = await pool.query(
            `SELECT us.*, s.nombre AS nombre_serie, s.anio, s. director, s.sinopsis, s.imagen, c.nombre AS nombre_categoria
            FROM usuario_serie us
            JOIN series s ON us.serie_id = s.id
            JOIN categorias c ON s.categoria = c.id
            WHERE us.usuario_id = $1`,
            [usuario_id]
        );
        return res.rows;
    } catch(err){
        console.error('Error al obtener las serie del usuario');
        throw err;
    }
}

async function obtenerPorUsuarioYSerie(usuario_id, serie_id) {
    try{
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
    } catch(err){
        console.error('Error al obtener la serie del usuario');
        throw err;
    }
}

async function obtenerPorEstado(usuario_id, estados) {
    try{
        const res = await pool.query(
            `SELECT us.*, s.nombre AS nombre_serie, s.anio, s.director, s.sinopsis, s.imagen, c.nombre AS nombre_categoria
            FROM usuario_serie us
            JOIN series s ON us.serie_id = s.id
            JOIN categorias c ON s.categoria = c.id
            WHERE us.usuario_id = $1 AND us.estado = $2`,
            [usuario_id, estados]
        );
        return res.rows;
    } catch(err){
        console.error('Error al obtener las series del usuario por estado');
        throw err;
    }
}


module.exports = {
    obtenerPorUsuario,
    obtenerPorUsuarioYSerie,
    obtenerPorEstado
};
