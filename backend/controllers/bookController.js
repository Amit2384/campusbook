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

exports.getSellerListings = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        const listings = await BookModel.getSellerListings(sellerId);
        res.json(listings);
    } catch (err) {
        next(err);
    }
};

exports.getSellerStats = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        const stats = await BookModel.getSellerStats(sellerId);
        res.json(stats);
    } catch (err) {
        next(err);
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const sellerId = req.user.id;

        const result = await BookModel.deleteBook(bookId, sellerId);

        if (result.error === 'cannot_delete_has_orders') {
            return res.status(400).json({
                message: 'Cannot delete a book that has existing orders. Remove the listing by marking it unavailable instead.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found or you do not have permission to delete it.' });
        }

        res.json({ message: 'Book listing deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.removeListing = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const sellerId = req.user.id;

        const affectedRows = await BookModel.setBookRemoved(bookId, sellerId);

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found or you do not have permission to update it.' });
        }

        res.json({ message: 'Listing removed successfully. The book is no longer visible to buyers.' });
    } catch (err) {
        next(err);
    }
};


