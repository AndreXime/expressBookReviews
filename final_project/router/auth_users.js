const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

const JWT_SECRET = "fingerprint_customer";

let users = [];

const isValid = (username) => users.some((u) => u.username === username);

const authenticatedUser = (username, password) =>
  users.some((u) => u.username === username && u.password === password);

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  req.session.authorization = { accessToken };
  return res.json({ message: "Login successful", accessToken });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const review = req.body.review ?? req.query.review;
  if (review === undefined || review === "") {
    return res.status(400).json({ message: "Review text required" });
  }
  const username = req.user?.username;
  if (!username) return res.status(403).json({ message: "Unauthorized" });
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (!book.reviews) book.reviews = {};
  book.reviews[username] = String(review);
  return res.json({ message: "Review added/updated" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user?.username;
  if (!username) return res.status(403).json({ message: "Unauthorized" });
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (book.reviews && book.reviews[username]) {
    delete book.reviews[username];
  }
  return res.json({ message: "Review deleted" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
