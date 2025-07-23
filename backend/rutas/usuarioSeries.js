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

module.exports = router;