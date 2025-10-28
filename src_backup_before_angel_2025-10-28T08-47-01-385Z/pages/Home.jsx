import React from 'react';
import AddBookForm from '../components/AddBookForm/AddBookForm';
import BookList from '../components/BookList/BookList';

const Home = () => {
    return (
        <div>
            <h1>Book Inventory</h1>
            <AddBookForm />
            <BookList />
        </div>
    );
};

export default Home;