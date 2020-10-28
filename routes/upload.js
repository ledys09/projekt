const express = require('express');
const fileUpload = require('express-fileupload');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize')
const app = express()
const {
    filesUser,
    imgPerfil,
    files,
    updateFile,
    deleteFile
} = require('../controllers/upload');


app.use(fileUpload({ useTempFiles: true }));


app.route("/img-perfil").put(auth, imgPerfil);

app.route("/files").post(auth, authorize("enterprise_role"), filesUser);

app.route("/:tipo").get(auth, authorize("enterprise_role"), files);

app.route("/:id").put(auth, authorize("enterprise_role"), updateFile);

app.route("/:id").delete(auth, authorize("enterprise_role"), deleteFile)



module.exports = app;