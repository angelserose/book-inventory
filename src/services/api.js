import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || process.env.API_URL || 'http://localhost:5000/api/books';

// axios default timeout
axios.defaults.timeout = 5000;

const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

// small helper to simulate latency
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

// Mock in-memory store (used when REACT_APP_USE_MOCK=true)
const MOCK_DATA = [
    { id: '1', title: 'Mock Book A', author: 'Author A', isbn: '111' },
    { id: '2', title: 'Mock Book B', author: 'Author B', isbn: '222' },
];

let mockStore = [...MOCK_DATA];

function genId() {
    return String(Date.now() + Math.floor(Math.random() * 1000));
}

async function fetchBooksReal() {
    const response = await axios.get(API_URL);
    // Normalize backend responses that wrap payload in { success, data }
    const payload = response.data;
    return payload && payload.data !== undefined ? payload.data : payload;
}

async function createBookReal(bookData) {
    const response = await axios.post(API_URL, bookData);
    const payload = response.data;
    return payload && payload.data !== undefined ? payload.data : payload;
}

async function updateBookReal(id, bookData) {
    const response = await axios.put(`${API_URL}/${id}`, bookData);
    const payload = response.data;
    return payload && payload.data !== undefined ? payload.data : payload;
}

async function deleteBookReal(id) {
    const response = await axios.delete(`${API_URL}/${id}`);
    const payload = response.data;
    return payload && payload.data !== undefined ? payload.data : payload;
}

export const fetchBooks = async () => {
    if (USE_MOCK) {
        await delay();
        return [...mockStore];
    }
    return fetchBooksReal();
};

export const createBook = async (bookData) => {
    if (USE_MOCK) {
        await delay();
        const item = { id: genId(), ...bookData };
        mockStore.unshift(item);
        return item;
    }
    return createBookReal(bookData);
};

export const updateBook = async (id, bookData) => {
    if (USE_MOCK) {
        await delay();
        const idx = mockStore.findIndex((b) => b.id === id);
        if (idx === -1) throw new Error('Not found');
        mockStore[idx] = { ...mockStore[idx], ...bookData };
        return mockStore[idx];
    }
    return updateBookReal(id, bookData);
};

export const deleteBook = async (id) => {
    if (USE_MOCK) {
        await delay();
        mockStore = mockStore.filter((b) => b.id !== id);
        return { success: true };
    }
    return deleteBookReal(id);
};