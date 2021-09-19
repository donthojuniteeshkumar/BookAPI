const Router = require("express").Router();

/*
Route              /publications
Description        Get all publications 
Access             PUBLIC
Parameter          isbn
Methods            GET
*/
Router.get("/", (req, res) => {
    return res.json({ publications: database.publication });
});

/*
Route              /publication/update/book
Description        Update/add new Book to publication
Access             PUBLIC
Parameter          isbn
Methods            PUT
*/

Router.put("/update/book/:isbn", (req, res) => {
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
Router.delete("/delete/book/:isbn/:pubID", (req, res) => {
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

module.exports = Router;