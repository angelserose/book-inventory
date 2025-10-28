import React, { useState } from 'react';

const AddBookForm = ({ onAddBook }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [isbn, setIsbn] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !author || !isbn) {
            setError('All fields are required');
            return;
        }
        onAddBook({ title, author, isbn });
        setTitle('');
        setAuthor('');
        setIsbn('');
        setError('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add New Book</h2>
            {error && <p className="error">{error}</p>}
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label>Author:</label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
            </div>
            <div>
                <label>ISBN:</label>
                <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                />
            </div>
            <button type="submit">Add Book</button>
        </form>
    );
};

export default AddBookForm;