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

// --- Implementações da Task 11 (Axios / Async-Await & Promises) ---

// Get all books using async/await
public_users.get('/async-get-books', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Get book details by ISBN using Promises (.then/.catch)
public_users.get('/promise-get-isbn/:isbn', (req, res) => {
  axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(500).json({message: "Error fetching by ISBN"}));
});

// Get book details by Author using async/await
public_users.get('/async-get-author/:author', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({message: "Error fetching by Author"});
  }
});

// Get book details by Title using Promises (.then/.catch)
public_users.get('/promise-get-title/:title', (req, res) => {
  axios.get(`http://localhost:5000/title/${req.params.title}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(500).json({message: "Error fetching by Title"}));
});

module.exports.general = public_users;