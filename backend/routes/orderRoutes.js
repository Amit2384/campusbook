const express = require('express');
const { check } = require('express-validator');
const orderController = require('../controllers/orderController');
const { validate } = require('../middleware/validate');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
router.post('/', verifyToken,
    check('items', 'Items array is required').isArray(),
    check('total_amount', 'Total amount is required').isNumeric(),
    validate, orderController.placeOrder);

// @route   GET /api/orders
router.get('/', verifyToken, orderController.getOrders);

module.exports = router;
