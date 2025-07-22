const pool = require('./db');

async function obtenerPorId(id) {
    const res = await pool.query(`SELECT * FROM libros WHERE id = $1`, [id]);
    return res.rows[0];
}

async function obtenerPorCategoria(id_categoria) {
    const res = await pool.query(`SELECT * FROM libros WHERE categoria = $1`, [id_categoria]);
    return res.rows;
}

async function obtenerPorCreador(creador_id) {
    const res = await pool.query('SELECT * FROM libros WHERE creador_id = $1', [creador_id]);
    return res.rows;
}

async function obtenerTodos() {
    const res = await pool.query('SELECT * FROM libros');
    return res.rows;
}

module.exports = { obtenerPorId, obtenerPorCategoria, obtenerTodos, obtenerPorCreador };