const express = require('express');
const router = express.Router();
const usuarioSerieModelo = require('../modelos/usuarioSerie');

//GET

router.get("/:usuario_id/estados/:estado", async (req, res) => {
    const {usuario_id, estado} = req.params;

    try{
        const seriePorEstado = await usuarioSerieModelo.obtenerPorEstado(usuario_id, estado);
        res.status(200).json(seriePorEstado);
    } catch(err){
        console.error(err);
        res.status(500).json({error: "Error al obtener las series por estado"});
    }
});

router.get("/:usuario_id/:serie_id", async (req, res) => {
    const {usuario_id, serie_id} = req.params;

    try{
        const serieUsuario = await usuarioSerieModelo.obtenerPorUsuarioYSerie(usuario_id, serie_id);
        res.status(200).json(serieUsuario);
    } catch(err){
        console.error(err);
        res.status(500).json({error: "Error al obtener serie del usuario"});
    }
});

router.get("/:usuario_id", async (req, res) =>{
    const {usuario_id} = req.params;

    try{
        const seriesDelUsuario = await usuarioSerieModelo.obtenerPorUsuario(usuario_id);
        return res.status(200).json(seriesDelUsuario);
    } catch(err){
        console.error(err);
        res.status(500).json({error: "Error al obtener las series del usuario"});
    }
});

//POST

router.post("/", async (req,res) => {
    const {usuario_id, serie_id, calificacion, estado} = req.body;

    if(!usuario_id || !serie_id || !calificacion || !estado){
        return res.status(400).json({error: 'Faltan campos'});
    }

    try{
        const serieExistente = await usuarioSerieModelo.obtenerPorUsuarioYSerie(usuario_id, serie_id);
        
        if(serieExistente){
            return res.status(409).json({error: 'Esta serie ya esta agregada'});
        }

        const serieUsuarioNueva = await usuarioSerieModelo.crear(usuario_id, serie_id, calificacion, estado);
        res.status(201).json(serieUsuarioNueva);

    } catch(err){
        console.error(err);
        res.status(500).json({error: 'Error al agregar una serie nueva'});
    }
})

//PUT

router.put("/:usuario_id/:serie_id", async (req, res) => {
    const {usuario_id, serie_id} = req.params;
    const {calificacion, estado} = req.body;

    if(!calificacion && !estado){
        res.status(400).json({error: 'Falta agregar la calificacion o estado'});
    }

    try{
        const serieActualizada = await usuarioSerieModelo.actualizar(usuario_id, serie_id, calificacion, estado);

        if(!serieActualizada){
            res.status(404).json({error: 'No se encontro la serie para actualizar'});
        }

        res.status(200).json(serieActualizada);

    } catch(err){
        console.error(err);
        res.status(500).json({error: 'Error al actualizar la serie'});
    }
});

//DELETE

router.delete("/:usuario_id/:serie_id", async (req, res) => {
    const {usuario_id, serie_id} = req.params;

    try{
        const serieEliminada = await usuarioSerieModelo.eliminar(usuario_id, serie_id);

        if(!serieEliminada){
            res.status(404).json({error: 'No se encontro la serie a eliminar'});
        }

        res.status(200).json({mesaje: 'Serie eliminada exitosamente'});

    } catch(err){
        console.error(err);
        res.status(500).json({error: 'Error al eliminar la serie'});
    }
});

module.exports = router;