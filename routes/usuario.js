const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const { registerClient, registerEnterprise } = require('../controllers/usuario')


router.route("/").post([
        check("nombres", "Ingrese nombres válidos").exists(),
        check("apellidos", "Ingrese apellidos válidos").exists(),
        check("direccion", "Ingrese apellidos válidos").exists(),
        check("contrasena", "Ingrese 8 caracteres min").isLength({ min: 8 }),
        check("correo", "Ingrese correo válido").isEmail().exists(),
        check("telefono", "Ingrese teléfono válido").isNumeric(),

    ],
    registerClient);

router.route("/").get(registerEnterprise);

module.exports = router;