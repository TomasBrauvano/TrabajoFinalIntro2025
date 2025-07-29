const pool = require('./db');

async function obtenerPeliculasPorIdPlataforma(plataforma_id) {
    const res = await pool.query('SELECT pp.calif_general , p.* FROM pelicula_plataforma pp JOIN peliculas p ON p.id = pp.pelicula_id WHERE plataforma_id = $1', [plataforma_id]);
    return res.rows;
}

async function agregar(pelicula_id, plataforma_id, calif_general) {
    let res;
    if (calif_general) {
        res = await pool.query(
            'INSERT INTO pelicula_plataforma (pelicula_id, plataforma_id, calif_general) VALUES ($1,$2,$3) RETURNING *',
            [pelicula_id, plataforma_id, calif_general]);
        return res.rows[0];
    } else {
        res = await pool.query(
            'INSERT INTO pelicula_plataforma (pelicula_id, plataforma_id) VALUES ($1,$2) RETURNING *',
            [pelicula_id, plataforma_id]);
        return res.rows[0];
    }
}

async function actualizar(pelicula_id, plataforma_id, calif_general) {
    let res;
    if (calif_general) {
        res = await pool.query(
            'UPDATE pelicula_plataforma SET calif_general = $3 WHERE pelicula_id = $1 AND plataforma_id = $2 RETURNING *',
            [pelicula_id, plataforma_id, calif_general]);
    } else {
        res = await pool.query(
            'UPDATE pelicula_plataforma SET calif_general = NULL WHERE pelicula_id = $1 AND plataforma_id = $2 RETURNING *',
            [usuario_id, pelicula_id]);
    }
    return res.rows[0];
}

async function eliminar(pelicula_id, plataforma_id) {
    const res = await pool.query(
        'DELETE FROM pelicula_plataforma WHERE pelicula_id = $1 AND plataforma_id = $2 RETURNING *',
        [pelicula_id, plataforma_id]);
    return res.rows[0];
}

module.exports = { obtenerPeliculasPorIdPlataforma, agregar, actualizar, eliminar };