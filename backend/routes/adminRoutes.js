const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const passport = require('passport');
require('../config/passport')(passport);

const {isAdmin} = require('../middleware/authorization');

router.get('/admintest', isAdmin, (req, res) => {
    res.status(200).send({message: 'only admin can see'})
});

module.exports = router;