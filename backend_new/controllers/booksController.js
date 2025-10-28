const Book = require('../models/Book');

// Get all books with optional filtering and sorting
exports.getBooks = async (req, res) => {
    try {
        const { sort = '-createdAt', genre, search } = req.query;
        
        // Build query
        let query = {};
        
        // Add genre filter if provided
        if (genre) {
            query.genre = { $regex: genre, $options: 'i' };
        }
        
        // Add search across title, author, and description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const books = await Book.find(query)
            .sort(sort)
            .lean()
            .exec();

        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error('Error in getBooks:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching books',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).lean();
        
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error('Error in getBookById:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching book',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Create a new book
exports.createBook = async (req, res) => {
    try {
        const { title, author, genre, price, stock, isbn, description } = req.body;

        // Create book
        const book = new Book({
            title,
            author,
            genre,
            price: Number(price),
            stock: Number(stock || 0),
            isbn,
            description
        });

        // Save book
        await book.save();

        res.status(201).json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error('Error in createBook:', error);
        
        // Handle duplicate ISBN error
        if (error.code === 11000 && error.keyPattern?.isbn) {
            return res.status(400).json({
                success: false,
                error: 'A book with this ISBN already exists'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Error creating book',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update a book
exports.updateBook = async (req, res) => {
    try {
        const updates = { ...req.body };
        
        // Convert numeric strings to numbers
        if ('price' in updates) updates.price = Number(updates.price);
        if ('stock' in updates) updates.stock = Number(updates.stock);

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { 
                new: true,
                runValidators: true
            }
        ).lean();

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error('Error in updateBook:', error);
        res.status(500).json({
            success: false,
            error: 'Error updating book',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete a book
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteBook:', error);
        res.status(500).json({
            success: false,
            error: 'Error deleting book',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update book stock
exports.updateStock = async (req, res) => {
    try {
        const { stock } = req.body;
        
        if (stock == null) {
            return res.status(400).json({
                success: false,
                error: 'Stock value is required'
            });
        }

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: { stock: Number(stock) } },
            { 
                new: true,
                runValidators: true
            }
        ).lean();

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error('Error in updateStock:', error);
        res.status(500).json({
            success: false,
            error: 'Error updating stock',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};