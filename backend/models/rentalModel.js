const pool = require('../config/db');

exports.getUserRentals = async (userId) => {
    const [rows] = await pool.query(`
    SELECT r.*, b.title, b.image_url, b.rental_price_per_day
    FROM rentals r
    JOIN books b ON r.book_id = b.id
    WHERE r.buyer_id = ?
    ORDER BY r.created_at DESC
  `, [userId]);
    return rows;
};

exports.returnRental = async (rentalId, lateFine) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Update rental status
        await connection.query(
            'UPDATE rentals SET status = ?, late_fine = ? WHERE id = ?',
            ['Returned', lateFine, rentalId]
        );

        // 2. Get book id and restock
        const [rentalResult] = await connection.query('SELECT book_id FROM rentals WHERE id = ?', [rentalId]);
        if (rentalResult.length > 0) {
            await connection.query(
                'UPDATE books SET available_quantity = available_quantity + 1 WHERE id = ?',
                [rentalResult[0].book_id]
            );
        }

        await connection.commit();
        return true;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};
