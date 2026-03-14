const RentalModel = require('../models/rentalModel');

exports.getRentals = async (req, res, next) => {
    try {
        const rentals = await RentalModel.getUserRentals(req.user.id);
        res.json(rentals);
    } catch (err) {
        next(err);
    }
};

exports.returnBook = async (req, res, next) => {
    try {
        const { late_fine } = req.body;
        await RentalModel.returnRental(req.params.id, late_fine || 0);
        res.json({ message: 'Book returned successfully' });
    } catch (err) {
        next(err);
    }
};
