const pool = require('../config/db');
const BookModel = require('../models/bookModel');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const [users] = await pool.query('SELECT COUNT(*) as total FROM users');
        const [books] = await pool.query('SELECT COUNT(*) as total FROM books');
        const [rentals] = await pool.query('SELECT COUNT(*) as total FROM rentals');
        const [revenue] = await pool.query('SELECT SUM(total_amount) as total FROM orders WHERE status = "Completed"');

        res.json({
            totalUsers: users[0].total,
            totalBooksListed: books[0].total,
            totalRentals: rentals[0].total,
            totalRevenue: revenue[0].total || 0
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
      SELECT u.id, u.name, u.email, u.phone, u.created_at, r.name as role 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

exports.approveBookListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Live, Rejected, Removed
        await BookModel.updateBookStatus(id, status);
        res.json({ message: `Book listing updated to ${status}` });
    } catch (err) {
        next(err);
    }
};

exports.getPendingBooks = async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
      SELECT b.*, u.name as seller_name, c.name as category_name
      FROM books b
      JOIN users u ON b.seller_id = u.id
      JOIN categories c ON b.category_id = c.id
      WHERE b.status = 'Pending'
    `);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};
