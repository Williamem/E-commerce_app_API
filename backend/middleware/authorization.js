const isAdmin = (req, res, next) => {
    if (req.user && req.user.dataValues.role_id === 1) {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized' }); // User is not authorized
    }
};

module.exports = {
    isAdmin,
}