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

async function crear(creador_id, { nombre, anio, autor, sinopsis, imagen, categoria }) {
    try {
        await pool.query(
            'INSERT INTO libros (nombre, anio, autor, sinopsis, imagen, creador_id, categoria) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [nombre, anio, autor, sinopsis, imagen, creador_id, categoria]
        );
    } catch (err) {
        throw err;
    }
}

async function actualizar(id, { nombre, anio, autor, sinopsis, imagen, creador_id, categoria }) {
    try {
        const resultado = await pool.query(
            'UPDATE libros SET nombre = $1 , anio = $2 , autor = $3 , sinopsis = $4 , imagen = $5 , creador_id = $6 , categoria = $7  WHERE id = $8 RETURNING *',
            [nombre, anio, autor, sinopsis, imagen, creador_id, categoria, id]
        );
        return resultado.rows[0];
    } catch (err) {
        throw err;
    }
}

async function eliminarPorId(id) {
    try {
        const resultado = await pool.query(
            'DELETE FROM libros WHERE id = $1 RETURNING *', [id]
        )
        return resultado.rows[0];
    } catch (err) {
        throw err;
    }
}

module.exports = { obtenerPorId, obtenerPorCategoria, obtenerTodos, obtenerPorCreador, crear, actualizar, eliminarPorId };