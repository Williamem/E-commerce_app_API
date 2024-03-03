//ProductRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const searchAndFilterController = require('../controllers/searchAndFilterController');
const passport = require('passport');
require('../config/passport')(passport);
const {isAdmin} = require('../middleware/authorization');

//search and filter routes
router.get('/search/', searchAndFilterController.searchProducts);
router.get('/filter/:category', searchAndFilterController.filterProducts);
router.get('/categories', searchAndFilterController.getCategories);

router.post('/add', isAdmin, productController.createProduct);
router.put('/:id', isAdmin, productController.updateProduct);
router.delete('/:id', isAdmin, productController.deleteProduct);
router.get('/:id', productController.getProduct);
router.get('/', productController.getProducts);

/* router.get('/', (req, res) => {
    res.status(200).send({message: 'messages'})
}); */

module.exports = router;