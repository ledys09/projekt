const Usuario = require('../models/user');
const Upload = require('../models/upload')
const fs = require('fs');
const pathD = require('path');
const _ = require('underscore');




//@desc     Actualizar foto de perfil
//@route    PUT /api/upload/img-perfil/:tipo/:id
//@access   Private (auth)
exports.imgPerfil = async(req, res) => {
    try {
        const tipoUser = req.params.tipo;
        const _id = req.params.id;

        if (!req.files) {
            return res.status(400).json({
                success: false,
                msg: 'No seleccionó imagen',
                error: { message: 'Debe seleccionar una imagen' }
            })
        }

        const archivoSubir = req.files.archivoSubir
        const nombreDividido = archivoSubir.name.split('.');
        const extension = nombreDividido[nombreDividido.length - 1]
        const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

        if (!extensionesValidas.includes(extension)) {
            return res.status(400).json({
                success: false,
                error: { msg: 'Extensión no válida' }
            })
        }

        const nombreArchivo = `${_id }-${ new Date().getMilliseconds() }.${ extension }`;
        const path = `./uploads/imgProfile/${tipoUser}/${nombreArchivo}`;
        archivoSubir.mv(path, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'No se movió la imagen',
                    err
                })
            }
        });
        // asignar foto a un usuario
        await Usuario.findById(_id, (err, usuario) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'No se encontró usuario',
                    err
                })
            }

            const pathBefore = `./uploads/imgProfile/${tipoUser}/${usuario.foto}`
            if (fs.existsSync(pathBefore)) {
                fs.unlinkSync(pathBefore);
            }
            usuario.foto = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        msg: 'No se actulizó foto del usuario',
                        err
                    })
                }
                return res.status(200).json({
                    success: true,
                    msg: 'Se actualizó foto del usuario',
                    data: usuarioActualizado
                });
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error interno del servidor',
            error
        });
    }
};

//@desc     Subir archivos empresa
//@route    POST /api/upload/files/:id
//@access   Private (enterprise_role)
exports.filesUser = async(req, res) => {
    try {
        // console.log(req.files)
        //const usuario = req.usuario;
        const idEmpresa = req.params.id;

        if (!req.files) {
            return res.status(400).json({
                success: false,
                msg: 'No seleccionó  archivo',
                error: { message: 'Debe seleccionar un archivo' }
            })
        }
        //console.log(req.files)
        const archivoSubir = req.files.archivoSubir
        const tipoDividido = archivoSubir.mimetype.split('/');
        const tipoArchivo = tipoDividido[0]
        const nombreDividido = archivoSubir.name.split('.');
        const extension = nombreDividido[nombreDividido.length - 1]
        const nombreArchivo = `${ idEmpresa }-${ new Date().getMilliseconds() }.${ extension }`;
        fs.mkdir(pathD.join(__dirname, `../uploads/filesEnterprise/${idEmpresa}`), { recursive: true }, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'No se creó el directorio',
                    err
                })
            }
        });
        const path = pathD.resolve(__dirname, `../uploads/filesEnterprise/${idEmpresa}/${nombreArchivo}`);
        archivoSubir.mv(path, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'No se movió la imagen',
                    err
                })
            }
        });
        let tipoDB = '';
        if (tipoArchivo != 'image' && tipoArchivo != 'video') {
            tipoDB = 'others';
        } else {
            tipoDB = tipoArchivo;
        }
        //console.log(imagePath)
        let newFile = new Upload({
            nombreArchivo,
            tipo: tipoDB,
            url: path,
            extension: extension,
            usuario: idEmpresa
        })
        await newFile.save(err => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al guardar archivo',
                    err
                })
            }
            return res.status(201).json({
                success: true,
                msg: 'Archivo guardado',
                data: newFile
            });
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'Error interno del servidor',
            error
        })
    }
};

//@desc     Obtener los archivos por tipo
//@route    GET /api/upload/:id/:tipo
//@access   Private(enteprise_role)
exports.files = async(req, res) => {
    try {
        const tipo = req.params.tipo
        const id = req.params.id;

        await Upload.find({ tipo: tipo, usuario: id }, (err, fileDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error en la base de datos',
                    err
                })
            }
            if (fileDB == '') {
                return res.status(404).json({
                    success: false,
                    msg: 'No hay archivos de este tipo',
                    err
                })
            }

            /* fileDB.forEach((element, i) => {
                // console.log(element.url)
                const pathImg = pathD.resolve(__dirname, `.${element.url}`);
                //  const pathImg = element.url;
                if (fs.existsSync(pathImg)) {
                    console.log(pathImg, i);
                    res.sendFile(pathImg);
                } else {
                    console.log('error')
                }
            }); */
            const total = fileDB.length;

            return res.status(200).json({
                success: true,
                msg: 'Archivos',
                fileDB,
                total
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'Error interno del servidor',
            error
        })
    }
};

//@desc     Obtener archivo de empresa
//@route    GET /api/upload/get/:id/:archivo
//@access   Private(enteprise_role)
exports.getFiles = (req, res) => {
    try {
        const archivo = req.params.archivo
        const id = req.params.id;

        const pathImg = pathD.resolve(__dirname, `../uploads/filesEnterprise/${id}/${archivo}`);
        if (fs.existsSync(pathImg)) {

            res.sendFile(pathImg);
        } else {
            console.log(pathImg)
            const pathNoImg = pathD.resolve(__dirname, '../uploads/imgProfile/no-img.png');
            res.sendFile(pathNoImg);
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'Error interno del servidor',
            error
        })
    }
}

//@desc     Actualizar un archivo
//@route    PUT /api/upload/:id
//@access   Private(enterprise_role)
exports.updateFile = async(req, res) => {
    try {
        const id = req.params.id;
        const body = _.pick(req.body, ['nombreArchivo']);
        Upload.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, fileDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al actualizar',
                    errors: err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Archivo Actualizado',
                fileDB
            })
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'Error en el servidor',
            error
        })
    }
};

//@desc     Eliminar un archivo
//@route    DELETE /api/upload/:id
//@access   Private(enterprise_role)
exports.deleteFile = async(req, res) => {
    try {
        const id = req.params.id;

        Upload.findByIdAndRemove(id, (err, fileDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al eliminar',
                    errors: err
                })
            }
            const pathBefore = fileDB.url;
            if (fs.existsSync(pathBefore)) {
                fs.unlinkSync(pathBefore);
            }
            return res.status(200).json({
                success: true,
                msg: 'Archivo eliminado',
                fileDB
            })
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error en el servidor',
            error
        })
    }
}


//@desc     Obtener la img de perfil
//@route    GET /api/upload/perfil/:tipo/:img
//@access   Private(auth)
exports.img = async(req, res) => {
    try {
        const img = req.params.img
        const tipoUser = req.params.tipo;

        const pathImg = pathD.resolve(__dirname, `../uploads/imgProfile/${tipoUser}/${img}`);
        if (fs.existsSync(pathImg)) {
            res.sendFile(pathImg);
        } else {
            const pathNoImg = pathD.resolve(__dirname, '../uploads/imgProfile/no-img.png');
            res.sendFile(pathNoImg);
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'Error interno del servidor',
            error
        })
    }
};