const Usuario = require('../models/user');
const Upload = require('../models/upload')
const fs = require('fs');
const pathD = require('path');



//@desc     Actualizar foto de perfil
//@route    PUT /api/upload/img-perfil
//@access   Private (auth)
exports.imgPerfil = async(req, res) => {
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
                msg: 'No se encontro usuario',
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
                    msg: 'No se actulizo foto del usuario',
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
};

//@desc     Subir archivos empresa
//@route    POST /api/upload/files
//@access   Private (enterprise_role)
exports.filesUser = async(req, res) => {
    const usuario = req.usuario;
    const idEmpresa = usuario._id;

    if (!req.files) {
        return res.status(400).json({
            success: false,
            msg: 'No seleccionó  archivo',
            error: { message: 'Debe seleccionar un archivo' }
        })
    }

    const archivoSubir = req.files.archivoSubir
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

    let newFile = new Upload({
        nombreArchivo,
        tipo: extension,
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
};