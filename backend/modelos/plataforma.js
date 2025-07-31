const pool = require('./db');

async function obtenerTodas() {
    const res = await pool.query('SELECT * FROM plataformas');
    return res.rows;
}

async function obtenerPorId(id) {
    const res = await pool.query('SELECT * FROM plataformas WHERE id = $1', [id]);
    return res.rows[0];
}

async function obtenerPorDisponibilidad() {
    const res = await pool.query('SELECT * FROM plataformas WHERE disponible_en_argentina = true');
    return res.rows;
}

async function crear(creador_id, { nombre, logo_url, costo_mensual, pagina_url, ceo, disponible_en_argentina }) {
    try {
        const res = await pool.query('INSERT INTO plataformas (nombre, logo_url, costo_mensual, pagina_url, ceo, disponible_en_argentina, creador_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [nombre, logo_url, costo_mensual, pagina_url, ceo, disponible_en_argentina, creador_id]);
        return res.rows[0];
    } catch (err) {
        throw err;
    }
}

async function actualizar(id, { nombre, logo_url, costo_mensual, pagina_url, ceo, disponible_en_argentina, creador_id }) {
    try {
        const res = await pool.query('UPDATE plataformas SET nombre = $1, logo_url = $2, costo_mensual = $3, pagina_url = $4, ceo = $5, disponible_en_argentina = $6, creador_id = $7 WHERE id = $8',
            [nombre, logo_url, costo_mensual, pagina_url, ceo, disponible_en_argentina, creador_id, id]);
        return res.rows[0];
    } catch (err) {
        throw err;
    }
}

async function eliminarPorId(id) {
    try {
        const resultado = await pool.query(
            'DELETE FROM plataformas WHERE id = $1 RETURNING *', [id]
        )
        return resultado.rows[0];
    } catch (err) {
        throw err;
    }
}

async function obtenerPorCreador(creador_id) {
    const res = await pool.query('SELECT * FROM plataformas WHERE creador_id = $1', [creador_id]);
    return res.rows;
}

module.exports = { obtenerPorId, obtenerPorDisponibilidad, obtenerTodas, crear, actualizar, eliminarPorId, obtenerPorCreador };