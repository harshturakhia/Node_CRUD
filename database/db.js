const mongoose = require('mongoose');

const harsh = mongoose.connect('mongodb://localhost/CRUD')
    .then(() => {
        console.log("Database connected!")
    })
    .catch((err) => {
        console.log(err)
    })

module.exports = harsh