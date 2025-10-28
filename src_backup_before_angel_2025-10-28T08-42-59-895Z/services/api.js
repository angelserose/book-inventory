import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/books';

export const fetchBooks = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createBook = async (bookData) => {
    const response = await axios.post(API_URL, bookData);
    return response.data;
};

export const updateBook = async (id, bookData) => {
    const response = await axios.put(`${API_URL}/${id}`, bookData);
    return response.data;
};

export const deleteBook = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};