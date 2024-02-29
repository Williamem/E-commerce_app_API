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


module.exports = router;

