const express = require('express')
const auth = require('../middlewares/auth')
const router = express.Router()

const {
    nuevaPagina,
    editarPagina,
    eliminarPagina,
    paginas,
    pagina,
    nuevoBloque,
    editarBloque,
    eliminarBloque,
    obtenerBloque,
    bloques
} = require('../controllers/page')

router.route('/').post(auth, nuevaPagina);
router.route('/:idPagina').put(auth, editarPagina);
router.route('/:id').delete(auth, eliminarPagina);
router.route('/:idEmpresa').get(paginas);
router.route('/pages/:idPagina').get(pagina);

router.route('/bloque/:idPagina').put(nuevoBloque);
router.route('/bloque/:idPagina/:idBloque').put(editarBloque);
router.route('/bloque/delete/:idPagina/:idBloque').put(eliminarBloque);
router.route('/bloque/:idPagina/:idBloque').get(obtenerBloque);
router.route('/bloques/:idPagina').get(bloques);

module.exports = router;