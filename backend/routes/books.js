const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const booksController = require('../controllers/booksController');

// GET /api/books
router.get('/', booksController.getBooks);

// POST /api/books
router.post(
  '/',
  [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('author').isString().notEmpty().withMessage('Author is required'),
    body('genre').isString().notEmpty().withMessage('Genre is required'),
    body('price').isFloat({ gt: -1 }).withMessage('Price is required and must be a number'),
  ],
  booksController.createBook
);

// PUT /api/books/:id
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid id'),
    body('title').optional().isString(),
    body('author').optional().isString(),
    body('genre').optional().isString(),
    body('price').optional().isFloat({ gt: -1 }),
    body('stock').optional().isInt({ min: 0 }),
  ],
  booksController.updateBook
);

// DELETE /api/books/:id
router.delete('/:id', [param('id').isMongoId().withMessage('Invalid id')], booksController.deleteBook);

module.exports = router;
