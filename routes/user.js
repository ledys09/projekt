const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const auth = require('../middlewares/auth')
const { registerClient, registerEnterprise, registerAdmin } = require('../controllers/user')
const authotize = require('../middlewares/authotize')


router.route("/registerclient").post(
    [
        check("nombres", "Ingrese nombres").exists(),
        check("apellidos", "Ingrese apellidos").exists(),
        check("direccion", "Ingrese dirección").exists(),
        check("contrasena", "Ingrese 8 caracteres min").isLength({ min: 8 }),
        check("correo", "Ingrese correo").isEmail().exists(),
        check("telefono", "Ingrese teléfono").isNumeric(),
    ],
    registerClient);

router.route("/registerenterprise").post([
        check("nombreEmpresa", "Ingrese nombre de la empresa").exists(),
        check("nombrePropietario", "Ingrese nombre del propietario").exists(),
        check("direccion", "Ingrese dirección").exists(),
        check("plan", "Ingrese plan").exists(),
        check("contrasena", "Ingrese 8 caracteres min").isLength({ min: 8 }).exists(),
        check("correo", "Ingrese correo").isEmail().exists(),
        check("telefono", "Ingrese teléfono").isNumeric(),
    ],
    registerEnterprise);

router.route("/registerAdmin").post([
    [
        check("correo", "Ingrese correo").exists(),
        check("contrasena", "Ingrese contraseña").isLength({ min: 8 }).exists()
    ], auth, authotize("admin")
], registerAdmin);

module.exports = router;