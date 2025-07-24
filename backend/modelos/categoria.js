const pool = require('./db');

async function obtenerTodas() {
    const res = await pool.query(`SELECT * FROM categorias`);
    return res.rows;
}

async function obtenerPorId(id) {
    const res = await pool.query(`SELECT * FROM categorias WHERE id = $1`, [id]);
    return res.rows[0];
}

module.exports = { obtenerTodas, obtenerPorId };