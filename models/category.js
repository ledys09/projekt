const moongose = require('mongoose');
const Schema = moongose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const categoriaScheme = new Schema({
    nombreCategoria: { type: String, unique: true, required: [true, 'Categoria obligatoria'] },
    descripcion: { type: String, required: [true, 'Descripción obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, required: true, ref: 'Usuario' }
});

categoriaScheme.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = moongose.model('Categoria', categoriaScheme)