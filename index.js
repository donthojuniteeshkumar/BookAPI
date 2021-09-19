require("dotenv").config();

//Frame work
const express = require("express");
const mongoose = require("mongoose");

// Micrpservices Routers
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication")

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
booky.use("/author", Authors);
booky.use("/publication", Publications);

const port=3000
booky.listen(port, () => console.log(`Hey server is running on 👍 ->  ${port}`));