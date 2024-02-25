const isAdmin = (req, res, next) => {
    console.log('req.user:')
    console.dir(req.user);
    if (req.user && req.user.dataValues.role_id === 1) {
        console.log('authorized admin');
        next(); // User is authorized, proceed to the next middleware or route handler
    } else {
        res.status(403).json({ error: 'Unauthorized' }); // User is not authorized
    }
};

module.exports = {
    isAdmin,
}