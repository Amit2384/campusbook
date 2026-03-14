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
      SELECT oi.*, b.title, b.image_url 
      FROM order_items oi 
      JOIN books b ON oi.book_id = b.id 
      WHERE oi.order_id = ?`, [order.id]);
        order.items = items;
    }

    return orders;
};
