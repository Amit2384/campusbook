const ReviewModel = require('../models/reviewModel');

exports.addReview = async (req, res, next) => {
    try {
        const { seller_id, rating, comment } = req.body;
        await ReviewModel.addReview(req.user.id, seller_id, rating, comment);
        res.status(201).json({ message: 'Review added successfully' });
    } catch (err) {
        next(err);
    }
};

exports.getSellerReviews = async (req, res, next) => {
    try {
        const reviews = await ReviewModel.getSellerReviews(req.params.seller_id);
        res.json(reviews);
    } catch (err) {
        next(err);
    }
};
