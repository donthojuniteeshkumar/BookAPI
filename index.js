require("dotenv").config();

//Frame work
const express = require("express");
const mongoose = require("mongoose");

// Database
const database = require("./database");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// Micrpservices Routers
const Books = require(".API/Book");

// Initializing Express
const booky = express();

// Configuration
booky.use(express.json());

// Establish database connection
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
.then(() => console.log("connection established!!!!")); 


// Intializing Microservices
booky.use("/book", Books);

/*
Route              /author
Description        Get all authors
Access             PUBLIC
Parameter          NONE
Methods            GET
*/
booky.get("/author", async (req, res) => {
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

/*
Route              /publications
Description        Get all publications 
Access             PUBLIC
Parameter          isbn
Methods            GET
*/
booky.get("/publications", (req, res) => {
    return res.json({ publications: database.publication });
});

/*
Route              /author/new
Description        add new author
Access             PUBLIC
Parameter          NONE
Methods            POST
*/
booky.post("/author/new", (req, res) => {
    const { newAuthor }= req.body;
   
    AuthorModel.create(newAuthor);

    return res.json({ message: "author was added!" });
});

/*
Route              /publication/update/book
Description        Update/add new Book to publication
Access             PUBLIC
Parameter          isbn
Methods            PUT
*/

booky.put("/publication/update/book/:isbn", (req, res) => {
    // Update the publication database
       database.publication.forEach((publication) => {
           if (publication.id === req.body.pubId) {
               return publication.books.push(req.params.isbn);
           }
       });
    // update the book database
       database.books.forEach((book) => {
           if (book.isbn === req.params.isbn) {
               book.publication = req.body.pubId;
               return;
           }
       });
   return res.json({books: database.books, publication: database.publication, message: "Successfully Updated publicatoion"});
   });

/*
Route              /publication/delete/book
Description        delete a book from publication
Access             PUBLIC
Parameter          isbn, publication id
Methods            DELETE
*/
booky.delete("/publication/delete/book/:isbn/:pubID", (req, res) => {
    database.publication.forEach((publication) => {
        if(publication.id === parseInt(req.params.pubID)){
            const newBooksList = publication.books.filter(
             (book) => book !== req.params.isbn
            );

            publication.books = newBooksList;
            return;
        }
    });

   // update book database
   database.books.forEach((book) => {
       if(book.ISBN === req.params.isbn) {
        book.publication = 0; // no publication avaliable
        return;
       } 
     });
     return res.json({ books: database.books, publication: database.publication})
});

const port=3000
booky.listen(port, () => console.log(`Hey server is running on 👍 ->  ${port}`));