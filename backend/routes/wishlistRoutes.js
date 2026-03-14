const express = require('express');
const { check } = require('express-validator');
const wishlistController = require('../controllers/wishlistController');
const { validate } = require('../middleware/validate');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/wishlist
router.post('/', verifyToken, [
    check('book_id', 'Book ID is required').isInt()
], validate, wishlistController.add);

// @route   DELETE /api/wishlist/:book_id
router.delete('/:book_id', verifyToken, wishlistController.remove);

// @route   GET /api/wishlist
router.get('/', verifyToken, wishlistController.get);

module.exports = router;
