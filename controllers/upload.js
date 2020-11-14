const Usuario = require('../models/user');
const Upload = require('../models/upload')
const fs = require('fs');
const pathD = require('path');
const _ = require('underscore');




//@desc     Actualizar foto de perfil
//@route    PUT /api/upload/img-perfil
//@access   Private (auth)
exports.imgPerfil = async(req, res) => {
    try {
        let tipoUser = '';
        const usuario = req.usuario;
        if (usuario.role == 'client_role') {
            tipoUser = 'client';
        }
        if (usuario.role == 'enterprise_role') {
            tipoUser = 'enterprise';
        }
        if (usuario.role == 'admin_role') {
            tipoUser = 'admin';
        }
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

        const nombreArchivo = `${ usuario._id }-${new Date().getMonth()}.${extension}`;
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
        await Usuario.findById(usuario._id, (err, usuario) => {
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
//@route    POST /api/upload/files
//@access   Private (enterprise_role)
exports.filesUser = async(req, res) => {
    try {
        const usuario = req.usuario;
        const idEmpresa = usuario._id;

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
        const nombreArchivo = `${ usuario._id }-${ new Date().getMilliseconds() }.${ extension }`;
        fs.mkdir(pathD.join(__dirname, `../uploads/filesEnterprise/${idEmpresa}`), { recursive: true }, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'No se creó el directorio',
                    err
                })
            }
        });
        const path = `./uploads/filesEnterprise/${idEmpresa}/${nombreArchivo}`;
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
        let newFile = new Upload({
            nombreArchivo,
            tipo: tipoDB,
            url: path,
            usuario: usuario._id
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
        return res.status(500).json({
            success: false,
            msg: 'Error interno del servidor',
            error
        })
    }
};

//@desc     Obtener los archivos por tipo
//@route    GET /api/upload/:tipo
//@access   Private(enteprise_role)
exports.files = async(req, res) => {
    try {
        const tipo = req.params.tipo
        const usuario = req.usuario;

        await Upload.find({ tipo: tipo, usuario: usuario._id }, (err, fileDB) => {
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
            return res.status(200).json({
                success: true,
                msg: 'Archivos',
                fileDB
            })
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error interno del servidor',
            error
        })
    }
};

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
//@route    GET /api/upload/:img
//@access   Private(auth)
exports.img = async(req, res) => {
    try {
        const img = req.params.img
        const usuario = req.usuario;
        let tipoUser = '';

        if (usuario.role == 'client_role') {
            tipoUser = 'client';
        }
        if (usuario.role == 'enterprise_role') {
            tipoUser = 'enterprise';
        }
        if (usuario.role == 'admin_role') {
            tipoUser = 'admin';
        }
        const pathImg = pathD.resolve(__dirname, `../uploads/imgProfile/${tipoUser}/${img}`);
        if (fs.existsSync(pathImg)) {
            res.sendFile(pathImg);
        } else {
            const pathNoImg = pathD.resolve(__dirname, '../uploads/imgProfile/no-img.png');
            res.sendFile(pathNoImg);
        }


    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error interno del servidor',
            error
        })
    }
};