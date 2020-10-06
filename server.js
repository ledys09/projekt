const express = require('express')
const cors = require('cors')
require('dotenv').config({ path: '/config.env' })
const path = require('path');


const server = express();

//  midlelware
server.use(cors())
server.use(express.json({ extended: false }))

//  Routes file
const { login } = require('./controllers/login');

//  Routes
server.use("/api/login", login)

//  Conexión
const PORT = 5000 || process.env.PORT

server.listen(PORT, () => console.log(`Servidor conectado en el puerto ${PORT}`))