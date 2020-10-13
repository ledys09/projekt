const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const { registerClient, registerEnterprise } = require('../controllers/usuario')


router.route("/").post([
        check("nombres").exists(),
        check("apellidos").exists(),
        check("direccion").exists(),
        check("contrasena").isLength({ min: 8 }),
        check("correo").isEmail().exists(),
        check("telefono").exists(),

    ],
    registerClient);

router.route("/").get(registerEnterprise);

module.exports = router;






module.exports = router;