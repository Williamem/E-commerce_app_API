const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAdmin, isCurrentUserOrAdmin, isCurrentUser } = require('../middleware/authorization');

router.get('/', orderController.getOrders);
router.get('/:id',/*  (req, res, next) => isCurrentUser(req.params.userId, req, res, next), */ orderController.getOrder);

module.exports = router;