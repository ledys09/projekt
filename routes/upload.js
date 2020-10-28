const express = require('express');
const { filesUser, imgPerfil } = require('../controllers/upload');
const fileUpload = require('express-fileupload');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize')
const app = express()

app.use(fileUpload({ useTempFiles: true }));


app.route("/img-perfil").put(auth, imgPerfil);

app.route("/files").post(auth, authorize("enterprise_role"), filesUser);



module.exports = app;