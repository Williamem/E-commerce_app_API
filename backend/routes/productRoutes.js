const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const passport = require('passport');
require('../config/passport')(passport);
const {isAdmin} = require('../middleware/authorization');

router.post('/add', isAdmin, productController.createProduct)

/* router.get('/', (req, res) => {
    res.status(200).send({message: 'messages'})
}); */

module.exports = router;