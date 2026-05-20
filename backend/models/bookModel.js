const pool = require('../config/db');

exports.createBook = async (bookData) => {
    const { seller_id, category_id, title, author, description, condition_state, price, rental_price_per_day, available_quantity, image_url } = bookData;
    const [result] = await pool.query(`
    INSERT INTO books 
    (seller_id, category_id, title, author, description, condition_state, price, rental_price_per_day, available_quantity, image_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [seller_id, category_id, title, author, description, condition_state, price, rental_price_per_day, available_quantity, image_url]);
    return result.insertId;
};

exports.getAllBooks = async ({ search, category_id, condition_state, type, sort = 'created_at', order = 'DESC', limit = 10, offset = 0 }) => {
    let query = `
    SELECT b.*, u.name as seller_name, c.name as category_name
    FROM books b
    JOIN users u ON b.seller_id = u.id
    JOIN categories c ON b.category_id = c.id
    WHERE b.status = 'Live' AND b.available_quantity > 0
  `;
    const params = [];

    if (search) {
        query += ` AND (b.title LIKE ? OR b.author LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }
    if (category_id) {
        query += ` AND b.category_id = ?`;
        params.push(category_id);
    }
    if (condition_state) {
        query += ` AND b.condition_state = ?`;
        params.push(condition_state);
    }
    if (type === 'Sale') {
        query += ` AND b.price IS NOT NULL`;
    } else if (type === 'Rent') {
        query += ` AND b.rental_price_per_day IS NOT NULL`;
    }

    // Order by
    const allowedSorts = ['price', 'created_at'];
    const sortCol = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY b.${sortCol} ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = `
    SELECT COUNT(*) as total
    FROM books b
    WHERE b.status = 'Live' AND b.available_quantity > 0
  `;
    const countParams = [];
    if (search) {
        countQuery += ` AND (b.title LIKE ? OR b.author LIKE ?)`;
        countParams.push(`%${search}%`, `%${search}%`);
    }
    if (category_id) {
        countQuery += ` AND b.category_id = ?`;
        countParams.push(category_id);
    }
    if (condition_state) {
        countQuery += ` AND b.condition_state = ?`;
        countParams.push(condition_state);
    }
    if (type === 'Sale') {
        countQuery += ` AND b.price IS NOT NULL`;
    } else if (type === 'Rent') {
        countQuery += ` AND b.rental_price_per_day IS NOT NULL`;
    }
    const [countRows] = await pool.query(countQuery, countParams);

    return { books: rows, total: countRows[0].total };
};

exports.getBookById = async (id) => {
    const [rows] = await pool.query(`
    SELECT b.*, u.name as seller_name, c.name as category_name,
    (SELECT AVG(rating) FROM reviews WHERE seller_id = b.seller_id) as seller_rating
    FROM books b
    JOIN users u ON b.seller_id = u.id
    JOIN categories c ON b.category_id = c.id
    WHERE b.id = ?
  `, [id]);
    return rows[0];
};

exports.updateBookStatus = async (id, status) => {
    const [result] = await pool.query('UPDATE books SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows;
};

exports.getCategories = async () => {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows;
};

exports.getSellerListings = async (sellerId) => {
    const [rows] = await pool.query(`
    SELECT 
      b.*,
      c.name as category_name,
      COALESCE(SUM(CASE WHEN oi.type = 'Purchase' THEN oi.quantity ELSE 0 END), 0) as total_sold,
      COALESCE(SUM(CASE WHEN oi.type = 'Rent' THEN oi.quantity ELSE 0 END), 0) as total_rented,
      COALESCE(SUM(oi.price_at_purchase * oi.quantity), 0) as total_revenue
    FROM books b
    JOIN categories c ON b.category_id = c.id
    LEFT JOIN order_items oi ON oi.book_id = b.id
    WHERE b.seller_id = ?
    GROUP BY b.id, b.seller_id, b.category_id, b.title, b.author, b.description,
             b.condition_state, b.price, b.rental_price_per_day, b.available_quantity,
             b.image_url, b.status, b.created_at, c.id, c.name
    ORDER BY b.created_at DESC
  `, [sellerId]);
    return rows;
};

exports.setBookRemoved = async (bookId, sellerId) => {
    const [result] = await pool.query(
        "UPDATE books SET status = 'Removed', available_quantity = 0 WHERE id = ? AND seller_id = ?",
        [bookId, sellerId]
    );
    return result.affectedRows;
};

exports.deleteBook = async (bookId, sellerId) => {
    // Prevent deletion if the book has any associated order items (preserve order history)
    const [orderCheck] = await pool.query(
        'SELECT COUNT(*) as cnt FROM order_items WHERE book_id = ?',
        [bookId]
    );
    if (orderCheck[0].cnt > 0) {
        return { error: 'cannot_delete_has_orders' };
    }

    const [result] = await pool.query(
        'DELETE FROM books WHERE id = ? AND seller_id = ?',
        [bookId, sellerId]
    );
    return { affectedRows: result.affectedRows };
};

exports.getSellerStats = async (sellerId) => {
    const [[listings]] = await pool.query(
        'SELECT COUNT(*) as total_listed FROM books WHERE seller_id = ?',
        [sellerId]
    );
    const [[sales]] = await pool.query(`
        SELECT 
          COALESCE(SUM(CASE WHEN oi.type = 'Purchase' THEN oi.quantity ELSE 0 END), 0) as books_sold,
          COALESCE(SUM(CASE WHEN oi.type = 'Rent' THEN oi.quantity ELSE 0 END), 0) as books_rented,
          COALESCE(SUM(oi.price_at_purchase * oi.quantity), 0) as total_revenue
        FROM order_items oi
        JOIN books b ON oi.book_id = b.id
        WHERE b.seller_id = ?
    `, [sellerId]);
    const [[ratingRow]] = await pool.query(
        'SELECT AVG(rating) as avg_rating FROM reviews WHERE seller_id = ?',
        [sellerId]
    );
    return {
        totalListed: listings.total_listed,
        booksSold: sales.books_sold,
        booksRented: sales.books_rented,
        totalRevenue: Number(sales.total_revenue).toFixed(2),
        avgRating: ratingRow.avg_rating ? Number(ratingRow.avg_rating).toFixed(1) : null
    };
};
