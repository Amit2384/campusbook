const WishlistModel = require('../models/wishlistModel');

exports.add = async (req, res, next) => {
    try {
        const { book_id } = req.body;
        await WishlistModel.addToWishlist(req.user.id, book_id);
        res.status(201).json({ message: 'Added to wishlist' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Book already in wishlist' });
        }
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const { book_id } = req.params;
        await WishlistModel.removeFromWishlist(req.user.id, book_id);
        res.json({ message: 'Removed from wishlist' });
    } catch (err) {
        next(err);
    }
};

exports.get = async (req, res, next) => {
    try {
        const items = await WishlistModel.getUserWishlist(req.user.id);
        res.json(items);
    } catch (err) {
        next(err);
    }
};
