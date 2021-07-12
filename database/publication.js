const mongoose = require('mongoose');

// Creatin Publication Schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: String,
});

// Creating Publication Model

const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;