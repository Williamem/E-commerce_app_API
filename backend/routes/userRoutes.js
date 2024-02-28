const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');
require('../config/passport')(passport);
const { isCurrentUser, isAdmin } = require('../middleware/authorization');

router.post('/register', userController.createUser);
router.post('/login', passport.authenticate('local'), userController.login);
router.get('/logout', userController.logout);

// profile routes
router.post('/:userId/address', (req, res, next) => isCurrentUser(req.params.userId, req, res, next), userController.createAddress);

module.exports = router;

