const BookModel = require('../models/bookModel');

exports.addBook = async (req, res, next) => {
    try {
        const { category_id, title, author, description, condition_state, price, rental_price_per_day, available_quantity } = req.body;
        const seller_id = req.user.id;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        const bookId = await BookModel.createBook({
            seller_id,
            category_id,
            title,
            author,
            description,
            condition_state,
            price: price || null,
            rental_price_per_day: rental_price_per_day || null,
            available_quantity: available_quantity || 1,
            image_url
        });

        res.status(201).json({ message: 'Book listed successfully, pending approval', bookId });
    } catch (err) {
        next(err);
    }
};

exports.getBooks = async (req, res, next) => {
    try {
        const { search, category_id, condition_state, type, sort, order, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const result = await BookModel.getAllBooks({
            search, category_id, condition_state, type, sort, order, limit, offset
        });

        res.json({
            books: result.books,
            total: result.total,
            page: Number(page),
            totalPages: Math.ceil(result.total / limit)
        });
    } catch (err) {
        next(err);
    }
};

exports.getBookDetails = async (req, res, next) => {
    try {
        const book = await BookModel.getBookById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        next(err);
    }
};

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await BookModel.getCategories();
        res.json(categories);
    } catch (err) {
        next(err);
    }
};
