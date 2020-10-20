const Usuario = require('../models/user')
const Empresa = require('../models/enterprise')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt');



//@desc     Registrar nuevo cliente
//@route    POST /api/registerclient
//@access   Public
exports.registerClient = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: "Error en validaciones",
            errors: errors
        });
    }

    try {
        const { nombres, apellidos, direccion, contrasena, correo, telefono } = req.body;
        const password = bcrypt.hashSync(contrasena, 10);
        const nuevoUsuario = new Usuario({
            nombres,
            apellidos,
            direccion,
            contrasena: password,
            correo,
            telefono
        });
        nuevoUsuario.save((err) => {
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
exports.registerEnterprise = (req, res) => {
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
            nombreEmpresa,
            nombrePropietario,
            plan,
            direccion,
            contrasena,
            correo,
            telefono
        } = req.body;
        const password = bcrypt.hashSync(contrasena, 10);
        const nuevaEmpresa = new Empresa({
            nombreEmpresa,
            nombrePropietario,
            plan,
            direccion,
            contrasena: password,
            correo,
            telefono
        });
        nuevaEmpresa.save((err) => {
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
exports.registerAdmin = (req, res) => {

};