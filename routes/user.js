const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const auth = require('../middlewares/auth')
const { registerClient, registerEnterprise } = require('../controllers/user')



router.route("/registerclient").post([
        [
            check("nombres", "Ingrese nombres").exists(),
            check("apellidos", "Ingrese apellidos").exists(),
            check("direccion", "Ingrese apellidos").exists(),
            check("contrasena", "Ingrese 8 caracteres min").isLength({ min: 8 }),
            check("correo", "Ingrese correo").isEmail().exists(),
            check("telefono", "Ingrese teléfono").isNumeric(),
        ], auth.verifyToken
    ],
    registerClient);

router.route("/registerenterprise").get(registerEnterprise);

module.exports = router;