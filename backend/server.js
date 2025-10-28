const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const booksRouter = require('./routes/books');

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/book_inventory';

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    // don't exit immediately — allow process to fail later if needed
  }

  const app = express();
  app.use(express.json());

  // CORS - allow frontend dev server
  app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));

  app.get('/', (req, res) => res.json({ ok: true, message: 'Book Inventory API' }));

  app.use('/api/books', booksRouter);

  // 404
  app.use((req, res, next) => {
    res.status(404).json({ error: 'Not found' });
  });

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start();
