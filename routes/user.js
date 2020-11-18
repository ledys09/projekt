const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const auth = require('../middlewares/auth')
const authorize = require('../middlewares/authorize')
const {
    registerClient,
    registerEnterprise,
    registerAdmin,
    users,
    user,
    search,
    updateUser,
    deleteUser
} = require('../controllers/user')


// Usuario Cliente

router.route("/registerclient").post(
    [
        check("nombre", "Ingrese nombres").exists(),
        check("direccion", "Ingrese dirección").exists(),
        check("contrasena", "Ingrese 8 caracteres min").isLength({ min: 8 }),
        check("correo", "Ingrese correo").isEmail().exists(),
        check("telefono", "Ingrese teléfono").isNumeric(),
    ],
    registerClient);


// Usuario Empresa

router.route("/registerenterprise").post([
        check("nombreEmpresa", "Ingrese nombre de la empresa").exists(),
        check("nombre", "Ingrese nombre del propietario").exists(),
        check("direccion", "Ingrese dirección").exists(),
        check("plan", "Ingrese plan").exists(),
        check("contrasena", "Ingrese 8 caracteres min").isLength({ min: 8 }).exists(),
        check("correo", "Ingrese correo").isEmail().exists(),
        check("telefono", "Ingrese teléfono").isNumeric(),
    ],
    registerEnterprise);

// Usuario Admin 

router.route("/registeradmin").post([
    [
        check("nombre", "Ingrese nombres").exists(),
        check("correo", "Ingrese correo").exists(),
        check("contrasena", "Ingrese contraseña").isLength({ min: 8 }).exists()
    ], auth, authorize("admin_role")
], registerAdmin);

router.route("/users/:role").get(auth, authorize("admin_role"), users);

router.route("/:id").get(user);

router.route("/search/:termino").get(auth, authorize("admin_role"), search)

router.route("/:id").put(auth, updateUser);

router.route("/:id").delete(auth, authorize("admin_role"), deleteUser)

module.exports = router;