const Producto = require('../models/product')
const { validationResult } = require('express-validator')
const product = require('../models/product')

//@desc     Crear un nuevo producto
//@route    POST /api/product
//@access   Private(enterprise_role)
exports.createProduct = async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: 'Error en validaciones',
            errors
        })
    }
    try {
        const {
            nombreProducto,
            precio,
            descripcion,
            categoria,
        } = req.body;
        const usuario = req.usuario._id;
        const nuevoProducto = new Producto({
            nombreProducto,
            precio,
            descripcion,
            categoria,
            usuario
        })
        await nuevoProducto.save(err => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error en la base de datos',
                    err
                })
            }

            return res.status(201).json({
                success: true,
                msg: 'Producto creado',
                data: nuevoProducto
            })
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error en el servidor',
            error
        })
    }
}

//@desc     Obtener productos por categoria 
//@router   GET /api/product/products/:idCategoria
//@access   Public
exports.products = async(req, res) => {
    try {
        const idCategoria = req.params.idCategoria;
        await Producto.find({ categoria: idCategoria }, (err, data) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error base de datos',
                    err
                })
            }
            if (data == '') {
                return res.status(404).json({
                    success: false,
                    msg: 'No existen productos'
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Productos obtenidos',
                data
            })
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error en el servidor',
            error
        })
    }
}

//@desc     Obtener un producto por id
//@router   GET /api/product/:idProducto
//@access   Public
exports.product = async(req, res) => {
    try {
        const idProducto = req.params.idProducto;
        await Producto.find({ _id: idProducto }, (err, data) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error base de datos',
                    err
                })
            }
            if (data == '') {
                return res.status(404).json({
                    success: false,
                    msg: 'No existe este producto'
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Producto obtenido',
                data
            })
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error en el servidor',
            error
        })
    }
}

//@desc     Actualizar producto
//@route    PUT /api/product/:id
//@access   Private(enterprise_role) 
exports.updateProduct = (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body

        Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al actualizar',
                    errors: err
                })
            }
            if (productoDB == null) {
                return res.status(404).json({
                    success: false,
                    msg: 'No existe este producto'
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'producto actualizado',
                productoDB
            })
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error en el servidor',
            error
        })
    }
}

//@desc     Eliminar producto
//@route    DELETE /api/product/:id
//@access   Private(enterprise_role) 
exports.deleteProduct = async(req, res) => {
    try {
        const id = req.params.id;

        Producto.findByIdAndRemove(id, (err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al eliminar',
                    errors: err
                })
            }

            if (productoDB == null) {
                return res.status(404).json({
                    success: false,
                    msg: 'No existe este producto'
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Producto eliminado',
                productoDB
            })
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error en el servidor',
            error
        })
    }
}