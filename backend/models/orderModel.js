const pool = require('../config/db');

exports.createOrder = async (buyer_id, items, total_amount) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Create Order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (buyer_id, total_amount) VALUES (?, ?)',
            [buyer_id, total_amount]
        );
        const orderId = orderResult.insertId;

        // 2. Insert Order Items and Update Inventory
        for (const item of items) {
            // type: 'Purchase' or 'Rent'
            await connection.query(
                'INSERT INTO order_items (order_id, book_id, quantity, price_at_purchase, type) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.book_id, item.quantity, item.price, item.type]
            );

            // Update book quantity
            await connection.query(
                'UPDATE books SET available_quantity = available_quantity - ? WHERE id = ?',
                [item.quantity, item.book_id]
            );

            // If rent, add to rentals table (assuming start_date and end_date are passed)
            if (item.type === 'Rent') {
                const [orderItemResult] = await connection.query('SELECT LAST_INSERT_ID() as id');
                const orderItemId = orderItemResult[0].id;

                await connection.query(
                    'INSERT INTO rentals (order_item_id, buyer_id, book_id, rental_start_date, rental_end_date) VALUES (?, ?, ?, ?, ?)',
                    [orderItemId, buyer_id, item.book_id, item.start_date, item.end_date]
                );
            }
        }

        await connection.commit();
        return orderId;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

exports.getUserOrders = async (userId) => {
    const [orders] = await pool.query('SELECT * FROM orders WHERE buyer_id = ? ORDER BY created_at DESC', [userId]);

    for (let order of orders) {
        const [items] = await pool.query(`
      SELECT oi.*, b.title, b.image_url, b.seller_id, su.name as seller_name
      FROM order_items oi 
      JOIN books b ON oi.book_id = b.id 
      JOIN users su ON b.seller_id = su.id
      WHERE oi.order_id = ?`, [order.id]);
        order.items = items;
    }

    return orders;
};

exports.getSellerOrders = async (sellerId) => {
    // Get all orders that contain at least one book belonging to this seller
    const [orders] = await pool.query(`
        SELECT DISTINCT
            o.id, o.buyer_id, o.total_amount, o.status, o.created_at,
            u.name as buyer_name, u.email as buyer_email, u.phone as buyer_phone
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN books b ON oi.book_id = b.id
        JOIN users u ON o.buyer_id = u.id
        WHERE b.seller_id = ?
        ORDER BY o.created_at DESC
    `, [sellerId]);

    // For each order, get only the items belonging to this seller
    for (let order of orders) {
        const [items] = await pool.query(`
            SELECT oi.*, b.title, b.author, b.image_url, b.price, b.rental_price_per_day
            FROM order_items oi
            JOIN books b ON oi.book_id = b.id
            WHERE oi.order_id = ? AND b.seller_id = ?
        `, [order.id, sellerId]);
        order.items = items;
    }

    return orders;
};

exports.updateOrderStatus = async (orderId, status) => {
    const [result] = await pool.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
    );
    return result.affectedRows > 0;
};

exports.getAllOrders = async () => {
    const [orders] = await pool.query(`
        SELECT o.id, o.buyer_id, o.total_amount, o.status, o.created_at,
               u.name as buyer_name, u.email as buyer_email
        FROM orders o
        JOIN users u ON o.buyer_id = u.id
        ORDER BY o.created_at DESC
    `);
    
    for (let order of orders) {
        const [items] = await pool.query(`
            SELECT oi.*, b.title, b.author
            FROM order_items oi
            JOIN books b ON oi.book_id = b.id
            WHERE oi.order_id = ?
        `, [order.id]);
        order.items = items;
    }
    return orders;
};
