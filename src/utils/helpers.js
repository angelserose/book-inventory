export const validateBookData = (book) => {
    const { title, author, isbn } = book;
    if (!title || !author || !isbn) {
        return false;
    }
    return true;
};

export const formatBookData = (book) => {
    return {
        ...book,
        title: book.title.trim(),
        author: book.author.trim(),
        isbn: book.isbn.trim(),
    };
};