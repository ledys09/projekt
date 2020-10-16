const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const { registerClient, registerEnterprise } = require('../controllers/register')


router.route("/").post([
        body("nombres", "Ingrese nombres válidos").exists(),
        body("apellidos", "Ingrese apellidos válidos").exists(),
        body("direccion", "Ingrese apellidos válidos").exists(),
        body("contrasena", "Ingrese 8 caracteres min").isLength({ min: 8 }),
        body("correo", "Ingrese correo válido").isEmail().exists(),
        body("telefono", "Ingrese teléfono válido").isNumeric(),

    ],
    registerClient);

router.route("/").get(registerEnterprise);

module.exports = router;