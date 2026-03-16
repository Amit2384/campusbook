const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
router.post('/register',
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['Buyer', 'Seller', 'Admin']),
    validate, authController.register);

// @route   POST /api/auth/login
router.post('/login',
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    validate, authController.login);

// @route   GET /api/auth/profile
router.get('/profile', verifyToken, authController.getProfile);

// @route   POST /api/auth/reset-password
router.post('/reset-password',
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    validate, authController.resetPassword);

module.exports = router;
