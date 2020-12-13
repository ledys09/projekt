const express = require('express')
const router = express.Router();
const { check } = require('express-validator')
const auth = require('../middlewares/auth')
const authorize = require('../middlewares/authorize')
const {
    create,
    read,
    update,
    deletePlan
} = require('../controllers/plan')

router.route("/").post([
    [
        check("nombrePlan", "Ingrese").exists(),
        check("precio", "Ingrese").exists(),
        check("paginas", "Ingrese").exists(),
        check("imagenes", "Ingrese").exists(),
    ], auth, authorize("admin_role")
], create);

router.route("/").get(read);

router.route("/:id").put(auth, authorize("admin_role"), update);

router.route("/:id").delete(auth, authorize("admin_role"), deletePlan);


module.exports = router;