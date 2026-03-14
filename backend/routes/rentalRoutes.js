const express = require('express');
const rentalController = require('../controllers/rentalController');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/rentals
router.get('/', verifyToken, rentalController.getRentals);

// @route   PATCH /api/rentals/:id/return
router.patch('/:id/return', verifyToken, rentalController.returnBook);

module.exports = router;
