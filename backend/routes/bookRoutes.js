const express = require('express');
const { check } = require('express-validator');
const bookController = require('../controllers/bookController');
const { validate } = require('../middleware/validate');
const { verifyToken } = require('../middleware/auth');
const { isSeller, isAdmin } = require('../middleware/role');
const upload = require('../utils/upload');

const router = express.Router();

// @route   GET /api/books/categories
router.get('/categories', bookController.getCategories);

// @route   POST /api/books
router.post('/', verifyToken, isSeller, upload.single('image'),
    check('category_id', 'Category ID is required').isInt(),
    check('title', 'Title is required').not().isEmpty(),
    check('author', 'Author is required').not().isEmpty(),
    check('condition_state', 'Condition is required (New, Good, Acceptable)').isIn(['New', 'Good', 'Acceptable']),
    validate, bookController.addBook);

// @route   GET /api/books/seller/listings  (seller's own books)
router.get('/seller/listings', verifyToken, isSeller, bookController.getSellerListings);

// @route   GET /api/books/seller/stats  (aggregate stats for logged-in seller)
router.get('/seller/stats', verifyToken, isSeller, bookController.getSellerStats);

// @route   GET /api/books
router.get('/', bookController.getBooks);

// @route   GET /api/books/:id
router.get('/:id', bookController.getBookDetails);

module.exports = router;
