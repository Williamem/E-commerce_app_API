const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAdmin, isCurrentUserOrAdmin, isCurrentUser } = require('../middleware/authorization');

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);

module.exports = router;