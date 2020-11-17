const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const uniqueValidator = require('mongoose-unique-validator')

const rolesValidos = {
    values: ['admin_role', 'client_role', 'enterprise_role'],
    message: '{VALUE} no es un rol permitido'
}

const usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'Nombres obligatorio'] },
    nombreEmpresa: { type: String },
    plan: { type: String },
    foto: { type: String, default: 'no-img.png' },
    correo: { type: String, unique: true, required: [true, 'Correo obligatorio'] },
    contrasena: { type: String, required: [true, 'Contraseña obligatoria'] },
    telefono: { type: String },
    direccion: { type: String },
    role: { type: String, required: true, enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = mongoose.model('Usuario', usuarioSchema);