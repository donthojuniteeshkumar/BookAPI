const books = [
    {
      ISBN: "12345Book",
      title: "Getting started with MERN",
      pubDate: "2021-07-07",
      language: ["en", "tel", "hin"],
      numPage: 250,
      author: [1, 2],
      publications: [1],
      category: ["tech", "Programmming", "education", "thriller"],
    }
];


const author = [
    {
        id: 1,
        name: "Niteesh",
        books: ["12345Book", "123456789Secret"],
    },
    {id:2, name: "Rajesh", books: ["12345Book"]},
];

const publication = [
    {
        id: 1,
        name: "Writex",
        books: ["12345Book"],
    },
];

module.exports = { books, author, publication };