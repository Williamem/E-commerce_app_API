//ProductRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const searchAndFilterController = require('../controllers/searchAndFilterController');
const passport = require('passport');
require('../config/passport')(passport);
const {isAdmin, isCurrentUser} = require('../middleware/authorization');

//search and filter routes
router.get('/search/', searchAndFilterController.searchProducts);
router.get('/filter/:category', searchAndFilterController.filterProducts);
router.get('/categories', searchAndFilterController.getCategories);

router.get('/:id', productController.getProduct);
router.get('/', productController.getProducts);

module.exports = router;