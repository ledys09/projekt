const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

const rolesValidos = {
    values: ['admin_role', 'client_role', 'enterprise_role'],
    message: '{VALUE} no es un rol permitido'
}

const empresaSchema = new Schema({

    nombreEmpresa: { type: String, unique: true, required: [true, 'Nombre empresa obligatorio'] },
    nombrePropietario: { type: String, required: [true, 'Nombre propietario obligatorio'] },
    logoTipo: { type: String, default: null },
    plan: { type: String, required: [true, 'Plan obligatorio'] },
    correo: { type: String, unique: true, required: [true, 'Correo obligatorio'] },
    contrasena: { type: String, required: [true, 'Contraseña obligatoria'] },
    telefono: { type: String, required: [true, 'Teléfono obligatorio'] },
    direccion: { type: String, required: [true, 'Dirección obligatorio'] },
    role: { type: String, required: true, default: 'enterprise_role', enum: rolesValidos }
});

empresaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = mongoose.model('Empresa', empresaSchema);