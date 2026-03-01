const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
const public_users = express.Router();

public_users.get('/', (req, res) => {
  return res.json(books);
});

public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.json(book);
});

public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;
  const byAuthor = Object.values(books).filter(
    (b) => b.author && b.author.toLowerCase().includes(author.toLowerCase())
  );
  return res.json(byAuthor);
});

public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;
  const byTitle = Object.values(books).filter(
    (b) => b.title && b.title.toLowerCase().includes(title.toLowerCase())
  );
  return res.json(byTitle);
});

public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.json(book.reviews || {});
});

function getBooksAsync() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 100);
  });
}

async function getBooksViaAxios() {
  const { data } = await axios.get("http://localhost:5000/");
  return data;
}

module.exports.general = public_users;
module.exports.getBooksAsync = getBooksAsync;
module.exports.getBooksViaAxios = getBooksViaAxios;
