const pool = require('./db');

async function obtenerNombrePorId(id) {
    const res = await pool.query(`SELECT nombre FROM estados WHERE id = $1`, [id]);
    return res.rows[0];
}

module.exports = { obtenerNombrePorId };