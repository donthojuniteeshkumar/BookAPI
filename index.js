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

// Initialization
const booky = express();

// Configuration
booky.use(express.json());

// Establish database connection
mongoose
 .connect(
    process.env.Mongo_Url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
 )
.then(() => console.log("connection established!!!!")); 

/*
Route              /
Description        Get all books
Access             PUBLIC
Parameter          NONE
Methods            GET
*/
booky.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});


/*
Route              /is
Description        Get Specific books based on ISBN
Access             PUBLIC
Parameter          isbn
Methods            GET
*/
booky.get("/is/:isbn", async (req, res) => {
    
    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });


    if (!getSpecificBook) {
        return res.json({ 
            error: `No book found for the ISBN of ${req.params.isbn}`,
     });
    }

    return res.json({ book: getSpecificBook });

});


/*
Route              /c
Description        Get Specific books based on category
Access             PUBLIC
Parameter          Catregory
Methods            GET
*/
booky.get("/c/:category", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({category:  req.params.category,})


    if (!getSpecificBook) {
        return res.json({ 
            error: `No book found for the category of ${req.params.category}`,
     });
    }

    return res.json({book: getSpecificBook});
});

/*
Route              /l
Description        Get Specific books based on language
Access             PUBLIC
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
Route              /book/new
Description        add new book 
Access             PUBLIC
Parameter          NONE
Methods            POST
*/
booky.post("/book/new", (req, res) => {
    const { newBook }= req.body;
    BookModel.create(newBook); 

    return res.json({ message: "book was added!!" });

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
Route              /book/update
Description        Update book title
Access             PUBLIC
Parameter          isbn
Methods            PUT
*/
booky.put("/book/update/:isbn", async (req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
           ISBN: req.params.isbn,
        },
        {
           title: req.body.newbookTitle,
        },
        {
           new: true, // to get updated data
        }
    );
    return res.json({ books: updatedBook });
});

/*
Route              /book/author/update
Description        Update/add new author for a Book
Access             PUBLIC
Parameter          isbn
Methods            PUT
*/
booky.put("/book/author/update/:isbn", async (req, res) => {
    //Update book Database

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
          $addToSet: {
              author: req.body.newAuthor,
          },
        },
        {
            new: true,
        }
    );

    // database.books.forEach((book) => {
    //     if(book.ISBN === req.params.isbn) { 
    //      return book.author.push(parseInt(req.params.authorId));
    //     }
    // });

    // update author database

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor,
        },
        {
            $push: {
                books: req.params.isbn,
            },
        },
        {
            new: true,
        }
    );

    // database.author.forEach((author) => {
    //     if(author.id === parseInt(req.params.authorId)) 
    //      return author.books.push(req.params.isbn);
    // });

    return res.json({ books: updatedBook, author: updatedAuthor, message: "New author was added👍" });
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
Route              /book/delete
Description        Delete a Book
Access             PUBLIC
Parameter          isbn
Methods            DELETE
*/
booky.delete("/book/delete/:isbn", async (req, res) => {

    const updatedBookDatabase = await BookModel.findOneAndDelete({
        ISBN: req.params.isbn,
    });
    
    // const updatedBookDatabase = database.books.filter(
    //     (book) => book.ISBN !== req.params.isbn
    // );

    // database.books = updatedBookDatabase;
    return res.json({ books: updatedBookDatabase });
});

/*
Route              /book/delete/author
Description        delete an author from a Book
Access             PUBLIC
Parameter          isbn
Methods            DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorID", async (req, res) => {
    // update the book database

    const updatedBook = await BookModel.findOneAndUpdate(
    {
        ISBN: req.params.isbn,
    },
    {
        $pull: {
            author: parseInt(req.params.authorID),
        }
    },
    {
        new: true
    }
    );



    // database.books.forEach((book) => {
    //     if(book.ISBN === req.params.isbn){
    //         const newAuthorList = book.author.filter(
    //             (author) => author !== parseInt(req.params.authorID)
    //         );
    //         book.author = newAuthorList;
    //         return;
    //     }
    // });
    //update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
       id: parseInt(req.params.authorID),
    },
    {
        $pull: {
            books: req.params.isbn,
        },
    },
    { new: true }
    );
    // database.author.forEach((author) => {
    //     if(author.id === parseInt(req.params.authorID)) {
    //         const newBooksList = author.books.filter(
    //         (book) => book !== req.params.isbn
    //     );

    //     author.books = newBooksList;
    //     return;
    //     }  
    // });

    return res.json({
        message: "author was deleted successfully😜",
        book: updatedBook,
        author: updatedAuthor,
    });
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