const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const passport = require('passport');
require('../config/passport')(passport);

const {isAdmin} = require('../middleware/authorization');

//router.get('/users',/*  passport.authenticate('jwt', { session: false }),  */isAdmin, adminController.getAllUsers);

module.exports = router;