const express = require('express')
const cors = require('cors')
require('dotenv').config({ path: '/config.env' })
const bodyParser = require('body-parser')
    //conection db
const db = require('./config/db')





const app = express();

//  midlelware
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  Routes file
const { login } = require('./controllers/login');

//  Routes
app.use("/api/login", login)

//  Conexión
const PORT = 5000 || process.env.PORT

app.listen(PORT, () => console.log(`Servidor conectado en el puerto:  \x1b[36m%s\x1b[0m`, `${PORT} `));


//clg('server puerto: \x1b[32m%s\x1b[0m','online');