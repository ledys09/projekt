const express = require('express')
const router = express.Router();
const auth = require('../middlewares/auth')
const authorize = require('../middlewares/authorize')
const { check } = require('express-validator')
const {
    createProduct,
    products,
    product,
    updateProduct,
    deleteProduct,
    searchP
} = require('../controllers/product');

router.route("/").post([
    [
        check("nombreProducto", "Ingrese nombreProducto").exists(),
        check("precio", "Ingrese precio").exists(),
        check("descripcion", "Ingrese descripcion").exists(),
        check("categoria", "Ingrese categoria").exists()
    ], auth, authorize("enterprise_role")
], createProduct)

router.route("/search/:termino").get(auth, authorize("enterprise_role"), searchP)
router.route('/products/:idCategoria').get(products);

router.route("/:idProducto").get(product);
router.route("/:id").put(auth, authorize("enterprise_role"), updateProduct);
router.route("/:id").delete(auth, authorize("enterprise_role"), deleteProduct)

module.exports = router;