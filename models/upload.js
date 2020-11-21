const moongose = require('mongoose');
const Schema = moongose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const uploadSchema = new Schema({
    nombreArchivo: { type: String, unique: true, required: [true, 'Nombre archivo obligatorio'] },
    tipo: { type: String, required: [true, 'Tipo oblogatorio'] },
    url: { type: String, required: [true, 'Url obligatorio'] },
    extension: { type: String, required: [true, 'Extensión obligatorio'] },
    usuario: { type: Schema.Types.ObjectId, required: true, ref: 'Usuario' }
})

uploadSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = moongose.model('Upload', uploadSchema);