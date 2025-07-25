const pool = require('./db');

async function obtenerPorId(id) {
    const res = await pool.query(`SELECT * FROM peliculas WHERE id = $1`, [id]);
    return res.rows[0];
}

async function obtenerPorCategoria(categoria) {
    const res = await pool.query(`SELECT * FROM peliculas WHERE categoria = $1`, [categoria]);
    return res.rows;
}

async function obtenerPorCreador(creador_id) {
    const res = await pool.query('SELECT * FROM peliculas WHERE creador_id = $1', [creador_id]);
    return res.rows;
}

async function obtenerTodas() {
    const res = await pool.query('SELECT * FROM peliculas');
    return res.rows;
}

async function crear(creador_id, { nombre, anio, director, sinopsis, imagen, categoria }) {
    const res = await pool.query(
        'INSERT INTO peliculas (nombre, anio, director, sinopsis, imagen, creador_id, categoria) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [nombre, anio, director, sinopsis, imagen, creador_id, categoria]
    );
    return res.rows[0];
}

async function actualizar(id, { nombre, anio, director, sinopsis, imagen, creador_id, categoria }) {
    const resultado = await pool.query(
        'UPDATE peliculas SET nombre = $1 , anio = $2 , director = $3 , sinopsis = $4 , imagen = $5 , creador_id = $6 , categoria = $7  WHERE id = $8 RETURNING *',
        [nombre, anio, director, sinopsis, imagen, creador_id, categoria, id]
    );
    return resultado.rows[0];
}

async function eliminarPorId(id) {
    const resultado = await pool.query(
        'DELETE FROM peliculas WHERE id = $1 RETURNING *', [id]
    )
    return resultado.rows[0];
}

async function obtenerRecomendaciones(usuario_id) {
    const resultado = await pool.query(
        'SELECT p.* FROM peliculas p JOIN usuarios u ON p.categoria = u.categoria_preferida WHERE u.id = $1 AND p.id NOT IN ( SELECT pelicula_id FROM usuario_pelicula WHERE usuario_id = $1 );',
        [usuario_id]
    );
    return resultado.rows;
}

async function obtenerPorNombre(nombre) {
    const res = await pool.query('SELECT * FROM peliculas WHERE LOWER(nombre) = $1', [nombre]);
    return res.rows;
}

module.exports = { obtenerPorId, obtenerPorCategoria, obtenerTodas, crear, actualizar, eliminarPorId, obtenerPorCreador, obtenerRecomendaciones, obtenerPorNombre };