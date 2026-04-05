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

const UserModel = require('../models/userModel');
exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Optional: prevent deleting self
        if (req.user.id == id) {
            return res.status(400).json({ message: "Cannot delete your own admin account." });
        }
        const success = await UserModel.deleteUser(id);
        if (success) {
            res.json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
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

const OrderModel = require('../models/orderModel');
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await OrderModel.getAllOrders();
        res.json(orders);
    } catch (err) {
        next(err);
    }
};
