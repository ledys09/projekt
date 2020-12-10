const Pagina = require('../models/page')
const mongoose = require('mongoose')


//desc      nueva pagina
//route     POST /api/page
//access    Private 
exports.nuevaPagina = (req, res) => {
    try {
        const usuario = req.usuario._id;
        const {
            titulo,
            descripcion,
            bloques
        } = req.body
        let nuevaP = new Pagina({
            titulo,
            descripcion,
            bloques,
            usuario
        })
        nuevaP.save((err, nuevo) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'error db',
                    err
                })
            }
            return res.status(201).json({
                success: true,
                msg: 'Hecho',
                nuevo
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'Error server',
            error
        })
    }
}

//desc      actualizar pagina
//route     PUT /api/page/:idPagina
//access    Private
exports.editarPagina = (req, res) => {
    try {
        const idPagina = req.params.idPagina
        const body = req.body

        Pagina.findByIdAndUpdate(idPagina, body, { new: true }, (err, paginaM) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'error db',
                    err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Modificado',
                paginaM
            })
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'error serve',
            error
        })
    }
}

//desc      eliminar pagina
//route     DELETE  /api/page/:idPagina
//access    Private
exports.eliminarPagina = (req, res) => {
    try {
        const id = req.params.id;

        Pagina.findByIdAndRemove(id, (err, PaginaDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al eliminar',
                    errors: err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Pagina eliminada',
                PaginaDB
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'error server',
            error
        })
    }
}

//desc      obtener paginas por empresa
//route     GET /api/page/:idEmpresa
//access     
exports.paginas = (req, res) => {
    try {
        const idEmpresa = req.params.idEmpresa
        Pagina.find({ usuario: idEmpresa }, (err, data) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'error db',
                    err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'encontradas',
                data
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'error server',
            error
        })
    }
}

//desc      obtener una sola pagina
//route     GET /api/page/pages/:idPagina
//access
exports.pagina = (req, res) => {
    try {
        const idPagina = req.params.idPagina;
        Pagina.findOne({ _id: idPagina }, (err, data) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'error db',
                    err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'obtenida',
                data
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'error server',
            error
        })
    }
}


//desc      nuevo bloque
//route     PUT /api/page/bloque/:idPagina
//access    Private
exports.nuevoBloque = (req, res) => {
    try {
        const idPagina = req.params.idPagina
        const {
            bhtml,
            bcss,
            bjs,
            background,
            grids,
        } = req.body
        Pagina.update({ _id: idPagina }, {
            $push: {
                bloques: {
                    bhtml,
                    bcss,
                    bjs,
                    background,
                    grids,
                }
            }
        }, (err, pageM) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'error db',
                    err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'true',
                pageM
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'error server',
            error
        })
    }
}


//desc      actualizar bloque
//route     PUT /api/page/bloque/:idPagina/:idBloque
//access    Private
exports.editarBloque = (req, res) => {
    try {
        const idPagina = req.params.idPagina
        const idBloque = req.params.idBloque

        const {
            bhtml,
            bcss,
            bjs,
            background,
            grids
        } = req.body

        Pagina.update({ _id: idPagina, 'bloques._id': mongoose.Types.ObjectId(idBloque) }, {
                'bloques.$.bhtml': bhtml,
                'bloques.$.bcss': bcss,
                'bloques.$.bjs': bjs,
                'bloques.$.background': background,
                'bloques.$.grids': grids,
            },
            (err, bloqueM) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        msg: 'error db',
                        err
                    })
                }
                return res.status(200).json({
                    success: true,
                    msg: 'hecho',
                    bloqueM
                })
            })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'error server',
            error
        })
    }
}

//desc      eliminar bloque
//route      PUT /api/page/bloque/delete/:idPagina/:idBloque
//access    Private
exports.eliminarBloque = (req, res) => {
    try {
        const idPagina = req.params.idPagina
        const idBloque = req.params.idBloque

        Pagina.update({ _id: idPagina }, {
                $pull: {
                    bloques: {
                        _id: idBloque
                    }
                }
            },
            (err, data) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        msg: 'error db',
                        err
                    })
                }
                return res.status(200).json({
                    success: true,
                    msg: 'eliminado',
                    data
                })
            })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'error server',
            error
        })
    }
}

//desc      obtener un solo bloque
//route     GET /api/page/bloque/:idPagina/:idBloque
//access    Private
exports.obtenerBloque = async(req, res) => {
    try {
        const idPagina = req.params.idPagina
        const idBloque = req.params.idBloque
        await Pagina.findOne({ _id: idPagina, 'bloques._id': mongoose.Types.ObjectId(idBloque) }, { 'bloques.$': true },
            (err, data) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        msg: 'error db',
                        err
                    })
                }
                return res.status(200).json({
                    success: true,
                    msg: 'Hecho',
                    data
                })
            })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'error server',
            error
        })
    }
}


//desc      obtener bloques por pagina
//route     GET /api/page/bloques/:idPagina
//access    Private
exports.bloques = (req, res) => {
    try {
        const idPagina = req.params.idPagina

        Pagina.findOne({ _id: idPagina }, (err, data) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'error db',
                    err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'hecho',
                data: data.bloques
            })
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'error server',
            error
        })
    }
}