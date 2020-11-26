const express = require('express');
const fileUpload = require('express-fileupload');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize')
const app = express()
const {
    filesUser,
    imgPerfil,
    img,
    files,
    getFiles,
    updateFile,
    deleteFile,
    searchA
} = require('../controllers/upload');


app.use(fileUpload({ useTempFiles: true }));


app.route("/search/:termino").get(auth, authorize("enterprise_role"), searchA)
app.route("/img-perfil/:tipo/:id").put(imgPerfil);

app.route("/files/:id").post(filesUser);

app.route("/:id/:tipo").get(files);
app.route("/get/:id/:archivo").get(getFiles);

app.route("/perfil/:tipo/:img").get(img);

app.route("/:idE/:idA").put(auth, authorize("enterprise_role"), updateFile);

app.route("/:id").delete(auth, authorize("enterprise_role"), deleteFile)



module.exports = app;