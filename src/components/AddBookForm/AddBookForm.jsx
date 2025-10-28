import React, { useState } from 'react';

const AddBookForm = ({ onAddBook }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [isbn, setIsbn] = useState('');
    const [genre, setGenre] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !author || !genre || price === '') {
            setError('Title, author, genre and price are required');
            return;
        }
        setSaving(true);
        try {
            await onAddBook({ title, author, isbn, genre, price: parseFloat(price) });
            setTitle('');
            setAuthor('');
            setIsbn('');
            setGenre('');
            setPrice('');
            setError('');
        } catch (err) {
            setError(err?.message || 'Failed to add book');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-book-form">
            <h2>Add New Book</h2>
            {error && <p className="error">{error}</p>}
            <div className="form-group">
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Author:</label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>ISBN:</label>
                <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Genre:</label>
                <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Price:</label>
                <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <button type="submit" disabled={saving}>{saving ? 'Adding...' : 'Add Book'}</button>
        </form>
    );
};

export default AddBookForm;