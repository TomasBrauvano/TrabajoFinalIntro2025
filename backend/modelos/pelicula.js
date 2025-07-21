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

async function crear({ nombre, anio, director, sinopsis, imagen, categoria }) {
    try {
        await pool.query(
            'INSERT INTO peliculas (nombre, anio, director, sinopsis, imagen, categoria) VALUES ($1, $2, $3, $4, $5, $6)',
            [nombre, anio, director, sinopsis, imagen, categoria]
        );
    } catch (err) {
        throw err;
    }
}

module.exports = { obtenerPorId, obtenerPorCategoria, obtenerTodas, crear };