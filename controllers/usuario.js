const Usuario = require('../models/usuario')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt');



//@desc     Registrar nuevo cliente
//@route    POST /api/registerClient
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
//@route    POST /api/registerEnterprise
//@access   Public
exports.registerEnterprise = (req, res) => {
    Usuario.find({}, (err, usuarios) => {
        if (err) {
            return res.status(500).json({
                success: false,
                msg: "Server error",
                error: err
            });
        }
        res.status(200).json({
            success: true,
            data: usuarios
        });
    });
};