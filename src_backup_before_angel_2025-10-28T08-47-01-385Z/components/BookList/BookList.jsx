import React from 'react';
import { useFetchBooks } from '../../hooks/useFetchBooks';

const BookList = () => {
    const { books, loading, error } = useFetchBooks();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching books: {error.message}</div>;

    return (
        <div>
            <h2>Book List</h2>
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookList;