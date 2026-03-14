const errorHandler = (err, req, res, next) => {
    console.error('=== ERROR ===');
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('Stack:', err.stack);
    res.status(500).json({
        message: err.message || 'Internal Server Error',
        error: err.stack
    });
};

module.exports = errorHandler;
