const isAdmin = (req, res, next) => {
  if (req.user && req.user.dataValues.role_id === 1) {
    next();
  } else {
    res.status(403).json({ error: "Unauthorized" }); // User is not authorized
  }
};

// authorization.js
const isCurrentUser = (idToAccess, req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "User is not signed in" }); // Unauthorized: User is not signed in
  }
  if (parseInt(req.user.dataValues.id) === parseInt(idToAccess)) {
    next(); // User authorized, continue to the next middleware or route handler
  } else {
    res.status(403).json({ error: "Unauthorized" }); // User is not authorized
  }
};

const isCurrentUserOrAdmin = (idToAccess, req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "User is not signed in" }); // Unauthorized: User is not signed in
  }
  if (
    req.user.dataValues.id === parseInt(idToAccess) ||
    req.user.dataValues.role_id === 1
  ) {
    next(); // User is authorized, continue to the next middleware or route handler
  } else {
    res.status(403).json({ error: "Unauthorized" }); // User is not authorized
  }
};

module.exports = {
  isAdmin,
  isCurrentUser,
  isCurrentUserOrAdmin,
};
