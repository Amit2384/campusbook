const express = require('express');
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

const router = express.Router();

// Apply middleware to all admin routes
router.use(verifyToken, isAdmin);

// @route   GET /api/admin/dashboard
router.get('/dashboard', adminController.getDashboardStats);

// @route   GET /api/admin/users
router.get('/users', adminController.getAllUsers);

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', adminController.deleteUser);

// @route   GET /api/admin/books/pending
router.get('/books/pending', adminController.getPendingBooks);

// @route   PATCH /api/admin/books/:id/status
router.patch('/books/:id/status', adminController.approveBookListing);

// @route   GET /api/admin/orders
router.get('/orders', adminController.getAllOrders);

module.exports = router;
