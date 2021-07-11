const express = require("express");

// Database
const database = require("./database/database");            

// Initialization
const booky = express();

// Configuration
booky.use(express.json());

/*
Route              /
Description        Get all books
Access             PUBLIC
Parameter          NONE
Methods            GET
*/
booky.get("/", (req, res) => {
    return res.json ({ books: database.books });
});


/*
Route              /is
Description        Get Specific books based on ISBN
Access             PUBLIC
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
Access             PUBLIC
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
booky.post("/book/add", (req, res) => {
    const { newBook }= req.body;
    database.books.push(newBook);
    return res.json({ books: database.books });

});

/*
Route              /author/add
Description        add new author
Access             PUBLIC
Parameter          NONE
Methods            POST
*/
booky.post("/author/add", (req, res) => {
    const { newAuthor }= req.body;
    database.author.push(newAuthor);
    return res.json({ author: database.author });
})

/*
Route              /book/update/title
Description        Update book title
Access             PUBLIC
Parameter          isbn
Methods            PUT
*/
booky.put("/book/update/title/:isbn", (req, res) => {
    database.books.forEach((book) => {
       if(book.ISBN === req.params.isbn) {
           book.title = req.body.newBookTitle;
           return;
       }
    });

return res.json({ books: database.books });
});

/*
Route              /book/update/author
Description        Update/add new author for a Book
Access             PUBLIC
Parameter          isbn
Methods            PUT
*/
booky.put("/book/update/author/:isbn/:authorId", (req, res) => {
    //Update book Database

    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) { 
         return book.author.push(parseInt(req.params.authorId));
        }
    });

    // update author database
    database.author.forEach((author) => {
        if(author.id === parseInt(req.params.authorId)) 
         return author.books.push(req.params.isbn);
    });

    return res.json({ books: database.books, author: database.author });
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
booky.delete("/book/delete/:isbn", (req, res) => {
    const updateedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );

    database.books = updateedBookDatabase;
    return res.json({ books: database.books });
});

/*
Route              /book/delete/author
Description        delete an author from a Book
Access             PUBLIC
Parameter          isbn
Methods            DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorID", (req, res) => {
    
    // update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            const newAuthorList = book.author.filter(
                (author) => author !== parseInt(req.params.authorID)
            );
            book.author = newAuthorList;
            return;
        }
    });
    //update the author database
    database.author.forEach((author) => {
        if(author.id === parseInt(req.params.authorID)) {
            const newBooksList = author.books.filter(
            (book) => book !== req.params.isbn
        );

        author.books = newBooksList;
        return;
        }  
    });

    return res.json({
        message: "author was deleted successfully😜",
        book: database.books,
        author: database.author,
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

// Talk to mongodb in which mongodb understands => *****
// Talk to us inthe way we understand => Javascript

// mongoose