const pool = require('./db');

async function obtenerTodas() {
    const res = await pool.query(`SELECT * FROM categorias`);
    return res.rows;
}

module.exports = { obtenerTodas };