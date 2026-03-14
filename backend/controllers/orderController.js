const OrderModel = require('../models/orderModel');

exports.placeOrder = async (req, res, next) => {
    try {
        const { items, total_amount } = req.body;
        const buyer_id = req.user.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const orderId = await OrderModel.createOrder(buyer_id, items, total_amount);
        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (err) {
        next(err);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await OrderModel.getUserOrders(req.user.id);
        res.json(orders);
    } catch (err) {
        next(err);
    }
};
