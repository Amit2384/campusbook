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

exports.getSellerOrders = async (req, res, next) => {
    try {
        const orders = await OrderModel.getSellerOrders(req.user.id);
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowed = ['Confirmed', 'Completed', 'Cancelled'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be Confirmed, Completed, or Cancelled.' });
        }
        const updated = await OrderModel.updateOrderStatus(req.params.id, status);
        if (!updated) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: `Order marked as ${status}` });
    } catch (err) {
        next(err);
    }
};
