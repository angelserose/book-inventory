import React from 'react';
import AddBookForm from '../components/AddBookForm/AddBookForm';
import BookList from '../components/BookList/BookList';
import useFetchBooks from '../hooks/useFetchBooks';
import { createBook } from '../services/api';

const Home = () => {
    const { books, loading, error, refetch } = useFetchBooks();

    const handleAddBook = async (bookData) => {
        try {
            await createBook(bookData);
            // refresh list
            await refetch();
        } catch (err) {
            // swallow — refetch will show error if any
            console.error('Add book failed', err);
            await refetch();
        }
    };

    return (
        <div className="container">
            <h1>Book Inventory</h1>
            <div className="grid">
                <div className="col form-col">
                    <AddBookForm onAddBook={handleAddBook} />
                </div>
                <div className="col list-col">
                    <BookList books={books} loading={loading} error={error} onRetry={refetch} />
                </div>
            </div>
        </div>
    );
};

export default Home;