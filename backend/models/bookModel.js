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
