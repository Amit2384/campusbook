const express = require('express');
const { check } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const { validate } = require('../middleware/validate');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/reviews
router.post('/', verifyToken,
    check('seller_id', 'Seller ID is required').isInt(),
    check('rating', 'Rating is required (1-5)').isIn(['1', '2', '3', '4', '5']),
    check('comment', 'Comment is optional but must be string').optional().isString(),
    validate, reviewController.addReview);

// @route   GET /api/reviews/:seller_id
router.get('/:seller_id', reviewController.getSellerReviews);

module.exports = router;
