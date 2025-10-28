const { validationResult } = require('express-validator');
const Book = require('../models/Book');

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return null;
};

exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).lean();
    res.json(books);
  } catch (err) {
    next(err);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const validation = handleValidation(req, res);
    if (validation) return;
    const { title, author, isbn, genre, price, stock } = req.body;
    const book = new Book({ title, author, isbn, genre, price, stock });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const validation = handleValidation(req, res);
    if (validation) return;
    const { id } = req.params;
    const update = req.body;
    const book = await Book.findByIdAndUpdate(id, update, { new: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const validation = handleValidation(req, res);
    if (validation) return;
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
