const moongose = require('mongoose');
const Schema = moongose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

const productoSchema = new Schema({
    nombreProducto: { type: String, unique: true, required: [true, 'Producto obligatorio'] },
    precio: { type: Number, required: [true, 'Precio obligatorio'] },
    descripcion: { type: String, required: [true, 'Descripción obligatorio'] },
    fotoProdcuto: { type: String, default: null },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: [true, 'Categoria obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'Usuario obligatorio'] }
});

productoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = moongose.model('Producto', productoSchema);