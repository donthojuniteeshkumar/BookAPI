const mongoose = require('mongoose');

// Creating a Schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    pubDate: String,
    language: String,
    numPage: Number,
    author: Number,
    publication: Number,
    category: String,
});

// Creating a Book model
const BookModel = mongoose.model(BookSchema);

module.exports = BookModel;