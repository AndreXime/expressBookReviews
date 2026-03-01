const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// Task 2: Get all books
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Task 3: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 4: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const byAuthor = Object.values(books).filter(
    (b) => b.author && b.author.toLowerCase() === author.toLowerCase()
  );
  if(byAuthor.length > 0) {
      return res.status(200).json(byAuthor);
  }
  return res.status(404).json({message: "Author not found"});
});

// Task 5: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const byTitle = Object.values(books).filter(
    (b) => b.title && b.title.toLowerCase() === title.toLowerCase()
  );
  if(byTitle.length > 0) {
      return res.status(200).json(byTitle);
  }
  return res.status(404).json({message: "Title not found"});
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews || {});
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 11: Async/Await & Axios - Get all books (async/await + axios.get)
public_users.get('/async-get-books', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book by ISBN (Promises .then/.catch + axios.get)
public_users.get('/async-get-isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get("http://localhost:5000/isbn/" + isbn)
    .then(function (response) {
      return res.status(200).json(response.data);
    })
    .catch(function (error) {
      return res.status(500).json({ message: "Error fetching by ISBN" });
    });
});

// Task 11: Get books by Author (async/await + axios.get)
public_users.get('/async-get-author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get("http://localhost:5000/author/" + encodeURIComponent(author));
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching by Author" });
  }
});

// Task 11: Get books by Title (Promises .then/.catch + axios.get)
public_users.get('/async-get-title/:title', function (req, res) {
  const title = req.params.title;
  axios.get("http://localhost:5000/title/" + encodeURIComponent(title))
    .then(function (response) {
      return res.status(200).json(response.data);
    })
    .catch(function (error) {
      return res.status(500).json({ message: "Error fetching by Title" });
    });
});

module.exports.general = public_users;