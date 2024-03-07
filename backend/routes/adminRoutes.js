const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const passport = require('passport');
require('../config/passport')(passport);

const {isAdmin} = require('../middleware/authorization');

router.get('/users', isAdmin, adminController.getAllUsers);
router.get('/orders', isAdmin, adminController.getAllOrders);
router.get('/orders/:id', isAdmin, adminController.getOrderById);
router.put('/orders/:id', isAdmin, adminController.updateOrderById);
//handle products
router.post('/products/add', isAdmin, adminController.createProduct);
router.get('/products/:id', isAdmin, adminController.getProduct);
router.put('/products/:id', isAdmin, adminController.updateProduct);
router.delete('/products/:id', isAdmin, adminController.deleteProduct);

module.exports = router;