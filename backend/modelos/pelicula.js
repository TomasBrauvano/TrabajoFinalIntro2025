const pool = require('./db');

async function obtenerPorId(id) {
    const res = await pool.query(`SELECT * FROM peliculas WHERE id = $1`, [id]);
    return res.rows[0];
}

async function obtenerPorCategoria(id_categoria) {
    const res = await pool.query(`SELECT * FROM peliculas WHERE categoria = $1`, [id_categoria]);
    return res.rows;
}

async function obtenerTodas() {
    const res = await pool.query('SELECT * FROM peliculas');
    return res.rows;
}

module.exports = { obtenerPorId, obtenerPorCategoria, obtenerTodas };