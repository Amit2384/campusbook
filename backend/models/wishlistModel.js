const pool = require('../config/db');

exports.addToWishlist = async (userId, bookId) => {
    const [result] = await pool.query(
        'INSERT IGNORE INTO wishlist (user_id, book_id) VALUES (?, ?)',
        [userId, bookId]
    );
    return result.insertId;
};

exports.removeFromWishlist = async (userId, bookId) => {
    const [result] = await pool.query(
        'DELETE FROM wishlist WHERE user_id = ? AND book_id = ?',
        [userId, bookId]
    );
    return result.affectedRows;
};

exports.getUserWishlist = async (userId) => {
    const [rows] = await pool.query(`
    SELECT w.id as wishlist_id, b.* 
    FROM wishlist w
    JOIN books b ON w.book_id = b.id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `, [userId]);
    return rows;
};
