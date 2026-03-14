const pool = require('../config/db');

exports.addReview = async (buyerId, sellerId, rating, comment) => {
    const [result] = await pool.query(
        'INSERT INTO reviews (buyer_id, seller_id, rating, comment) VALUES (?, ?, ?, ?)',
        [buyerId, sellerId, rating, comment]
    );
    return result.insertId;
};

exports.getSellerReviews = async (sellerId) => {
    const [rows] = await pool.query(`
    SELECT r.*, u.name as buyer_name 
    FROM reviews r
    JOIN users u ON r.buyer_id = u.id
    WHERE r.seller_id = ?
    ORDER BY r.created_at DESC
  `, [sellerId]);

    const [avgRow] = await pool.query('SELECT AVG(rating) as average_rating FROM reviews WHERE seller_id = ?', [sellerId]);

    return {
        reviews: rows,
        average_rating: avgRow[0].average_rating ? Number(avgRow[0].average_rating).toFixed(1) : 0
    };
};
