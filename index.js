const express = require("express");

// Database
const database = require("./database");

// Initialization
const booky = express();

/*
Route              /
Description        Get all books
Acccess            PUBLIC
Parameter          NONE
Methods            GET
*/
booky.get("/", (req, res) => {
    return res.json ({ books: database.books });
});


/*
Route              /is
Description        Get Specific books based on ISBN
Acccess            PUBLIC
Parameter          isbn
Methods            GET
*/
booky.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if (getSpecificBook.length === 0) {
        return res.json({ 
            error: `No book found for the ISBN of ${req.params.isbn}`,
     });
    }

    return res.json({book: getSpecificBook});

});


/*
Route              /c
Description        Get Specific books based on category
Acceess            PUBLIC
Parameter          Catregory
Methods            GET
*/
booky.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );

    if (getSpecificBook.length === 0) {
        return res.json({ 
            error: `No book found for the category of ${req.params.category}`,
     });
    }

    return res.json({book: getSpecificBook});
});

/*
Route              /l
Description        Get Specific books based on language
Acccess            PUBLIC
Parameter          language
Methods            GET
*/
booky.get("/l/:language",function(req,res){
    const getSpecificBook = database.books.filter(
        (book) => book.language.includes(req.params.language)
    );

    if (getSpecificBook.length === 0) {
        return res.json({ 
            error: `No book found for the language of ${req.params.language}`,
     });
    }

    return res.json({book: getSpecificBook});
});

/*
Route              /author
Description        Get all authors
Acccess            PUBLIC
Parameter          NONE
Methods            GET
*/
booky.get("/author", (req, res) => {
    return res.json ({ authors: database.author });
});

 /*
Route              /author/book
Description        Get all authors based on Books
Acceess            PUBLIC
Parameter          isbn
Methods            GET
*/
booky.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if (getSpecificAuthor.length === 0) {
        return res.json({ 
            error: `No Author found for book of ${req.params.isbn}`,
     });
    }

    return res.json({ authors: getSpecificAuthor });
});



const port=9000

booky.listen(port, () => console.log(`Hey server is running on 👍 ->  ${port}`));