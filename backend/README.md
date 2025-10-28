# Book Inventory Backend

This is a simple Express + MongoDB backend for the Book Inventory project. It exposes a small REST API under `/api/books` with full CRUD operations and validation.

## Quick start

1. Install dependencies

```powershell
cd backend
npm install
```

2. Create `.env` (or copy `.env.sample`) and configure `MONGODB_URI` and `PORT` if needed.

3. Start the server

```powershell
# development with auto-reload
npm run dev
# or production
npm start
```

4. API endpoints

- GET /api/books — list books
- POST /api/books — create book { title, author, isbn }
- PUT /api/books/:id — update book (any of title, author, isbn)
- DELETE /api/books/:id — delete book

5. CORS

The server allows cross-origin requests from `http://localhost:3000` by default. Change `CORS_ORIGIN` environment variable to allow other origins.

6. Notes

- Uses Mongoose for MongoDB. If you don't have MongoDB locally, you can use MongoDB Atlas — set `MONGODB_URI` accordingly.

