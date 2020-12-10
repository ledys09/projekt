const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaPagina = new Schema({
    titulo: { type: String },
    descripcion: { type: String },
    bloques: [{
        bhtml: String,
        bcss: String,
        bjs: String,
        background: String,
        grids: Number,
    }],
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
})

module.exports = mongoose.model('Pagina', schemaPagina);