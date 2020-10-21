const express = require('express')
const router = express.Router();
const { check } = require('express-validator')
const auth = require('../middlewares/auth')
const authorize = require('../middlewares/authorize')
const {
    createCategory,
    categories,
    updateCategory,
    deleteCategory
} = require('../controllers/category')

router.route("/").post([
    [
        check("nombreCategoria", "Ingrese categoria").exists(),
        check("descripcion", "Ingrese descripción").exists()
    ], auth, authorize("enterprise_role")
], createCategory);

router.route("/:id").get(categories);

router.route("/:id").put(auth, authorize("enterprise_role"), updateCategory);

router.route("/:id").delete(auth, authorize("enterprise_role"), deleteCategory)

module.exports = router;