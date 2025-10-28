import React, { useState, useEffect } from 'react';
import './EditBookModal.css';

const EditBookModal = ({ isOpen, onClose, book = {}, onUpdate }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        if (book) {
            setTitle(book.title || '');
            setAuthor(book.author || '');
            setDescription(book.description || '');
            setGenre(book.genre || '');
            setPrice(book.price != null ? String(book.price) : '');
        }
    }, [book]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedBook = {
            ...book,
            title,
            author,
            description,
            genre,
            price: price === '' ? undefined : parseFloat(price),
        };
        onUpdate(updatedBook);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Book</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Author:</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Genre:</label>
                        <input
                            type="text"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit">Update Book</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBookModal;