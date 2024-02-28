const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const passport = require('passport');
require('../config/passport')(passport);
const {isAdmin} = require('../middleware/authorization');

router.post('/add', isAdmin, productController.createProduct);
router.put('/:id', isAdmin, productController.updateProduct);
router.delete('/:id', isAdmin, productController.deleteProduct);
router.get('/:id', productController.getProduct);

/* router.get('/', (req, res) => {
    res.status(200).send({message: 'messages'})
}); */

module.exports = router;