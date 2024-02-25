const isAuthenticated = (req, res, next) => {
    if (req.user) return next();
    else {
        return res.status(401).json({
            error: 'user not authenticated'
        })
    }
}

module.exports = {
    isAuthenticated,
}