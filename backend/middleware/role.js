exports.isRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Require Role: ' + roles.join(' or ') });
        }
        next();
    };
};

exports.isAdmin = exports.isRole(['Admin']);
exports.isSeller = exports.isRole(['Seller', 'Admin']); // Admins can do what sellers do
exports.isBuyer = exports.isRole(['Buyer', 'Admin']); // Admins can do what buyers do
