// Intializing Express Router
const Router = require("express").Router();

// Database Models
const BookModel = require("../../database/book");

/*
Route              /
Description        Get all books
Access             PUBLIC
Parameter          NONE
Methods            GET
*/
Router.get("/", async (req, res) => {
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
Router.get("/is/:isbn", async (req, res) => {
    
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
Router.get("/c/:category", async (req, res) => {
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
Router.get("/l/:language",function(req,res){
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
Route              /book/new
Description        add new book 
Access             PUBLIC
Parameter          NONE
Methods            POST
*/
Router.post("/new", async (req, res) => {
  try{
     const { newBook }= req.body;
     await BookModel.create(newBook); 

     return res.json({ message: "book was added!!" });
  }   catch (error) {
     return res.json({ error: error.message });
 }

});

/*
Route              /book/update
Description        Update book title
Access             PUBLIC
Parameter          isbn
Methods            PUT
*/
Router.put("/update/:isbn", async (req, res) => {
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
Router.put("/author/update/:isbn", async (req, res) => {
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

    return res.json({ 
        books: updatedBook, 
        author: updatedAuthor, 
        message: "New author was added????" 
    });
});

/*
Route              /book/delete
Description        Delete a Book
Access             PUBLIC
Parameter          isbn
Methods            DELETE
*/
Router.delete("/delete/:isbn", async (req, res) => {

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
Router.delete("/delete/author/:isbn/:authorID", async (req, res) => {
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
        message: "author was deleted successfully????",
        book: updatedBook,
        author: updatedAuthor,
    });
});

module.exports = Router;
