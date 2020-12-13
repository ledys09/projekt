const Plan = require('../models/plan')
const { validationResult } = require('express-validator');


//desc  nuevo plan
//route POST /api/plan
//access private (admin_role)
exports.create = async(req, res) => {
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
            nombrePlan,
            precio,
            paginas,
            imagenes,
            videos,
            documentos
        } = req.body;
        const nuevoPlan = new Plan({
            nombrePlan,
            precio,
            paginas,
            imagenes,
            videos,
            documentos
        })
        await nuevoPlan.save(err => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al crear plan',
                    errors: err
                })
            }
            return res.status(201).json({
                success: true,
                msg: 'Creado correctamente',
                data: nuevoPlan
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

//desc  actualizar plan
//route PUT /api/plan/:id
//access private (admin role)
exports.update = (req, res) => {

    try {
        const id = req.params.id;
        const body = req.body

        Plan.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, planDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al actualizar',
                    errors: err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Plan actualizado',
                planDB
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

//desc  obtener planes 
//route GET /api/plan
//access public
exports.read = async(req, res) => {
    try {
        await Plan.find({}, (err, data) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error en base de datos',
                    errors: err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Planes obtenidos',
                data,
                total: data.length
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


//desc eliminar plan
//route DELETE /api/plan/:id
//access private (admin_role)
exports.deletePlan = (req, res) => {

    try {
        const id = req.params.id;
        Plan.findByIdAndRemove(id, (err, planDB) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error al eliminar',
                    errors: err
                })
            }
            return res.status(200).json({
                success: true,
                msg: 'Plan eliminado',
                planDB
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