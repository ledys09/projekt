const moongose = require('mongoose')
const Schema = moongose.Schema;

const planSchema = new Schema({
    nombrePlan: { type: String },
    precio: { type: Number },
    paginas: { type: Number },
    imagenes: { type: Number },
    videos: { type: Number },
    documentos: { type: Number }
})

module.exports = moongose.model('Plan', planSchema);