import { useState, useEffect } from 'react';
import { fetchBooks } from '../services/api';

const useFetchBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getBooks = async () => {
            try {
                const data = await fetchBooks();
                setBooks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getBooks();
    }, []);

    return { books, loading, error };
};

export default useFetchBooks;