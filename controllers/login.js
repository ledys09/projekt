const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');


//@desc     Loguear usuario
//@route    /api/login
//@access   public
exports.login = (req, res) => {
    var body = req.body;

    Usuario.findOne({ correo: body.correo }, (err, usuariodb) => {
        console.log(usuariodb)
        if (err) {
            return res.status(500).json({
                success: false,
                msg: 'Error en base de datos',
                errors: err
            })
        }

        if (!usuariodb) {
            return res.status(404).json({
                success: false,
                msg: 'Credenciales invalidas correo',
                errors: err
            })
        }
        if (!bcrypt.compareSync(body.contrasena), usuariodb.contrasena) {
            return res.status(404).json({
                success: false,
                msg: 'Credenciales invalidas contra',
                errors: err
            })
        }
        //crear token 
        res.status(200).json({
            success: true,
            data: usuariodb,
            id: usuariodb._id
        })
    })
}


/* const errors = validationResult(req.body);
   if (!errors.isEmpty()) {
       return res.status(400).json({
           success: false,
           msg: "Error en validaciones",
           error: errors
       });
   }
   const { correo, contrasena } = req.body;

   Usuario.findOne({ correo: correo }, (err, usuariodb) => {
       if (err) {
           return res.status(500).json({
               success: false,
               msg: 'Error en base de datos',
               error: err
           })
       }
       if (!usuariodb) {
           return res.status(404).json({
               success: false,
               msg: 'Credenciales invalidas',
               error: err
           })
       }
       if (!bcrypt.compareSync(contrasena), usuariodb.contrasena) {
           return res.status(404).json({
               success: false,
               msg: 'Credenciales invalidas',
               error: err
           })
       }
       res.status(200).json({
           success: true,
           data: usuariodb,
           id: usuariodb._id
       })
   }) */