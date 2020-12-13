const express = require('express')
const cors = require('cors')
require('dotenv').config({ path: './config/config.env' })
const bodyParser = require('body-parser')

//conection db
const db = require('./config/db')

const app = express();

//  Middelwares
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//  Importar rutas
const login = require("./routes/login");
const user = require("./routes/user");
const category = require("./routes/category");
const product = require("./routes/product");
const upload = require("./routes/upload")
const page = require("./routes/page")
const plan = require("./routes/plan")

//  Rutas
app.use("/api/login", login);
app.use("/api/user", user);
app.use("/api/category", category);
app.use("/api/product", product);
app.use("/api/upload", upload);
app.use("/api/page", page);
app.use("/api/plan", plan);



//  Conexión
const PORT = 5000 || process.env.PORT

app.listen(PORT, () => console.log(`Servidor conectado en el puerto:  \x1b[36m%s\x1b[0m`, `${PORT} `));


//clg('server puerto: \x1b[32m%s\x1b[0m','online');