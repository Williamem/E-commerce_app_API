const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAdmin, isCurrentUserOrAdmin } = require('../middleware/authorization');

router.get('/', orderController.getOrders);

module.exports = router;