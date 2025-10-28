import React, { createContext, useState, useEffect } from 'react';
import { fetchBooks, createBook, updateBook, deleteBook } from '../services/api';

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const data = await fetchBooks();
                setBooks(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, []);

    const addBook = async (book) => {
        try {
            const newBook = await createBook(book);
            setBooks((prevBooks) => [...prevBooks, newBook]);
        } catch (err) {
            setError(err);
        }
    };

    const editBook = async (id, updatedBook) => {
        try {
            const updated = await updateBook(id, updatedBook);
            setBooks((prevBooks) =>
                prevBooks.map((book) => (book.id === id ? updated : book))
            );
        } catch (err) {
            setError(err);
        }
    };

    const removeBook = async (id) => {
        try {
            await deleteBook(id);
            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
        } catch (err) {
            setError(err);
        }
    };

    return (
        <BookContext.Provider value={{ books, loading, error, addBook, editBook, removeBook }}>
            {children}
        </BookContext.Provider>
    );
};