const Usuario = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')


//@desc     Loguear usuario
//@route    POST    /api/login
//@access   public
exports.login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: "Error en validaciones",
            errors: errors
        });
    }
    try {
        const body = req.body;

        Usuario.findOne({ correo: body.correo }, (err, usuariodb) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error buscando usuario',
                    errors: err
                })
            }

            if (!usuariodb) {
                return res.status(404).json({
                    success: false,
                    msg: 'Credenciales invalidas',
                    errors: err
                })
            }

            if (!bcrypt.compareSync(body.contrasena, usuariodb.contrasena)) {
                return res.status(404).json({
                    success: false,
                    msg: 'Credenciales invalidas',
                    errors: err
                })
            }
            //create token 
            const token = jwt.sign({ usuario: usuariodb }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXP })
            res.status(200).json({
                success: true,
                token: token,
                usuario: usuariodb.correo,
                id: usuariodb._id,
                role: usuariodb.role
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