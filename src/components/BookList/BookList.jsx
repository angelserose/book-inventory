import React from 'react';

const BookList = ({ books = [], loading, error, onRetry, onDelete, onEdit }) => {
    const API_URL = process.env.REACT_APP_API_URL || process.env.API_URL || 'http://localhost:5000/api/books';
    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="book-list">
            <h2>Book List</h2>
            {/* Hide the full error banner when we fell back to mock data (network error).
                Instead show a small unobtrusive info line and a link to the API so the user
                can open it in the browser and diagnose the backend. */}
            {error && !error.toLowerCase().includes('network') && (
                <div className="error-banner">{error} <button onClick={onRetry}>Retry</button></div>
            )}
            {error && error.toLowerCase().includes('network') && (
                <div className="info-line">
                    Backend not reachable — showing mock data. 
                    <a href={API_URL} target="_blank" rel="noreferrer">Open API</a>
                </div>
            )}
            {books.length === 0 ? (
                <p>No books found.</p>
            ) : (
                <ul>
                    {books.map(book => (
                        <li key={book._id || book.id} className="book-item">
                            <div className="book-title">{book.title}</div>
                            <div className="book-meta">{book.author} — {book.genre} — ${book.price}</div>
                            <div style={{marginTop:8}}>
                                <button style={{marginRight:8}} onClick={() => onEdit && onEdit(book)}>Edit</button>
                                <button onClick={() => onDelete && onDelete(book._id || book.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookList;