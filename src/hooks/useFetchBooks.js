import { useState, useEffect, useCallback } from 'react';
import { fetchBooks } from '../services/api';

const MOCK_DATA = [
  { id: '1', title: 'Mock Book A', author: 'Author A', isbn: '111' },
  { id: '2', title: 'Mock Book B', author: 'Author B', isbn: '222' },
];

const useFetchBooks = (opts = {}) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const useMock = process.env.REACT_APP_USE_MOCK === 'true' || opts.useMock;

    const getBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (useMock) {
                // small artificial delay to simulate network
                await new Promise(r => setTimeout(r, 200));
                setBooks(MOCK_DATA);
            } else {
                const data = await fetchBooks();
                setBooks(data || []);
            }
        } catch (err) {
            // err may be AxiosError
            const msg = err?.response?.data?.message || err.message || String(err);
            // If it's a network error, automatically fall back to mock data so UI is usable
            const isNetwork = msg && (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('ecconnrefused'));
            if (isNetwork) {
                setBooks(MOCK_DATA);
                setError('Network error — showing mock data');
            } else {
                setError(msg);
                setBooks([]);
            }
        } finally {
            setLoading(false);
        }
    }, [useMock]);

    useEffect(() => {
        getBooks();
    }, [getBooks]);

    return { books, loading, error, refetch: getBooks };
};

export default useFetchBooks;