const Usuario = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const _ = require('underscore');



//@desc     Registrar nuevo cliente
//@route    POST /api/registerclient
//@access   Public
exports.registerClient = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: "Error en validaciones",
            errors: errors
        });
    }

    try {
        const {
            nombres,
            apellidos,
            direccion,
            contrasena,
            correo,
            telefono
        } = req.body;
        const password = bcrypt.hashSync(contrasena, 10);
        const nuevoUsuario = new Usuario({
            nombres,
            apellidos,
            direccion,
            contrasena: password,
            correo,
            telefono,
            role: 'client_role'
        });
        await nuevoUsuario.save((err) => {
            if (err) {

                return res.status(400).json({
                    success: false,
                    msg: "Error al crear usuario",
                    errors: err
                });
            }
            return res.status(201).json({
                success: true,
                msg: "Registrado correctamente",
                data: nuevoUsuario
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Error en el servidor",
            error: error
        })
    }

};


//@desc     Registrar nueva empresa
//@route    POST /api/registerenterprise
//@access   Public
exports.registerEnterprise = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: "Error en validaciones",
            errors: errors
        });
    }

    try {
        const {
            nombres,
            apellidos,
            nombreEmpresa,
            plan,
            direccion,
            contrasena,
            correo,
            telefono
        } = req.body;
        const password = bcrypt.hashSync(contrasena, 10);
        const nuevaEmpresa = new Usuario({

            nombres,
            apellidos,
            nombreEmpresa,
            plan,
            direccion,
            contrasena: password,
            correo,
            telefono,
            role: 'enterprise_role'
        });
        await nuevaEmpresa.save((err) => {
            if (err) {

                return res.status(400).json({
                    success: false,
                    msg: "Error al crear empresa",
                    errors: err
                });
            }
            return res.status(201).json({
                success: true,
                msg: "Registrado correctamente",
                data: nuevaEmpresa
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Error en el servidor",
            error: error
        })
    }
};

//@desc     Registro de nuevo admin
//@route    POST /api/registeradmin
//@access   Private(Solo admin)
exports.registerAdmin = async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: 'Error en validaciones',
            errors
        })
    }

    try {
        const {
            nombres,
            apellidos,
            contrasena,
            correo
        } = req.body;
        const password = bcrypt.hashSync(contrasena, 10);
        const nuevoAdmin = new Usuario({
            nombres,
            apellidos,
            contrasena: password,
            correo,
            role: 'admin_role'
        });
        await nuevoAdmin.save(err => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al crear admin',
                    errors: err
                })
            }
            return res.status(201).json({
                success: true,
                msg: 'Registrado correctamente',
                data: nuevoAdmin
            })
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error en el servidor',
            error
        })
    }
};


//@desc     Obtener un solo usuario
//@route    GET /api/user/:id
//@access   Public
exports.user = async(req, res) => {
    try {
        const id = req.params.id;
        //console.log(empresa_id)
        await Usuario.find({ _id: id }, (err, data) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error en base de datos',
                    errors: err
                })
            }
            if (data == '') {
                return res.status(404).json({
                    success: false,
                    msg: 'No existe usuario'
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Usuario obtenido',
                data
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

//@desc     Obtener usuarios por rol
//@route    GET /api/user/:role
//@access   Private (admin_role)
exports.users = async(req, res) => {
    try {
        const role = req.params.role;
        //console.log(empresa_id)
        await Usuario.find({ role: role }, (err, data) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error en base de datos',
                    errors: err
                })
            }
            if (data == '') {
                return res.status(404).json({
                    success: false,
                    msg: 'No existen usuarios'
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Usuarios obtenidos',
                data
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


//@desc     Actualizar usuario
//@route    PUT /api/user/:id
//@access   Private (all roles)
exports.updateUser = async(req, res) => {

    try {
        const id = req.params.id;
        const body = _.pick(
            req.body, [
                'nombreEmpresa',
                'nombres',
                'apellidos',
                'foto',
                'telefono',
                'direccion',
                'correo',
                'plan'
            ]
        );


        Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, UsuarioDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al actualizar',
                    errors: err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Usuario Actualizado',
                UsuarioDB
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


//@desc     Eliminar usuario
//@route    DELETE /api/user/id
//@access   Private(admin_role)
exports.deleteUser = async(req, res) => {
    try {
        const id = req.params.id;

        Usuario.findByIdAndRemove(id, (err, UsuarioDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al eliminar',
                    errors: err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Usuario eliminado',
                UsuarioDB
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