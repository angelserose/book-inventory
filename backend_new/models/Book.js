const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters long']
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true,
        minlength: [2, 'Author name must be at least 2 characters long']
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    isbn: {
        type: String,
        trim: true,
        sparse: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

// Create indexes for common queries
bookSchema.index({ title: 1, author: 1 });
bookSchema.index({ isbn: 1 }, { unique: true, sparse: true });
bookSchema.index({ genre: 1 });

module.exports = mongoose.model('Book', bookSchema);