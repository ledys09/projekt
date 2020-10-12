const mongoose = require('mongoose')
require("dotenv").config({ path: "./config.env" });


class Database {
    constructor() {
        mongoose.connect(process.env.BASE_URL)
            .then(() => {
                console.log('Conectado a la base de datos:  \x1b[36m%s\x1b[0m', 'projekt');
            }).catch(error => {
                console.log(error);
            });
    }
}

module.exports = new Database();