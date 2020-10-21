const express = require('express');
const router = express.Router()
const { check } = require('express-validator')
const { login } = require('../controllers/login')

router.route("/").post([
    check("correo", "Ingrese correo").exists(),
    check("contrasena", "Ingrese contraseña").isLength({ min: 8 }).exists()
], login);

module.exports = router;