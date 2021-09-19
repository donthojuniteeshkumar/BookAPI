const Router = require("express").Router();

const AuthorModel = require("../../database/author");

/*
Route              /author
Description        Get all authors
Access             PUBLIC
Parameter          NONE
Methods            GET
*/
Router.get("/", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({ authors: getAllAuthors });
});

 /*
Route              /author/book
Description        Get all authors based on Books
Acceess            PUBLIC
Parameter          isbn
Methods            GET
*/
Router.get("/book/:isbn", (req, res) => {
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

/*
Route              /author/new
Description        add new author
Access             PUBLIC
Parameter          NONE
Methods            POST
*/
Router.post("/new", (req, res) => {
    const { newAuthor }= req.body;
   
    AuthorModel.create(newAuthor);

    return res.json({ message: "author was added!" });
});

module.exports = Router;