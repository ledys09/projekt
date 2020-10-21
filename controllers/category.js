const Categoria = require('../models/category');
const { validationResult } = require('express-validator');


//@desc     Guardar nueva categoria
//@route    POST /api/category
//@access   Private (enterprise_role)
exports.createCategory = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: 'Error en validaciones',
            errors
        })
    }
    try {
        const {
            nombreCategoria,
            descripcion
        } = req.body;
        const usuario = req.usuario._id;
        const nuevaCategoria = new Categoria({
            nombreCategoria,
            descripcion,
            usuario
        })
        await nuevaCategoria.save(err => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al crear categoria',
                    errors: err
                })
            }
            return res.status(201).json({
                success: true,
                msg: 'Creado correctamente',
                data: nuevaCategoria
            })
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error en el servidor',
            error
        })
    }

};

//@desc     Obtener todas las categorias
//@route    GET /api/category/:id
//@access   public 
exports.categories = async(req, res) => {
    try {
        const empresa_id = req.params.id;
        //console.log(empresa_id)
        await Categoria.find({ usuario: empresa_id }, (err, data) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error en base de datos',
                    errors: err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Categorias obtenidas',
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

//@desc     Actualizar categoria
//@route    PUT /api/category/:id
//@access   Private(enterprise_role) 
exports.updateCategory = (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body

        Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al actualizar',
                    errors: err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Categoria Actualizada',
                categoriaDB
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

//@desc     Eliminar categoria
//@route    DELETE /api/category/:id
//@access   Private(enterprise_role) 
exports.deleteCategory = async(req, res) => {
    try {
        const id = req.params.id;

        Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al eliminar',
                    errors: err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Categoria eliminada',
                categoriaDB
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