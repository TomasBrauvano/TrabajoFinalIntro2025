const pool = require('./db');

//Funciones para tabla (series)

async function obtenerPorId(id) {
    try{
        const res = await pool.query(
            'SELECT s.*, c.nombre AS nombre_categoria FROM series s JOIN categorias c ON s.categoria = c.id WHERE s.id = $1',[id]
        );
        return res.rows[0];
    } catch (err){
        console.error('Error al obtener por ID (Series)', err);
        throw err;
    }
}

async function obtenerPorCreador(creador_id) {
    try{
        const res = await pool.query('SELECT * FROM series WHERE creador_id = $1', [creador_id]);
        return res.rows;
    } catch (err){
        console.error('Error al obtener serie por creador', err);
        throw err;
    }
}

async function obtenerTodas() {
    try{
        const res = await pool.query(
            'SELECT s.*, c.nombre AS nombre_categoria FROM series s JOIN categorias c ON s.categoria = c.id'
        );
        return res.rows;
    } catch (err){
        console.error('Error al obtener todas las series', err);
        throw err;
    }
}

async function obtenerTodasPorCategoria(id_categoria) {
    try{
        const res = await pool.query(
            'SELECT s.*, c.nombre AS nombre_categoria FROM series s JOIN categorias c ON s.categoria = c.id WHERE s.categoria = $1',[id_categoria]
        );
        return res.rows;
    } catch (err){
        console.error('Error al obtener todas por categoria', err);
        throw err;
    }
}

async function crear(creador_id,{nombre, anio, director, sinopsis, categoria, imagen}) {
    try{
        const res = await pool.query(
            'INSERT into series (nombre, anio, director, sinopsis, imagen, creador_id, categoria) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [nombre, anio, director, sinopsis, imagen, creador_id, categoria]
        ); 
        return res.rows[0];
    } catch (err){
        console.error("Error al crear series", err);
        throw err;
    }
}

async function actualizar(id,{nombre, anio, director, sinopsis, imagen, creador_id, categoria}) {
    try{
       const res =  await pool.query(
            'UPDATE series SET nombre = $1, anio = $2, director = $3, sinopsis = $4, imagen = $5, creador_id = $6, categoria = $7 WHERE id = $8 RETURNING *',
            [nombre, anio, director, sinopsis, imagen, creador_id, categoria, id]
        );
        return res.rows[0];
    } catch (err){
        console.error('Error al actualizar series', err);
        throw err;
    }
}

async function eliminarPorId(id) {
    try{
        const res = await pool.query(
            'DELETE FROM series WHERE id = $1 RETURNING *', [id]
        );
        return res.rows[0];
    } catch (err){
        console.error('Error al eliminar por Id', err); 
        throw err;
    }
}

module.exports = {
    obtenerPorId,
    obtenerPorCreador,
    obtenerTodas,
    obtenerTodasPorCategoria,
    crear,
    actualizar,
    eliminarPorId
};