const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
// const { isCurrentUser, isAdmin, isCurrentUserOrAdmin } = require('../middleware/authorization');

router.get('/', cartController.getCart);
router.delete('/', cartController.clearCart);
router.post('/add', cartController.addToCart);
router.delete('/:id', cartController.removeFromCart);
router.put('/:id', cartController.updateCartItem);
router.post('/checkout', cartController.checkout);

module.exports = router;