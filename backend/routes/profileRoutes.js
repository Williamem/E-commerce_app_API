const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isCurrentUserOrAdmin } = require('../middleware/authorization');


router.get('/:userId', (req, res, next) => isCurrentUserOrAdmin(req.params.userId, req, res, next), profileController.getUserProfile);
router.post('/:userId/address', (req, res, next) => isCurrentUserOrAdmin(req.params.userId, req, res, next), profileController.createAddress);
router.put('/:userId/address/:addressId', (req, res, next) => isCurrentUserOrAdmin(req.params.userId, req, res, next), profileController.updateAddress);

module.exports = router;