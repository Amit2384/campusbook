const express = require('express');
const { check } = require('express-validator');
const orderController = require('../controllers/orderController');
const { validate } = require('../middleware/validate');
const { verifyToken } = require('../middleware/auth');
const { isSeller } = require('../middleware/role');

const router = express.Router();

// @route   POST /api/orders
router.post('/', verifyToken,
    check('items', 'Items array is required').isArray(),
    check('total_amount', 'Total amount is required').isNumeric(),
    validate, orderController.placeOrder);

// @route   GET /api/orders/seller  — seller sees incoming orders for their books
router.get('/seller', verifyToken, isSeller, orderController.getSellerOrders);

// @route   PATCH /api/orders/:id/status  — seller updates order status
router.patch('/:id/status', verifyToken, isSeller,
    check('status', 'Status is required').notEmpty(),
    validate, orderController.updateOrderStatus);

// @route   GET /api/orders  — buyer sees their own orders
router.get('/', verifyToken, orderController.getOrders);

module.exports = router;
