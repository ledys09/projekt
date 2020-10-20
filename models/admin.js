const moongose = require('mongoose');
const Schema = moongose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const rolesValidos = {
    values: ['admin_role', 'client_role', 'enterprise_role'],
    message: '{VALUE} no es un rol permitido'
}

const adminSchema = new Schema({
    correo: { type: String, unique: true, required: [true, 'Correo obligatorio'] },
    contrasena: { type: String, required: [true, 'Contraseña obligatoria'] },
    role: { type: String, default: 'admin_role', required: true }
});

adminSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = mongoose.model('Admin', adminSchema);