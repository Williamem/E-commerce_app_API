module.exports = function errorHandler(err, req, res, next) {
    // Set default status as 500 (Internal Server Error)
    let status = err.status || 500;
    let message = err.message || 'Something went wrong';

    // If we're in development mode, we can add more detailed error info
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
        message = err.stack;
    }

    // Sending error response
    res.status(status).json({
        error: {
            message: message,
            status: status
        }
    });
};