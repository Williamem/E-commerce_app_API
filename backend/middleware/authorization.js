const isAdmin = (req, res, next) => {
    if (req.user && req.user.dataValues.role_id === 1) {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized' }); // User is not authorized
    }
};

// authorization.js
const isCurrentUser = (idToAccess, req, res, next) => {
    console.log('idToAccess: ', idToAccess);
    console.log('req.user.datavalues.id ', req.user.dataValues.id)
    if (req.user && parseInt(req.user.dataValues.id) === parseInt(idToAccess)) {
        next(); // User authorized, continue to the next middleware or route handler
    } else {
        res.status(403).json({ error: 'Unauthorized' }); // User is not authorized
    }
}

module.exports = {
    isAdmin,
    isCurrentUser,
}