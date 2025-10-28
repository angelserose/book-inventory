const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const booksController = require('../controllers/booksController');

// Validation rules
const createBookRules = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 2 })
        .withMessage('Title must be at least 2 characters long'),
    body('author')
        .trim()
        .notEmpty()
        .withMessage('Author is required')
        .isLength({ min: 2 })
        .withMessage('Author name must be at least 2 characters long'),
    body('genre')
        .trim()
        .notEmpty()
        .withMessage('Genre is required'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    body('isbn')
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage('ISBN must be at least 10 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters')
];

const updateBookRules = [
    param('id').isMongoId().withMessage('Invalid book ID'),
    body('title')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Title must be at least 2 characters long'),
    body('author')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Author name must be at least 2 characters long'),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer')
];

const updateStockRules = [
    param('id').isMongoId().withMessage('Invalid book ID'),
    body('stock')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer')
];

// Routes
router.get('/', [
    query('sort').optional(),
    query('genre').optional(),
    query('search').optional().trim()
], booksController.getBooks);

router.get('/:id',
    [param('id').isMongoId().withMessage('Invalid book ID')],
    validateRequest,
    booksController.getBookById
);

router.post('/',
    createBookRules,
    validateRequest,
    booksController.createBook
);

router.put('/:id',
    updateBookRules,
    validateRequest,
    booksController.updateBook
);

router.patch('/:id/stock',
    updateStockRules,
    validateRequest,
    booksController.updateStock
);

router.delete('/:id',
    [param('id').isMongoId().withMessage('Invalid book ID')],
    validateRequest,
    booksController.deleteBook
);

module.exports = router;